const DURATION = 700;

/** Onda circular que se expande a partir de qualquer clique na página. */
export function initRipple(): () => void {
  const onClick = (e: MouseEvent) => {
    // Cliques via teclado chegam com coordenadas (0, 0): ignorados
    if (e.detail === 0) return;
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    ripple.setAttribute("aria-hidden", "true");
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), DURATION);
  };

  window.addEventListener("click", onClick);
  return () => window.removeEventListener("click", onClick);
}
