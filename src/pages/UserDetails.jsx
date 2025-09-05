import React, { useEffect, useRef } from 'react';
import bgAudio from '../assets/audio/uplifting-pad-texture-113842.mp3';

function UserDetails() {
  const audioRef = useRef(null);

  useEffect(() => {
    handlePlay();
  }, []);

  const handlePlay = () => {
    audioRef.current?.play().catch((error) => {
      console.error('Audio playback failed. User interaction may be required:', error);
    });
  };

  return (
    <div className="flex flex-col items-center w-[100%] h-[100%] p-[0.5rem]"
      onMouseEnter={handlePlay}>
      <audio ref={audioRef} src={bgAudio} preload="auto" />
    </div>
  )
}

export default UserDetails