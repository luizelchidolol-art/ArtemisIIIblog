import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { createLunarRenderer } from "./lunarRenderer";
import "./globe.css";

const homeView = { longitude: 3, latitude: 9, zoom: 1 };
const atlasView = { longitude: 0, latitude: 0, zoom: 1 };
const turn = 14;
const minZoom = 0.75;
const maxZoom = 2.25;

function wrapLongitude(angle: number) {
  return ((angle + 180) % 360 + 360) % 360 - 180;
}

export default function Globe({ interactive = false }: { interactive?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const description = useId();
  const view = useRef({ ...(interactive ? atlasView : homeView) });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const [unavailable, setUnavailable] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [playing, setPlaying] = useState<boolean | null>(null);
  const spinning = playing ?? (!interactive && !reduced);
  const rotation = useRef(spinning);
  const schedule = useRef<() => void>(() => undefined);

  useEffect(() => {
    const region = stage.current;
    if (!region) return;
    function wheel(event: WheelEvent) {
      if (document.activeElement !== region || event.ctrlKey) return;
      event.preventDefault();
      const delta = Math.sign(event.deltaY) * -0.1;
      view.current.zoom = Math.max(minZoom, Math.min(maxZoom, view.current.zoom + delta));
      schedule.current();
    }
    region.addEventListener("wheel", wheel, { passive: false });
    return () => region.removeEventListener("wheel", wheel);
  }, [interactive]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(preference.matches);
      if (preference.matches) setPlaying(null);
    };
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    rotation.current = spinning;
    schedule.current();
  }, [spinning]);

  useEffect(() => {
    const target = canvas.current;
    if (!target) return;

    const img = new Image();
    let visible = true;
    let frame = 0;
    let previousTime = 0;
    let paint: ReturnType<typeof createLunarRenderer> = null;

    function draw(time: number) {
      frame = 0;
      if (!paint || !visible || document.hidden) {
        previousTime = 0;
        return;
      }
      if (rotation.current && previousTime) {
        const elapsed = Math.min(60, time - previousTime) / 1_000;
        view.current.longitude = wrapLongitude(view.current.longitude + elapsed * 5);
      }
      paint.draw(view.current, interactive, rotation.current);
      previousTime = rotation.current ? time : 0;
      if (rotation.current) requestFrame();
    }

    function requestFrame() {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
    }

    schedule.current = requestFrame;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) previousTime = 0;
      requestFrame();
    });
    intersection.observe(target);
    const resize = new ResizeObserver(requestFrame);
    resize.observe(target);
    function visibilityChanged() {
      previousTime = 0;
      requestFrame();
    }

    document.addEventListener("visibilitychange", visibilityChanged);
    img.onload = () => {
      paint = createLunarRenderer(target, img);
      if (paint) requestFrame();
      else setUnavailable(true);
    };
    img.onerror = () => setUnavailable(true);
    img.src = "/media/luna.jpg";

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibilityChanged);
      img.onload = null;
      img.onerror = null;
      paint?.dispose();
      schedule.current = () => undefined;
    };
  }, [interactive]);

  function orient(horizontal: number, vertical: number) {
    setPlaying(false);
    view.current.longitude = wrapLongitude(view.current.longitude + horizontal);
    view.current.latitude = Math.max(-90, Math.min(90, view.current.latitude + vertical));
    schedule.current();
  }

  function changeZoom(delta: number) {
    view.current.zoom = Math.max(minZoom, Math.min(maxZoom, view.current.zoom + delta));
    schedule.current();
  }

  function setView(latitude: number) {
    setPlaying(false);
    view.current = { ...atlasView, latitude };
    schedule.current();
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowLeft": orient(-turn, 0); break;
      case "ArrowRight": orient(turn, 0); break;
      case "ArrowUp": orient(0, turn); break;
      case "ArrowDown": orient(0, -turn); break;
      case "+": case "=": changeZoom(0.25); break;
      case "-": changeZoom(-0.25); break;
      case "Home": setView(0); break;
      default: return;
    }
    event.preventDefault();
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const active = pointers.current;
    const previous = active.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    active.set(event.pointerId, next);
    if (active.size === 1) {
      orient((previous.x - next.x) * 0.42, (next.y - previous.y) * 0.42);
      return;
    }
    const other = [...active.entries()].find(([id]) => id !== event.pointerId)![1];
    const before = Math.hypot(previous.x - other.x, previous.y - other.y);
    const after = Math.hypot(next.x - other.x, next.y - other.y);
    if (before > 1) changeZoom(view.current.zoom * (after / before - 1));
  }

  const image = <canvas ref={canvas} width="760" height="760" role="img"
    aria-label="Globo lunar a partir del mosaico LROC" />;
  const toggle = <button type="button" onClick={() => setPlaying(!spinning)}
    className="hero-moon-toggle"
    disabled={unavailable} aria-label={spinning ? "Pausar rotación lunar" : "Girar la Luna"}>
    <span aria-hidden="true">{spinning ? "Ⅱ" : "▶"}</span>
  </button>;

  if (!interactive) return <>{image}{toggle}</>;

  return (
    <section className="globe-exhibit" aria-label="Globo lunar tridimensional">
      <div className="globe-accessible-description">
        <h3>La Luna en 3D</h3>
        <p id={description}>Arrastra para girar la Luna. Haz clic y usa la rueda para acercarte, o separa dos dedos en una pantalla táctil. Con teclado, usa las flechas y las teclas + y −.</p>
      </div>
      <div className="globe-stage" ref={stage} role="region" aria-label="Vista tridimensional de la Luna"
        aria-describedby={description} tabIndex={0} onKeyDown={handleKeys}
        onPointerDown={event => {
          if (event.button !== 0 || pointers.current.size >= 2) return;
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
          setPlaying(false);
        }}
        onPointerMove={move}
        onLostPointerCapture={event => { pointers.current.delete(event.pointerId); }}>
        {image}
        {unavailable && <p className="globe-unavailable">El atlas plano sigue disponible debajo.</p>}
      </div>
    </section>
  );
}
