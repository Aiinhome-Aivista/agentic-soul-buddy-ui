import { useState, useRef, useEffect, useContext } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { VoiceRecognizer } from '../common/helper/VoiceRecognizer'
import CanvasVisualizer from '../components/CanvasVisualizer';
import { Context } from '../common/helper/Context';
import ExitModal from '../common/modal/ExitModal';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Guidance = () => {
  const { setLoadGuidance } = useContext(Context);
  const audioRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [openExitModal, setOpenExitModal] = useState(false);

  useEffect(() => {
    // 2. Attempt to play audio, catching potential browser errors for autoplay
    audioRef.current?.play().catch((error) => {
      console.error('Audio playback failed. User interaction may be required:', error);
    });
  }, []);

  const handleMicClick = () => {
    setIsRecording((prevState) => !prevState);
  };

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
  };

  return (
    <div className="flex flex-col items-center w-[100%] h-[100%] p-[0.5rem]">
      <div className={`flex items-start justify-end gap-[1%] w-[100%] ${openExitModal ? 'opacity-80' : 'opacity-80'}`}>
        <p className='text-white'>Welcome, User</p>
        <ExitToAppIcon onClick={() => setOpenExitModal(true)} className='cursor-pointer' />
      </div>
      <div className="flex flex-col items-center gap-[3%] h-[40%]">
        <p className='text-3xl font-bold text-yellow-400 pt-[20%]'>Speak with your AI spiritual guide.</p>
        <p className='font-light text-yellow-100'>Share your thoughts, questions, or concerns...</p>
      </div>
      <div className="flex flex-col items-center h-[50%]">
        {/* <CanvasVisualizer audioRef={audioRef}
          width={400}
          height={100}
          barWidth={9}
          gap={35}
          minBarHeight={1}
          fps={60} /> */}
        <div className='pb-[1%]'>
          <MicIcon sx={{ fontSize: '5rem', color: isRecording ? 'red' : '#fefce8' }} onClick={handleMicClick} />
        </div>
        <p className='pb-[50%] font-light text-xs text-yellow-100'>{isRecording ? 'Listening...' : 'Click the mic to start recording'}</p>
        <p className='font-light text-yellow-100'>Soothe your mind and relieve your stress.</p>
      </div>
      <VoiceRecognizer isRecording={isRecording} setIsRecording={setIsRecording} />
      <audio
        ref={audioRef}
        src=""
        preload="auto"
      />
      {openExitModal && <ExitModal OnClose={() => setOpenExitModal(false)} />}
    </div>
  );
};

export default Guidance;