/**
 * Conteúdo textual da landing page. Mantido separado dos componentes
 * para facilitar a edição sem mexer em layout ou efeitos.
 */

export const marqueeItems = [
  "ATENDIMENTO EM CASA",
  "DOR DE CABEÇA TENSIONAL",
  "DTM",
  "PESCOÇO",
  "COSTAS",
  "RECUPERAÇÃO MUSCULAR",
  "MOBILIDADE",
] as const;

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Fração do anel SVG preenchida (0–1). */
  progress: number;
  color: string;
  label: string;
}

// Sem números reais ainda: a seção fica fora da página (ver src/app/page.tsx)
export const stats: Stat[] = [];

export type SpecialtyIcon = "bone" | "run" | "heartbeat" | "yoga";

export interface Specialty {
  icon: SpecialtyIcon;
  color: string;
  title: string;
  text: string;
}

export const specialties: Specialty[] = [
  {
    icon: "heartbeat",
    color: "var(--tq)",
    title: "Cervical e DTM",
    text: "Dor de cabeça tensional, pescoço travado e dor ao mastigar ou abrir a boca.",
  },
  { icon: "bone", color: "var(--bl)", title: "Coluna e lombar", text: "Dor nas costas que piora depois de um dia inteiro sentado." },
  {
    icon: "run",
    color: "var(--tq)",
    title: "Recuperação muscular",
    text: "Alívio do músculo dolorido para você voltar a treinar no seu ritmo.",
  },
  { icon: "yoga", color: "var(--bl)", title: "Mobilidade", text: "Mais amplitude para agachar e correr sem sentir o corpo travado." },
];

/** Opções do formulário de agendamento (derivadas das especialidades). */
export const treatments = specialties.map((s) => s.title);

export type HotspotKey = "cervical" | "ombro" | "lombar" | "joelho" | "tornozelo";

export interface Hotspot {
  key: HotspotKey;
  label: string;
  title: string;
  text: string;
  /** Posição do ponto no corpo 3D (x, y, z). */
  position: [number, number, number];
}

export const hotspots: Hotspot[] = [
  {
    key: "cervical",
    label: "Cervical",
    title: "Dor de cabeça tensional e DTM",
    text: "Quando a tensão no pescoço vira dor de cabeça ou a mandíbula dói ao mastigar. Trato as duas coisas na sua casa.",
    position: [0, 2.15, -0.12],
  },
  {
    key: "ombro",
    label: "Ombro",
    title: "Dor e tensão no ombro",
    text: "Trabalho o alívio da dor e a volta do movimento do ombro.",
    position: [0.62, 1.92, 0],
  },
  {
    key: "lombar",
    label: "Lombar",
    title: "Dor lombar",
    text: "Alívio da dor nas costas e orientações de postura para o seu dia a dia.",
    position: [0, 0.75, -0.42],
  },
  {
    key: "joelho",
    label: "Joelho",
    title: "Recuperação muscular e mobilidade",
    text: "Recuperação muscular e mobilidade do joelho para você voltar ao treino com mais conforto.",
    position: [0.22, -1.02, 0.16],
  },
  {
    key: "tornozelo",
    label: "Tornozelo",
    title: "Mobilidade para quem treina",
    text: "Recuperação muscular da panturrilha e mobilidade do tornozelo para quem treina.",
    position: [-0.22, -2.08, 0.12],
  },
];

export const methodSteps = [
  { title: "1. Contato pelo WhatsApp", text: "Você me chama no WhatsApp, conta o que está sentindo e a gente combina o horário." },
  {
    title: "2. Avaliação da queixa",
    text: "Na primeira visita, entendo de onde vem a dor e o quanto ela atrapalha sua rotina e seus treinos.",
  },
  {
    title: "3. Sessão em casa",
    text: "Levo o atendimento até a sua casa. Você não precisa se deslocar.",
  },
  { title: "4. Orientações e prevenção", text: "Você recebe orientações para o dia a dia e para o treino, para manter o resultado." },
];

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

// Só depoimentos reais, com autorização. Sem eles, a seção fica fora da página (ver src/app/page.tsx)
export const testimonials: Testimonial[] = [];

// Credenciais reais (ex.: "CREFITO-X 000000-F"). Vazio: a lista de selos não aparece no "Sobre"
export const certifications: string[] = [];

/** Capitais conectadas a São Paulo no globo do contato: [latitude, longitude]. */
export const globeDestinations: [number, number][] = [
  [-22.9, -43.2], // Rio de Janeiro
  [-19.9, -43.9], // Belo Horizonte
  [-25.4, -49.3], // Curitiba
  [-15.8, -47.9], // Brasília
  [-27.6, -48.5], // Florianópolis
  [-12.97, -38.5], // Salvador
  [-3.7, -38.5], // Fortaleza
];

// Cidade de atendimento ainda não informada: o pin do globo continua em São Paulo
export const globeOrigin: [number, number] = [-23.55, -46.63]; // São Paulo
