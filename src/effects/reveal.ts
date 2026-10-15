import { countUp } from "./counter";
import { scramble } from "./scramble";

/** Elementos animados na primeira vez em que entram na tela. */
const SELECTOR = "[data-split], .fade, .scr, [data-count], [data-progress]";
const RING_LENGTH = 213.6; // 2πr do anel de progresso (r = 34)

/**
 * Observador único de entrada na tela: aplica a classe `is-in` (reveal
 * palavra por palavra e fade), dispara o scramble das tags, os contadores
 * e o preenchimento dos anéis SVG.
 */
export function initReveal({ reducedMotion }: { reducedMotion: boolean }): () => void {
  const stoppers: Array<() => void> = [];

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        el.classList.add("is-in");

        if (el.classList.contains("scr") && !reducedMotion) stoppers.push(scramble(el));
        if (el.dataset.count !== undefined) stoppers.push(countUp(el, reducedMotion ? 0 : 1800));
        if (el.dataset.progress !== undefined) {
          el.style.strokeDashoffset = String(RING_LENGTH * (1 - Number(el.dataset.progress)));
        }
      }
    },
    { threshold: 0.3 },
  );

  document.querySelectorAll(SELECTOR).forEach((el) => observer.observe(el));

  return () => {
    observer.disconnect();
    stoppers.forEach((stop) => stop());
  };
}
