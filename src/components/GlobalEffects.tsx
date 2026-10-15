"use client";

import { useEffect } from "react";
import { initCursor } from "@/effects/cursor";
import { initMagnetic } from "@/effects/magnetic";
import { initReveal } from "@/effects/reveal";
import { initRipple } from "@/effects/ripple";
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
    const cleanups = [initReveal(env), initTimeline(), initTilt(env)];

    if (!env.reducedMotion) {
      cleanups.push(initSmoothScroll(), initRipple());
      // Cursor customizado e magnetismo só com mouse/trackpad
      if (env.finePointer) cleanups.push(initCursor(), initMagnetic());
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
