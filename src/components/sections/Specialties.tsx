import { IconBone, IconHeartbeat, IconRun, IconYoga } from "@tabler/icons-react";
import { SplitWords } from "@/components/SplitWords";
import { type SpecialtyIcon, specialties } from "@/data/content";

const icons: Record<SpecialtyIcon, typeof IconBone> = {
  bone: IconBone,
  run: IconRun,
  heartbeat: IconHeartbeat,
  yoga: IconYoga,
};

/** Especialidades: cards glass com tilt 3D, brilho que segue o cursor e ícone que "salta". */
export function Specialties() {
  return (
    <section className="sec" id="especialidades" aria-labelledby="especialidades-title">
      <span className="tag scr">{"// ESPECIALIDADES"}</span>
      <h2 id="especialidades-title" className="sec-title">
        <SplitWords text="Tratamento certo para cada corpo" />
      </h2>
      <div className="grid specialties__grid">
        {specialties.map((item) => {
          const Icon = icons[item.icon];
          return (
            <article key={item.title} className="glass card fade specialty">
              {/* Anima o wrapper, não o <svg>: transform em SVG não é acelerado por GPU */}
              <span className="card-icon" style={{ color: item.color }}>
                <Icon size={32} aria-hidden="true" />
              </span>
              <h3>{item.title}</h3>
              <p className="muted">{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
