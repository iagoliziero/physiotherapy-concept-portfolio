/**
 * Conteúdo textual da landing page. Mantido separado dos componentes
 * para facilitar a edição sem mexer em layout ou efeitos.
 */

export const marqueeItems = [
  "ATENDIMENTO EM CASA",
  "DOR DE CABEÇA TENSIONAL",
  "DTM",
  "CERVICAL",
  "LOMBAR",
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
    text: "Dor de cabeça tensional, tensão no pescoço e dor na mandíbula.",
  },
  { icon: "bone", color: "var(--bl)", title: "Coluna e lombar", text: "Alívio da dor nas costas e orientação de postura." },
  {
    icon: "run",
    color: "var(--tq)",
    title: "Recuperação muscular",
    text: "Para quem treina: menos dor e recuperação entre os treinos.",
  },
  { icon: "yoga", color: "var(--bl)", title: "Mobilidade", text: "Mais amplitude de movimento para treinar e para o dia a dia." },
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
    text: "Tensão no pescoço que vira dor de cabeça e dor na mandíbula (DTM), tratadas na sua casa.",
    position: [0, 2.15, -0.12],
  },
  {
    key: "ombro",
    label: "Ombro",
    title: "Dor e tensão no ombro",
    text: "Alívio da dor e recuperação do movimento do ombro.",
    position: [0.62, 1.92, 0],
  },
  {
    key: "lombar",
    label: "Lombar",
    title: "Dor lombar",
    text: "Alívio da dor nas costas, com orientações de postura e movimento para o dia a dia.",
    position: [0, 0.75, -0.42],
  },
  {
    key: "joelho",
    label: "Joelho",
    title: "Recuperação muscular e mobilidade",
    text: "Para quem treina: recuperação muscular e ganho de mobilidade no joelho, para voltar ao treino com mais conforto.",
    position: [0.22, -1.02, 0.16],
  },
  {
    key: "tornozelo",
    label: "Tornozelo",
    title: "Mobilidade para quem treina",
    text: "Recuperação muscular da panturrilha e mobilidade do tornozelo, para treinar com mais liberdade.",
    position: [-0.22, -2.08, 0.12],
  },
];

export const methodSteps = [
  { title: "1. Contato pelo WhatsApp", text: "Você chama no WhatsApp, conta o que está sentindo e combina o horário." },
  { title: "2. Avaliação da queixa", text: "Entender a origem da dor e o quanto ela atrapalha sua rotina e seus treinos." },
  {
    title: "3. Sessão em casa",
    text: "O atendimento acontece na sua casa, sem você precisar se deslocar.",
  },
  { title: "4. Orientações e prevenção", text: "Orientações para o dia a dia e para os treinos, para a dor não voltar." },
];

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

// Só depoimentos reais, com autorização. Sem eles, a seção fica fora da página (ver src/app/page.tsx)
export const testimonials: Testimonial[] = [];

export const certifications = ["Atendimento em domicílio"];

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
