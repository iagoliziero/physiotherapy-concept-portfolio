import { addFrame } from "@/lib/loop";

/** Segundos para a faixa andar uma volta inteira com a página parada. */
const LOOP_SECONDS = 26;
/** Parte da velocidade da rolagem (px/s) repassada à faixa. */
const SCROLL_BOOST = 0.3;
/** Teto do empurrão da rolagem (px/s), para o texto não virar um borrão. */
const MAX_BOOST = 900;

/**
 * Faixa inclinada em loop infinito, movida pelo loop único. Anda sozinha e,
 * com `followScroll`, acelera no sentido da rolagem (rolar para cima chega a
 * inverter o sentido), voltando ao ritmo normal quando a página para.
 * Só anima enquanto está na tela.
 * O conteúdo vem repetido em <span>s iguais: uma volta é a distância entre dois.
 */
export function initMarquee({ followScroll }: { followScroll: boolean }): () => void {
  const track = document.querySelector<HTMLElement>("[data-marquee]");
  const [first, second] = track ? Array.from(track.children) : [];
  if (!track || !first || !second) return () => {};

  // A largura muda com a troca de fonte (display: swap) e com o tamanho da tela
  let period = 0;
  const resize = new ResizeObserver(() => {
    period = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
  });
  resize.observe(track);

  let visible = false;
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  visibility.observe(track);

  // Posição lida no evento de scroll, para não forçar layout dentro do quadro
  let scrollY = window.scrollY;
  const onScroll = () => {
    scrollY = window.scrollY;
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  let x = 0;
  let lastY = scrollY;
  let velocity = 0;

  const stopFrame = addFrame((_t, delta) => {
    if (delta <= 0) return;
    // Velocidade da rolagem (px/s), suavizada para a faixa não dar trancos
    velocity += ((scrollY - lastY) / delta - velocity) * (1 - Math.pow(0.85, delta * 60));
    lastY = scrollY;
    if (!visible || period <= 0) return;

    const boost = followScroll ? Math.max(-MAX_BOOST, Math.min(MAX_BOOST, velocity * SCROLL_BOOST)) : 0;
    x = (x + (period / LOOP_SECONDS + boost) * delta) % period;
    if (x < 0) x += period;
    track.style.transform = `translate3d(${-x}px, 0, 0)`;
  });

  return () => {
    stopFrame();
    resize.disconnect();
    visibility.disconnect();
    window.removeEventListener("scroll", onScroll);
    track.style.transform = "";
  };
}
