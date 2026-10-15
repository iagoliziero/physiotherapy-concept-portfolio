import { addFrame } from "@/lib/loop";

const CHARS = "!<>-_/[]{}=+*^?#ABCXYZ0123456789";

/**
 * Efeito "scramble": caracteres aleatórios vão se resolvendo, da esquerda
 * para a direita, até formar o texto final.
 */
export function scramble(el: HTMLElement): () => void {
  const final = el.dataset.text ?? (el.dataset.text = el.textContent ?? "");
  const total = final.length * 2;
  let frame = 0;

  const stop = addFrame(() => {
    el.textContent = final
      .split("")
      .map((char, i) => (i < frame / 2 || char === " " ? char : CHARS[(Math.random() * CHARS.length) | 0]))
      .join("");
    if (frame++ >= total) {
      el.textContent = final;
      stop();
    }
  });

  return stop;
}
