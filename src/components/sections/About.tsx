import Image from "next/image";
import profilePhoto from "@/assets/luis-fernando.jpg";
import { ScheduleCta } from "@/components/ScheduleCta";
import { site } from "@/config/site";
import { certifications } from "@/data/content";

/** Sobre: avatar com moldura conic-gradient girando, bio e certificações. */
export function About() {
  return (
    <section className="sec about" id="sobre" aria-labelledby="sobre-title">
      <div className="grid about__grid">
        <div className="about__avatar-wrap reveal">
          <div className="avatar-frame card">
            {/* O miolo gira ao contrário da moldura, então a foto fica sempre de pé */}
            <div>
              <Image
                className="avatar-photo"
                src={profilePhoto}
                alt={`${site.name}, fisioterapeuta`}
                sizes="(max-width: 860px) 240px, 360px"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
        <div>
          <h2 id="sobre-title" className="reveal-mask">
            <span>{site.name}</span>
          </h2>
          <p className="about__bio muted reveal">
            Sou fisioterapeuta e atendo na casa do paciente. Trabalho com dor de cabeça tensional, DTM e dores no
            pescoço e nas costas. Também cuido da recuperação muscular e da mobilidade de quem treina.
          </p>
          {/* Selos só aparecem com credenciais informadas (ex.: CREFITO) em src/data/content.ts */}
          {certifications.length > 0 ? (
            <ul className="badges reveal" aria-label="Formação e certificações">
              {certifications.map((item) => (
                <li key={item} className="badge">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <ScheduleCta />
        </div>
      </div>
    </section>
  );
}
