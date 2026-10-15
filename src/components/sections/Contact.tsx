import { ContactForm } from "@/components/ContactForm";
import { SceneMount } from "@/components/SceneMount";
import { SplitWords } from "@/components/SplitWords";
import { site } from "@/config/site";

/** Contato: formulário com validação inline + globo 3D com rotas de pacientes. */
export function Contact() {
  return (
    <section className="sec" id="contato" aria-labelledby="contato-title">
      <span className="tag scr">{"// AGENDAMENTO"}</span>
      <h2 id="contato-title" className="sec-title">
        <SplitWords text="Agende sua avaliação" />
      </h2>
      <div className="grid contact__grid">
        <ContactForm />
        <div className="glass fade contact__globe">
          <SceneMount
            scene="globe"
            className="contact__globe-scene"
            label="Globo 3D com rotas de pacientes de várias capitais até São Paulo"
          />
          <p className="contact__globe-caption muted">Pacientes de todo o Brasil</p>
          <address className="contact__address">
            <strong>{site.clinic}</strong>
            <br />
            <span className="muted">
              {site.address.street} · {site.address.city}
            </span>
          </address>
        </div>
      </div>
    </section>
  );
}
