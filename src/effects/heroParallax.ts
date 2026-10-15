/** Fração da rolagem em que o texto do hero "fica para trás" no início. */
const LAG = 0.35;
/** Layout do hero em duas colunas (ver o breakpoint de 860px em sections.css). */
const TWO_COLUMNS = "(min-width: 861px)";

/**
 * Ao rolar para fora do hero, o texto sobe mais devagar que a página e
 * esmaece, enquanto a coluna 3D se separa. Só no layout de duas colunas:
 * empilhado (celular), o texto deslizaria por cima da cena 3D logo abaixo.
 */
export function initHeroParallax(): () => void {
  const copy = document.querySelector<HTMLElement>("[data-hero-copy]");
  const hero = copy?.closest<HTMLElement>("section");
  if (!copy || !hero) return () => {};

  const wide = window.matchMedia(TWO_COLUMNS);
  let height = 1;
  /** Espaço livre entre a base do texto e a base do hero (o hero corta o que passar). */
  let room = 0;
  /** Último progresso aplicado: passado o hero, a rolagem não escreve mais no DOM. */
  let applied = -1;

  const paint = () => {
    const y = Math.min(window.scrollY, height);
    const p = wide.matches ? y / height : 0;
    if (p === applied) return;
    applied = p;
    // Começa a LAG da rolagem e desacelera até encostar na base, sem nunca ser cortado
    const shift = room > 0 ? room * (1 - Math.exp((-LAG * y) / room)) : 0;
    copy.style.transform = p > 0 ? `translate3d(0, ${shift.toFixed(1)}px, 0)` : "";
    copy.style.opacity = p > 0 ? String(Math.max(0, 1 - p * 1.25)) : "";
  };

  // Medidas de layout (offset*), que ignoram o próprio transform do parallax
  const resize = new ResizeObserver(() => {
    let top = 0;
    for (let el: HTMLElement | null = copy; el && el !== hero; el = el.offsetParent as HTMLElement | null) {
      top += el.offsetTop;
    }
    height = hero.offsetHeight || 1;
    room = height - top - copy.offsetHeight;
    applied = -1;
    paint();
  });
  resize.observe(hero);
  resize.observe(copy);
  window.addEventListener("scroll", paint, { passive: true });
  wide.addEventListener("change", paint);

  return () => {
    resize.disconnect();
    window.removeEventListener("scroll", paint);
    wide.removeEventListener("change", paint);
    copy.style.transform = "";
    copy.style.opacity = "";
  };
}
