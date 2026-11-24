import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import ExhibitDialog from "./ExhibitDialog";
import Globe from "./Globe";

const atlasUrl = "/media/luna.jpg";
const lunarCredit = "NASA/GSFC/Arizona State University";
const apolloCoordinates =
  "https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html";
const sites = [
  {
    title: "Apollo 11",
    shortName: "Apollo 11",
    category: "Histórico",
    kind: "historic",
    lat: 0.67416,
    lon: 23.47314,
    feature: "Mare Tranquillitatis · 20 de julio de 1969",
    text: "Neil Armstrong y Buzz Aldrin alunizaron en una llanura de lava basáltica cerca del ecuador lunar. El relieve relativamente llano facilitaba la búsqueda de un punto de descenso y la exploración a pie. Michael Collins permaneció en órbita lunar.",
    image: "/media/lunar-apollo11.jpg",
    caption:
      "Buzz Aldrin en Mare Tranquillitatis, fotografiado por Neil Armstrong",
    credit: "NASA/MSFC",
    source: "https://science.nasa.gov/resource/saturn-apollo-program-2/",
    coordinates: apolloCoordinates,
  },
  {
    title: "Apollo 17",
    shortName: "Apollo 17",
    category: "Histórico",
    kind: "historic",
    lat: 20.1911,
    lon: 30.7723,
    feature: "Valle Taurus-Littrow · 11 de diciembre de 1972",
    text: "Gene Cernan y Harrison Schmitt exploraron el valle mientras Ronald Evans permaneció en órbita. El lugar ofrecía acceso tanto a rocas antiguas de tierras altas como a materiales volcánicos. La tripulación recogió más de 110 kg de muestras.",
    image: "/media/lunar-apollo17.jpg",
    caption:
      "Harrison Schmitt y el vehículo lunar en Taurus-Littrow, fotografiados por Eugene Cernan",
    credit: "NASA",
    source:
      "https://science.nasa.gov/resource/harrison-jack-schmitt-busy-on-the-moon-apollo-17/",
    coordinates: apolloCoordinates,
  },
  {
    title: "Mare Imbrium",
    shortName: "Imbrium",
    category: "Interés científico",
    kind: "science",
    lat: 34.72,
    lon: -14.91,
    feature: "Mar lunar · cuenca de impacto",
    text: "Una gran colisión excavó la cuenca y las lavas basálticas inundaron sus partes bajas. Las crestas arrugadas que cruzan la llanura registran la compresión y la deformación posterior de esas rocas.",
    image: "/media/lunar-imbrium.jpg",
    caption: "Cresta arrugada al noroeste de Mare Imbrium, observada por LROC",
    credit: lunarCredit,
    source:
      "https://science.nasa.gov/photojournal/wrinkle-ridges-of-northwest-mare-imbrium/",
    coordinates: "https://planetarynames.wr.usgs.gov/Feature/3678",
  },
  {
    title: "Cráter Shackleton",
    shortName: "Shackleton",
    category: "Interés científico",
    kind: "science",
    lat: -89.67,
    lon: 129.78,
    feature: "Cráter de impacto · polo sur lunar",
    text: "El polo sur geográfico está cerca del borde. La luz solar incide casi en horizontal en esta zona y hay depresiones donde el Sol nunca llega. Esas sombras permanentes pueden conservar hielo durante largos periodos.",
    image: "/media/lunar-shackleton.png",
    caption:
      "Mapa de iluminación elaborado con imágenes LROC. Shackleton ocupa el centro",
    credit: lunarCredit,
    source:
      "https://science.nasa.gov/resource/illumination-map-of-the-moons-south-pole/",
    coordinates: "https://planetarynames.wr.usgs.gov/Feature/5450",
  },
  {
    title: "Mons Mouton",
    shortName: "Mouton",
    category: "Región candidata estudiada",
    kind: "candidate",
    lat: -84.6,
    lon: 31,
    feature: "Montaña polar · punto de referencia del relieve",
    text: "Mons Mouton y su meseta figuran entre las regiones polares que la NASA evaluó para un futuro alunizaje Artemis. Los equipos comparan pendiente, luz solar y comunicaciones. El marcador indica el centro de la montaña según el nomenclátor de la USGS.",
    image: "/media/lunar-candidates.jpg",
    caption:
      "Mapa de regiones candidatas publicado en 2024, antes de que Artemis III pasara a ser una prueba en órbita terrestre",
    credit: "NASA",
    source: "https://www.nasa.gov/feature/living-and-working-on-the-moon/",
    coordinates: "https://planetarynames.wr.usgs.gov/Feature/16070",
  },
];

type Site = (typeof sites)[number];
type Center = { x: number; y: number };
const origin = { x: 0.5, y: 0.5 };
const keyboardMoves: Record<string, Center> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
};
const project = (site: Site): Center => ({
  x: (site.lon + 180) / 360,
  y: (90 - site.lat) / 180,
});

function clampCenter(center: Center, zoom: number): Center {
  const margin = 0.5 / zoom;
  return {
    x: Math.min(1 - margin, Math.max(margin, center.x)),
    y: Math.min(1 - margin, Math.max(margin, center.y)),
  };
}

function formatCoordinate(value: number, positive: string, negative: string) {
  return `${Math.abs(value).toLocaleString("es-MX", { maximumFractionDigits: 3 })}° ${value >= 0 ? positive : negative}`;
}

