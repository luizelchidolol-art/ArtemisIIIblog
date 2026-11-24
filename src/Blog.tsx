import { useEffect, useState } from "react";
import { articles } from "./blogArticles";
import { pageLink } from "./navigation";
import "./blog.css";

const edition = "Atlas espacial";
const photo = (image: string) => `/media/${image}`;
const infographic = "/media/infografia.png";
const contactEmail = "artemisiiinasaunaq@gmail.com";
const photoSources: Record<string, string> = {
  "sls.jpg": "https://images.nasa.gov/details/NHQ202604010227",
  "research-operations.jpg": "https://www.nasa.gov/missions/artemis/nasas-artemis-iii-mission-to-test-future-moon-lander-operations/",
  "research-interior.jpg": "https://www.nasa.gov/podcasts/curious-universe/artemis-ii-inside-nasas-new-ride-to-the-moon/",
  "lunar-shackleton.png": "https://science.nasa.gov/resource/illumination-map-of-the-moons-south-pole/",
  "research-crew.jpg": "https://www.nasa.gov/image-detail/amf-jsc2026e391567/",
  "research-control.jpg": "https://www.nasa.gov/centers-and-facilities/johnson/behind-the-lens-meet-nasa-johnsons-photographers/",
};
const tools = {
  simulador: "Ensayar la maniobra en el simulador",
  orion: "Identificar los componentes de Orion",
  luna: "Examinar la superficie en el atlas lunar",
  tripulacion: "Conocer a la tripulación",
};
const prompts = {
  simulador: "Salta a Acoplamiento y alterna entre Blue Moon y Starship. Observa dónde está el puerto de cada vehículo y explica qué cambia en la orientación de Orion.",
  orion: "Localiza el módulo de servicio en el carrusel. Busca después los paneles solares e identifica qué funciones de la cápsula dependen de ellos.",
  luna: "Localiza un sitio Apollo y examina la región polar. Compara qué información aporta una ubicación histórica y qué significa una zona de interés para una misión futura.",
  tripulacion: "Abre dos fichas y compara una experiencia previa de cada astronauta. ¿Qué aportaría cada trayectoria al trabajo en una cabina compartida?",
};

