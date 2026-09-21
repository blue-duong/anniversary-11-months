import React from 'react';
import { motion } from 'framer-motion';
import { anniversary } from '../data/anniversary';
import { DinosaurSVG } from './Mirror';

const ForestScene: React.FC = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef6e4" />
          <stop offset="50%" stopColor="#ffe8c7" />
          <stop offset="100%" stopColor="#ffd8a8" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a8e6a3" />
          <stop offset="100%" stopColor="#7fd9a8" />
        </linearGradient>
        <linearGradient id="treeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bdeac5" />
          <stop offset="100%" stopColor="#8fd9a0" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3c4" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>

      <rect width="800" height="600" fill="url(#skyGrad)" />

      <circle cx="680" cy="100" r="90" fill="url(#sunGlow)" />
      <circle cx="680" cy="100" r="45" fill="#fff3c4" />
      <circle cx="680" cy="100" r="32" fill="#ffeaa7" />

      <g opacity="0.7">
        <g className="animate-sway" style={{ transformOrigin: '150px 250px', animationDelay: '0s' }}>
          <ellipse cx="150" cy="200" rx="80" ry="45" fill="#d4c5f9" opacity="0.6" />
          <ellipse cx="180" cy="190" rx="55" ry="35" fill="#e8e0fb" opacity="0.7" />
          <ellipse cx="120" cy="210" rx="45" ry="28" fill="#d4c5f9" opacity="0.5" />
        </g>
        <g style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '0.5s' }}>
          <ellipse cx="450" cy="130" rx="70" ry="38" fill="#d4c5f9" opacity="0.5" />
          <ellipse cx="475" cy="122" rx="48" ry="28" fill="#e8e0fb" opacity="0.6" />
          <ellipse cx="420" cy="138" rx="38" ry="22" fill="#d4c5f9" opacity="0.4" />
        </g>
        <g style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1s' }}>
          <ellipse cx="680" cy="220" rx="60" ry="32" fill="#d4c5f9" opacity="0.4" />
          <ellipse cx="660" cy="212" rx="40" ry="24" fill="#e8e0fb" opacity="0.5" />
        </g>
      </g>

      <g opacity="0.4">
        <path d="M 0 420 Q 100 350 200 390 T 400 370 T 600 395 T 800 360 L 800 450 L 0 450 Z" fill="#c8e6c9" />
      </g>

      <g>
        <rect x="95" y="380" width="18" height="120" rx="4" fill="#8b6f5e" />
        <path d="M 104 380 L 104 260 Q 60 250 50 200 Q 70 230 100 240 Q 90 200 70 160 Q 110 200 115 250 Q 135 210 170 180 Q 145 230 120 255 Q 170 240 190 220 Q 155 270 110 280 Z" fill="url(#treeGrad)" />
        <path d="M 55 215 Q 70 235 90 225" stroke="#b5d98a" strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M 130 200 Q 145 220 160 210" stroke="#b5d98a" strokeWidth="3" fill="none" opacity="0.6" />
      </g>

      <g>
        <rect x="695" y="370" width="22" height="140" rx="5" fill="#9b7f6e" />
        <path d="M 706 370 L 706 220 Q 650 205 630 140 Q 665 180 700 195 Q 690 140 660 90 Q 720 150 730 215 Q 780 170 830 130 Q 775 220 720 245 Q 790 235 820 215 Q 770 275 712 295 Z" fill="url(#treeGrad)" />
      </g>

      <g>
        <rect x="48" y="420" width="10" height="80" rx="2" fill="#8b6f5e" />
        <ellipse cx="53" cy="410" rx="40" ry="35" fill="#b5e8b0" />
        <ellipse cx="40" cy="400" rx="25" ry="22" fill="#a8e6a3" />
        <ellipse cx="68" cy="398" rx="22" ry="20" fill="#a8e6a3" />
      </g>

      <g>
        <rect x="745" y="430" width="9" height="70" rx="2" fill="#8b6f5e" />
        <ellipse cx="750" cy="422" rx="32" ry="28" fill="#b5e8b0" />
      </g>

      <rect x="0" y="480" width="800" height="120" fill="url(#groundGrad)" />

      <g opacity="0.3">
        {[...Array(12)].map((_, i) => (
          <ellipse key={i} cx={50 + i * 70} cy={495 + (i % 2) * 8} rx="35" ry="8" fill="#8fd9a0" />
        ))}
      </g>

      <g>
        {[...Array(6)].map((_, i) => {
          const x = 120 + i * 110;
          const y = 495 + (i % 3) * 5;
          const colors = ['#ffb5b5', '#d4c5f9', '#ffeaa7', '#ffd8a8', '#a8e6a3', '#9fd3c7'];
          return (
            <g key={i}>
              <rect x={x - 1} y={y} width="2" height="12" fill="#7fd9a8" />
              <ellipse cx={x - 5} cy={y - 2} rx="4" ry="4" fill={colors[i]} />
              <ellipse cx={x + 5} cy={y - 2} rx="4" ry="4" fill={colors[i]} />
              <ellipse cx={x} cy={y - 6} rx="4" ry="4" fill={colors[i]} />
              <ellipse cx={x - 3} cy={y - 8} rx="3" ry="3" fill={colors[i]} />
              <ellipse cx={x + 3} cy={y - 8} rx="3" ry="3" fill={colors[i]} />
              <circle cx={x} cy={y - 4} r="2" fill="#ffeaa7" />
            </g>
          );
        })}
      </g>

      <g>
        {[80, 310, 560].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={490} rx="18" ry="12" fill="#8fd9a0" opacity="0.6" />
            <ellipse cx={x + 12} cy={485} rx="15" ry="10" fill="#a8e6a3" opacity="0.7" />
            <ellipse cx={x - 10} cy={488} rx="12" ry="8" fill="#8fd9a0" opacity="0.5" />
          </g>
        ))}
      </g>
    </svg>
  );
};

