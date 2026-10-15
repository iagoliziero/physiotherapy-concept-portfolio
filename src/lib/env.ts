/**
 * Preferências do dispositivo, lidas apenas no cliente.
 */
export interface DeviceEnv {
  /** Usuário pediu menos movimento (prefers-reduced-motion). */
  reducedMotion: boolean;
  /** Tela pequena ou touch: menos partículas/vértebras, pixelRatio 1, sem antialias. */
  lowPower: boolean;
  /** Mouse/trackpad preciso: habilita cursor customizado e efeitos de hover. */
  finePointer: boolean;
}

export function getDeviceEnv(): DeviceEnv {
  if (typeof window === "undefined") {
    return { reducedMotion: true, lowPower: true, finePointer: false };
  }
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    lowPower: window.innerWidth < 760 || coarse,
    finePointer: window.matchMedia("(pointer: fine)").matches && !coarse,
  };
}
