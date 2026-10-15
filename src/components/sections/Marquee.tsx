import { marqueeItems } from "@/data/content";

/**
 * Faixa inclinada com as especialidades em loop infinito. Três cópias
 * iguais: a faixa anda a largura de uma e recomeça sem emenda, sem sobrar
 * espaço vazio em telas largas nem quando a rolagem inverte o sentido.
 */
export function Marquee() {
  const sequence = marqueeItems.map((item) => `${item} ✦ `).join("");
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" data-marquee="">
        <span>{sequence}</span>
        <span>{sequence}</span>
        <span>{sequence}</span>
      </div>
    </div>
  );
}