function Share({ title, summary }: { title: string; summary: string }) {
  const [status,setStatus] = useState("");
  const [manual,setManual] = useState(false);
  const publicLink = /^https?:$/.test(location.protocol) && !["localhost","127.0.0.1","[::1]"].includes(location.hostname);
  const text = [title, summary, edition, publicLink ? location.href.split("#")[0] : ""].filter(Boolean).join("\n");
  async function share() {
    if (navigator.share) {
      try { await navigator.share({title,text}); return; }
      catch (error) { if (error instanceof Error && error.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(text); setStatus("Referencia copiada."); }
    catch { setManual(true); }
  }
  return <div className="blog-share"><button type="button" onClick={share}>Compartir lectura</button>
    <span role="status">{status}</span>{manual && <label>Copia esta referencia<textarea readOnly value={text} onFocus={e=>e.currentTarget.select()} /></label>}</div>;
}

function InfoGraphic() {
  return <><h1>Artemis III de un vistazo</h1><p>Del lanzamiento a los dos encuentros orbitales. Sigue la secuencia de arriba abajo.</p>
    <figure className="blog-poster"><img src={infographic} width="800" height="2000" alt="Infografía de Artemis III. El SLS lanza a Orion. En órbita terrestre baja, la tripulación ensaya primero un acoplamiento con Blue Moon y después otro con Starship. Las pruebas preparan futuras misiones lunares."/>
    <figcaption>Diseño de Atlas espacial. Fuentes y créditos de imagen al pie de la infografía.</figcaption></figure>
    <a download="Artemis-III-infografia.png" href={infographic}>Descargar infografía · PNG, 800 × 2000 px</a></>;
}

function Policies() {
  return <><h1>Políticas de uso</h1><h2>Leer, citar y compartir</h2><p>Puedes compartir los enlaces y citar fragmentos breves identificando el artículo, Atlas espacial y la fuente original. Las fotografías, emblemas y materiales externos conservan sus créditos y condiciones de uso. Antes de reutilizar una imagen, consulta la fuente que la acompaña. Citar al equipo no sustituye el crédito del fotógrafo.</p>
    <h2>Cómo interpretamos las fuentes</h2><p>Fechamos los planes de vuelo y distinguimos las pruebas previstas de los resultados observados. Los modelos y sus cifras sirven para estudiar relaciones entre variables. No deben emplearse para navegación ni para operaciones de vuelo. Puedes proponer una corrección con el título, el pasaje y un enlace verificable.</p>
    <h2>Privacidad y participación</h2><p>La aplicación no solicita registro, instala analítica ni guarda las selecciones del simulador. Cuando se consulta en línea, el proveedor de alojamiento puede procesar datos técnicos de conexión. Al seguir un enlace externo se aplican las condiciones de ese servicio.</p>
    <p>La participación se realiza compartiendo lecturas o enviando correcciones al equipo. Este blog no publica comentarios de visitantes. Al compartir, cita la fuente, respeta la privacidad de otras personas y evita acusaciones sin respaldo. Cada lector elige la aplicación y el destinatario del contenido que comparte.</p>
    <p>Si escribes al buzón editorial, utiliza únicamente los datos necesarios para responderte. El equipo debe pedirte permiso antes de publicar tu mensaje o identificarte.</p></>;
}

function Contact() {
  return <><h1>Contacto editorial</h1><p>Para solicitar una corrección científica o de crédito fotográfico, indica el título de la entrada, el fragmento o imagen y la fuente que sustenta el cambio.</p>
  <a href={"mailto:"+contactEmail}>{contactEmail}</a></>;
}

export default function Blog({path}:{path:string}) {
  const article = articles.find(a=>path==="/blog/"+a.slug);
  const title = article?.title ?? ({"/infografia":"Infografía","/politicas":"Políticas de uso","/contacto":"Contacto editorial"}[path] || "Blog académico");
  useEffect(()=>{document.title=title+" · "+edition},[title]);
  if (article) return <div className="blog-sheet"><article className="blog-reading">
    <a className="blog-back" href={pageLink("/blog")}>Todos los artículos</a>
    <header><p className="blog-label">ARTEMIS III · BLOG ACADÉMICO</p><h1>{article.title}</h1><p className="blog-deck">{article.summary}</p><p className="blog-byline">Equipo de Atlas espacial · Noviembre de 2026</p></header>
    <figure><img src={photo(article.image)} alt={article.credit}/><figcaption>{article.credit}{photoSources[article.image] && <> · <a href={photoSources[article.image]}>Fuente de la imagen</a></>}</figcaption></figure>
    {article.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((p,i)=><p key={i}>{p.split(/(\[\d+\])/g).map((piece,j)=>/^\[\d+\]$/.test(piece)?<a key={j} href={"#ref-"+piece.slice(1,-1)} aria-label={"Fuente "+piece.slice(1,-1)}>{piece}</a>:piece)}</p>)}</section>)}
    <aside className="blog-activity"><h2>Del artículo al laboratorio</h2><p>{prompts[article.tool]}</p><a href={pageLink("/explorar#"+article.tool)}>{tools[article.tool]}</a></aside>
    <h2>Fuentes de esta lectura</h2><ol>{article.sources.map((s,i)=><li id={"ref-"+(i+1)} key={s.url}><a href={s.url}>{s.label}</a></li>)}</ol>
    <Share title={article.title} summary={article.summary}/></article></div>;
  if (path==="/politicas" || path==="/contacto" || path==="/infografia") return <div className="blog-sheet"><article className="blog-reading"><a className="blog-back" href={pageLink("/blog")}>Volver al blog</a>{path==="/politicas"?<Policies/>:path==="/contacto"?<Contact/>:<InfoGraphic/>}</article></div>;
  return <section className="blog-index"><div className="kicker"><i/> ARTEMIS III · BLOG ACADÉMICO</div><h1>Cuaderno de misión</h1><p>¿Qué aprende una tripulación al ensayar cerca de la Tierra? Cinco entradas exploran la ingeniería, la evidencia y las decisiones detrás de Artemis III.</p>
    <div className="blog-grid">{articles.map(a=><article key={a.slug}><a href={pageLink("/blog/"+a.slug)}><img src={photo(a.image)} alt={a.credit} loading="lazy"/><div><small>{a.credit}</small><h2>{a.title}</h2><p>{a.summary}</p></div></a></article>)}</div>
    <a className="blog-poster-link" href={pageLink("/infografia")}><img src={infographic} alt="" loading="lazy"/><div><h2>Artemis III de un vistazo</h2><p>Explora la secuencia de vuelo en una infografía vertical.</p></div></a></section>;
}
