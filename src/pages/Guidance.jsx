import { useState, useRef, useEffect } from 'react';
import UniverseBackground from '../components/UniverseBackground';
import SpiritualAudioWaves from '../components/SpiritualAudioWaves';

const Guidance = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    // 2. Attempt to play audio, catching potential browser errors for autoplay
    audioRef.current?.play().catch((error) => {
      console.error('Audio playback failed. User interaction may be required:', error);
    });
  }, []);

  return (
    <div className="flex flex-col items-center w- h-screen">
      <div className="flex items-start w-[100%]">hello</div>
    </div>
  );
};

export default Guidance;