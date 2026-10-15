import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  RingGeometry,
  SphereGeometry,
  Vector3,
  WireframeGeometry,
} from "three";
import { globeDestinations, globeOrigin } from "@/data/content";
import type { DeviceEnv } from "@/lib/env";
import { createStage, type SceneHandle } from "./stage";

const RADIUS = 1.6;
const ARC_POINTS = 50;

/** Converte latitude/longitude em um ponto na superfície da esfera. */
function latLonToVector(lat: number, lon: number, radius = RADIUS) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * Globo do contato: wireframe com pontos, pin pulsante em São Paulo e arcos
 * animados (QuadraticBezierCurve3 + setDrawRange) para outras capitais.
 */
export function createGlobeScene(el: HTMLElement, env: DeviceEnv): SceneHandle {
  const stage = createStage(el, env, 5.4);
  const { scene } = stage;

  const globe = new Group();
  scene.add(globe);

  // Malha wireframe + esfera escura que oculta as linhas de trás
  globe.add(
    new LineSegments(
      new WireframeGeometry(new SphereGeometry(RADIUS, 24, 16)),
      new LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.12 }),
    ),
  );
  globe.add(
    new Mesh(
      new SphereGeometry(RADIUS * 0.98, 32, 32),
      new MeshBasicMaterial({ color: 0x0b1220, transparent: true, opacity: 0.7 }),
    ),
  );

  // Pontos distribuídos uniformemente na superfície
  const dots: number[] = [];
  for (let i = 0; i < (env.lowPower ? 400 : 900); i++) {
    const lat = (Math.asin(Math.random() * 2 - 1) * 180) / Math.PI;
    const v = latLonToVector(lat, Math.random() * 360 - 180, RADIUS * 1.005);
    dots.push(v.x, v.y, v.z);
  }
  const dotsGeometry = new BufferGeometry();
  dotsGeometry.setAttribute("position", new Float32BufferAttribute(dots, 3));
  globe.add(new Points(dotsGeometry, new PointsMaterial({ color: 0x38bdf8, size: 0.025, transparent: true, opacity: 0.6 })));

  // Pin pulsante em São Paulo
  const origin = latLonToVector(...globeOrigin);
  const pin = new Mesh(new SphereGeometry(0.06, 16, 16), new MeshBasicMaterial({ color: 0x2dd4bf }));
  pin.position.copy(origin);
  globe.add(pin);

  const pulse = new Mesh(
    new RingGeometry(0.08, 0.11, 32),
    new MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, side: DoubleSide }),
  );
  pulse.position.copy(origin.clone().multiplyScalar(1.01));
  pulse.lookAt(origin.clone().multiplyScalar(2));
  globe.add(pulse);

  // Arcos até as capitais
  const arcs = globeDestinations.map(([lat, lon], i) => {
    const end = latLonToVector(lat, lon);
    const mid = origin.clone().add(end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(RADIUS + origin.distanceTo(end) * 0.6);

    const geometry = new BufferGeometry().setFromPoints(new QuadraticBezierCurve3(origin, mid, end).getPoints(ARC_POINTS));
    globe.add(new Line(geometry, new LineBasicMaterial({ color: i % 2 ? 0x38bdf8 : 0x2dd4bf, transparent: true, opacity: 0.9 })));

    const dot = new Mesh(new SphereGeometry(0.035, 8, 8), new MeshBasicMaterial({ color: 0x38bdf8 }));
    dot.position.copy(end);
    globe.add(dot);

    return { geometry, offset: i * 0.4 };
  });

  // Rotação que deixa São Paulo de frente para a câmera
  const baseY = -Math.atan2(origin.x, origin.z);
  const baseX = Math.atan2(origin.y, Math.hypot(origin.x, origin.z));

  stage.start((time) => {
    globe.rotation.y = baseY + Math.sin(time * 0.3) * 0.35;
    globe.rotation.x = baseX;

    pulse.scale.setScalar(1 + (time % 1.5));
    pulse.material.opacity = 1 - (time % 1.5) / 1.5;

    arcs.forEach((arc) => {
      const k = Math.min(1, Math.max(0, ((time * 0.5 + arc.offset) % 3) / 1.4));
      arc.geometry.setDrawRange(0, Math.floor(k * (ARC_POINTS + 1)));
    });
  });

  return { dispose: () => stage.dispose() };
}
