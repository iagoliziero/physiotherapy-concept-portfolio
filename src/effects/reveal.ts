import { countUp } from "./counter";

/** Elementos animados na primeira vez em que entram na tela. */
const SELECTOR = "[data-split], .reveal, .reveal-mask, [data-count], [data-progress]";
const RING_LENGTH = 213.6; // 2πr do anel de progresso (r = 34)
/** Atraso entre elementos que entram juntos na tela (ms) e máximo de degraus. */
const STAGGER = 90;
const MAX_STEPS = 5;

/**
 * Observador único de entrada na tela: aplica a classe `is-in` (reveal
 * palavra por palavra, blocos que sobem e títulos com máscara), dispara os
 * contadores e o preenchimento dos anéis SVG.
 */
export function initReveal(): () => void {
  const stoppers: Array<() => void> = [];

  const observer = new IntersectionObserver(
    (entries) => {
      let step = 0;
      for (const entry of entries) {
        // Já ficou para trás (ex.: página recarregada no meio): mostra sem cascata
        const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        if (!entry.isIntersecting && !passed) continue;

        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        // Quem entra no mesmo quadro (ex.: cards de uma linha) aparece em cascata
        if (!passed && el.matches(".reveal, .reveal-mask")) {
          el.style.setProperty("--d", `${Math.min(step++, MAX_STEPS) * STAGGER}ms`);
        }
        el.classList.add("is-in");

        if (el.dataset.count !== undefined) stoppers.push(countUp(el, 1800));
        if (el.dataset.progress !== undefined) {
          el.style.strokeDashoffset = String(RING_LENGTH * (1 - Number(el.dataset.progress)));
        }
      }
    },
    // Dispara um pouco antes da base da tela, com o elemento já à vista
    { rootMargin: "0px 0px -10% 0px" },
  );

  document.querySelectorAll(SELECTOR).forEach((el) => observer.observe(el));

  return () => {
    observer.disconnect();
    stoppers.forEach((stop) => stop());
  };
}
