import React, { useRef, useEffect, useState, useCallback } from 'react';
import { drawDinosaur, drawMirror } from './Dinosaur';
import { GameControls } from './GameControls';

interface GameCanvasProps {
  onWin: () => void;
  musicOn: boolean;
  onToggleMusic: () => void;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'rock' | 'bush';
}

interface Decoration {
  x: number;
  y: number;
  type: 'flower' | 'grass' | 'bush-small' | 'mushroom';
  scale: number;
  color?: string;
}

interface Leaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
}

interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  vx: number;
  vy: number;
}

const WORLD_WIDTH = 3200;
const WORLD_HEIGHT = 600;
const GRAVITY = 0.62;
const MOVE_SPEED = 5.2;
const JUMP_POWER = 14.5;
const GROUND_Y = 500;

const platforms: Platform[] = [
  { x: 0, y: GROUND_Y, width: WORLD_WIDTH, height: 100 },
  { x: 350, y: 420, width: 120, height: 20 },
  { x: 550, y: 360, width: 100, height: 20 },
  { x: 800, y: 410, width: 140, height: 20 },
  { x: 1100, y: 350, width: 120, height: 20 },
  { x: 1350, y: 420, width: 100, height: 20 },
  { x: 1600, y: 370, width: 150, height: 20 },
  { x: 1900, y: 320, width: 110, height: 20 },
  { x: 2150, y: 400, width: 130, height: 20 },
  { x: 2450, y: 340, width: 140, height: 20 },
  { x: 2700, y: 410, width: 100, height: 20 },
];

const obstacles: Obstacle[] = [
  { x: 680, y: GROUND_Y - 35, width: 45, height: 35, type: 'rock' },
  { x: 1250, y: GROUND_Y - 30, width: 50, height: 30, type: 'bush' },
  { x: 1850, y: GROUND_Y - 38, width: 48, height: 38, type: 'rock' },
  { x: 2350, y: GROUND_Y - 32, width: 52, height: 32, type: 'bush' },
];

const MIRROR_X = 3000;
const MIRROR_Y = 380;

const flowers = ['#ffb5b5', '#d4c5f9', '#ffeaa7', '#ffd8a8', '#9fd3c7', '#fff1a8'];

const generateDecorations = (): Decoration[] => {
  const decs: Decoration[] = [];
  for (let i = 0; i < 45; i++) {
    decs.push({
      x: 50 + i * 70 + Math.random() * 30,
      y: GROUND_Y - 5,
      type: 'grass',
      scale: 0.8 + Math.random() * 0.5,
    });
  }
  for (let i = 0; i < 25; i++) {
    decs.push({
      x: 100 + i * 125 + Math.random() * 50,
      y: GROUND_Y - 10,
      type: 'flower',
      scale: 0.7 + Math.random() * 0.6,
      color: flowers[Math.floor(Math.random() * flowers.length)],
    });
  }
  for (let i = 0; i < 10; i++) {
    decs.push({
      x: 250 + i * 310 + Math.random() * 100,
      y: GROUND_Y - 20,
      type: 'bush-small',
      scale: 0.9 + Math.random() * 0.4,
    });
  }
  for (let i = 0; i < 6; i++) {
    decs.push({
      x: 400 + i * 520 + Math.random() * 150,
      y: GROUND_Y - 18,
      type: 'mushroom',
      scale: 0.7 + Math.random() * 0.4,
    });
  }
  return decs;
};

const decorations = generateDecorations();

