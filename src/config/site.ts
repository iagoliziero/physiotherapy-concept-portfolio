/**
 * Dados institucionais centralizados: usados em metadata, JSON-LD,
 * rodapé, botão de WhatsApp e formulário.
 */
export const site = {
  name: "Dr. Rafael Moura",
  brand: "Rafael Moura",
  title: "Dr. Rafael Moura | Fisioterapia Esportiva e Coluna em São Paulo",
  description:
    "Fisioterapia esportiva e reabilitação de coluna em São Paulo. Tratamento baseado em evidência para lombalgia, hérnia de disco, lesões esportivas e pós-operatório.",
  ogTitle: "Dr. Rafael Moura | Fisioterapia",
  ogDescription: "Movimento sem dor começa aqui. Agende sua avaliação.",
  /** Defina NEXT_PUBLIC_SITE_URL no deploy para gerar URLs absolutas corretas. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+55-11-99999-0000",
  whatsapp: "5511999990000",
  crefito: "CREFITO-3 000000-F",
  clinic: "Clínica Movimento",
  address: {
    street: "Av. Paulista, 1000",
    city: "São Paulo",
    region: "SP",
    country: "BR",
  },
  themeColor: "#0B1220",
} as const;

/** Link do WhatsApp, opcionalmente com mensagem pré-preenchida. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
