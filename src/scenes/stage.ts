import {
  AmbientLight,
  BufferGeometry,
  ColorManagement,
  type ColorRepresentation,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  LinearSRGBColorSpace,
  type Material,
  MeshStandardMaterial,
  type Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";
import type { DeviceEnv } from "@/lib/env";
import { addFrame } from "@/lib/loop";

/*
 * O protótipo usava three r128, sem gestão de cor e com luzes "legadas".
 * Para manter a mesma aparência no three atual: desliga a conversão sRGB e
 * multiplica a intensidade das luzes por π (fator que o r128 aplicava).
 */
ColorManagement.enabled = false;
const LEGACY = Math.PI;

export type FrameUpdate = (time: number, delta: number) => void;

export interface Stage {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  el: HTMLElement;
  env: DeviceEnv;
  /** Começa a renderizar pelo loop único (só quando o contêiner está visível). */
  start(update: FrameUpdate): void;
  dispose(): void;
}

/** Contrato comum das cenas montadas pelos componentes React. */
export interface SceneHandle {
  dispose(): void;
}

export function createStage(el: HTMLElement, env: DeviceEnv, cameraZ: number): Stage {
  const width = el.clientWidth || 1;
  const height = el.clientHeight || 1;

  const renderer = new WebGLRenderer({ antialias: !env.lowPower, alpha: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, env.lowPower ? 1 : 2));
  renderer.setSize(width, height);
  renderer.domElement.setAttribute("aria-hidden", "true");
  el.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.z = cameraZ;

  scene.add(new AmbientLight(0xffffff, 0.45 * LEGACY));
  // decay 0 + distância 40 aproxima o decaimento linear do r128
  const keyLight = new PointLight(0x2dd4bf, 1.6 * LEGACY * 0.8, 40, 0);
  keyLight.position.set(4, 3, 6);
  scene.add(keyLight);
  const fillLight = new PointLight(0x38bdf8, 1.2 * LEGACY * 0.8, 40, 0);
  fillLight.position.set(-4, -2, 5);
  scene.add(fillLight);

  // Renderiza só quando o contêiner está na tela
  let visible = false;
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  visibility.observe(el);

  // Acompanha o tamanho do contêiner (resize da janela, breakpoints, etc.)
  const resize = new ResizeObserver(() => {
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  resize.observe(el);

  let stopFrame: (() => void) | null = null;
  let disposed = false;

  return {
    renderer,
    scene,
    camera,
    el,
    env,
    start(update) {
      stopFrame?.();
      const begin = () => {
        if (disposed) return;
        stopFrame = addFrame((time, delta) => {
          if (!visible) return;
          update(time, delta);
          renderer.render(scene, camera);
        });
      };
      // Compila os shaders antes do primeiro quadro, em paralelo, em vez de
      // travar a thread principal no primeiro render. Sem a extensão o
      // three.js só avisaria no console e compilaria do jeito normal.
      if (renderer.extensions.has("KHR_parallel_shader_compile")) {
        renderer.compileAsync(scene, camera).then(begin, begin);
      } else {
        begin();
      }
    },
    dispose() {
      disposed = true;
      stopFrame?.();
      visibility.disconnect();
      resize.disconnect();
      disposeTree(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

/** Libera geometrias e materiais de toda a árvore da cena. */
function disposeTree(root: Object3D) {
  root.traverse((obj) => {
    const node = obj as Object3D & { geometry?: BufferGeometry; material?: Material | Material[] };
    node.geometry?.dispose();
    const material = node.material;
    if (Array.isArray(material)) material.forEach((m) => m.dispose());
    else material?.dispose();
  });
}

/** Material padrão das peças sólidas (metal leve, acabamento acetinado). */
export function standardMaterial(color: ColorRepresentation, opacity = 1) {
  return new MeshStandardMaterial({ color, metalness: 0.35, roughness: 0.3, transparent: opacity < 1, opacity });
}

/** Arestas de uma geometria como linhas (efeito wireframe "limpo"). */
export function edges(geometry: BufferGeometry, color: ColorRepresentation, opacity: number) {
  return new LineSegments(
    new EdgesGeometry(geometry),
    new LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

/** Fator de interpolação independente da taxa de quadros (base: 60 fps). */
export function damp(factor: number, delta: number) {
  return 1 - Math.pow(1 - factor, delta * 60);
}
