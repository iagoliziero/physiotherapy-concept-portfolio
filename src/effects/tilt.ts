/**
 * Cards `.card` inclinam em 3D na direção do cursor e recebem as variáveis
 * --x/--y usadas pelo brilho radial (ver effects.css).
 */
export function initTilt({ reducedMotion }: { reducedMotion: boolean }): () => void {
  let current: HTMLElement | null = null;

  const release = () => {
    if (current) current.style.transform = "";
    current = null;
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as Element | null)?.closest?.<HTMLElement>(".card") ?? null;
    if (card !== current) release();
    if (!card) return;

    current = card;
    const box = card.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;
    card.style.setProperty("--x", `${x * 100}%`);
    card.style.setProperty("--y", `${y * 100}%`);
    if (!reducedMotion) {
      // Perspectiva no próprio card: o 3D parte do centro dele, não do centro da grade
      card.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 20}deg) rotateX(${(0.5 - y) * 20}deg) translateZ(14px)`;
    }
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("mouseleave", release);

  return () => {
    release();
    document.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("mouseleave", release);
  };
}
