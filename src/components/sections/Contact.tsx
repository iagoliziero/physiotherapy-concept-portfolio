import { ContactForm } from "@/components/ContactForm";
import { SceneMount } from "@/components/SceneMount";
import { SplitWords } from "@/components/SplitWords";
import { site } from "@/config/site";

/** Contato: formulário com validação inline + globo 3D com rotas de pacientes. */
export function Contact() {
  // Região e cidade aparecem só quando informadas
  const location = [site.address.street, site.address.city].filter(Boolean).join(" · ");
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
            label="Globo 3D decorativo com a cidade de atendimento em destaque"
          />
          <p className="contact__globe-caption muted">A fisioterapia vai até você</p>
          <address className="contact__address">
            <strong>{site.clinic}</strong>
            {location ? (
              <>
                <br />
                <span className="muted">{location}</span>
              </>
            ) : null}
          </address>
        </div>
      </div>
    </section>
  );
}
