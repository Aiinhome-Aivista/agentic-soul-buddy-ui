import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const Guidance = () => {
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // 2. Attempt to play audio, catching potential browser errors for autoplay
    audioRef.current?.play().catch((error) => {
      console.error('Audio playback failed. User interaction may be required:', error);
    });
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('SpeechRecognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Recognized text:', transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-[100%] h-[100%] p-[0.5rem]">
      <div className="flex items-start w-[100%]">
        <ArrowBackIcon onClick={() => navigate('/home')} className='cursor-pointer' />
      </div>
      <div className="flex flex-col items-center gap-[3%] h-[40%]">
        <p className='text-5xl font-bold pt-[20%]'>Welcome, User</p>
        <p className='font-light'>Speak with your AI spiritual guide. Press and hold to talk</p>
      </div>
      <div className="flex flex-col items-center h-[50%]">
        <div className='pb-[1%]'>
          <MicIcon sx={{ fontSize: '5rem', color: isRecording ? 'red' : 'white' }} onClick={handleMicClick} />
        </div>
        <p className='pb-[70%] font-light text-xs'>{isRecording ? 'Listening...' : 'Click the mic to start recording'}</p>
        <p className='font-light'>Share your thoughts, questions, or concerns...</p>
      </div>
    </div>
  );
};

export default Guidance;