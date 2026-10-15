import { addFrame } from "@/lib/loop";

const formatter = new Intl.NumberFormat("pt-BR");

/**
 * Contador animado de 0 até `data-count`, com easing cúbico.
 * O HTML do servidor já traz o valor final (SEO / sem JS).
 */
export function countUp(el: HTMLElement, duration: number): () => void {
  const target = Number(el.dataset.count ?? 0);
  if (duration <= 0) {
    el.textContent = formatter.format(target);
    return () => {};
  }

  let start = -1;
  const stop = addFrame((_t, _d, now) => {
    if (start < 0) start = now;
    const k = Math.min((now - start) / duration, 1);
    el.textContent = formatter.format(Math.round(target * (1 - Math.pow(1 - k, 3))));
    if (k >= 1) stop();
  });
  return stop;
}
