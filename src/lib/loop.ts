/**
 * Loop de animação único da página.
 *
 * Todos os efeitos (cursor, partículas, carrossel, Lenis e cenas 3D) se
 * registram aqui em vez de criarem o próprio requestAnimationFrame. O loop
 * só fica ativo enquanto houver ao menos um assinante.
 */

/** `time` em segundos desde o início do loop; `delta` em segundos desde o último quadro. */
export type FrameCallback = (time: number, delta: number, now: number) => void;

const callbacks = new Set<FrameCallback>();
let rafId = 0;
let startedAt = -1;
let last = 0;

function tick(now: number) {
  if (startedAt < 0) startedAt = now;
  // Limita o delta para evitar saltos depois de a aba ficar em segundo plano
  const delta = Math.min((now - last) / 1000, 0.1);
  last = now;
  const time = (now - startedAt) / 1000;

  callbacks.forEach((cb) => cb(time, delta, now));

  rafId = callbacks.size > 0 ? requestAnimationFrame(tick) : 0;
}

/** Registra um callback por quadro e devolve a função que o remove. */
export function addFrame(cb: FrameCallback): () => void {
  callbacks.add(cb);
  if (!rafId) {
    last = performance.now();
    rafId = requestAnimationFrame(tick);
  }
  return () => {
    callbacks.delete(cb);
  };
}
