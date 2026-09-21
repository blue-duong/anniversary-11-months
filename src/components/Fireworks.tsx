import React, { useRef, useEffect } from 'react';

interface FireworksProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'trail' | 'spark' | 'glow';
  trail: { x: number; y: number }[];
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  trail: { x: number; y: number }[];
  exploded: boolean;
}

const PASTEL_COLORS = [
  'rgba(255, 181, 181, ',
  'rgba(212, 197, 249, ',
  'rgba(255, 234, 167, ',
  'rgba(159, 211, 199, ',
  'rgba(168, 230, 163, ',
  'rgba(255, 216, 168, ',
  'rgba(255, 200, 220, ',
  'rgba(200, 230, 255, ',
  'rgba(255, 223, 186, ',
  'rgba(230, 200, 255, ',
];

export const Fireworks: React.FC<FireworksProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const particles: Particle[] = [];
    const rockets: Rocket[] = [];
    let lastRocket = 0;
    let running = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const explode = (x: number, y: number, color: string) => {
      const patterns = [
        { count: 60, type: 'circle' as const },
        { count: 45, type: 'ring' as const },
        { count: 70, type: 'burst' as const },
        { count: 55, type: 'heart' as const },
      ];
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];

      const color2 = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];

      for (let i = 0; i < pattern.count; i++) {
        let angle: number;
        let speed: number;

        if (pattern.type === 'ring') {
          angle = (i / pattern.count) * Math.PI * 2;
          speed = 3.5 + Math.random() * 1;
        } else if (pattern.type === 'heart') {
          angle = (i / pattern.count) * Math.PI * 2;
          const hx = 16 * Math.pow(Math.sin(angle), 3);
          const hy = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
          const mag = Math.hypot(hx, hy);
          angle = Math.atan2(hy, hx);
          speed = (mag / 16) * 4 + Math.random() * 0.5;
        } else if (pattern.type === 'burst') {
          angle = Math.random() * Math.PI * 2;
          speed = 1.5 + Math.random() * 5;
        } else {
          angle = (i / pattern.count) * Math.PI * 2 + Math.random() * 0.1;
          speed = 2 + Math.random() * 3.5;
        }

        const useColor = Math.random() > 0.5 ? color : color2;

        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 900 + Math.random() * 700,
          maxLife: 1600,
          size: 2 + Math.random() * 2.5,
          color: useColor,
          type: Math.random() > 0.3 ? 'spark' : 'glow',
          trail: [],
        });
      }

      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: 1200 + Math.random() * 800,
          maxLife: 2000,
          size: 1.5 + Math.random() * 2,
          color: 'rgba(255, 255, 255, ',
          type: 'spark',
          trail: [],
        });
      }
    };

    const spawnRocket = () => {
      const W = window.innerWidth;
      const startX = W * 0.1 + Math.random() * W * 0.8;
      const targetY = 60 + Math.random() * (window.innerHeight * 0.35);
      rockets.push({
        x: startX,
        y: window.innerHeight + 10,
        vy: -8 - Math.random() * 3,
        targetY,
        color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
        trail: [],
        exploded: false,
      });
    };

    const loop = (now: number) => {
      if (!running) return;
      const dt = 16;
      const W = window.innerWidth;
      const H = window.innerHeight;

      ctx.fillStyle = 'rgba(26, 26, 62, 0.18)';
      ctx.fillRect(0, 0, W, H);

      if (active) {
        if (now - lastRocket > 350 + Math.random() * 450) {
          lastRocket = now;
          spawnRocket();
          if (Math.random() > 0.5) spawnRocket();
        }
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 12) r.trail.shift();

        r.y += r.vy;
        r.vy += 0.05;
        r.x += (Math.random() - 0.5) * 0.3;

        for (let t = 0; t < r.trail.length; t++) {
          const tp = r.trail[t];
          const alpha = (t / r.trail.length) * 0.8;
          ctx.fillStyle = r.color + alpha + ')';
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, 1.5 + t * 0.1, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = r.color + '1)';
        ctx.shadowColor = r.color + '0.8)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (r.y <= r.targetY || r.vy >= -1) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        p.vy += 0.035;
        p.vx *= 0.99;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;

        const alpha = Math.max(0, p.life / p.maxLife);
        const size = p.size * (0.5 + alpha * 0.5);

        if (p.type === 'glow') {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
          glow.addColorStop(0, p.color + (alpha * 0.6) + ')');
          glow.addColorStop(1, p.color + '0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.trail.length > 1) {
          ctx.strokeStyle = p.color + (alpha * 0.5) + ')';
          ctx.lineWidth = size * 0.8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.stroke();
        }

        ctx.fillStyle = p.color + alpha + ')';
        ctx.shadowColor = p.color + Math.min(1, alpha * 1.5) + ')';
        ctx.shadowBlur = p.type === 'glow' ? 12 : 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafId = requestAnimationFrame(loop);
    };

    if (active) {
      for (let i = 0; i < 2; i++) {
        setTimeout(() => spawnRocket(), i * 200);
      }
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};

export default Fireworks;
