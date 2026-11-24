import { useState } from "react";
import ExhibitDialog from "./ExhibitDialog";

const gallery = "https://www.nasa.gov/gallery/artemis-iii-astronauts/";
const crew = [
  {
    name: "Randy Bresnik",
    agency: "NASA",
    role: "Comandante",
    image: "bresnik-bio.jpg",
    actionImage: "bresnik-action.jpg",
    actionSource: "https://www.nasa.gov/image-detail/amf-jsc2026e391915_alt/",
    profile: "https://www.nasa.gov/people/randolph-komrade-bresnik/",
    experience: "Piloto de pruebas · STS-129 · Expediciones 52 y 53",
    bio: "Piloto de pruebas del F/A-18, seleccionado por la NASA en 2004. Voló a la Estación Espacial Internacional en la misión STS-129. Fue ingeniero de vuelo de la Expedición 52 y comandante de la Expedición 53. Ha realizado cinco caminatas espaciales.",
  },
  {
    name: "Frank Rubio",
    agency: "NASA",
    role: "Especialista de misión",
    image: "rubio-bio.jpg",
    actionImage: "rubio-action.jpg",
    actionSource: "https://www.nasa.gov/image-detail/amf-jsc2026e391938_alt/",
    profile: "https://www.nasa.gov/people/frank-rubio/",
    experience: "Médico de vuelo · 371 días en órbita",
    bio: "Médico de familia, médico de vuelo y piloto de helicópteros UH-60 Black Hawk. Despegó a bordo de la Soyuz MS-22 en 2022 y pasó 371 días en el espacio. Realizó tres caminatas espaciales y participó en la instalación de paneles solares en la estación.",
  },
  {
    name: "Andre Douglas",
    agency: "NASA",
    role: "Especialista de misión",
    image: "douglas-bio.jpg",
    actionImage: "douglas-action.jpg",
    actionSource: "https://www.nasa.gov/image-detail/amf-jsc2026e391946_alt/",
    profile: "https://www.nasa.gov/people/nasa-astronaut-andre-douglas/",
    experience: "Ingeniería de sistemas · Defensa planetaria",
    bio: "Doctor en ingeniería de sistemas y exingeniero naval de la Guardia Costera de Estados Unidos. En el Laboratorio de Física Aplicada de la Universidad Johns Hopkins trabajó en robótica submarina y apoyó el desarrollo de la misión de defensa planetaria DART.",
  },
  {
    name: "Luca Parmitano",
    agency: "ESA",
    role: "Piloto",
    image: "parmitano-bio.jpg",
    actionImage: "parmitano-action.jpg",
    actionSource: "https://www.nasa.gov/image-detail/amf-jsc2026e391926_alt/",
    profile:
      "https://www.esa.int/articles/about-us/directorates/human-and-robotic-exploration/astronauts/luca-parmitano",
    experience: "Piloto de pruebas · Volare y Beyond",
    bio: "Piloto de pruebas italiano y astronauta de la ESA desde 2009. Viajó a la Estación Espacial Internacional en 2013 con Volare y en 2019 con Beyond. Durante Beyond asumió el mando de la estación y participó en la reparación del Espectrómetro Magnético Alfa.",
  },
];

const photo = (image: string) => `/media/${image}`;

export default function Crew() {
  const [person, setPerson] = useState<(typeof crew)[number] | null>(null);

  return (
    <div className="crew-exhibit">
      <div className="crew-grid">
        {crew.map((astronaut) => (
          <article className="crew-card" key={astronaut.name}>
            <button
              type="button"
              className="crew-card-button"
              onClick={() => setPerson(astronaut)}
              aria-haspopup="dialog"
            >
              <span className="crew-portrait">
                <img
                  src={photo(astronaut.image)}
                  alt={`Retrato oficial de ${astronaut.name}`}
                  loading="lazy"
                />
                <img
                  className="crew-action-photo"
                  src={photo(astronaut.actionImage)}
                  alt=""
                  loading="lazy"
                />
              </span>
              <span className="crew-card-agency">{astronaut.agency}</span>
              <span className="crew-card-name">{astronaut.name}</span>
              <span className="crew-card-role">{astronaut.role}</span>
              <span className="crew-card-experience">
                {astronaut.experience}
              </span>
            </button>
            <a
              className="crew-profile-link"
              href={astronaut.profile}
              target="_blank"
              rel="noreferrer"
            >
              Perfil oficial de {astronaut.agency}
            </a>
          </article>
        ))}
      </div>
      <p className="exhibit-credit">
        Fotografías de Artemis III ·{" "}
        <a href={gallery} target="_blank" rel="noreferrer">
          NASA / Luna Posadas Nava y Bill Stafford
        </a>
      </p>
      {person && (
        <ExhibitDialog title={person.name} onClose={() => setPerson(null)}>
          <div className="crew-dialog-grid">
            <figure>
              <img
                src={photo(person.actionImage)}
                alt={`${person.name} con el casco del traje Orion en su retrato oficial de Artemis III`}
              />
              <figcaption className="exhibit-credit">
                <a href={person.actionSource} target="_blank" rel="noreferrer">
                  NASA / Bill Stafford
                </a>
              </figcaption>
            </figure>
            <div>
              <p className="exhibit-category">
                {person.agency} · {person.role} de Artemis III
              </p>
              <p>{person.bio}</p>
              <p>
                <a href={person.profile} target="_blank" rel="noreferrer">
                  Consultar su biografía oficial
                </a>
              </p>
            </div>
          </div>
        </ExhibitDialog>
      )}
    </div>
  );
}
