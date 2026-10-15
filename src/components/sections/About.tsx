import Image from "next/image";
import profilePhoto from "@/assets/luis-fernando.jpg";
import { SplitWords } from "@/components/SplitWords";
import { site } from "@/config/site";
import { certifications } from "@/data/content";

/** Sobre: avatar com moldura conic-gradient girando, bio e certificações. */
export function About() {
  return (
    <section className="sec about" id="sobre" aria-labelledby="sobre-title">
      <div className="grid about__grid">
        <div className="about__avatar-wrap fade">
          <div className="avatar-frame card">
            {/* O miolo gira ao contrário da moldura, então a foto fica sempre de pé */}
            <div>
              <Image
                className="avatar-photo"
                src={profilePhoto}
                alt={`${site.name}, fisioterapeuta`}
                sizes="210px"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
        <div>
          <span className="tag scr">{"// SOBRE"}</span>
          <h2 id="sobre-title">
            <SplitWords text={site.name} />
          </h2>
          <p className="about__bio fade muted">
            Fisioterapeuta com atendimento em domicílio, com foco em dor de cabeça tensional, DTM, recuperação
            muscular e mobilidade para quem treina.
          </p>
          <ul className="badges fade" aria-label="Formação e certificações">
            {certifications.map((item) => (
              <li key={item} className="badge">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
