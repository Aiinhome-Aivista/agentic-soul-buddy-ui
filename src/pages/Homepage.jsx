import { useState, useRef, useEffect, useContext } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import { VoiceRecognizer } from '../common/helper/VoiceRecognizer'
import { Context } from '../common/helper/Context';
import ExitModal from '../common/modal/ExitModal';
import { apiService } from '../service/apiService';
import { POST_url } from '../connection/connection';
import TypingDots from '../components/TypingDots';
import CanvasVisualizerSim from '../components/CanvasVisualizerSim';
import LoginIcon from '../components/LoginIcon';
import LogoutIcon from '../components/LogoutIcon';
import LoginModal from '../common/modal/LoginModal';

const Homepage = () => {
  const { userData, recognizedText, isLoggedIn, loginModal, setLoginModal } = useContext(Context);
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioUrl(null);
      // Setting isPlaying to false ensures the visualizer unmounts correctly.
      setIsPlaying(false);
    }
  };

  const handleMicClick = async () => {
    if (isLoggedIn) {
      setIsRecording((prevState) => !prevState);
      if (isRecording) {
        setIsLoading(true);
        if (recognizedText !== null) {
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
              setAudioUrl(response.Data.audio_url);
            } else {
              console.error('Submission failed:', response?.message);
              console.log(`Submission failed: ${response?.message || 'An error occurred.'}`);
            }
          } catch (error) {
            setIsLoading(false);
            console.error('An error occurred during submission:', error);
            console.log('An error occurred. Please try again later.');
          }
        }
      }
    }
    else { 
      setLoginModal(true)
    }
  };

  return (
    <div className="flex flex-col items-center w-[100%] h-[100%] p-[0.5rem]">
      <div className={`flex items-start justify-end gap-[1%] w-[100%]`}>
        {isLoggedIn ? (
          <LogoutIcon onClick={() => setLoginModal(true)} />
        ) : (
          <LoginIcon onClick={() => setLoginModal(true)} />
        )}
      </div>
      <div className="flex flex-col items-center gap-[3%] h-[40%]">
        <p className='text-4xl font-bold text-white pt-[12%]'>Cosmic Wisdom</p>
        <p className='text-white text-xl font-light'>"Sharing ancient Indian knowledge..."</p>
      </div>
      <div className="flex flex-col items-center h-[50%]">
        {isRecording ? (
          <div className='relative pb-[1%] rounded-full'>
            <div className='absolute inset-0 bg-[#FFFFFF]/9 animate-pulse-circle rounded-full' />
            <MicIcon
              sx={{ fontSize: '2.5rem', color: '#D9D9D9', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}
              onClick={handleMicClick}
              className='relative cursor-pointer'
            />
          </div>
        ) : isLoading ? (
          <TypingDots />
        ) : isPlaying ? (
          <div className='pb-[1%]'>
            <CanvasVisualizerSim
              width={400}
              height={130}
              barCount={32}
              barWidth={8}
              gap={5}
              centerGap={5}
              minBarHeight={0}
            />
          </div>
        ) : (
          <div className='relative pb-[1%]'>
            <MicIcon sx={{ fontSize: '2.5rem', color: '#D9D9D9' }} onClick={handleMicClick} className='cursor-pointer' />
          </div>
        )}
        {isPlaying ? (
          <div className='pb-[40%] font-light text-xs text-white'>
            <div></div>
            <div className='flex gap-2 mt-2'>
              <button
                onClick={handleStop}
                className='px-3 py-1 text-sm bg-gray-400/30 hover:bg-gray-300/30 text-white rounded-full cursor-pointer'
              >
                Stop
              </button>
            </div>
          </div>
        ) : (
          <div className='pb-[40%] font-light text-xs text-white'>
          </div>
        )}
      </div>
      <p className='text-xl text-white text-center font-light pb-[3%]'>Share your details to begin your personalized <br /> spiritual journey</p>
      <VoiceRecognizer isRecording={isRecording} setIsRecording={setIsRecording} />
      <audio
        crossOrigin="anonymous"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleStop}
        ref={audioRef}
        src={audioUrl}
        autoPlay
        preload="auto"
      />
      {openExitModal && <ExitModal OnClose={() => setOpenExitModal(false)} />}
      {loginModal && <LoginModal OnClose={() => setLoginModal(false)} />}
    </div >
  );
};

export default Homepage;