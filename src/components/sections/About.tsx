import { SplitWords } from "@/components/SplitWords";
import { certifications } from "@/data/content";

/** Sobre: avatar com moldura conic-gradient girando, bio e certificações. */
export function About() {
  return (
    <section className="sec about" id="sobre" aria-labelledby="sobre-title">
      <div className="grid about__grid">
        <div className="about__avatar-wrap fade">
          <div className="avatar-frame card" aria-hidden="true">
            <div>RM</div>
          </div>
        </div>
        <div>
          <span className="tag scr">{"// SOBRE"}</span>
          <h2 id="sobre-title">
            <SplitWords text="Dr. Rafael Moura" />
          </h2>
          <p className="about__bio fade muted">
            Fisioterapeuta formado pela USP, mestre em Ciências do Movimento. Atende atletas e pacientes com dor
            crônica de coluna há mais de 12 anos.
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
