import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import { VoiceRecognizer } from '../common/helper/VoiceRecognizer'
import { Context } from '../common/helper/Context';
import { apiService } from '../service/apiService';
import { POST_url1 } from '../connection/connection';
import TypingDots from '../components/TypingDots';
import CanvasVisualizerSim from '../components/CanvasVisualizerSim';
import LoginLogoutIcon from '../components/LoginLogoutIcon';
import LoginModal from '../common/modal/LoginModal';
import SignupModal from '../common/modal/SignupMOdal';
import SignupModal2 from '../common/modal/signupafterquestions';
import WellBeingProfile from '../common/modal/WellBeingProfile';

const AiChat = () => {
  const navigate = useNavigate();
  const { recognizedText, isLoggedIn, loginModal, setLoginModal, signupModal, setSignupModal, signupModal2, setSignupModal2, audioUrl, setAudioUrl, isLoading, setIsLoading } = useContext(Context);
  const audioRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem('userId'));
      setSessionId(localStorage.getItem('sessionId'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsRecording(false);
    }
  }, [isLoggedIn]
  );

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
            "user_id": localStorage.getItem('userId'),
            // "session_id": localStorage.getItem('sessionId'),
            "text": recognizedText
          }
          try {
            console.log(payload)
            const response = await apiService({
              url: POST_url1.ask,
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
    <div className="flex flex-col items-center w-[100%] h-[100%]">


      <div className={`flex items-start justify-end gap-[1%] w-[100%]`}>
        {!isLoggedIn && (
          <button
            onClick={() => navigate('/questionnaire')}
            className="h-[1.7rem] px-3 rounded-[1rem] border-2 border-[#333333] bg-[#474747]/22 text-[0.75rem] font-medium text-[#7D7E7F] hover:bg-[#474747]/40 transition-colors"
          >
            Sign Up
          </button>
        )}
        {/* <button
          onClick={() => setShowProfile(true)}
          className="h-[1.7rem] px-3 rounded-[1rem] border-2 border-[#333333] bg-[#474747]/22 text-[0.75rem] font-medium text-[#7D7E7F] hover:bg-[#474747]/40 transition-colors"
        >
          Profile
        </button> */}
        <LoginLogoutIcon />
      </div>
      <div className="flex flex-col items-center gap-[3%] h-[40%]">
        <p className='text-4xl font-bold text-white pt-[12%]  cursor-default' >Cosmic Wisdom</p>
        <p className='text-white text-xl font-light  cursor-default'>"Grow With Ancient Indian Guidance..."</p>
      </div>
      <div className="flex flex-col items-center h-[45%] pt-[2%]">
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
              width={350}
              height={130}
              barCount={34}
              barWidth={5}
              gap={4}
              centerGap={5}
              minBarHeight={5}
            />
          </div>
        ) : (
          <div className='relative pb-[1%]'>
            <MicIcon sx={{
              fontSize: '2.5rem',
              color: '#D9D9D9',
              transition: 'color 0.2s, font-size 0.2s',
              '&:hover': {
                color: '#fdfdfdff',
                fontSize: '2.6rem'
              }
            }} onClick={handleMicClick} className='cursor-pointer' />
          </div>
        )}
        {isPlaying ? (
          <div className='pb-[40%] font-light text-xs text-white'>
            <div></div>
            <div className='flex items-center rounded-3xl bg-[#474747]/22 border-2 border-gray-500 p-1 cursor-pointer'>
              <div className='rounded-full h-[1rem] w-[1rem] bg-[#D9D9D9]/54'
                onClick={handleStop}></div>
              <p className='flex items-center justify-center text-sm text-[#7D7E7F] px-1'>Stop</p>
            </div>
          </div>
        ) : (
          <div className='pb-[40%] font-light text-xs text-white'>
          </div>
        )}
      </div>
      <p className='text-large text-[#D9D9D9] text-center font-light pb-[5%] cursor-default'>Share your details to begin your personalized<br />journey of transformation</p>
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

      {loginModal && <LoginModal OnClose={() => setLoginModal(false)} />}
      {signupModal && <SignupModal OnClose={() => setSignupModal(false)} />}
      {signupModal && <SignupModal OnClose={() => setSignupModal(false)} />}
      {signupModal2 && <SignupModal2 OnClose={() => setSignupModal2(false)} />}
      {showProfile && <WellBeingProfile onClose={() => setShowProfile(false)} />}
    </div >
  );
};

export default AiChat;