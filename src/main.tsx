import { lazy, Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import Globe from "./Globe";
import { currentPage as path, pageLink } from "./navigation";
import "./site.css";
const Blog = lazy(() => import("./Blog")),
  Simulator = lazy(() => import("./Simulator")),
  Moon = lazy(() => import("./Moon")),
  Orion = lazy(() => import("./Orion")),
  Crew = lazy(() => import("./Crew"));
const links = [
    ["/", "Inicio"],
    ["/blog", "Blog"],
    ["/explorar", "Explorar"],
  ];
function Mark() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path d="M7 32 21 5l12 27-12-12z" stroke="#ff8659" strokeWidth="2.4" />
      <ellipse
        cx="20"
        cy="23"
        rx="19"
        ry="5"
        transform="rotate(-28 20 23)"
        stroke="currentColor"
      />
    </svg>
  );
}
function Home() {
  return (
    <>
      <section className="hero">
        <div className="spaceart">
          <div className="orbit o1" />
          <div className="orbit o2" />
          <Globe />
        </div>
        <div className="intro">
          <h1>
            ARTEMIS <em>III</em>
          </h1>
          <h2>La ingeniería detrás de una nueva era de exploración espacial</h2>
          <p>
            Cuatro astronautas, una nave y un encuentro en órbita terrestre.
            Descubre cómo se ensayan las maniobras que harán posibles los
            próximos alunizajes.
          </p>
        </div>
        <small className="mooncredit">
          Cartografía lunar · NASA / GSFC / Arizona State University
        </small>
      </section>
      <div className="stats">
        {[
          ["MISIÓN", "Artemis III"],
          ["DESTINO", "Órbita terrestre baja"],
          ["TRIPULACIÓN", "4 astronautas"],
          ["LANZAMIENTO PREVISTO", "2027"],
        ].map(([a, b]) => (
          <div key={a}>
            <small>{a}</small>
            <strong>{b}</strong>
          </div>
        ))}
      </div>
      <section className="collection">
        <div className="kicker">
          <i /> COLECCIÓN ARTEMIS
        </div>
        <h2>Dentro de la misión</h2>
        <div className="cards">
          {[
            [
              "/blog",
              "Blog académico",
              "Cinco lecturas sobre la ingeniería y las personas de Artemis III.",
              "sls",
              "Despegue de Artemis II · NASA / Bill Ingalls",
            ],
            [
              "/explorar",
              "Laboratorio interactivo",
              "Simula el vuelo, recorre la Luna y conoce a la tripulación.",
              "orion",
              "Orion en Artemis I · NASA",
            ],
          ].map(([url, title, desc, img, credit]) => (
            <a href={pageLink(url)} key={url}>
              <img src={"/media/" + img + ".jpg"} alt={credit} />
              <div>
                <small>{credit}</small>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="purpose">
          <div><h3>Misión del blog</h3><p>Acercar la ingeniería aeroespacial a estudiantes y lectores curiosos. Cada entrada conecta una pregunta de la misión con documentos de vuelo, una imagen y una experiencia que puedes probar.</p></div>
          <div><h3>Visión</h3><p>Que cualquier lector pueda distinguir lo que una misión se propone, lo que una prueba permite medir y lo que todavía queda por demostrar.</p></div>
        </div>
      </section>
    </>
  );
}
const exhibits = [
  ["simulador", "Simulador", Simulator],
  ["luna", "Atlas lunar", Moon],
  ["orion", "Nave Orion", Orion],
  ["tripulacion", "Tripulación", Crew],
] as const;
function Explore() {
  const [id, set] = useState(location.hash.slice(1));
  const entry = exhibits.find((e) => e[0] === id) || exhibits[0],
    View = entry[2];
  return (
    <section className="lab">
      <div className="kicker">
        <i /> LABORATORIO INTERACTIVO
      </div>
      <h1>Explora la misión</h1>
      <div className="tabs">
        {exhibits.map(([key, name]) => (
          <button
            key={key}
            aria-pressed={entry[0] === key}
            onClick={() => {
              set(key);
              history.replaceState(null, "", "#" + key);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <h2>{entry[1]}</h2>
      <View />
    </section>
  );
}
function App() {
  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="top">
        <a className="brand" href={pageLink("/")}>
          <Mark />
          <span>ATLAS ESPACIAL</span>
        </a>
        <nav>
          {links.map(([url, title]) => (
            <a
              key={url}
              aria-current={(path === url || (url === "/blog" && (path.startsWith("/blog/") || path === "/investigacion"))) ? "page" : undefined}
              href={pageLink(url)}
            >
              {title}
            </a>
          ))}
        </nav>
      </header>
      <main id="contenido">
        <Suspense fallback={<p>Cargando la exposición…</p>}>
          {path === "/investigacion" || path === "/blog" || path.startsWith("/blog/") || ["/contacto","/politicas","/infografia"].includes(path) ? (
            <Blog path={path} />
          ) : path === "/explorar" ? (
            <Explore />
          ) : (
            <Home />
          )}
        </Suspense>
      </main>
      <footer>
        ATLAS ESPACIAL{" "}
        <span>Museo digital de divulgación científica · Artemis III</span>
        <a href={pageLink("/politicas")}>Políticas de uso</a>
        <a href={pageLink("/contacto")}>Contacto editorial</a>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
