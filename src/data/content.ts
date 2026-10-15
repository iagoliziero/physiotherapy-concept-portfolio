/**
 * Conteúdo textual da landing page. Mantido separado dos componentes
 * para facilitar a edição sem mexer em layout ou efeitos.
 */

export const marqueeItems = [
  "COLUNA",
  "JOELHO",
  "OMBRO",
  "PÓS-OPERATÓRIO",
  "PILATES CLÍNICO",
  "LESÕES ESPORTIVAS",
  "POSTURA",
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

export const stats: Stat[] = [
  { value: 12, suffix: "+", progress: 0.85, color: "#2DD4BF", label: "anos de experiência" },
  { value: 3200, progress: 0.92, color: "#38BDF8", label: "pacientes atendidos" },
  { value: 98, suffix: "%", progress: 0.98, color: "#2DD4BF", label: "de satisfação" },
];

export type SpecialtyIcon = "bone" | "run" | "heartbeat" | "yoga";

export interface Specialty {
  icon: SpecialtyIcon;
  color: string;
  title: string;
  text: string;
}

export const specialties: Specialty[] = [
  { icon: "bone", color: "var(--tq)", title: "Coluna", text: "Hérnia de disco, lombalgia e correção postural." },
  { icon: "run", color: "var(--bl)", title: "Esportiva", text: "Joelho, tornozelo e retorno ao esporte." },
  { icon: "heartbeat", color: "var(--tq)", title: "Pós-operatório", text: "Recuperação segura de cirurgias ortopédicas." },
  { icon: "yoga", color: "var(--bl)", title: "Pilates clínico", text: "Fortalecimento, mobilidade e prevenção." },
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
    title: "Dor no pescoço e tensão",
    text: "Liberação miofascial, mobilização cervical e ergonomia para quem passa horas no computador.",
    position: [0, 2.15, -0.12],
  },
  {
    key: "ombro",
    label: "Ombro",
    title: "Tendinite e lesão do manguito",
    text: "Fortalecimento progressivo, terapia manual e retorno seguro a treinos de força e natação.",
    position: [0.62, 1.92, 0],
  },
  {
    key: "lombar",
    label: "Lombar",
    title: "Dor lombar e hérnia de disco",
    text: "Terapia manual, estabilização do core e reeducação postural para aliviar e prevenir crises.",
    position: [0, 0.75, -0.42],
  },
  {
    key: "joelho",
    label: "Joelho",
    title: "Lesões de LCA e menisco",
    text: "Reabilitação pós-operatória e conservadora com protocolo baseado em critérios de retorno ao esporte.",
    position: [0.22, -1.02, 0.16],
  },
  {
    key: "tornozelo",
    label: "Tornozelo",
    title: "Entorses e instabilidade",
    text: "Treino proprioceptivo, fortalecimento e prevenção de novas entorses.",
    position: [-0.22, -2.08, 0.12],
  },
];

export const methodSteps = [
  { title: "1. Avaliação", text: "Testes de força, mobilidade e análise do movimento." },
  { title: "2. Diagnóstico funcional", text: "Identificamos a causa da dor, não apenas o sintoma." },
  { title: "3. Tratamento", text: "Terapia manual, exercícios e tecnologia com metas mensuráveis." },
  { title: "4. Alta e prevenção", text: "Plano de manutenção para a dor não voltar." },
];

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  { name: "Marina S.", role: "Corredora", quote: "Voltei a correr meia maratona sem dor no joelho em 3 meses." },
  { name: "Carlos T.", role: "Analista", quote: "A dor lombar de 5 anos sumiu. Mudou minha rotina." },
  { name: "Juliana P.", role: "Pós-cirurgia LCA", quote: "Recuperação impecável, me senti segura em cada etapa." },
  { name: "Pedro A.", role: "Jogador de futebol", quote: "Retornei aos treinos antes do previsto e mais forte." },
  { name: "Ana L.", role: "Professora", quote: "O pilates clínico corrigiu minha postura de vez." },
  { name: "Roberto M.", role: "Ciclista", quote: "Atendimento técnico e humano. Recomendo demais." },
];

export const certifications = [
  "CREFITO-3",
  "Mestrado USP",
  "Terapia manual",
  "Pilates clínico",
  "Dry needling",
];

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

export const globeOrigin: [number, number] = [-23.55, -46.63]; // São Paulo
