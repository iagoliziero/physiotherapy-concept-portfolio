import Lenis from "lenis";
import { addFrame } from "@/lib/loop";

/**
 * Smooth scroll com Lenis, movido pelo loop único da página.
 * Intercepta links internos (href="#...") para rolar suavemente e mover o
 * foco para a seção de destino (acessibilidade de teclado). A compensação
 * da navbar fixa vem do `scroll-margin-top` das seções, respeitado pelo Lenis.
 */
export function initSmoothScroll(): () => void {
  const lenis = new Lenis({ lerp: 0.09, autoRaf: false });
  const stopFrame = addFrame((_t, _d, now) => lenis.raf(now));

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
    const hash = link?.getAttribute("href");
    if (!hash || hash.length < 2) return;

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    lenis.scrollTo(target);
    history.pushState(null, "", hash);

    // Leva o foco junto, sem pular a rolagem suave
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    stopFrame();
    lenis.destroy();
  };
}
