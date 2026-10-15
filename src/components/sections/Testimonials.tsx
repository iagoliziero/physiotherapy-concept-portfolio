"use client";

import { IconChevronLeft, IconChevronRight, IconStarFilled } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { testimonials } from "@/data/content";
import { getDeviceEnv } from "@/lib/env";
import { addFrame } from "@/lib/loop";

const RADIUS = 240;
const STEP = 360 / testimonials.length;

/** Depoimentos: carrossel CSS 3D em cilindro que gira sozinho e pausa no hover/foco. */
export function Testimonials() {
  const ring = useRef<HTMLUListElement>(null);
  const target = useRef(0);
  const paused = useRef(false);

  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    const { reducedMotion } = getDeviceEnv();
    let angle = target.current;

    return addFrame((_t, delta) => {
      if (!paused.current && !reducedMotion) target.current -= 0.12 * delta * 60;
      angle += (target.current - angle) * (reducedMotion ? 1 : 1 - Math.pow(0.92, delta * 60));
      el.style.transform = `translateZ(-${RADIUS}px) rotateY(${angle}deg)`;
    });
  }, []);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  return (
    <section className="sec" aria-labelledby="depoimentos-title">
      <h2 id="depoimentos-title" className="sec-title reveal-mask">
        <span>Quem já voltou a se mover</span>
      </h2>

      <div
        className="cylinder"
        aria-roledescription="carrossel"
        aria-label="Depoimentos de pacientes"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
      >
        <ul ref={ring} className="cylinder__ring" style={{ transform: `translateZ(-${RADIUS}px)` }}>
          {testimonials.map((t, i) => (
            <li
              key={t.name}
              className="glass testimonial"
              style={{ transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px)` }}
            >
              <div className="testimonial__stars" role="img" aria-label="5 de 5 estrelas">
                {Array.from({ length: 5 }, (_, s) => (
                  <IconStarFilled key={s} size={14} aria-hidden="true" />
                ))}
              </div>
              <blockquote>
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <div className="testimonial__name">{t.name}</div>
              <div className="testimonial__role muted">{t.role}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="cylinder__controls">
        <button
          type="button"
          className="btn btn-ghost btn--icon mag"
          aria-label="Depoimento anterior"
          onClick={() => (target.current += STEP)}
        >
          <IconChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="btn btn-ghost btn--icon mag"
          aria-label="Próximo depoimento"
          onClick={() => (target.current -= STEP)}
        >
          <IconChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
