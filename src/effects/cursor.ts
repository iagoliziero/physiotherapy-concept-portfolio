import { addFrame } from "@/lib/loop";

const TRAIL_SIZE = 7;
/** Elementos que fazem o anel do cursor crescer. */
const INTERACTIVE = "a, button, input, select, label, .card, canvas, .chip";

/**
 * Cursor customizado: anel que segue o mouse com atraso e cresce sobre
 * elementos clicáveis, mais um rastro de 7 pontos.
 * Só deve ser iniciado em dispositivos com ponteiro preciso.
 */
export function initCursor(): () => void {
  const root = document.documentElement;
  const ring = document.createElement("div");
  ring.className = "cursor";
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);

  const trail = Array.from({ length: TRAIL_SIZE }, (_, i) => {
    const el = document.createElement("div");
    el.className = "cursor-trail";
    el.setAttribute("aria-hidden", "true");
    el.style.opacity = String((1 - i / TRAIL_SIZE) * 0.6);
    const size = `${6 - i * 0.6}px`;
    el.style.width = size;
    el.style.height = size;
    document.body.appendChild(el);
    return { el, x: 0, y: 0 };
  });

  root.classList.add("has-custom-cursor");

  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    targetX = e.clientX;
    targetY = e.clientY;
    ring.style.opacity = "1";
  };
  const onLeave = () => {
    ring.style.opacity = "0";
  };
  const onOver = (e: MouseEvent) => {
    const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
    ring.classList.toggle("is-big", Boolean(hit));
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);
  document.addEventListener("mouseover", onOver);

  const stopFrame = addFrame((_t, delta) => {
    // Interpolação independente da taxa de quadros
    const k = 1 - Math.pow(0.8, delta * 60);
    const kt = 1 - Math.pow(0.65, delta * 60);
    x += (targetX - x) * k;
    y += (targetY - y) * k;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

    let px = targetX;
    let py = targetY;
    for (const dot of trail) {
      dot.x += (px - dot.x) * kt;
      dot.y += (py - dot.y) * kt;
      dot.el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      px = dot.x;
      py = dot.y;
    }
  });

  return () => {
    stopFrame();
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    document.removeEventListener("mouseover", onOver);
    root.classList.remove("has-custom-cursor");
    ring.remove();
    trail.forEach((dot) => dot.el.remove());
  };
}
