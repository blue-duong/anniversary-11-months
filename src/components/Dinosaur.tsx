const roundRect = (
  ctx: CanvasRenderingContext2D,
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
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  if (typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(x, y, w, h, r);
  } else {
    roundRect(ctx, x, y, w, h, r);
  }
};

export const drawDinosaur = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  facingRight: boolean,
  walkFrame: number,
  isJumping: boolean
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facingRight ? scale : -scale, scale);

  const breathe = Math.sin(Date.now() / 500) * 2;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(0, 60, 35, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail
  ctx.fillStyle = '#5fd38f';
  ctx.beginPath();
  ctx.moveTo(-30, 35);
  ctx.quadraticCurveTo(-55, 25, -50, 10);
  ctx.quadraticCurveTo(-45, 20, -30, 40);
  ctx.closePath();
  ctx.fill();

  // Tail spots
  ctx.fillStyle = '#4cc380';
  ctx.beginPath();
  ctx.ellipse(-42, 20, 3, 2, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Body
  const bodyY = 30 + breathe;
  const gradient = ctx.createLinearGradient(-30, bodyY - 30, 30, bodyY + 30);
  gradient.addColorStop(0, '#7fd9a8');
  gradient.addColorStop(1, '#5fd38f');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, bodyY, 32, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly
  ctx.fillStyle = '#e8f7ef';
  ctx.beginPath();
  ctx.ellipse(5, bodyY + 5, 18, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spikes on back
  ctx.fillStyle = '#4cc380';
  const spikePositions = [-15, -5, 5, 15];
  spikePositions.forEach((sx, i) => {
    ctx.beginPath();
    ctx.moveTo(sx - 5, bodyY - 26);
    ctx.quadraticCurveTo(sx, bodyY - 36 - (i % 2) * 3, sx + 5, bodyY - 26);
    ctx.closePath();
    ctx.fill();
  });

  // Body spots
  ctx.fillStyle = '#4cc380';
  [[-15, bodyY + 5], [10, bodyY - 5], [-5, bodyY + 15]].forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.ellipse(sx, sy, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Legs
  const legOffset = isJumping ? 0 : Math.sin(walkFrame * 0.4) * 8;
  ctx.fillStyle = '#5fd38f';

  // Left leg
  ctx.beginPath();
  safeRoundRect(ctx,-18, bodyY + 22 - (isJumping ? 5 : Math.max(0, legOffset)), 14, 20 + (isJumping ? 0 : Math.max(0, legOffset)), 5);
  ctx.fill();

  // Right leg
  ctx.beginPath();
  safeRoundRect(ctx,4, bodyY + 22 - (isJumping ? 5 : Math.max(0, -legOffset)), 14, 20 + (isJumping ? 0 : Math.max(0, -legOffset)), 5);
  ctx.fill();

  // Feet
  ctx.fillStyle = '#4cc380';
  ctx.beginPath();
  ctx.ellipse(-11, bodyY + 42 + (isJumping ? -legOffset : Math.max(0, -legOffset)), 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(11, bodyY + 42 + (isJumping ? legOffset : Math.max(0, legOffset)), 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Arms
  const armSwing = isJumping ? -0.5 : Math.sin(walkFrame * 0.4) * 0.2;
  ctx.save();
  ctx.translate(22, bodyY);
  ctx.rotate(armSwing);
  ctx.fillStyle = '#5fd38f';
  ctx.beginPath();
  safeRoundRect(ctx,0, -3, 14, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#4cc380';
  ctx.beginPath();
  ctx.ellipse(14, 2, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Head
  const headY = 5 + breathe;
  ctx.save();
  ctx.translate(25, headY);

  // Head gradient
  const headGrad = ctx.createLinearGradient(-25, -25, 25, 25);
  headGrad.addColorStop(0, '#7fd9a8');
  headGrad.addColorStop(1, '#5fd38f');
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  safeRoundRect(ctx,-25, -22, 50, 44, 18);
  ctx.fill();

  // Cheek blush
  ctx.fillStyle = 'rgba(255, 181, 181, 0.5)';
  ctx.beginPath();
  ctx.ellipse(-12, 12, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(8, 12, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye white
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-8, -5, 8, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(12, -5, 8, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye pupil
  const eyeShift = facingRight ? 1 : -1;
  ctx.fillStyle = '#2d3748';
  ctx.beginPath();
  ctx.arc(-8 + eyeShift * 2, -4, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(12 + eyeShift * 2, -4, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye shine
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-10 + eyeShift, -7, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(10 + eyeShift, -7, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Nostrils
  ctx.fillStyle = '#4cc380';
  ctx.beginPath();
  ctx.arc(20, 5, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(20, 9, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#2d3748';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(5, 12, 8, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Mouth inside
  ctx.fillStyle = '#ffb5b5';
  ctx.beginPath();
  ctx.ellipse(5, 17, 5, 3, 0, 0, Math.PI);
  ctx.fill();

  // Head spikes
  ctx.fillStyle = '#4cc380';
  [[-15, -22], [-5, -25], [5, -25], [15, -22]].forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(sx - 4, sy);
    ctx.quadraticCurveTo(sx, sy - 8, sx + 4, sy);
    ctx.closePath();
    ctx.fill();
  });

  // Head spots
  ctx.fillStyle = '#4cc380';
  ctx.beginPath();
  ctx.ellipse(-18, 2, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
};

export const drawMirror = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  sparklePhase: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const bob = Math.sin(Date.now() / 400) * 3;
  ctx.translate(0, bob);

  // Sparkles around mirror
  const sparkleCount = 6;
  for (let i = 0; i < sparkleCount; i++) {
    const angle = (i / sparkleCount) * Math.PI * 2 + sparklePhase;
    const dist = 35 + Math.sin(sparklePhase * 2 + i) * 5;
    const sx = Math.cos(angle) * dist;
    const sy = Math.sin(angle) * dist - 15;
    const size = 2 + Math.sin(sparklePhase * 3 + i * 2) * 1.5;
    const alpha = 0.4 + Math.sin(sparklePhase * 2 + i) * 0.3;

    ctx.fillStyle = `rgba(255, 234, 167, ${alpha})`;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle + sparklePhase);
    ctx.beginPath();
    ctx.moveTo(0, -size * 2);
    ctx.lineTo(size * 0.5, -size * 0.5);
    ctx.lineTo(size * 2, 0);
    ctx.lineTo(size * 0.5, size * 0.5);
    ctx.lineTo(0, size * 2);
    ctx.lineTo(-size * 0.5, size * 0.5);
    ctx.lineTo(-size * 2, 0);
    ctx.lineTo(-size * 0.5, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Handle
  ctx.fillStyle = '#a8e6a3';
  ctx.strokeStyle = '#7fd9a8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  safeRoundRect(ctx,-6, 15, 12, 28, 6);
  ctx.fill();
  ctx.stroke();

  // Handle decoration
  ctx.fillStyle = '#7fd9a8';
  ctx.beginPath();
  ctx.arc(0, 38, 4, 0, Math.PI * 2);
  ctx.fill();

  // Mirror frame
  const frameGrad = ctx.createLinearGradient(-28, -30, 28, 30);
  frameGrad.addColorStop(0, '#b5e8b0');
  frameGrad.addColorStop(0.5, '#a8e6a3');
  frameGrad.addColorStop(1, '#8fda89');
  ctx.fillStyle = frameGrad;
  ctx.strokeStyle = '#7fd9a8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  safeRoundRect(ctx,-28, -30, 56, 48, 14);
  ctx.fill();
  ctx.stroke();

  // Inner frame
  ctx.fillStyle = '#7fd9a8';
  ctx.beginPath();
  safeRoundRect(ctx,-22, -24, 44, 36, 10);
  ctx.fill();

  // Mirror surface (glass)
  const glassGrad = ctx.createLinearGradient(-18, -20, 18, 30);
  glassGrad.addColorStop(0, '#e8f7ef');
  glassGrad.addColorStop(0.3, '#c8e6d4');
  glassGrad.addColorStop(0.7, '#d8f0e4');
  glassGrad.addColorStop(1, '#f0faf5');
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  safeRoundRect(ctx,-18, -20, 36, 30, 7);
  ctx.fill();

  // Glass shine
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.ellipse(-8, -12, 8, 4, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // Little heart reflection
  const heartPulse = Math.sin(sparklePhase * 2) * 0.15 + 1;
  ctx.save();
  ctx.translate(4, 2);
  ctx.scale(heartPulse * 0.08, heartPulse * 0.08);
  ctx.fillStyle = 'rgba(255, 181, 181, 0.7)';
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.bezierCurveTo(-70, -100, -120, -30, 0, 50);
  ctx.bezierCurveTo(120, -30, 70, -100, 0, -50);
  ctx.fill();
  ctx.restore();

  ctx.restore();
};
