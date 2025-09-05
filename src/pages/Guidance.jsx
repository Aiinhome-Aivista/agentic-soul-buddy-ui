import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { VoiceRecognizer } from '../common/helper/VoiceRecognizer'

const Guidance = () => {
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // 2. Attempt to play audio, catching potential browser errors for autoplay
    audioRef.current?.play().catch((error) => {
      console.error('Audio playback failed. User interaction may be required:', error);
    });
  }, []);

  const handleMicClick = () => {
    setIsRecording((prevState) => !prevState);
  };

  return (
    <div className="flex flex-col items-center w-[100%] h-[100%] p-[0.5rem]">
      <div className="flex items-start w-[100%]">
        <ArrowBackIcon onClick={() => navigate('/home')} className='cursor-pointer' />
      </div>
      <div className="flex flex-col items-center gap-[3%] h-[40%]">
        <p className='text-5xl font-bold text-yellow-400 pt-[20%]'>Welcome, User</p>
        <p className='font-light text-yellow-100'>Speak with your AI spiritual guide. Press and hold to talk</p>
      </div>
      <div className="flex flex-col items-center h-[50%]">
        <div className='pb-[1%]'>
          <MicIcon sx={{ fontSize: '5rem', color: isRecording ? 'red' : '#fefce8' }} onClick={handleMicClick} />
        </div>
        <p className='pb-[70%] font-light text-xs text-yellow-100'>{isRecording ? 'Listening...' : 'Click the mic to start recording'}</p>
        <p className='font-light text-yellow-100'>Share your thoughts, questions, or concerns...</p>
      </div>
      <VoiceRecognizer isRecording={isRecording} setIsRecording={setIsRecording} />
    </div>
  );
};

export default Guidance;