import React, { useRef, useEffect, useState } from 'react';

interface GameControlsProps {
  onLeftStart: () => void;
  onLeftEnd: () => void;
  onRightStart: () => void;
  onRightEnd: () => void;
  onJump: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
  onJump,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  const buttonClass = `
    w-16 h-16 md:w-20 md:h-20 rounded-full glass
    flex items-center justify-center text-2xl md:text-3xl font-bold
    active:scale-90 transition-transform duration-100
    border-2 border-white/60 shadow-lg
    select-none touch-none
  `;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-6 pointer-events-none">
      <div className="flex justify-between items-end max-w-lg mx-auto pointer-events-auto">
        <div className="flex gap-3">
          <button
            className={buttonClass}
            onTouchStart={(e) => { e.preventDefault(); onLeftStart(); }}
            onTouchEnd={(e) => { e.preventDefault(); onLeftEnd(); }}
            onTouchCancel={(e) => { e.preventDefault(); onLeftEnd(); }}
            onMouseDown={onLeftStart}
            onMouseUp={onLeftEnd}
            onMouseLeave={onLeftEnd}
          >
            ◀
          </button>
          <button
            className={buttonClass}
            onTouchStart={(e) => { e.preventDefault(); onRightStart(); }}
            onTouchEnd={(e) => { e.preventDefault(); onRightEnd(); }}
            onTouchCancel={(e) => { e.preventDefault(); onRightEnd(); }}
            onMouseDown={onRightStart}
            onMouseUp={onRightEnd}
            onMouseLeave={onRightEnd}
          >
            ▶
          </button>
        </div>
        <button
          className={`${buttonClass} w-20 h-20 md:w-24 md:h-24 text-white bg-gradient-to-br from-dino-teal to-dino-green !border-dino-green/50`}
          onTouchStart={(e) => { e.preventDefault(); onJump(); }}
          onMouseDown={onJump}
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default GameControls;
