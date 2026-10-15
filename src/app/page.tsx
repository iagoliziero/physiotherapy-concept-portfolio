import { Footer } from "@/components/Footer";
import { GlobalEffects } from "@/components/GlobalEffects";
import { Navbar } from "@/components/Navbar";
import { About } from "@/components/sections/About";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Method } from "@/components/sections/Method";
import { PainMap } from "@/components/sections/PainMap";
import { Specialties } from "@/components/sections/Specialties";
import { site } from "@/config/site";

/** Dados estruturados (schema.org) do tipo Physiotherapist. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Physiotherapist",
  name: `${site.name} - Fisioterapia`,
  description: site.description,
  url: site.url,
  image: `${site.url}/opengraph-image`,
  // Telefone e endereço só entram quando informados em src/config/site.ts
  ...(site.phone ? { telephone: site.phone } : {}),
  ...(site.address.city
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
      }
    : {}),
  medicalSpecialty: ["Physiotherapy"],
};

/*
 * As seções de números (Stats) e depoimentos (Testimonials) estão fora da
 * página até haver dados reais. Para voltar, preencha `stats`/`testimonials`
 * em src/data/content.ts e recoloque os componentes abaixo.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Marquee />
        <Specialties />
        <PainMap />
        <Method />
        <BeforeAfter />
        <About />
        <Contact />
      </main>
      <Footer />
      <GlobalEffects />
    </>
  );
}
