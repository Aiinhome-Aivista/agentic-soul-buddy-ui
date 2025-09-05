import galaxyVideo from '../assets/video/galaxy.mp4';

const UniverseBackground = () => {
  return (
    <div className="fixed inset-0 h-full w-full">
      {/* Real Universe Background Image */}
      <video
        src={galaxyVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.4)' }} // Dim the background
      />
      {/* Overlay for extra dimming (optional) */}
      {/* <Galaxy /> */}
      <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />
    </div>
  );
};

export default UniverseBackground;