export const GameCanvas: React.FC<GameCanvasProps> = ({ onWin, musicOn, onToggleMusic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [foundMessage, setFoundMessage] = useState(false);

  const stateRef = useRef({
    dino: {
      x: 80,
      y: GROUND_Y - 90,
      vx: 0,
      vy: 0,
      width: 70,
      height: 90,
      facingRight: true,
      onGround: true,
      walkFrame: 0,
      isJumping: false,
    },
    camera: { x: 0 },
    keys: { left: false, right: false, jump: false },
    time: 0,
    leaves: [] as Leaf[],
    clouds: [] as Cloud[],
    sparkles: [] as Sparkle[],
    won: false,
    winTimer: 0,
    mirrorPhase: 0,
  });

  useEffect(() => {
    const clouds: Cloud[] = [];
    for (let i = 0; i < 10; i++) {
      clouds.push({
        x: Math.random() * WORLD_WIDTH,
        y: 50 + Math.random() * 150,
        scale: 0.6 + Math.random() * 0.8,
        speed: 0.15 + Math.random() * 0.2,
      });
    }
    stateRef.current.clouds = clouds;

    const leaves: Leaf[] = [];
    for (let i = 0; i < 18; i++) {
      leaves.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * 300,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.3 + Math.random() * 0.4,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.05,
        size: 6 + Math.random() * 6,
        color: ['#a8e6a3', '#b5e8b0', '#8fd9a0', '#c8e6c9'][Math.floor(Math.random() * 4)],
      });
    }
    stateRef.current.leaves = leaves;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const k = stateRef.current.keys;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') k.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') k.right = true;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        k.jump = true;
        handleJump();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const k = stateRef.current.keys;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') k.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') k.right = false;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') k.jump = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleJump = useCallback(() => {
    const s = stateRef.current;
    if (s.dino.onGround && !s.won) {
      s.dino.vy = -JUMP_POWER;
      s.dino.onGround = false;
      s.dino.isJumping = true;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let lastTime = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const roundRectHelper = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    };

    const safeRoundRect = (
      x: number, y: number, w: number, h: number, r: number
    ) => {
      if (typeof (ctx as any).roundRect === 'function') {
        (ctx as any).roundRect(x, y, w, h, r);
      } else {
        roundRectHelper(x, y, w, h, r);
      }
    };

    const checkCollision = (
      ax: number, ay: number, aw: number, ah: number,
      bx: number, by: number, bw: number, bh: number
    ) => {
      return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    };

    const drawBackground = (camX: number, W: number, H: number) => {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#fef6e4');
      skyGrad.addColorStop(0.5, '#ffe8c7');
      skyGrad.addColorStop(1, '#ffd8a8');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      const sunX = W - 100 - camX * 0.02;
      const sunY = 80;
      const glow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 100);
      glow.addColorStop(0, 'rgba(255,243,196,0.8)');
      glow.addColorStop(1, 'rgba(255,243,196,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(sunX - 100, sunY - 100, 200, 200);
      ctx.fillStyle = '#ffeaa7';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 38, 0, Math.PI * 2);
      ctx.fill();

      const s = stateRef.current;
      for (const cloud of s.clouds) {
        cloud.x -= cloud.speed;
        if (cloud.x < -150) cloud.x = WORLD_WIDTH + 100;
        const cx = cloud.x - camX * 0.3;
        const cy = cloud.y;
        const sc = cloud.scale;
        ctx.fillStyle = 'rgba(212,197,249,0.6)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 60 * sc, 30 * sc, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 25 * sc, cy - 8 * sc, 40 * sc, 24 * sc, 0, 0, Math.PI * 2);
        ctx.ellipse(cx - 30 * sc, cy + 5 * sc, 35 * sc, 20 * sc, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(232,224,251,0.5)';
        ctx.beginPath();
        ctx.ellipse(cx + 10 * sc, cy - 5 * sc, 25 * sc, 16 * sc, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = 'rgba(168,230,163,0.4)';
      ctx.beginPath();
      ctx.moveTo(0, H - 180);
      for (let i = 0; i <= 12; i++) {
        const x = (i / 12) * W;
        const baseY = H - 180;
        const hill = Math.sin(i * 0.8 + camX * 0.001) * 40 - 20;
        ctx.lineTo(x, baseY + hill);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(143,217,160,0.35)';
      ctx.beginPath();
      ctx.moveTo(0, H - 130);
      for (let i = 0; i <= 15; i++) {
        const x = (i / 15) * W;
        const baseY = H - 130;
        const hill = Math.sin(i * 1.1 + camX * 0.002 + 2) * 35 - 15;
        ctx.lineTo(x, baseY + hill);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();
    };

    const drawWorld = (camX: number) => {
      const scaleH = (window.innerHeight / WORLD_HEIGHT);
      const scaleW = (window.innerWidth / 800);
      const camScale = Math.min(scaleH, scaleW, 1);

      for (const plat of platforms) {
        const px = plat.x - camX;
        if (px + plat.width < -100 || px > window.innerWidth + 100) continue;

        if (plat.y >= GROUND_Y) {
          const groundGrad = ctx.createLinearGradient(0, plat.y - camX * 0, 0, plat.y + plat.height);
          groundGrad.addColorStop(0, '#a8e6a3');
          groundGrad.addColorStop(0.2, '#8fd9a0');
          groundGrad.addColorStop(1, '#6dca85');
          ctx.fillStyle = groundGrad;
          ctx.fillRect(px, plat.y, plat.width, plat.height);

          ctx.fillStyle = 'rgba(113,202,133,0.4)';
          for (let gx = 0; gx < plat.width; gx += 40) {
            ctx.beginPath();
            ctx.ellipse(px + gx + 20, plat.y + 12, 22, 5, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.fillStyle = '#b5e8b0';
          ctx.beginPath();
          safeRoundRect(px, plat.y, plat.width, plat.height, 8);
          ctx.fill();
          ctx.fillStyle = '#8fd9a0';
          ctx.beginPath();
          safeRoundRect(px + 3, plat.y + 3, plat.width - 6, plat.height - 6, 6);
          ctx.fill();
          ctx.fillStyle = '#7fd9a8';
          for (let gx = 5; gx < plat.width - 5; gx += 12) {
            ctx.beginPath();
            ctx.moveTo(px + gx, plat.y);
            ctx.lineTo(px + gx + 3, plat.y - 5);
            ctx.lineTo(px + gx + 6, plat.y);
            ctx.fill();
          }
        }
      }

      for (const dec of decorations) {
        const dx = dec.x - camX;
        if (dx < -80 || dx > window.innerWidth + 80) continue;
        const dy = dec.y;
        ctx.save();
        ctx.translate(dx, dy);
        ctx.scale(dec.scale, dec.scale);

        if (dec.type === 'grass') {
          ctx.strokeStyle = '#6dca85';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 3, 0);
            ctx.quadraticCurveTo(i * 3 + 1, -8, i * 3 + 2, -14);
            ctx.stroke();
          }
        } else if (dec.type === 'flower') {
          const c = dec.color || '#ffb5b5';
          ctx.strokeStyle = '#6dca85';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -18);
          ctx.stroke();
          ctx.fillStyle = c;
          for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.ellipse(Math.cos(a) * 4, -18 + Math.sin(a) * 4, 4, 5, a, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#ffeaa7';
          ctx.beginPath();
          ctx.arc(0, -18, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (dec.type === 'bush-small') {
          ctx.fillStyle = '#8fd9a0';
          ctx.beginPath();
          ctx.ellipse(-10, -10, 14, 12, 0, 0, Math.PI * 2);
          ctx.ellipse(8, -12, 13, 11, 0, 0, Math.PI * 2);
          ctx.ellipse(0, -18, 14, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#a8e6a3';
          ctx.beginPath();
          ctx.ellipse(-5, -14, 6, 5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (dec.type === 'mushroom') {
          ctx.fillStyle = '#fff8e7';
          ctx.beginPath();
          safeRoundRect(-3, -10, 6, 10, 2);
          ctx.fill();
          ctx.fillStyle = '#ffb5b5';
          ctx.beginPath();
          ctx.ellipse(0, -12, 11, 8, 0, 0, Math.PI);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-4, -14, 1.5, 0, Math.PI * 2);
          ctx.arc(3, -15, 1.8, 0, Math.PI * 2);
          ctx.arc(5, -11, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      for (const obs of obstacles) {
        const ox = obs.x - camX;
        if (ox + obs.width < -50 || ox > window.innerWidth + 50) continue;
        if (obs.type === 'rock') {
          ctx.fillStyle = '#c5b9aa';
          ctx.beginPath();
          ctx.ellipse(ox + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, obs.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#d9cfc2';
          ctx.beginPath();
          ctx.ellipse(ox + obs.width / 2 - 5, obs.y + obs.height / 2 - 5, obs.width / 4, obs.height / 4, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#8fd9a0';
          ctx.beginPath();
          ctx.ellipse(ox + obs.width / 2 - 8, obs.y + obs.height / 2, 18, 15, 0, 0, Math.PI * 2);
          ctx.ellipse(ox + obs.width / 2 + 8, obs.y + obs.height / 2 - 3, 17, 14, 0, 0, Math.PI * 2);
          ctx.ellipse(ox + obs.width / 2, obs.y + obs.height / 2 - 10, 18, 14, 0, 0, Math.PI * 2);
          ctx.fill();
          const c1 = ['#ffb5b5', '#ffeaa7', '#d4c5f9'];
          for (let i = 0; i < 3; i++) {
            ctx.fillStyle = c1[i];
            ctx.beginPath();
            ctx.arc(ox + 10 + i * 15, obs.y + 5, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      for (let treeIdx = 0; treeIdx < 8; treeIdx++) {
        const treeX = 200 + treeIdx * 420 - camX;
        if (treeX < -150 || treeX > window.innerWidth + 150) continue;
        const treeY = GROUND_Y;

        ctx.fillStyle = '#8b6f5e';
        ctx.beginPath();
        safeRoundRect(treeX - 10, treeY - 120, 20, 120, 5);
        ctx.fill();
        ctx.strokeStyle = '#7a5f4e';
        ctx.lineWidth = 1.5;
        for (let l = 0; l < 4; l++) {
          ctx.beginPath();
          ctx.moveTo(treeX - 8, treeY - 100 + l * 25);
          ctx.quadraticCurveTo(treeX, treeY - 90 + l * 25, treeX + 8, treeY - 100 + l * 25);
          ctx.stroke();
        }

        const treeGrad = ctx.createLinearGradient(treeX - 70, treeY - 220, treeX + 70, treeY - 80);
        treeGrad.addColorStop(0, '#bdeac5');
        treeGrad.addColorStop(1, '#8fd9a0');
        ctx.fillStyle = treeGrad;
        ctx.beginPath();
        ctx.ellipse(treeX, treeY - 130, 65, 55, 0, 0, Math.PI * 2);
        ctx.ellipse(treeX - 35, treeY - 110, 45, 38, 0, 0, Math.PI * 2);
        ctx.ellipse(treeX + 40, treeY - 115, 42, 36, 0, 0, Math.PI * 2);
        ctx.ellipse(treeX, treeY - 180, 48, 42, 0, 0, Math.PI * 2);
        ctx.ellipse(treeX - 20, treeY - 170, 38, 32, 0, 0, Math.PI * 2);
        ctx.ellipse(treeX + 25, treeY - 165, 36, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 181, 181, 0.7)';
        ctx.beginPath();
        ctx.arc(treeX - 25, treeY - 145, 3, 0, Math.PI * 2);
        ctx.arc(treeX + 30, treeY - 150, 3, 0, Math.PI * 2);
        ctx.arc(treeX - 5, treeY - 185, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawLeaves = (camX: number, dt: number) => {
      const s = stateRef.current;
      for (const leaf of s.leaves) {
        leaf.x += leaf.vx + Math.sin(s.time * 0.002 + leaf.rot) * 0.3;
        leaf.y += leaf.vy;
        leaf.rot += leaf.vr;
        if (leaf.y > GROUND_Y + 20) {
          leaf.y = -20;
          leaf.x = camX + Math.random() * (window.innerWidth + 200);
        }
        if (leaf.x < camX - 50) leaf.x = camX + WORLD_WIDTH;
        if (leaf.x > camX + WORLD_WIDTH + 50) leaf.x = camX;

        const lx = leaf.x - camX;
        ctx.save();
        ctx.translate(lx, leaf.y);
        ctx.rotate(leaf.rot);
        ctx.fillStyle = leaf.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size, leaf.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(109,202,133,0.5)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-leaf.size, 0);
        ctx.lineTo(leaf.size, 0);
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawSparkles = (dt: number) => {
      const s = stateRef.current;
      s.sparkles = s.sparkles.filter(sp => {
        sp.life -= dt;
        if (sp.life <= 0) return false;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.05;
        const alpha = sp.life / sp.maxLife;
        ctx.fillStyle = sp.color.replace('ALPHA', alpha.toFixed(3));
        const sz = sp.size * alpha;
        ctx.save();
        ctx.translate(sp.x, sp.y);
        ctx.beginPath();
        ctx.moveTo(0, -sz);
        ctx.lineTo(sz * 0.3, -sz * 0.3);
        ctx.lineTo(sz, 0);
        ctx.lineTo(sz * 0.3, sz * 0.3);
        ctx.lineTo(0, sz);
        ctx.lineTo(-sz * 0.3, sz * 0.3);
        ctx.lineTo(-sz, 0);
        ctx.lineTo(-sz * 0.3, -sz * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        return true;
      });
    };

    const spawnWinSparkles = (x: number, y: number) => {
      const s = stateRef.current;
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        const colors = [
          'rgba(255,234,167,ALPHA)',
          'rgba(255,181,181,ALPHA)',
          'rgba(212,197,249,ALPHA)',
          'rgba(168,230,163,ALPHA)',
        ];
        s.sparkles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: 3 + Math.random() * 4,
          life: 600 + Math.random() * 500,
          maxLife: 1000,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(now - lastTime, 33);
      lastTime = now;
      const s = stateRef.current;
      s.time += dt;

      const W = window.innerWidth;
      const H = window.innerHeight;

      if (!s.won) {
        const d = s.dino;
        const k = s.keys;

        if (k.left) {
          d.vx = -MOVE_SPEED;
          d.facingRight = false;
        } else if (k.right) {
          d.vx = MOVE_SPEED;
          d.facingRight = true;
        } else {
          d.vx *= 0.88;
          if (Math.abs(d.vx) < 0.1) d.vx = 0;
        }

        d.vy += GRAVITY;
        if (d.vy > 20) d.vy = 20;

        d.x += d.vx;
        if (d.x < 0) d.x = 0;
        if (d.x > WORLD_WIDTH - d.width) d.x = WORLD_WIDTH - d.width;

        d.y += d.vy;

        d.onGround = false;
        for (const p of platforms) {
          if (checkCollision(d.x + 10, d.y, d.width - 20, d.height, p.x, p.y, p.width, p.height)) {
            if (d.vy >= 0 && d.y + d.height - d.vy <= p.y + 40) {
              d.y = p.y - d.height;
              d.vy = 0;
              d.onGround = true;
              d.isJumping = false;
            }
          }
        }

        for (const o of obstacles) {
          if (checkCollision(d.x + 15, d.y + 30, d.width - 30, d.height - 35, o.x, o.y, o.width, o.height)) {
            if (d.vx > 0) d.x = o.x - d.width + 15;
            else if (d.vx < 0) d.x = o.x + o.width - 15;
            d.vx = 0;
          }
        }

        if (d.vx !== 0 && d.onGround) {
          d.walkFrame += 1;
        }

        const mirrorDist = Math.hypot((d.x + d.width / 2) - MIRROR_X, (d.y + d.height / 2) - MIRROR_Y);
        if (mirrorDist < 55) {
          s.won = true;
          s.winTimer = 0;
          setFoundMessage(true);
          spawnWinSparkles(MIRROR_X - s.camera.x, MIRROR_Y);
          spawnWinSparkles(d.x + d.width / 2 - s.camera.x, d.y + d.height / 2);
          setTimeout(() => {
            setFoundMessage(false);
            onWin();
          }, 2200);
        }
      }

      s.mirrorPhase += dt * 0.004;

      const dinoCenterX = s.dino.x + s.dino.width / 2;
      let targetCam = dinoCenterX - W / 2;
      targetCam = Math.max(0, Math.min(WORLD_WIDTH - W, targetCam));
      s.camera.x += (targetCam - s.camera.x) * 0.1;

      let scale = 1;
      if (s.won) {
        s.winTimer += dt;
        const t = Math.min(s.winTimer / 1500, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const targetZoom = Math.min(W / 600, H / 400) * 1.3;
        scale = 1 + (targetZoom - 1) * ease;
      }
      setZoom(scale);

      ctx.clearRect(0, 0, W, H);
      drawBackground(s.camera.x, W, H);

      ctx.save();
      if (s.won) {
        const t = Math.min(s.winTimer / 1500, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const cx = s.dino.x + s.dino.width / 2 - s.camera.x;
        const cy = s.dino.y + s.dino.height / 2;
        ctx.translate(cx, cy);
        const zoomFactor = 1 + (scale - 1);
        ctx.scale(zoomFactor, zoomFactor);
        ctx.translate(-cx, -cy);
      }
      drawWorld(s.camera.x);
      drawLeaves(s.camera.x, dt);

      const mirrorDrawX = MIRROR_X - s.camera.x;
      drawMirror(ctx, mirrorDrawX, MIRROR_Y, 1, s.mirrorPhase);

      const dinoDrawX = s.dino.x + s.dino.width / 2 - s.camera.x;
      const dinoDrawY = s.dino.y + s.dino.height - 52;
      drawDinosaur(
        ctx,
        dinoDrawX,
        dinoDrawY,
        0.82,
        s.dino.facingRight,
        s.dino.walkFrame,
        s.dino.isJumping || !s.dino.onGround
      );

      ctx.restore();

      drawSparkles(dt);

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [onWin]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'auto' }}
      />

      <button
        onClick={onToggleMusic}
        className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full glass flex items-center justify-center text-xl hover:scale-110 transition-transform shadow-lg"
        aria-label="Toggle music"
      >
        {musicOn ? '🎵' : '🔇'}
      </button>

      <div className="absolute top-4 left-4 z-20 glass rounded-full px-4 py-2 text-sm flex items-center gap-2 shadow-lg"
        style={{ color: '#5d4e42' }}>
        <span className="text-lg">🔍</span>
        <span>Find the hand mirror</span>
      </div>

      <div className="absolute bottom-32 md:bottom-4 left-1/2 -translate-x-1/2 z-20 md:flex gap-2 hidden">
        <div className="glass rounded-full px-3 py-1.5 text-xs" style={{ color: '#5d4e42' }}>
          A/D or ← → Move
        </div>
        <div className="glass rounded-full px-3 py-1.5 text-xs" style={{ color: '#5d4e42' }}>
          Space Jump
        </div>
      </div>

      {foundMessage && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="animate-fade-in-up glass rounded-3xl px-12 py-8 md:px-20 md:py-10 shadow-2xl">
            <div
              className="romantic-font text-4xl md:text-6xl text-center"
              style={{ color: '#e7718a' }}
            >
              You found it! ♡
            </div>
          </div>
        </div>
      )}

      <GameControls
        onLeftStart={() => (stateRef.current.keys.left = true)}
        onLeftEnd={() => (stateRef.current.keys.left = false)}
        onRightStart={() => (stateRef.current.keys.right = true)}
        onRightEnd={() => (stateRef.current.keys.right = false)}
        onJump={handleJump}
      />
    </div>
  );
};

export default GameCanvas;
