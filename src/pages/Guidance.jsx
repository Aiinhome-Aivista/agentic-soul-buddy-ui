import { useState, useRef, useEffect, useContext } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import { VoiceRecognizer } from '../common/helper/VoiceRecognizer'
import { Context } from '../common/helper/Context';
import ExitModal from '../common/modal/ExitModal';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { apiService } from '../service/apiService';
import { POST_url } from '../connection/connection';
import LogoutIcon from '@mui/icons-material/Logout';
import TypingDots from '../components/TypingDots';
import CanvasVisualizer from '../components/CanvasVisualizer';


const Guidance = () => {
  const { userData, recognizedText } = useContext(Context);
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      handlePlay();
    }
  }, [audioUrl]);

  const handlePlay = () => audioRef.current?.play();
  const handlePause = () => audioRef.current?.pause();
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioUrl(null);
    }
  };

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
          setAudioUrl(response?.Data?.audio_url);
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
        <p className='text-5xl font-bold text-white pt-[12%]'>Speak with Cosmic Wisdom.</p>
        <p className='font-light text-white'>Share your thoughts, questions, or concerns...</p>
      </div>
      <div className="flex flex-col items-center h-[50%]">
        {isRecording ? (
          <div className='pb-[1%] rounded-full bg-red-500/30 animate-pulse-circle'>
            <MicIcon sx={{ fontSize: '5rem', color: '#ffffffff' }} onClick={handleMicClick} />
          </div>
        ) : isLoading ? (
          <TypingDots />
        ) : isPlaying ? (
          <div className='pb-[1%]'>
            <CanvasVisualizer audioRef={audioRef} width={270} height={100} barWidth={9} gap={2} minBarHeight={2} sensitivity={15} />
          </div>
        ) : (
          <div className='relative pb-[1%]'>
            <MicIcon sx={{ fontSize: '5rem', color: '#ffffffff' }} onClick={handleMicClick} />
          </div>
        )}
        {isRecording ? (
          <div className='pb-[50%] font-light text-xs text-white'>
            Analyzing voice patterns...
          </div>
        ) : isPlaying ? (
          <div className='pb-[50%] font-light text-xs text-white'>
            {/* <div>Cosmic wisdom is speaking...</div> */}
            <div></div>
            <div className='flex gap-2 mt-2'>
              <button
                onClick={handlePause}
                className='px-3 py-1 text-sm bg-red-500/30 hover:bg-red-500/50 text-white rounded-full'
              >
                Pause
              </button>
              <button
                onClick={handleStop}
                className='px-3 py-1 text-sm bg-red-500/30 hover:bg-red-500/50 text-white rounded-full'
              >
                Stop
              </button>
            </div>
          </div>
        ) : (
          <div className='pb-[50%] font-light text-xs text-white'>
            {/* Click the mic to start recording */}
          </div>
        )}
      </div>
      <p className='font-light text-white'>Soothe your mind and relieve your stress.</p>
      <VoiceRecognizer isRecording={isRecording} setIsRecording={setIsRecording} />
      <audio
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleStop}
        ref={audioRef}
        src={audioUrl}
        preload="auto"
      />
      {openExitModal && <ExitModal OnClose={() => setOpenExitModal(false)} />}
    </div >
  );
};

export default Guidance;