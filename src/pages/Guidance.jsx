import { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Guidance = () => {
  const audioRef = useRef(null);
  const navigate=useNavigate();

  useEffect(() => {
    // 2. Attempt to play audio, catching potential browser errors for autoplay
    audioRef.current?.play().catch((error) => {
      console.error('Audio playback failed. User interaction may be required:', error);
    });
  }, []);

  return (
    <div className="flex flex-col items-center w-[100%] h-[100%] p-[0.5rem]">
      <div className="flex items-start w-[100%]">
        <ArrowBackIcon onClick={() => navigate('/home')}/>
      </div>
      <div className="flex flex-col items-center gap-[3%] h-[40%]">
        <div className='text-5xl font-bold pt-[20%]'>Welcome, User</div>
        <div className='font-light'>Speak with your AI spiritual guide. Press and hold to talk</div>
      </div>
      <div className="flex flex-col items-center justify-between h-[50%]">
        <div className='pb-[4%]'>
          <MicIcon sx={{ fontSize: '5rem' }} />
        </div>
        <p className='font-light'>Share your thoughts, questions, or concerns...</p>
      </div>
    </div>
  );
};

export default Guidance;