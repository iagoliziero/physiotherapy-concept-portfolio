"use client";

import { useEffect, useRef } from "react";
import { getDeviceEnv } from "@/lib/env";
import { whenNearViewport } from "@/lib/viewport";
import type { SceneHandle } from "@/scenes/stage";

/*
 * As cenas são carregadas sob demanda: o three.js fica fora do bundle
 * inicial e só é baixado no navegador.
 */
const loaders = {
  spine: () => import("@/scenes/spine").then((m) => m.createSpineScene),
  globe: () => import("@/scenes/globe").then((m) => m.createGlobeScene),
};

interface SceneMountProps {
  scene: keyof typeof loaders;
  className?: string;
  /** Descrição acessível da cena. */
  label: string;
}

/** Contêiner que monta (e desmonta) uma cena Three.js. */
export function SceneMount({ scene, className = "", label }: SceneMountProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let handle: SceneHandle | null = null;
    let cancelled = false;

    // Só cria a cena quando ela se aproxima da tela
    const stopWatching = whenNearViewport(el, () => {
      loaders[scene]()
        .then((create) => {
          if (!cancelled) handle = create(el, getDeviceEnv());
        })
        .catch((error: unknown) => {
          // Sem WebGL a página continua funcional, só sem a cena
          console.warn(`Cena 3D "${scene}" indisponível:`, error);
        });
    });

    return () => {
      cancelled = true;
      stopWatching();
      handle?.dispose();
    };
  }, [scene]);

  return <div ref={ref} className={`scene ${className}`} role="img" aria-label={label} />;
}
