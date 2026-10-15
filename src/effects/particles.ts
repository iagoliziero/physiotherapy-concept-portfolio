import type { DeviceEnv } from "@/lib/env";
import { addFrame } from "@/lib/loop";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const LINK_DISTANCE = 110;
const FLEE_RADIUS = 100;

/**
 * Partículas em constelação (canvas 2D): flutuam, se conectam por linhas
 * quando próximas e fogem do mouse. Só anima enquanto o canvas está visível.
 */
export function initParticles(canvas: HTMLCanvasElement, host: HTMLElement, env: DeviceEnv): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const count = env.lowPower ? 35 : 90;
  const dpr = env.lowPower ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let particles: Particle[] = [];
  const mouse = { x: -999, y: -999 };
  let visible = true;

  const setup = () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  };

  const draw = (step: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(56, 189, 248, .7)";

    for (const p of particles) {
      p.x += p.vx * step;
      p.y += p.vy * step;
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < FLEE_RADIUS && d > 0) {
        p.x += (dx / d) * 1.2;
        p.y += (dy / d) * 1.2;
      }
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.fillRect(p.x, p.y, 2, 2);
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (d < LINK_DISTANCE) {
          ctx.strokeStyle = `rgba(45, 212, 191, ${0.25 * (1 - d / LINK_DISTANCE)})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  setup();

  const onMouse = (e: MouseEvent) => {
    const box = canvas.getBoundingClientRect();
    mouse.x = e.clientX - box.left;
    mouse.y = e.clientY - box.top;
  };
  const onLeave = () => {
    mouse.x = mouse.y = -999;
  };
  host.addEventListener("mousemove", onMouse);
  host.addEventListener("mouseleave", onLeave);

  const resizeObserver = new ResizeObserver(setup);
  resizeObserver.observe(canvas);

  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  visibility.observe(canvas);

  const stopFrame = addFrame((_t, delta) => {
    if (visible) draw(delta * 60);
  });

  return () => {
    stopFrame();
    visibility.disconnect();
    resizeObserver.disconnect();
    host.removeEventListener("mousemove", onMouse);
    host.removeEventListener("mouseleave", onLeave);
  };
}
