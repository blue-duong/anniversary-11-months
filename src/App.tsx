import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StartScreen } from './components/StartScreen';
import { GameCanvas } from './components/GameCanvas';
import { WinScreen } from './components/WinScreen';
import { useAudio } from './components/MusicButton';

type GameState = 'start' | 'playing' | 'win';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [musicOn, toggleMusic, audio] = useAudio();

  const handleStart = useCallback(() => {
    if (!musicOn) {
      toggleMusic();
    } else {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      ctx.close();
    }
    setGameState('playing');
  }, [musicOn, toggleMusic]);

  const handleWin = useCallback(() => {
    audio.playFound();
    const fwInterval = setInterval(() => audio.playFirework(), 600);
    setTimeout(() => {
      setGameState('win');
      setTimeout(() => clearInterval(fwInterval), 6000);
    }, 200);
  }, [audio]);

  const handleRestart = useCallback(() => {
    setGameState('start');
  }, []);

  useEffect(() => {
    const prevent = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('touchmove', prevent, { passive: false });
    return () => document.removeEventListener('touchmove', prevent);
  }, []);

  return (
    <div className="w-full h-full overflow-hidden bg-cream relative">
      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <StartScreen
            key="start"
            onStart={handleStart}
            musicOn={musicOn}
            onToggleMusic={toggleMusic}
          />
        )}
        {gameState === 'playing' && (
          <GameCanvas
            key="game"
            onWin={handleWin}
            musicOn={musicOn}
            onToggleMusic={toggleMusic}
          />
        )}
        {gameState === 'win' && (
          <WinScreen
            key="win"
            onRestart={handleRestart}
            musicOn={musicOn}
            onToggleMusic={toggleMusic}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
