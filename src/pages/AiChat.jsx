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
// import SignupModal from '../common/modal/SignupMOdal';
import SignupModal2 from '../common/modal/signupafterquestions';
import WellBeingProfile from '../common/modal/WellBeingProfile';
import DisclaimerModal from '../common/modal/DisclaimerModal';

const AiChat = () => {
  const navigate = useNavigate();
  const { recognizedText, isLoggedIn, loginModal, setLoginModal, signupModal, setSignupModal, signupModal2, setSignupModal2, audioUrl, setAudioUrl, isLoading, setIsLoading } = useContext(Context);
  const audioRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [disclaimerModal, setDisclaimerModal] = useState(false);

  // Audio Visualization Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const [analyser, setAnalyser] = useState(null);

  const handleDisclaimerConfirm = () => {
    setDisclaimerModal(false);
    navigate('/questionnaire');
  };

  const [name, setName] = useState(localStorage.getItem('name') || '');

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem('userId'));
      setSessionId(localStorage.getItem('sessionId'));
      const storedName = localStorage.getItem('name');
      console.log("Retrieved userName from storage:", storedName);
      setName(storedName);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    console.log("AiChat Mounted. Current stored userName:", name);
   
  }, []);

  // Initialize Audio Context and connections
  useEffect(() => {
    if (audioRef.current && !audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 256;
      analyserRef.current = analyserNode;
      setAnalyser(analyserNode);

      try {
        const source = ctx.createMediaElementSource(audioRef.current);
        sourceRef.current = source;
        source.connect(analyserNode);
        analyserNode.connect(ctx.destination);
      } catch (err) {
        console.warn("MediaElementSource error:", err);
      }
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error(e));
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsRecording(false);
    }
  }, [isLoggedIn]
  );

  /* New useEffect for Auto Greeting */
  useEffect(() => {
    const hasGreeted = sessionStorage.getItem('hasGreeted');
    if (isLoggedIn && !hasGreeted) {
      handleVoiceQuery("");
      sessionStorage.setItem('hasGreeted', 'true');
    }
  }, [isLoggedIn]);

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioUrl(null);
      // Setting isPlaying to false ensures the visualizer unmounts correctly.
      setIsPlaying(false);
    }
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const handleVoiceQuery = async (textValue) => {
    setIsLoading(true);
    const payload = {
      "user_id": localStorage.getItem('userId'),
      // "session_id": localStorage.getItem('sessionId'),
      "text": textValue
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
        console.log(response)
        setAudioUrl(response.audio_url);
      } else {
        console.error('Submission failed:', response?.message);
        console.log(`Submission failed: ${response?.message || 'An error occurred.'}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('An error occurred during submission:', error);
      console.log('An error occurred. Please try again later.');
    }
  };

  const handleMicClick = async () => {
    if (isLoggedIn) {
      setIsRecording((prevState) => !prevState);
      if (isRecording) {
        // Was recording, now stopping -> send query
        if (recognizedText !== null) {
          handleVoiceQuery(recognizedText);
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
            onClick={() => setDisclaimerModal(true)}
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
        <style>{`
          .mic-button-3d {
            background: linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
            box-shadow: 
              8px 8px 16px rgba(0,0,0,0.2),
              -8px -8px 16px rgba(255,255,255,0.05);
            transition: all 0.2s ease;
          }
          .mic-button-3d:active, .mic-button-3d.pressed {
            background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15));
            box-shadow: 
              inset 4px 4px 8px rgba(0,0,0,0.3),
              inset -4px -4px 8px rgba(255,255,255,0.05);
            transform: scale(0.95);
          }
          .animate-pulse-shadow {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            animation: pulse-red 1.5s infinite;
          }
          @keyframes pulse-red {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            }
          }
        `}</style>
        {isRecording ? (
          <div className='relative pb-[1%]'>
            <div
              className='mic-button-3d pressed animate-pulse-shadow rounded-full p-4 cursor-pointer flex items-center justify-center'
              onClick={handleMicClick}
            >
              <MicIcon sx={{ fontSize: '2.5rem', color: '#ef4444' }} />
            </div>
          </div>
        ) : isLoading ? (
          <TypingDots />
        ) : isPlaying ? (
          <div className='pb-[1%]'>
            <CanvasVisualizerSim
              analyser={analyser}
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
            <div
              className='mic-button-3d rounded-full p-4 cursor-pointer flex items-center justify-center hover:bg-white/10'
              onClick={handleMicClick}
            >
              <MicIcon sx={{ fontSize: '2.5rem', color: '#D9D9D9' }} />
            </div>
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
        onPlay={handleAudioPlay}
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
      {disclaimerModal && <DisclaimerModal OnClose={() => setDisclaimerModal(false)} onConfirm={handleDisclaimerConfirm} />}
    </div >
  );
};

export default AiChat;