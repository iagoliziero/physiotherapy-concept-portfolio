import { IconBrandWhatsapp } from "@tabler/icons-react";
import { site, whatsappLink } from "@/config/site";

/** Rodapé com registro profissional e botão flutuante do WhatsApp. */
export function Footer() {
  return (
    <>
      <footer className="footer">
        © {new Date().getFullYear()} {[site.name, "Fisioterapia", site.crefito].filter(Boolean).join(" · ")}
      </footer>
      <a
        className="whatsapp-fab mag"
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp (abre em nova aba)"
      >
        <IconBrandWhatsapp size={30} aria-hidden="true" />
      </a>
    </>
  );
}