export default function Moon() {
  const [active, setActive] = useState<Site | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState(origin);
  const [mapLoaded, setMapLoaded] = useState(true);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  function changeZoom(step: number) {
    const next = Math.min(6, Math.max(1, zoom + step));
    setCenter((previous) => clampCenter(previous, next));
    setZoom(next);
  }

  function moveMap(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    const { width, height } = event.currentTarget.getBoundingClientRect();
    const x = (drag.current.x - event.clientX) / (width * zoom);
    const y = (drag.current.y - event.clientY) / (height * zoom);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setCenter((previous) =>
      clampCenter({ x: previous.x + x, y: previous.y + y }, zoom),
    );
  }

  return (
    <div className="lunar-exhibit">
      <Globe interactive />
      <h3 className="lunar-atlas-title">Atlas de regiones lunares</h3>
      <div className="lunar-controls" aria-label="Controles del mapa lunar">
        <button
          type="button"
          className="exhibit-button"
          onClick={() => changeZoom(-0.5)}
          disabled={zoom <= 1}
          aria-label="Alejar mapa"
        >
          −
        </button>
        <output className="lunar-zoom" aria-label="Nivel de acercamiento">
          {zoom.toLocaleString("es-MX")}×
        </output>
        <button
          type="button"
          className="exhibit-button"
          onClick={() => changeZoom(0.5)}
          disabled={zoom >= 6}
          aria-label="Acercar mapa"
        >
          +
        </button>
        <button
          type="button"
          className="exhibit-button"
          onClick={() => {
            setZoom(1);
            setCenter(origin);
          }}
        >
          Vista global
        </button>
        <button
          type="button"
          className="exhibit-button"
          onClick={() => {
            setZoom(3);
            setCenter(clampCenter({ x: 0.65, y: 1 }, 3));
          }}
        >
          Polo sur
        </button>
      </div>
      <div
        className="lunar-viewport"
        tabIndex={0}
        role="region"
        aria-label="Mapa lunar interactivo"
        data-zoomed={zoom > 1}
        onPointerDown={(event) => {
          if (
            zoom === 1 ||
            event.button !== 0 ||
            (event.target as HTMLElement).closest("button")
          )
            return;
          drag.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={moveMap}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "+" || event.key === "-") {
            event.preventDefault();
            changeZoom(event.key === "+" ? 0.5 : -0.5);
            return;
          }
          const move = keyboardMoves[event.key];
          if (!move || zoom <= 1) return;
          event.preventDefault();
          setCenter((previous) =>
            clampCenter(
              {
                x: previous.x + (move.x * 0.08) / zoom,
                y: previous.y + (move.y * 0.08) / zoom,
              },
              zoom,
            ),
          );
        }}
      >
        {mapLoaded ? (
          <img
            className="lunar-atlas"
            src={atlasUrl}
            alt="Mosaico equirectangular de la superficie de la Luna"
            draggable={false}
            loading="lazy"
            onError={() => setMapLoaded(false)}
            style={{
              width: `${100 * zoom}%`,
              height: `${100 * zoom}%`,
              left: `${50 - center.x * zoom * 100}%`,
              top: `${50 - center.y * zoom * 100}%`,
            }}
          />
        ) : (
          <p className="lunar-image-failed">
            No se pudo cargar el mosaico.{" "}
            <a href="https://svs.gsfc.nasa.gov/4720/">
              Abrir el atlas de la NASA
            </a>
          </p>
        )}
        {mapLoaded &&
          sites.map((site) => {
            const point = project(site);
            const x = 50 + (point.x - center.x) * zoom * 100;
            const y = 50 + (point.y - center.y) * zoom * 100;
            if (x < 0 || x > 100 || y < 0 || y > 100) return null;
            return (
              <button
                type="button"
                key={site.title}
                className="lunar-marker"
                data-kind={site.kind}
                aria-label={`${site.title}, ${site.category}`}
                aria-haspopup="dialog"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setActive(site)}
              >
                <span className="lunar-marker-label">{site.shortName}</span>
              </button>
            );
          })}
      </div>
      <p className="exhibit-credit">
        Acerca el mapa para desplazarlo con el cursor, el dedo o las flechas del
        teclado. Mosaico LRO ·{" "}
        <a
          href="https://svs.gsfc.nasa.gov/4720/"
          target="_blank"
          rel="noreferrer"
        >
          NASA Scientific Visualization Studio
        </a>
        .
      </p>
      <ul className="lunar-site-list" aria-label="Lugares del mapa">
        {sites.map((site) => (
          <li key={site.title}>
            <button
              type="button"
              className="lunar-site-button"
              data-kind={site.kind}
              onClick={() => setActive(site)}
              aria-haspopup="dialog"
            >
              <span>{site.title}</span>
              <small>{site.category}</small>
            </button>
          </li>
        ))}
      </ul>
      {active && (
        <ExhibitDialog title={active.title} onClose={() => setActive(null)}>
          <p className="exhibit-category">
            {active.category} · {active.feature}
          </p>
          <p className="lunar-coordinates">
            {formatCoordinate(active.lat, "N", "S")} ·{" "}
            {formatCoordinate(active.lon, "E", "O")}
          </p>
          <figure className="lunar-detail-image">
            <img src={active.image} alt={active.caption} />
            <figcaption className="exhibit-credit">
              {active.caption}. Crédito: {active.credit}.
            </figcaption>
          </figure>
          <p>{active.text}</p>
          <p className="lunar-detail-links">
            <a href={active.source} target="_blank" rel="noreferrer">
              Ver fuente oficial
            </a>
            <a href={active.coordinates} target="_blank" rel="noreferrer">
              Consultar coordenadas
            </a>
          </p>
        </ExhibitDialog>
      )}
    </div>
  );
}
