"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type HotspotKey, hotspots } from "@/data/content";
import { getDeviceEnv } from "@/lib/env";
import { whenNearViewport } from "@/lib/viewport";
import type { BodySceneHandle } from "@/scenes/body";

const INITIAL: HotspotKey = "lombar";
/** Tempo do painel "sumir" antes de trocar o texto (ms). */
const SWAP_DELAY = 220;

/**
 * "Onde dói?": corpo humano 3D com hotspots. Chips e cliques na cena
 * selecionam a região; o painel lateral anima a troca de conteúdo.
 */
export function PainMap() {
  const sceneEl = useRef<HTMLDivElement>(null);
  const scene = useRef<BodySceneHandle | null>(null);
  const swapTimer = useRef<number | undefined>(undefined);
  /** Seleção mais recente, para a cena nascer já na região escolhida. */
  const latest = useRef<HotspotKey>(INITIAL);

  const [selected, setSelected] = useState<HotspotKey>(INITIAL);
  const [shown, setShown] = useState<HotspotKey>(INITIAL);
  const [switching, setSwitching] = useState(false);

  // Atualiza o painel: some, troca o texto e reaparece
  const pick = useCallback((key: HotspotKey) => {
    latest.current = key;
    setSelected(key);
    setSwitching(true);
    window.clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(() => {
      setShown(key);
      setSwitching(false);
    }, SWAP_DELAY);
  }, []);

  useEffect(() => {
    const el = sceneEl.current;
    if (!el) return;
    let cancelled = false;

    // Só cria a cena quando ela se aproxima da tela
    const stopWatching = whenNearViewport(el, () => {
      import("@/scenes/body")
        .then(({ createBodyScene }) => {
          if (cancelled) return;
          scene.current = createBodyScene(el, getDeviceEnv(), { hotspots, initial: latest.current, onPick: pick });
        })
        .catch((error: unknown) => console.warn("Cena 3D do corpo indisponível:", error));
    });

    return () => {
      cancelled = true;
      stopWatching();
      window.clearTimeout(swapTimer.current);
      scene.current?.dispose();
      scene.current = null;
    };
  }, [pick]);

  const choose = (key: HotspotKey) => {
    scene.current?.select(key);
    pick(key);
  };

  const info = hotspots.find((h) => h.key === shown) ?? hotspots[0];

  return (
    <section className="sec" id="onde-doi" aria-labelledby="onde-doi-title">
      <h2 id="onde-doi-title" className="sec-title--tight reveal-mask">
        <span>Onde dói?</span>
      </h2>
      <p className="sec-lead muted reveal">Arraste para girar o corpo e toque no ponto que dói.</p>

      <div className="grid pain__grid">
        <div
          ref={sceneEl}
          className="glass scene pain__scene reveal"
          role="img"
          aria-label="Corpo humano 3D interativo. Use os botões de região ao lado para selecionar pelo teclado."
        />
        <div className="reveal">
          <div className="chips" role="group" aria-label="Regiões do corpo">
            {hotspots.map((h) => (
              <button
                key={h.key}
                type="button"
                className="chip mag"
                aria-pressed={selected === h.key}
                onClick={() => choose(h.key)}
              >
                {h.label}
              </button>
            ))}
          </div>
          <div className={`glass pain__info${switching ? " is-switching" : ""}`} aria-live="polite">
            <span className="region-label">{info.label}</span>
            <h3>{info.title}</h3>
            <p className="muted">{info.text}</p>
            <a className="btn btn-primary mag" href="#contato">
              Agendar avaliação
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
