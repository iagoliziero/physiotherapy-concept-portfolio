import { ScheduleCta } from "@/components/ScheduleCta";
import { SplitWords } from "@/components/SplitWords";
import { methodSteps } from "@/data/content";

/** Método: linha do tempo vertical que se desenha conforme as etapas entram na tela. */
export function Method() {
  return (
    <section className="sec" id="metodo" aria-labelledby="metodo-title">
      <span className="tag scr">{"// MÉTODO"}</span>
      <h2 id="metodo-title" className="sec-title">
        <SplitWords text="A jornada até a alta" />
      </h2>
      <div className="timeline" data-timeline="">
        <div className="timeline__track" aria-hidden="true" />
        <div className="timeline__progress" data-timeline-progress="" aria-hidden="true" />
        <ol className="timeline__steps">
          {methodSteps.map((step) => (
            <li key={step.title} className="step">
              <div className="step__dot" aria-hidden="true" />
              <div>
                <h3>{step.title}</h3>
                <p className="muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <ScheduleCta />
    </section>
  );
}
