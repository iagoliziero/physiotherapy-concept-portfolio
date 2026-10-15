import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  type LineSegments,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  SphereGeometry,
  TorusGeometry,
} from "three";
import type { DeviceEnv } from "@/lib/env";
import { createStage, damp, edges, type SceneHandle, standardMaterial } from "./stage";

/** Distância padrão da câmera (telas largas). */
const BASE_Z = 10;
/**
 * Raio horizontal que precisa caber no quadro: anel maior (3,4) + esfera
 * orbital + folga do parallax da câmera. Em canvas estreitos a câmera se
 * afasta o necessário para os anéis não serem cortados nas laterais.
 */
const FIT_RADIUS = 3.8;

interface Vertebra {
  group: Group;
  baseY: number;
  baseX: number;
  /** Fase aleatória usada no afastamento/giro da "explosão". */
  phase: number;
}

interface OrbitRing {
  mesh: Mesh;
  orb: Mesh;
  radius: number;
  speed: number;
}

/**
 * Cena do hero: coluna vertebral estilizada em S, anéis orbitais com
 * esferas, hélice dupla de partículas e icosaedros flutuantes.
 * Quando a cena sai pelo topo da tela as vértebras se afastam e giram ("explosão").
 */
export function createSpineScene(el: HTMLElement, env: DeviceEnv): SceneHandle {
  const stage = createStage(el, env, BASE_Z);
  const { scene, camera } = stage;

  // ----- Coluna: vértebras = cilindro + wireframe + processos + disco -----
  const spine = new Group();
  scene.add(spine);

  const bodyMat = standardMaterial(0x2dd4bf, 0.85);
  const spinousMat = standardMaterial(0x0f6e56);
  const transverseMat = standardMaterial(0x1d9e75);
  const discMat = standardMaterial(0xe1f5ee);

  const count = env.lowPower ? 10 : 16;
  // Com menos vértebras (celular), cada uma fica mais alta para a coluna continuar
  // encostada na mesma altura; com 16, o fator é 1 e nada muda
  const stretch = 15 / (count - 1);
  const segments = env.lowPower ? 12 : 28;
  const vertebrae: Vertebra[] = [];

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const y = 3.3 - t * 6.6;
    const x = Math.sin(t * Math.PI * 1.7) * 0.5; // curvatura em S
    const s = 0.55 + t * 0.55; // vértebras crescem em direção à lombar
    const group = new Group();
    group.position.set(x, y, 0);

    group.add(new Mesh(new CylinderGeometry(0.5 * s, 0.5 * s, 0.26 * stretch, segments), bodyMat));
    group.add(edges(new CylinderGeometry(0.58 * s, 0.58 * s, 0.3 * stretch, 10), 0x38bdf8, 0.6));

    // Processo espinhoso (para trás)
    const spinous = new Mesh(new BoxGeometry(0.22, 0.16 * stretch, 0.55 * s), spinousMat);
    spinous.position.z = -0.55 * s;
    group.add(spinous);

    // Processos transversos (laterais)
    for (const side of [-1, 1]) {
      const transverse = new Mesh(new BoxGeometry(0.5 * s, 0.1 * stretch, 0.12), transverseMat);
      transverse.position.set(side * 0.55 * s, 0, -0.25 * s);
      group.add(transverse);
    }

    // Disco intervertebral claro
    if (i < count - 1) {
      const disc = new Mesh(new CylinderGeometry(0.36 * s, 0.36 * s, 0.13 * stretch, 20), discMat);
      disc.position.y = -0.21 * stretch;
      group.add(disc);
    }

    spine.add(group);
    vertebrae.push({ group, baseY: y, baseX: x, phase: Math.random() * 6 });
  }

  // ----- Anéis orbitais com esferas -----
  const rings: OrbitRing[] = (
    [
      [2.4, 0x2dd4bf, 1.2],
      [2.9, 0x38bdf8, -0.9],
      [3.4, 0xa78bfa, 0.5],
    ] as const
  ).map(([radius, color, tilt]) => {
    const mesh = new Mesh(
      new TorusGeometry(radius, 0.012, 6, 140),
      new MeshBasicMaterial({ color, transparent: true, opacity: 0.55 }),
    );
    mesh.rotation.x = Math.PI / 2 + tilt * 0.3;
    mesh.rotation.y = tilt * 0.4;
    const orb = new Mesh(new SphereGeometry(0.07, 12, 12), new MeshBasicMaterial({ color }));
    mesh.add(orb);
    scene.add(mesh);
    return { mesh, orb, radius, speed: 0.6 + Math.random() };
  });

  // ----- Hélice dupla de partículas (AdditiveBlending) -----
  const helixCount = env.lowPower ? 160 : 360;
  const helixPositions: number[] = [];
  for (let i = 0; i < helixCount; i++) {
    const t = i / helixCount;
    const a = t * Math.PI * 10 + (i % 2) * Math.PI;
    helixPositions.push(Math.cos(a) * 1.5, 3.6 - t * 7.2, Math.sin(a) * 1.5);
  }
  const helixGeometry = new BufferGeometry();
  helixGeometry.setAttribute("position", new Float32BufferAttribute(helixPositions, 3));
  const helix = new Points(
    helixGeometry,
    new PointsMaterial({ color: 0x38bdf8, size: 0.05, transparent: true, opacity: 0.8, blending: AdditiveBlending }),
  );
  scene.add(helix);

  // ----- Icosaedros em wireframe flutuando -----
  const floaters: LineSegments[] = [];
  for (let i = 0; i < (env.lowPower ? 3 : 7); i++) {
    const floater = edges(new IcosahedronGeometry(0.18 + Math.random() * 0.2, 0), i % 2 ? 0x2dd4bf : 0x38bdf8, 0.8);
    floater.position.set((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3 - 1);
    scene.add(floater);
    floaters.push(floater);
  }

  // ----- Parallax de mouse -----
  let mouseX = 0;
  let mouseY = 0;
  const onMouse = (e: MouseEvent) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener("mousemove", onMouse, { passive: true });

  // ----- Explosão: a coluna se separa conforme a própria cena sai pelo topo da tela -----
  // (Pela fração visível do hero inteiro, no celular ela já se separava ao rolar até a cena,
  // que fica abaixo do texto.)
  let exitTarget = 0;
  let exitAmount = 0;
  const measureExit = () => {
    const box = el.getBoundingClientRect();
    exitTarget = box.height > 0 ? Math.min(1, Math.max(0, -box.top / box.height)) : 0;
  };
  measureExit();
  window.addEventListener("scroll", measureExit, { passive: true });
  window.addEventListener("resize", measureExit);

  stage.start((time, delta) => {
    const step = delta * 60;
    const ease = damp(0.05, delta);

    spine.rotation.y += 0.006 * step;
    spine.rotation.x += (mouseY * 0.45 - spine.rotation.x) * ease;
    spine.position.x += (mouseX * 0.9 - spine.position.x) * ease;

    // Movimento reduzido: sem explosão ligada ao scroll
    exitAmount += (exitTarget - exitAmount) * damp(0.15, delta);
    const explode = env.reducedMotion ? 0 : exitAmount * 0.9;
    vertebrae.forEach((v, i) => {
      v.group.position.y = v.baseY * (1 + explode * 0.6) + Math.sin(time * 1.5 + i * 0.5) * 0.03;
      v.group.position.x = v.baseX + Math.sin(v.phase) * explode * 0.8;
      v.group.rotation.y = explode * v.phase;
    });

    rings.forEach((r) => {
      r.mesh.rotation.z += 0.004 * r.speed * step;
      const a = time * r.speed;
      r.orb.position.set(Math.cos(a) * r.radius, Math.sin(a) * r.radius, 0);
    });

    helix.rotation.y -= 0.004 * step;

    floaters.forEach((f, i) => {
      f.rotation.x += 0.01 * step;
      f.rotation.y += 0.013 * step;
      f.position.y += Math.sin(time + i) * 0.002 * step;
    });

    // Enquadramento pela proporção atual do canvas (muda no resize)
    const halfHeight = Math.tan((camera.fov * Math.PI) / 360);
    camera.position.z = Math.max(BASE_Z, FIT_RADIUS / (halfHeight * camera.aspect));
    camera.position.x += (mouseX * 1.2 - camera.position.x) * damp(0.04, delta);
    camera.lookAt(0, 0, 0);
  });

  return {
    dispose() {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", measureExit);
      window.removeEventListener("resize", measureExit);
      stage.dispose();
    },
  };
}
