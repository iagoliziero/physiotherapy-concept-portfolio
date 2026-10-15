import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Points,
  PointsMaterial,
  Raycaster,
  SphereGeometry,
  Vector2,
} from "three";
import type { Hotspot, HotspotKey } from "@/data/content";
import type { DeviceEnv } from "@/lib/env";
import { createStage, damp, edges, type SceneHandle, standardMaterial } from "./stage";

export interface BodySceneHandle extends SceneHandle {
  /** Seleciona uma região e gira o corpo até ela. */
  select(key: HotspotKey): void;
}

interface BodySceneOptions {
  hotspots: Hotspot[];
  initial: HotspotKey;
  /** Chamado quando o usuário clica num hotspot dentro da cena. */
  onPick(key: HotspotKey): void;
}

interface HotspotMarker {
  key: HotspotKey;
  core: Mesh<SphereGeometry, MeshBasicMaterial>;
  halo: Mesh;
}

/** Ângulo do corpo que deixa a região de frente para a câmera. */
function facingAngle([x, , z]: [number, number, number]) {
  if (z < -0.1) return Math.PI; // regiões nas costas
  return x > 0.3 ? -0.5 : 0;
}

/**
 * "Onde dói?": corpo humano low-poly translúcido com a coluna visível por
 * dentro e hotspots pulsantes. Arrastar gira; clicar seleciona (raycaster).
 */
export function createBodyScene(el: HTMLElement, env: DeviceEnv, options: BodySceneOptions): BodySceneHandle {
  const stage = createStage(el, env, 7.6);
  const { scene, camera } = stage;

  // O corpo vai de y≈-2,2 (pés) a y≈2,9 (cabeça): desloca para centralizar no quadro
  const baseY = -0.35;
  const body = new Group();
  body.position.y = baseY;
  scene.add(body);

  // ----- Silhueta: cilindros/esferas translúcidos + arestas -----
  const skin = new MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.14, roughness: 0.4, depthWrite: false });
  const part = (geometry: BufferGeometry, x: number, y: number, z: number, rz = 0) => {
    const mesh = new Mesh(geometry, skin);
    mesh.position.set(x, y, z);
    mesh.rotation.z = rz;
    body.add(mesh);
    const outline = edges(geometry, 0x38bdf8, 0.22);
    outline.position.copy(mesh.position);
    outline.rotation.z = rz;
    body.add(outline);
  };

  part(new SphereGeometry(0.32, 16, 12), 0, 2.58, 0); // cabeça
  part(new CylinderGeometry(0.12, 0.13, 0.3, 10), 0, 2.17, 0); // pescoço
  part(new CylinderGeometry(0.56, 0.42, 1.5, 14), 0, 1.27, 0); // tronco
  part(new CylinderGeometry(0.44, 0.38, 0.4, 14), 0, 0.33, 0); // quadril
  for (const s of [-1, 1]) {
    part(new CylinderGeometry(0.12, 0.1, 0.95, 10), s * 0.76, 1.52, 0, s * 0.14); // braço
    part(new CylinderGeometry(0.1, 0.08, 0.9, 10), s * 0.88, 0.62, 0.02, s * 0.05); // antebraço
    part(new SphereGeometry(0.1, 8, 8), s * 0.9, 0.12, 0.03); // mão
    part(new CylinderGeometry(0.18, 0.13, 1.15, 10), s * 0.22, -0.45, 0); // coxa
    part(new CylinderGeometry(0.13, 0.09, 1.05, 10), s * 0.22, -1.55, 0); // perna
    part(new BoxGeometry(0.18, 0.1, 0.38), s * 0.22, -2.13, 0.1); // pé
  }

  // ----- Coluna visível por dentro -----
  const vertebraMat = standardMaterial(0x2dd4bf);
  const vertebraGeo = new CylinderGeometry(0.07, 0.07, 0.08, 10);
  for (let i = 0; i < 14; i++) {
    const vertebra = new Mesh(vertebraGeo, vertebraMat);
    vertebra.position.set(0, 2.1 - i * 0.135, -0.2 - Math.sin((i / 13) * Math.PI) * 0.08);
    body.add(vertebra);
  }

  // ----- Hotspots pulsantes -----
  const markers: HotspotMarker[] = options.hotspots.map((h) => {
    const core = new Mesh(new SphereGeometry(0.09, 16, 16), new MeshBasicMaterial({ color: 0x2dd4bf }));
    core.position.set(...h.position);
    core.userData.key = h.key;
    const halo = new Mesh(
      new SphereGeometry(0.2, 16, 16),
      new MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.3, blending: AdditiveBlending, depthWrite: false }),
    );
    core.add(halo);
    body.add(core);
    return { key: h.key, core, halo };
  });

  // ----- Poeira de partículas ao fundo -----
  const dust: number[] = [];
  for (let i = 0; i < (env.lowPower ? 80 : 200); i++) {
    dust.push((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4 - 1);
  }
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute("position", new Float32BufferAttribute(dust, 3));
  const dustPoints = new Points(dustGeometry, new PointsMaterial({ color: 0x2dd4bf, size: 0.03, transparent: true, opacity: 0.5 }));
  scene.add(dustPoints);

  // ----- Seleção e interação -----
  const byKey = new Map(options.hotspots.map((h) => [h.key, h]));
  let selected = options.initial;
  let targetRotation = 0.6;
  let dragging = false;
  let lastX = 0;
  let moved = 0;

  const select = (key: HotspotKey) => {
    const hotspot = byKey.get(key);
    if (!hotspot) return;
    selected = key;
    // Equivalente do ângulo mais próximo da rotação atual: gira pelo caminho curto
    const angle = facingAngle(hotspot.position);
    const turns = Math.round((body.rotation.y - angle) / (Math.PI * 2));
    targetRotation = angle + turns * Math.PI * 2;
  };
  select(options.initial);

  const raycaster = new Raycaster();
  const pointer = new Vector2();

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    moved = 0;
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    targetRotation += dx * 0.012;
    body.rotation.y += dx * 0.012;
  };
  const onUp = (e: PointerEvent) => {
    dragging = false;
    if (moved > 5) return; // foi um arraste, não um clique
    const box = el.getBoundingClientRect();
    pointer.x = ((e.clientX - box.left) / box.width) * 2 - 1;
    pointer.y = -((e.clientY - box.top) / box.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(
      markers.map((m) => m.core),
      false,
    )[0];
    const key = hit?.object.userData.key as HotspotKey | undefined;
    if (key) {
      select(key);
      options.onPick(key);
    }
  };
  const onCancel = () => {
    dragging = false;
  };

  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onCancel);

  stage.start((time, delta) => {
    if (!dragging) body.rotation.y += (targetRotation - body.rotation.y) * damp(0.06, delta);
    body.position.y = baseY + Math.sin(time) * 0.05;

    markers.forEach((m) => {
      const active = m.key === selected;
      const scale = active
        ? 1.6 + Math.sin(time * 4) * 0.4
        : 1 + Math.sin(time * 3 + m.core.position.y) * 0.2;
      m.halo.scale.setScalar(scale);
      m.core.material.color.set(active ? 0xffffff : 0x2dd4bf);
    });

    dustPoints.rotation.y += 0.001 * delta * 60;
  });

  return {
    select,
    dispose() {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onCancel);
      stage.dispose();
    },
  };
}
