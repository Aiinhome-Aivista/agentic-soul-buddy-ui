import { useState, useRef, useEffect } from 'react';
import UniverseBackground from '../components/UniverseBackground';
import SpiritualAudioWaves from '../components/SpiritualAudioWaves';

const Index = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    // 2. Attempt to play audio, catching potential browser errors for autoplay
    audioRef.current?.play().catch((error) => {
      console.error('Audio playback failed. User interaction may be required:', error);
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Universe Background */}
      <UniverseBackground />
      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(58vh)] flex items-end justify-center">
        <SpiritualAudioWaves />
      </div>
    </div>
  );
};

export default Index;