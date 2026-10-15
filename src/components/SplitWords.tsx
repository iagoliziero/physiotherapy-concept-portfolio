import { Fragment } from "react";

/**
 * Quebra o texto em palavras para o reveal palavra por palavra
 * (cada palavra entra com 80 ms de atraso em relação à anterior).
 * Um "\n" no texto força a quebra de linha naquele ponto.
 */
export function SplitWords({ text }: { text: string }) {
  let index = 0;
  const lines = text.split("\n");
  return (
    <span data-split="">
      {lines.map((line, l) => {
        const words = line.split(" ");
        return (
          <Fragment key={l}>
            {l > 0 ? <br /> : null}
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span className="word" style={{ transitionDelay: `${index++ * 80}ms` }}>
                  {word}
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </span>
  );
}
