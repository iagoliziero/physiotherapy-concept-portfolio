/**
 * Botões magnéticos: elementos com a classe `.mag` são atraídos pelo cursor.
 * Usa delegação de eventos, então funciona também para elementos
 * renderizados depois da inicialização.
 */
export function initMagnetic(): () => void {
  let current: HTMLElement | null = null;

  const release = () => {
    if (current) current.style.transform = "";
    current = null;
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = (e.target as Element | null)?.closest?.<HTMLElement>(".mag") ?? null;
    if (el !== current) release();
    if (!el) return;

    current = el;
    const box = el.getBoundingClientRect();
    const dx = (e.clientX - box.left - box.width / 2) * 0.3;
    const dy = (e.clientY - box.top - box.height / 2) * 0.4;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("mouseleave", release);

  return () => {
    release();
    document.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("mouseleave", release);
  };
}
