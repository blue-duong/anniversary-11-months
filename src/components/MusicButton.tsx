import React, { useRef, useEffect, useCallback, useState } from 'react';

interface MusicButtonProps {
  musicOn: boolean;
  onToggle: () => void;
  className?: string;
}

export const MusicButton: React.FC<MusicButtonProps> = ({ musicOn, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`w-12 h-12 rounded-full glass flex items-center justify-center text-xl hover:scale-110 transition-transform shadow-lg ${className}`}
      aria-label="Toggle music"
    >
      {musicOn ? '🎵' : '🔇'}
    </button>
  );
};

interface AudioManager {
  playMusic: () => void;
  stopMusic: () => void;
  playJump: () => void;
  playFound: () => void;
  playFirework: () => void;
}

export const useAudio = (): [boolean, () => void, AudioManager] => {
  const [musicOn, setMusicOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const musicIntervalRef = useRef<number | null>(null);
  const musicStartedRef = useRef(false);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const AC = (window.AudioContext || (window as any).webkitAudioContext);
      if (AC) audioCtxRef.current = new AC();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15, when: number = 0) => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + when);
    gain.gain.setValueAtTime(0, ctx.currentTime + when);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + when + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + when + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + when);
    osc.stop(ctx.currentTime + when + duration + 0.1);
  }, [getCtx]);

  const playChord = useCallback((freqs: number[], duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
    freqs.forEach((f, i) => playTone(f, duration, type, volume / (1 + i * 0.2), i * 0.03));
  }, [playTone]);

  const playJump = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }, [getCtx]);

  const playFound = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((n, i) => playTone(n, 0.4, 'triangle', 0.18, i * 0.1));
    setTimeout(() => {
      [659.25, 783.99, 1046.5].forEach((n, i) => playTone(n, 0.6, 'sine', 0.15, i * 0.08));
    }, 500);
  }, [getCtx, playTone]);

  const playFirework = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    noise.buffer = buffer;
    noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    noise.connect(noiseGain).connect(ctx.destination);
    noise.start();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }, [getCtx]);

  const playMusic = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    if (musicIntervalRef.current) return;
    musicStartedRef.current = true;

    const gain = ctx.createGain();
    gain.gain.value = 0.06;
    gain.connect(ctx.destination);
    musicGainRef.current = gain;

    const melody = [
      523.25, 659.25, 783.99, 659.25,
      523.25, 587.33, 698.46, 587.33,
      493.88, 587.33, 739.99, 587.33,
      523.25, 659.25, 880.00, 783.99,
      698.46, 587.33, 523.25, 659.25,
      587.33, 493.88, 440.00, 523.25,
    ];
    const bass = [
      130.81, 164.81, 196.00, 164.81,
      130.81, 146.83, 174.61, 146.83,
      123.47, 146.83, 185.00, 146.83,
      130.81, 164.81, 220.00, 196.00,
      174.61, 146.83, 130.81, 164.81,
      146.83, 123.47, 110.00, 130.81,
    ];

    let noteIdx = 0;
    const beatDuration = 380;

    const playNote = () => {
      if (!musicGainRef.current || !musicStartedRef.current) return;
      const ctx2 = getCtx();
      if (!ctx2) return;

      const mOsc = ctx2.createOscillator();
      const mGain = ctx2.createGain();
      mOsc.type = 'triangle';
      mOsc.frequency.value = melody[noteIdx % melody.length];
      mGain.gain.setValueAtTime(0, ctx2.currentTime);
      mGain.gain.linearRampToValueAtTime(0.22, ctx2.currentTime + 0.03);
      mGain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + beatDuration / 1000 * 0.9);
      mOsc.connect(mGain).connect(musicGainRef.current);
      mOsc.start();
      mOsc.stop(ctx2.currentTime + beatDuration / 1000);

      if (noteIdx % 2 === 0) {
        const bOsc = ctx2.createOscillator();
        const bGain = ctx2.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.value = bass[noteIdx % bass.length];
        bGain.gain.setValueAtTime(0, ctx2.currentTime);
        bGain.gain.linearRampToValueAtTime(0.18, ctx2.currentTime + 0.05);
        bGain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + beatDuration / 1000 * 1.4);
        bOsc.connect(bGain).connect(musicGainRef.current);
        bOsc.start();
        bOsc.stop(ctx2.currentTime + beatDuration / 1000 * 1.5);
      }

      noteIdx++;
    };

    playNote();
    musicIntervalRef.current = window.setInterval(playNote, beatDuration);
  }, [getCtx]);

  const stopMusic = useCallback(() => {
    musicStartedRef.current = false;
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
    }
    if (musicGainRef.current) {
      musicGainRef.current.gain.exponentialRampToValueAtTime(0.001, getCtx()?.currentTime || 0 + 0.3);
      setTimeout(() => {
        musicGainRef.current?.disconnect();
        musicGainRef.current = null;
      }, 400);
    }
  }, [getCtx]);

  const toggleMusic = useCallback(() => {
    setMusicOn(prev => {
      const next = !prev;
      if (next) playMusic();
      else stopMusic();
      return next;
    });
  }, [playMusic, stopMusic]);

  useEffect(() => {
    return () => {
      stopMusic();
      audioCtxRef.current?.close();
    };
  }, [stopMusic]);

  return [musicOn, toggleMusic, { playMusic, stopMusic, playJump, playFound, playFirework }];
};

export default MusicButton;
