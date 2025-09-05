import { useEffect, useRef, useState } from "react";
import Audio from "../assets/audio.mp3";
import CanvasVisualizer from "./ui/CanvasVisualizer";

const SpiritualAudioWaves = () => {
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handlePlay();
    }, 20);
    return () => clearTimeout(timer);
  }, []);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
  };


  return (
    <div
      className="flex flex-col items-center justify-center z-10 relative overflow-hidden max-h-full"
      onClick={() => handlePlay()}
    >
      <div
        className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
      >
        <div className="absolute inset-0 -m-8 rounded-full glow-ethereal opacity-60 pointer-events-none" />

        <div
          className={`mt-8 text-center transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-0"
            }`}
        >
          <p
            style={{ fontSize: "2.8rem", fontWeight: "bold", margin: "0", opacity: "0.6" }}>
            Cosmic Wisdom
          </p>
          <p className="text-muted-foreground text-3xl max-w-md p-0 m-0">
            "Sharing ancient Indian wisdom through sound..."
          </p>
        </div>

        {/* Canvas Audio Visualizer */}
        <CanvasVisualizer
          audioRef={audioRef}
          width={400}
          height={100}
          barWidth={9}
          gap={35}
          minBarHeight={1}
          fps={60}
        />

        {/* Hidden Audio Player (autoplay) */}
        <audio
          ref={audioRef}
          src={Audio}
          style={{ display: "none" }}
        />
      </div>

    </div>
  );
};

export default SpiritualAudioWaves;