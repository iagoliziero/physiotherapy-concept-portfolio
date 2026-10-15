import { marqueeItems } from "@/data/content";

/** Faixa inclinada com as especialidades em loop infinito (conteúdo duplicado). */
export function Marquee() {
  const sequence = marqueeItems.map((item) => `${item} ✦ `).join("");
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {sequence}
        {sequence}
        {" "}
      </div>
    </div>
  );
}
