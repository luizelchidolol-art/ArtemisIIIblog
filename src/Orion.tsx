import { useRef, useState } from "react";
import { projectOrion } from "./orionModel";
import "./flight.css";
import "./orion-carousel.css";

const components = [
  {
    id: "crew",
    title: "Módulo de tripulación",
    text: "La cápsula presurizada aloja a los astronautas, la aviónica y el puerto de acoplamiento. Es la sección que regresa a la Tierra.",
  },
  {
    id: "heat",
    title: "Escudo térmico",
    text: "Durante la reentrada, el escudo ablativo de la base soporta el calentamiento intenso. Su material protector se consume de forma controlada y limita el calor que llega a la cápsula.",
  },
  {
    id: "service",
    title: "Módulo de servicio europeo",
    text: "El módulo suministra electricidad, agua, oxígeno y nitrógeno. También aporta propulsión y control térmico. Se separa antes de la reentrada.",
  },
  {
    id: "solar",
    title: "Paneles solares",
    text: "Cuatro alas fotovoltaicas despliegan sus células tras el lanzamiento. Convierten la luz solar en electricidad y pueden orientarse para captar energía.",
  },
  {
    id: "engine",
    title: "Propulsión",
    text: "El motor principal modifica la trayectoria. Los propulsores auxiliares y de control de reacción permiten correcciones y cambios de orientación.",
  },
  {
    id: "comms",
    title: "Comunicaciones",
    text: "Las antenas intercambian voz, comandos y datos. La telemetría informa al control terrestre sobre el desempeño y el estado de la nave.",
  },
  {
    id: "abort",
    title: "Aborto de lanzamiento",
    text: "La torre puede alejar la cápsula del cohete en una emergencia durante el ascenso. Se desecha cuando deja de ser necesaria.",
  },
] as const;

const initialView = { yaw: -0.35, pitch: 0.55, zoom: 1.35 };

