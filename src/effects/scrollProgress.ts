/**
 * Linha de progresso da leitura na borda da navbar. Só muda o `scaleX`,
 * então rolar não provoca layout; a altura da página é relida apenas
 * quando o conteúdo ou a janela mudam de tamanho.
 */
export function initScrollProgress(): () => void {
  const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
  if (!bar) return () => {};

  let max = 1;
  const paint = () => {
    bar.style.transform = `scaleX(${Math.min(window.scrollY / max, 1)})`;
  };
  const measure = () => {
    max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    paint();
  };

  const resize = new ResizeObserver(measure);
  resize.observe(document.body);
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", paint, { passive: true });

  return () => {
    resize.disconnect();
    window.removeEventListener("resize", measure);
    window.removeEventListener("scroll", paint);
  };
}
