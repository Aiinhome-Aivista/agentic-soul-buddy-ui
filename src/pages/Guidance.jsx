import { useState, useRef, useEffect, useContext } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { VoiceRecognizer } from '../common/helper/VoiceRecognizer'
import CanvasVisualizer from '../components/CanvasVisualizer';
import { Context } from '../common/helper/Context';
import ExitModal from '../common/modal/ExitModal';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { apiService } from '../service/apiService';
import { POST_url } from '../connection/connection';
import LogoutIcon from '@mui/icons-material/Logout';
import TypingDots from '../components/TypingDots';


const Guidance = () => {
  const { userData, recognizedText } = useContext(Context);
  const audioRef = useRef(null);
  const [audio_url, setAudio_url] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openExitModal, setOpenExitModal] = useState(false);

  useEffect(() => {
    // 2. Attempt to play audio, catching potential browser errors for autoplay
    audioRef.current?.play().catch((error) => {
      console.error('Audio playback failed. User interaction may be required:', error);
    });
  }, []);

  const handleMicClick = async () => {
    setIsRecording((prevState) => !prevState);
    if (isRecording) {
      setIsLoading(true);
      const payload = {
        "user_id": userData?.user_id,
        "user_input": recognizedText
      }
      try {
        console.log(payload)
        const response = await apiService({
          url: POST_url.ask,
          method: 'POST',
          data: payload,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setIsLoading(false);
        if (response && !response.error) {
          console.log(response.Data)
          setAudio_url(response?.Data?.audio_url)
          setTimeout(() => {
            if (audioRef.current && response?.Data?.audio_url) {
              audioRef.current.play().catch((error) => {
                console.error('Audio playback failed:', error);
              });
            }
          }, 100);
        } else {
          console.error('Submission failed:', response?.message);
          alert(`Submission failed: ${response?.message || 'An error occurred.'}`);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('An error occurred during submission:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };


  return (
    <div className="flex flex-col items-center w-[100%] h-[100%] p-[0.5rem]">
      <div className={`flex items-start justify-end gap-[1%] w-[100%] ${openExitModal ? 'opacity-80' : 'opacity-80'}`}>
        <p className='text-white'>Welcome, {userData?.full_name}</p>
        <ExitToAppIcon onClick={() => setOpenExitModal(true)} className='cursor-pointer' />
      </div>
      <div className="flex flex-col items-center gap-[3%] h-[40%]">
        <p className='text-3xl font-bold text-yellow-400 pt-[20%]'>Speak with Cosmic Wisdom.</p>
        <p className='font-light text-white'>Share your thoughts, questions, or concerns...</p>
      </div>
      <div className="flex flex-col items-center h-[50%]">
        {isRecording ? (
          <div className='pb-[1%] rounded-full bg-red-500/30 animate-pulse-circle'>
            <MicIcon sx={{ fontSize: '5rem', color: 'red' }} onClick={handleMicClick} />
          </div>
        ) : isLoading ? (
          <TypingDots />
        ) : audioRef.current && !audioRef.current.paused ? (
          <div className='pb-[1%]'>
            <CanvasVisualizer audioRef={audioRef} width={400} height={100} barWidth={9} gap={35} minBarHeight={1} fps={60} />
          </div>
        ) : (
          <div className='realtive pb-[1%]'>
            <MicIcon sx={{ fontSize: '5rem', color: '#eae6b1ff' }} onClick={handleMicClick} />
          </div>
        )}
        {isRecording ? (
          <div className='pb-[50%] font-light text-xs text-white'>
            Analyzing voice patterns...
          </div>
        ) : audioRef.current && !audioRef.current.paused ? (
          <div className='pb-[50%] font-light text-xs text-white'>
            <div>Analyzing voice patterns (Playback)...</div>
            <div className='flex gap-2 mt-2'>
              <button
                onClick={() => audioRef.current?.pause()}
                className='px-3 py-1 text-sm bg-red-500/30 hover:bg-red-500/50 text-white rounded-full'
              >
                Pause
              </button>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.pause();
                    setIsRecording(false);
                  }
                }}
                className='px-3 py-1 text-sm bg-red-500/30 hover:bg-red-500/50 text-white rounded-full'
              >
                Stop
              </button>
            </div>
          </div>
        ) : (
          <div className='pb-[50%] font-light text-xs text-white'>
            Click the mic to start recording
          </div>
        )}
      </div>
      <p className='font-light text-white'>Soothe your mind and relieve your stress.</p>
      <VoiceRecognizer isRecording={isRecording} setIsRecording={setIsRecording} />
      <audio
        ref={audioRef}
        src={audio_url}
        preload="auto"
      />
      {openExitModal && <ExitModal OnClose={() => setOpenExitModal(false)} />}
    </div >
  );
};

export default Guidance;