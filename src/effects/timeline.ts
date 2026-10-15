/**
 * Linha do tempo do método: cada etapa acende ao entrar na tela e a linha
 * com glow "se desenha" até a última etapa visível.
 */
export function initTimeline(): () => void {
  const root = document.querySelector<HTMLElement>("[data-timeline]");
  const progress = root?.querySelector<HTMLElement>("[data-timeline-progress]");
  if (!root || !progress) return () => {};

  const steps = Array.from(root.querySelectorAll<HTMLElement>(".step"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
      });
      const last = steps.filter((step) => step.classList.contains("is-in")).pop();
      if (last) progress.style.height = `${last.offsetTop + 10}px`;
    },
    { threshold: 0.6 },
  );

  steps.forEach((step) => observer.observe(step));
  return () => observer.disconnect();
}