export default function Orion() {
  const [index, setIndex] = useState(0);
  const [interior, setInterior] = useState(false);
  const [view, setView] = useState(initialView);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const component = components[index];
  const selected = component.id;
  const swipeStart = useRef<number | null>(null);
  function move(step: number) {
    setIndex(
      (current) => (current + step + components.length) % components.length,
    );
  }
  const mesh = projectOrion(
    view.yaw,
    view.pitch,
    view.zoom,
    selected === "abort",
  );

  function turn(yaw: number, pitch = 0) {
    setView((previous) => ({
      ...previous,
      yaw: previous.yaw + yaw,
      pitch: Math.max(-1.5, Math.min(1.5, previous.pitch + pitch)),
    }));
  }

  return (
    <section
      className="artemis-flight-panel"
      aria-label="Explora la nave Orion"
    >
      <div className="artemis-flight-heading">
        <span className="artemis-flight-tag">
          Orion · Modelo esquemático 3D
        </span>
        <button
          type="button"
          onClick={() => setInterior(!interior)}
          aria-pressed={interior}
        >
          {interior ? "Volver al exterior" : "Explorar interior"}
        </button>
      </div>
      {interior ? (
        <div className="orion-interior">
          <div>
            <span className="artemis-flight-tag">Módulo presurizado</span>
            <h3>Vida y trabajo en cabina</h3>
            <p>
              Los tripulantes usan pantallas y mandos para supervisar y, cuando
              corresponde, controlar la nave. Los asientos los sujetan durante
              lanzamiento y reentrada.
            </p>
          </div>
          <div>
            <h4>Soporte vital</h4>
            <p>
              El control ambiental mantiene una atmósfera respirable, retira
              dióxido de carbono y gestiona la temperatura. El volumen interior
              también debe acoger almacenamiento, higiene y descanso.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="artemis-flight-screen orion-view">
            <svg
              viewBox="0 0 520 278"
              aria-hidden="true"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                drag.current = { x: event.clientX, y: event.clientY };
              }}
              onPointerMove={(event) => {
                if (!drag.current) return;
                turn(
                  (event.clientX - drag.current.x) * 0.013,
                  (event.clientY - drag.current.y) * 0.013,
                );
                drag.current = { x: event.clientX, y: event.clientY };
              }}
              onPointerUp={() => {
                drag.current = null;
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
              onLostPointerCapture={() => {
                drag.current = null;
              }}
            >
              <ellipse
                cx="260"
                cy="146"
                rx="221"
                ry="94"
                fill="none"
                stroke="#39537e"
                strokeDasharray="4 8"
              />
              {mesh.map((face, index) => (
                <polygon
                  key={index}
                  points={face.vertices}
                  fill={face.color}
                  stroke={face.part === selected ? "#ff9864" : "#233150"}
                  strokeWidth={face.part === selected ? "0.85" : "0.45"}
                  strokeLinejoin="round"
                  style={{ filter: `brightness(${face.brightness})` }}
                />
              ))}
            </svg>
          </div>
          <details className="orion-camera">
            <summary>Ajustar cámara</summary>
            <div className="artemis-flight-controls orion-controls">
              <button type="button" onClick={() => turn(-0.35)}>
                Girar izquierda
              </button>
              <button type="button" onClick={() => turn(0.35)}>
                Girar derecha
              </button>
              <button type="button" onClick={() => turn(0, -0.25)}>
                Inclinar arriba
              </button>
              <button type="button" onClick={() => turn(0, 0.25)}>
                Inclinar abajo
              </button>
              <label>
                Zoom{" "}
                <input
                  type="range"
                  min="0.75"
                  max="2.1"
                  step="0.05"
                  value={view.zoom}
                  onChange={(event) =>
                    setView((previous) => ({
                      ...previous,
                      zoom: event.target.valueAsNumber,
                    }))
                  }
                />
              </label>
              <button type="button" onClick={() => setView(initialView)}>
                Restablecer vista
              </button>
            </div>
          </details>
          <section
            className="orion-carousel"
            aria-label="Componentes de Orion"
            aria-roledescription="carrusel"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                move(event.key === "ArrowLeft" ? -1 : 1);
              }
            }}
          >
            <div className="orion-carousel-head">
              <span>Componentes de Orion</span>
              <div>
                <button
                  type="button"
                  aria-label="Componente anterior"
                  onClick={() => move(-1)}
                >
                  ‹
                </button>
                <span>
                  {index + 1} / {components.length}
                </span>
                <button
                  type="button"
                  aria-label="Componente siguiente"
                  onClick={() => move(1)}
                >
                  ›
                </button>
              </div>
            </div>
            <div
              aria-live="polite"
              aria-atomic="true"
              className="orion-slide"
              onTouchStart={(event) => {
                swipeStart.current = event.touches[0].clientX;
              }}
              onTouchCancel={() => {
                swipeStart.current = null;
              }}
              onTouchEnd={(event) => {
                const distance =
                  event.changedTouches[0].clientX -
                  (swipeStart.current ?? event.changedTouches[0].clientX);
                if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1);
                swipeStart.current = null;
              }}
            >
              <div key={component.id}>
                <h3>{component.title}</h3>
                <p>{component.text}</p>
              </div>
            </div>
            <div className="orion-track" aria-hidden="true">
              {components.map((item) => (
                <span
                  key={item.id}
                  className={item.id === selected ? "current" : ""}
                />
              ))}
            </div>
          </section>
          <p className="artemis-flight-caption">
            Arrastra la nave para cambiar el ángulo. La torre se muestra junto a
            los paneles desplegados para identificar sus posiciones relativas en
            el esquema.
          </p>
        </>
      )}
      <p className="artemis-flight-caption">
        Ilustración interactiva sin escala.{" "}
        <a href="https://www.nasa.gov/reference/orion-spacecraft/">
          Ficha de Orion de NASA
        </a>{" "}
        ·{" "}
        <a href="https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Orion">
          Programa Orion de ESA
        </a>
        .
      </p>
    </section>
  );
}
