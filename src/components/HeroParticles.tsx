"use client";

import { useEffect, useRef } from "react";
import { initParticles } from "@/effects/particles";
import { getDeviceEnv } from "@/lib/env";

/** Canvas 2D com as partículas em constelação do fundo do hero. */
export function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.closest("section");
    if (!canvas || !host) return;
    return initParticles(canvas, host, getDeviceEnv());
  }, []);

  return <canvas ref={ref} className="hero__stars" aria-hidden="true" />;
}
