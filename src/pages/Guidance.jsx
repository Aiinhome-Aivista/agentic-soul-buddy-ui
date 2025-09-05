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
    <div className="flex flex-col items-center w-[100%] h-[100%] p-[0.5rem]">
      <div className="flex items-start w-[100%]">back</div>
      <div className="flex flex-col h-[40%]">
        <div>Welcome, User</div>
        <div>Speak with your AI spiritual guide. Press and hold to talk</div>
      </div>
      <div className="flex flex-col">
        <div>button</div>
        <div>Share your thoughts, questions, or concerns</div>
      </div>
    </div>
  );
};

export default Guidance;