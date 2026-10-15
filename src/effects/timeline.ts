/** Altura da tela (fração) da "agulha" que puxa a ponta da linha. */
const NEEDLE = 0.6;
/** Início da linha e centro do ponto de cada etapa, a partir do topo da etapa (ver sections.css). */
const LINE_TOP = 8;
const DOT_CENTER = 14;

/**
 * Linha do tempo do método: a linha com glow se desenha acompanhando a
 * rolagem, com um ponto de luz na ponta, e cada etapa acende quando a
 * linha chega ao seu ponto. Rolando para cima, a linha recolhe junto.
 * Na rolagem só muda transform e classes; as medidas são relidas no resize.
 */
export function initTimeline(): () => void {
  const root = document.querySelector<HTMLElement>("[data-timeline]");
  const progress = root?.querySelector<HTMLElement>("[data-timeline-progress]");
  const tip = root?.querySelector<HTMLElement>("[data-timeline-tip]");
  if (!root || !progress || !tip) return () => {};

  const steps = Array.from(root.querySelectorAll<HTMLElement>(".step"));
  const lit = steps.map(() => false);
  /** Distância do início da linha até o ponto de cada etapa. */
  let marks: number[] = [];
  let start = 0;
  let length = 0;
  let needle = 0;
  let drawn = -1;

  const paint = () => {
    const next = Math.min(Math.max(window.scrollY + needle - start, 0), length);
    if (next === drawn) return;
    drawn = next;
    progress.style.transform = `scaleY(${length > 0 ? drawn / length : 0})`;
    tip.style.transform = `translate3d(0, ${drawn.toFixed(1)}px, 0)`;
    tip.style.opacity = drawn > 0 && drawn < length ? "1" : "0";
    marks.forEach((mark, i) => {
      const on = drawn >= mark;
      if (on === lit[i]) return;
      lit[i] = on;
      steps[i].classList.toggle("is-in", on);
    });
  };

  const measure = () => {
    start = root.getBoundingClientRect().top + window.scrollY + LINE_TOP;
    marks = steps.map((step) => step.offsetTop + DOT_CENTER - LINE_TOP);
    length = marks[marks.length - 1] ?? 0;
    needle = window.innerHeight * NEEDLE;
    progress.style.height = `${length}px`;
    drawn = -1;
    paint();
  };

  const resize = new ResizeObserver(measure);
  resize.observe(root);
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", paint, { passive: true });

  return () => {
    resize.disconnect();
    window.removeEventListener("resize", measure);
    window.removeEventListener("scroll", paint);
  };
}
