/**
 * Dados institucionais centralizados: usados em metadata, JSON-LD,
 * rodapé, botão de WhatsApp e formulário.
 */
export const site = {
  name: "Luis Fernando",
  brand: "Luis Fernando",
  title: "Luis Fernando | Fisioterapia em domicílio",
  description:
    "Fisioterapia em domicílio com Luis Fernando: dor de cabeça tensional, DTM, dores no pescoço e nas costas, e recuperação muscular para quem treina. Agende pelo WhatsApp.",
  ogTitle: "Luis Fernando | Fisioterapia em domicílio",
  ogDescription: "Fisioterapia que vai até a sua casa. Agende sua avaliação pelo WhatsApp.",
  /** Defina NEXT_PUBLIC_SITE_URL no deploy para gerar URLs absolutas corretas. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Ainda não informados. Campos vazios ficam ocultos no site.
  // WhatsApp: só dígitos, com DDI 55 (ex.: 5511999999999)
  phone: "",
  whatsapp: "",
  crefito: "",
  clinic: "Atendimento em domicílio",
  address: {
    street: "",
    city: "",
    region: "",
    country: "BR",
  },
  themeColor: "#0B1220",
} as const;

/** Link do WhatsApp, opcionalmente com mensagem pré-preenchida. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
