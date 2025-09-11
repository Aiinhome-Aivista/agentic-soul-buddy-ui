import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import background_audio from '../../assets/audio/spiritual-healing-and-emotional-release-225402.mp3';

export const BackgroundAudioContext = createContext(null);

export default function BackgroundAudioProvider({ children }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [volume, setVol] = useState(0.6); // desired target volume after fade-in

  // Create one <audio> element and keep it for the app lifetime
  useEffect(() => {
    const el = new Audio(background_audio);
    el.loop = true;
    el.preload = 'auto';
    el.crossOrigin = 'anonymous';
    el.volume = 0; // Optional: start muted/0 for smoother fade-in
    audioRef.current = el;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);

    return () => {
      el.pause();
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      audioRef.current = null;
    };
  }, []);

  // One-time unlock on first user gesture (click/touch/keydown/mouseenter)
  useEffect(() => {
    if (!audioRef.current) return;

    let removing = false;
    const events = ['pointerdown', 'click', 'touchstart', 'keydown', 'mouseenter'];

    const fadeIn = (target = volume, step = 0.05, everyMs = 80) => {
      if (!audioRef.current) return;
      audioRef.current.volume = 0;
      const id = setInterval(() => {
        if (!audioRef.current) { clearInterval(id); return; }
        const next = Math.min(target, audioRef.current.volume + step);
        audioRef.current.volume = next;
        if (next >= target) clearInterval(id);
      }, everyMs);
    };

    const unlock = async () => {
      if (!audioRef.current || unlocked) return;
      try {
        // Attempt to start playback during the gesture
        await audioRef.current.play(); // compliant with autoplay policy when in a gesture
        fadeIn(volume); // Optional: ramp up smoothly after gesture
        setUnlocked(true);
        if (!removing) removeListeners();
      } catch {
        // If blocked (rare if triggered by gesture), keep listeners for the next gesture
      }
    };

    const handler = () => unlock();
    const addListeners = () => events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    const removeListeners = () => {
      removing = true;
      events.forEach(e => window.removeEventListener(e, handler));
    };

    addListeners();
    return removeListeners;
  }, [unlocked, volume]);

  const play = useCallback(async () => {
    if (audioRef.current) await audioRef.current.play();
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
  }, []);

  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVol(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const value = useMemo(
    () => ({ playing, volume, setVolume, play, pause, unlocked }),
    [playing, volume, setVolume, play, pause, unlocked]
  );

  return (
    <BackgroundAudioContext.Provider value={value}>
      {children}
    </BackgroundAudioContext.Provider>
  );
}
