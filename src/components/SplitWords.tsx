import { Fragment } from "react";

/**
 * Quebra o texto em palavras para o reveal palavra por palavra
 * (cada palavra entra com 80 ms de atraso em relação à anterior).
 */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span data-split="">
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="word" style={{ transitionDelay: `${i * 80}ms` }}>
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
