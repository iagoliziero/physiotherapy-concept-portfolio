import type { CSSProperties } from "react";
import { stats } from "@/data/content";

const RING_LENGTH = 213.6; // 2π · 34
const formatter = new Intl.NumberFormat("pt-BR");

/** Números: anéis SVG de progresso + contadores animados. */
export function Stats() {
  return (
    <section className="sec stats" aria-label="Números">
      <div className="grid stats__grid">
        {stats.map((stat) => (
          <div key={stat.label} className="glass card stat">
            <svg width="110" height="110" viewBox="0 0 90 90" role="img" aria-label={`${formatter.format(stat.value)}${stat.suffix ?? ""} ${stat.label}`}>
              <circle cx="45" cy="45" r="34" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6" />
              <circle
                className="stat__ring"
                data-progress={stat.progress}
                cx="45"
                cy="45"
                r="34"
                fill="none"
                stroke={stat.color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={RING_LENGTH}
                strokeDashoffset={RING_LENGTH}
                // Valor final usado pelo fallback <noscript>
                style={{ "--done": RING_LENGTH * (1 - stat.progress) } as CSSProperties}
              />
              <text
                className="stat__value"
                x="45"
                y="51"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize={stat.value >= 1000 ? 16 : 18}
              >
                <tspan data-count={stat.value}>{formatter.format(stat.value)}</tspan>
                {stat.suffix}
              </text>
            </svg>
            <div className="muted" aria-hidden="true">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
