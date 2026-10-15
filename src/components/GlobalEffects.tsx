"use client";

import { useEffect } from "react";
import { initCursor } from "@/effects/cursor";
import { initHeroParallax } from "@/effects/heroParallax";
import { initMagnetic } from "@/effects/magnetic";
import { initMarquee } from "@/effects/marquee";
import { initReveal } from "@/effects/reveal";
import { initRipple } from "@/effects/ripple";
import { initScrollProgress } from "@/effects/scrollProgress";
import { initSmoothScroll } from "@/effects/smoothScroll";
import { initTilt } from "@/effects/tilt";
import { initTimeline } from "@/effects/timeline";
import { getDeviceEnv } from "@/lib/env";

/**
 * Liga os efeitos globais da página depois da hidratação. Não renderiza
 * nada: os efeitos atuam sobre o HTML gerado no servidor via classes e
 * atributos `data-*`.
 */
export function GlobalEffects() {
  useEffect(() => {
    const env = getDeviceEnv();
    const cleanups = [
      initReveal(),
      initTimeline(),
      initTilt(env),
      initScrollProgress(),
      initMarquee({ followScroll: !env.reducedMotion }),
    ];

    // Movimento reduzido: a página continua viva, só sem os movimentos grandes
    // ligados à rolagem (inércia, parallax do hero, faixa acelerando)
    if (!env.reducedMotion) {
      cleanups.push(initSmoothScroll(), initRipple(), initHeroParallax());
      // Cursor customizado e magnetismo só com mouse/trackpad
      if (env.finePointer) cleanups.push(initCursor(), initMagnetic());
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
