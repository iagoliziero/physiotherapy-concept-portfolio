"use client";

import { IconArrowsHorizontal } from "@tabler/icons-react";
import { useState } from "react";
import { ScheduleCta } from "@/components/ScheduleCta";

/*
 * Ilustrações estáticas fora do componente: o slider rerenderiza a cada
 * movimento e assim o React reaproveita os mesmos elementos SVG.
 */

/** Depois: eixo alinhado. */
const afterIllustration = (
  <svg viewBox="0 0 300 260" width="340" height="300" aria-hidden="true">
    <line x1="150" y1="10" x2="150" y2="250" stroke="#2DD4BF" strokeDasharray="4 5" opacity=".5" />
    <circle cx="150" cy="40" r="20" fill="none" stroke="#2DD4BF" strokeWidth="3" />
    <path d="M150 62 C152 100,148 140,150 170" fill="none" stroke="#2DD4BF" strokeWidth="4" />
    <path d="M150 80 L150 135" stroke="#2DD4BF" strokeWidth="3" />
    <path d="M150 170 L145 250 M150 170 L158 250" stroke="#2DD4BF" strokeWidth="3" />
    <text x="220" y="30" fill="#2DD4BF" fontSize="13">
      Depois
    </text>
    <text x="190" y="235" fill="#94A3B8" fontSize="11">
      eixo alinhado
    </text>
  </svg>
);

/** Antes: cabeça projetada e cifose. */
const beforeIllustration = (
  <svg viewBox="0 0 300 260" width="340" height="300" aria-hidden="true">
    <line x1="150" y1="10" x2="150" y2="250" stroke="#F09595" strokeDasharray="4 5" opacity=".5" />
    <circle cx="182" cy="52" r="20" fill="none" stroke="#F09595" strokeWidth="3" />
    <path d="M172 72 C140 95,135 130,152 170" fill="none" stroke="#F09595" strokeWidth="4" />
    <path d="M160 88 L176 140" stroke="#F09595" strokeWidth="3" />
    <path d="M152 170 L140 250 M152 170 L160 250" stroke="#F09595" strokeWidth="3" />
    <circle cx="145" cy="110" r="9" fill="none" stroke="#E24B4A" strokeWidth="2" />
    <text x="30" y="30" fill="#F09595" fontSize="13">
      Antes
    </text>
    <text x="20" y="235" fill="#94A3B8" fontSize="11">
      cabeça projetada + cifose
    </text>
  </svg>
);

const handleIcon = (
  <div className="compare__handle">
    <IconArrowsHorizontal size={20} />
  </div>
);

/** Antes e depois: slider arrastável comparando a postura. */
export function BeforeAfter() {
  const [value, setValue] = useState(50);

  return (
    <section className="sec" aria-labelledby="resultados-title">
      <h2 id="resultados-title" className="sec-title--tight reveal-mask">
        <span>Postura que pesa no pescoço</span>
      </h2>
      <p className="sec-lead muted reveal">
        Com a cabeça projetada para a frente, o pescoço trabalha sobrecarregado. Essa postura pode contribuir para
        a dor de cabeça tensional. Arraste para comparar.
      </p>

      <div className="compare glass reveal">
        <div className="compare__pane compare__pane--after">{afterIllustration}</div>

        {/* "Antes" fica por cima, recortado pelo slider */}
        <div className="compare__pane compare__pane--before" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          {beforeIllustration}
        </div>

        <div className="compare__bar" style={{ left: `${value}%` }} aria-hidden="true">
          {handleIcon}
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label="Comparar a postura com a cabeça projetada e a postura alinhada"
          aria-valuetext={`${value}% mostrando o antes`}
        />
      </div>
      <ScheduleCta />
    </section>
  );
}
