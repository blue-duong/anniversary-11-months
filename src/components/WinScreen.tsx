import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { anniversary } from '../data/anniversary';
import { Fireworks } from './Fireworks';
import { drawDinosaur, drawMirror } from './Dinosaur';

interface WinScreenProps {
  onRestart: () => void;
  musicOn: boolean;
  onToggleMusic: () => void;
}

export const WinScreen: React.FC<WinScreenProps> = ({ onRestart, musicOn, onToggleMusic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [typedTitle, setTypedTitle] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [typedMessage, setTypedMessage] = useState('');

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 800);
    const t2 = setTimeout(() => setShowSubtitle(true), 2200);
    const t3 = setTimeout(() => setShowMessage(true), 3800);
    const t4 = setTimeout(() => setShowButton(true), 6500);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    if (!showTitle) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTypedTitle(anniversary.title.slice(0, i));
      if (i >= anniversary.title.length) clearInterval(iv);
    }, 55);
    return () => clearInterval(iv);
  }, [showTitle]);

  useEffect(() => {
    if (!showSubtitle) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTypedSubtitle(anniversary.subtitle.slice(0, i));
      if (i >= anniversary.subtitle.length) clearInterval(iv);
    }, 35);
    return () => clearInterval(iv);
  }, [showSubtitle]);

  useEffect(() => {
    if (!showMessage) return;
    let i = 0;
    const msg = anniversary.message;
    const iv = setInterval(() => {
      i++;
      setTypedMessage(msg.slice(0, i));
      if (i >= msg.length) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [showMessage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let time = 0;
    const stars: { x: number; y: number; r: number; phase: number; speed: number }[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars.length = 0;
      const count = Math.floor((window.innerWidth * window.innerHeight) / 6000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.7,
          r: 0.5 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.002 + Math.random() * 0.004,
        });
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = (now: number) => {
      time += 0.016;
      const W = window.innerWidth;
      const H = window.innerHeight;

      ctx.clearRect(0, 0, W, H);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#0f0f2d');
      skyGrad.addColorStop(0.5, '#1a1a3e');
      skyGrad.addColorStop(0.85, '#2a2055');
      skyGrad.addColorStop(1, '#3d2d5e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      const moonX = W * 0.82;
      const moonY = H * 0.18;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 20, moonX, moonY, 120);
      moonGlow.addColorStop(0, 'rgba(255,245,220,0.4)');
      moonGlow.addColorStop(1, 'rgba(255,245,220,0)');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(moonX - 120, moonY - 120, 240, 240);
      ctx.fillStyle = '#fff5dc';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,225,190,0.3)';
      ctx.beginPath();
      ctx.arc(moonX - 10, moonY + 5, 8, 0, Math.PI * 2);
      ctx.arc(moonX + 12, moonY - 8, 5, 0, Math.PI * 2);
      ctx.arc(moonX + 8, moonY + 12, 4, 0, Math.PI * 2);
      ctx.fill();

      for (const star of stars) {
        const twinkle = 0.4 + Math.sin(time * star.speed * 60 + star.phase) * 0.6;
        ctx.fillStyle = `rgba(255,255,240,${0.3 + twinkle * 0.5})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * (0.7 + twinkle * 0.3), 0, Math.PI * 2);
        ctx.fill();

        if (star.r > 1.5 && twinkle > 0.7) {
          ctx.strokeStyle = `rgba(255,255,240,${twinkle * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - star.r * 3, star.y);
          ctx.lineTo(star.x + star.r * 3, star.y);
          ctx.moveTo(star.x, star.y - star.r * 3);
          ctx.lineTo(star.x, star.y + star.r * 3);
          ctx.stroke();
        }
      }

      const groundY = H - 80;
      const hillGrad = ctx.createLinearGradient(0, groundY - 60, 0, H);
      hillGrad.addColorStop(0, '#3d4a6e');
      hillGrad.addColorStop(1, '#2a3555');
      ctx.fillStyle = hillGrad;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 20);
      for (let i = 0; i <= 10; i++) {
        const x = (i / 10) * W;
        const h = Math.sin(i * 1.3) * 20 - 30;
        ctx.lineTo(x, groundY + h);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
      groundGrad.addColorStop(0, '#4a5a7e');
      groundGrad.addColorStop(1, '#3a4565');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, W, H - groundY);

      for (let i = 0; i < 25; i++) {
        const fx = (i / 25) * W + 20;
        const fy = groundY + 8;
        const fAlpha = 0.3 + Math.sin(time * 2 + i) * 0.2;
        const fColors = ['#ffb5b5', '#ffeaa7', '#d4c5f9', '#9fd3c7'];
        const glowColor = fColors[i % 4];

        ctx.fillStyle = `rgba(255,255,255,${fAlpha * 0.7})`;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      const dinoX = W / 2 - 30;
      const dinoY = groundY - 55;

      drawMirror(ctx, dinoX + 80, dinoY - 25, 0.8, time * 1.5);

      drawDinosaur(ctx, dinoX, dinoY, 0.88, true, Math.sin(time * 3) * 30, false);

      ctx.strokeStyle = `rgba(255,181,181,${0.4 + Math.sin(time * 2) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -time * 20;
      ctx.beginPath();
      const heartX1 = dinoX - 10;
      const heartY1 = dinoY - 55;
      const hx = heartX1;
      const hy = heartY1 - 20;
      ctx.moveTo(hx, hy);
      ctx.bezierCurveTo(hx - 20, hy - 25, hx - 40, hy - 5, hx, hy + 20);
      ctx.bezierCurveTo(hx + 40, hy - 5, hx + 20, hy - 25, hx, hy);
      ctx.stroke();
      ctx.setLineDash([]);

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
      <Fireworks active={true} />

      <button
        onClick={onToggleMusic}
        className="absolute top-4 right-4 z-40 w-12 h-12 rounded-full glass flex items-center justify-center text-xl hover:scale-110 transition-transform border-white/30 shadow-lg"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
        aria-label="Toggle music"
      >
        {musicOn ? '🎵' : '🔇'}
      </button>

      <div className="relative z-30 flex flex-col items-center justify-center h-full px-6 py-20 pointer-events-none">
        <div className="w-full max-w-2xl mx-auto text-center">
          <AnimatePresence>
            {showTitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <h1
                  className="romantic-font text-4xl md:text-7xl leading-tight"
                  style={{
                    color: '#fff5dc',
                    textShadow: '0 0 30px rgba(255,200,180,0.5), 0 2px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  {typedTitle}
                  <span
                    className="inline-block ml-2"
                    style={{ animation: 'pulseSoft 1.5s ease-in-out infinite' }}
                  >
                    {typedTitle.length === anniversary.title.length && '♡'}
                  </span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSubtitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-10"
              >
                <p
                  className="cute-font text-lg md:text-2xl font-medium leading-relaxed max-w-xl mx-auto"
                  style={{
                    color: '#ffe0d5',
                    textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                  }}
                >
                  {typedSubtitle}
                  {typedSubtitle.length === anniversary.subtitle.length && (
                    <span className="inline-block w-2 h-6 md:h-8 ml-1 align-middle bg-soft-pink rounded-sm animate-pulse" />
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-12"
              >
                <div
                  className="inline-block px-8 py-6 md:px-12 md:py-8 rounded-3xl max-w-lg mx-auto"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  <p
                    className="romantic-font text-2xl md:text-3xl leading-relaxed whitespace-pre-line"
                    style={{
                      color: '#fff8f0',
                      textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    }}
                  >
                    {typedMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="pointer-events-auto"
              >
                <motion.button
                  onClick={onRestart}
                  className="btn-cute romantic-font text-xl md:text-2xl inline-flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,181,181,0.9) 0%, rgba(212,197,249,0.9) 100%)',
                    color: '#3d2d5e',
                    boxShadow: '0 8px 24px rgba(255,181,181,0.4), 0 0 40px rgba(212,197,249,0.3)',
                  }}
                  whileHover={{ scale: 1.08, boxShadow: '0 12px 32px rgba(255,181,181,0.5), 0 0 60px rgba(212,197,249,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Play Again</span>
                  <span className="text-2xl" style={{ animation: 'pulseSoft 1.5s ease-in-out infinite' }}>♡</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default WinScreen;