interface StartScreenProps {
  onStart: () => void;
  musicOn: boolean;
  onToggleMusic: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, musicOn, onToggleMusic }) => {
  return (
    <motion.div
      className="relative w-full h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <ForestScene />

      <button
        onClick={onToggleMusic}
        className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full glass flex items-center justify-center text-xl hover:scale-110 transition-transform"
        aria-label="Toggle music"
      >
        {musicOn ? '🎵' : '🔇'}
      </button>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <motion.div
          className="mb-2 text-sm md:text-base text-center"
          style={{ color: '#8b6f5e' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          A little surprise for {anniversary.name}.
        </motion.div>

        <motion.div
          className="w-48 h-48 md:w-56 md:h-56 mb-6 animate-float"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
        >
          <DinosaurSVG className="w-full h-full drop-shadow-2xl" />
        </motion.div>

        <motion.div
          className="glass rounded-3xl px-8 py-8 md:px-12 md:py-10 text-center max-w-lg mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1
            className="romantic-font text-3xl md:text-5xl mb-4"
            style={{ color: '#5d4e42' }}
          >
            Em khổng long này có mụt nhiệm vụ ...
          </h1>
          <p
            className="cute-font text-base md:text-lg mb-8 leading-relaxed"
            style={{ color: '#7a6b5e' }}
          >
            giúp em khủng long này tìm ra món quà đặc biệt hen.
          </p>

          <motion.button
            onClick={onStart}
            className="btn-cute btn-primary text-white romantic-font text-xl md:text-2xl inline-flex items-center gap-2 animate-pulse-soft"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <span>Bắt đầu lụmmmm
            </span>
            <span className="text-2xl">♡</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="absolute bottom-4 text-xs opacity-60"
          style={{ color: '#8b6f5e' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2 }}
        >
          ← → to move • Space to jump
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StartScreen;
