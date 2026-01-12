import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import { VoiceRecognizer } from '../common/helper/VoiceRecognizer'
import { Context } from '../common/helper/Context';
import { apiService } from '../service/apiService';
import { POST_url1, get_url1 } from '../connection/connection';
import TypingDots from '../components/TypingDots';
import CanvasVisualizerSim from '../components/CanvasVisualizerSim';
import LoginLogoutIcon from '../components/LoginLogoutIcon';
import LoginModal from '../common/modal/LoginModal';
// import SignupModal from '../common/modal/SignupMOdal';
import SignupModal2 from '../common/modal/signupafterquestions';
import WellBeingProfile from '../common/modal/WellBeingProfile';
import DisclaimerModal from '../common/modal/DisclaimerModal';
import AccountModal from '../common/modal/AccountModal';
import SubscriptionPlane from '../common/modal/SubscribtionPlane';

const AiChat = () => {
  const navigate = useNavigate();
  const { recognizedText, isLoggedIn, loginModal, setLoginModal, signupModal, setSignupModal, signupModal2, setSignupModal2, audioUrl, setAudioUrl, isLoading, setIsLoading, accountModal, setAccountModal } = useContext(Context);
  const audioRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [disclaimerModal, setDisclaimerModal] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [dailyMinutesLeft, setDailyMinutesLeft] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLimitReachedModal, setShowLimitReachedModal] = useState(false);

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
    if (!isLoggedIn) {
      setIsRecording(false);
    }
  }, [isLoggedIn]
  );

  const checkSubscriptionStatus = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        const response = await apiService({
          url: `${get_url1.subscription_status}?user_id=${userId}`,
          method: 'GET'
        });
        if (response && !response.error) {
          setSubscriptionActive(response.active);
          setDailyMinutesLeft(response.daily_minutes_left);
          const canUseVoice = response.active && response.daily_minutes_left > 0;
          return canUseVoice;
        } else {
          setSubscriptionActive(false);
          setDailyMinutesLeft(0);
          return false;
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setSubscriptionActive(false);
        setDailyMinutesLeft(0);
        return false;
      }
    }
    return false;
  };

  /* Check subscription status when logged in */
  useEffect(() => {
    if (isLoggedIn) {
      checkSubscriptionStatus();
    }
  }, [isLoggedIn]);

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
      
      // Check subscription status after each ask API call
      const isActive = await checkSubscriptionStatus();
      if (!isActive) {
        setShowLimitReachedModal(true);
        return;
      }
      
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
      if (!subscriptionActive || dailyMinutesLeft === 0) {
        setShowLimitReachedModal(true);
        return;
      }
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

  const handleUpgradePlan = () => {
    setShowLimitReachedModal(false);
    setShowSubscriptionModal(true);
  };

  return (
    <div className="flex flex-col items-center w-[100%] h-[100%]">


      <div className={`flex items-start justify-end gap-[1%] w-[100%] `}>
        {!isLoggedIn && (
          <button
            onClick={() => navigate('/questionnaire')}
            className="h-[1.7rem] px-3 rounded-[1rem] border-2 border-[#333333] bg-[#474747]/22 text-[0.75rem] font-medium text-[#7D7E7F] hover:bg-[#474747]/40 transition-colors cursor-pointer"
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
        <p className='text-4xl font-bold text-white pt-[12%]  cursor-default' >Soul Junction</p>
        <p className='text-white text-xl font-light  cursor-default'>"Grow With Ancient Indian Guidance..."</p>
      </div>
      <div className="flex flex-col items-center h-[45%] pt-[2%]">
        {isRecording ? (
          <div className='relative pb-[1%] flex items-center justify-center'>
            {/* Outer pulsing ring */}
            <div className='absolute w-20 h-20 rounded-full bg-[#e57373]/40 animate-recording-pulse' />
            {/* Main red circular button */}
            <div
              className='relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer'
              style={{
                backgroundColor: '#e54b4b',
                boxShadow: '0 4px 15px rgba(229, 75, 75, 0.4)'
              }}
              onClick={handleMicClick}
            >
              <MicIcon
                sx={{
                  fontSize: '2rem',
                  color: '#FFFFFF'
                }}
              />
            </div>
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
      {disclaimerModal && <DisclaimerModal OnClose={() => setDisclaimerModal(false)} onConfirm={handleDisclaimerConfirm} />}
      {accountModal && <AccountModal OnClose={() => setAccountModal(false)} />}
      {showSubscriptionModal && <SubscriptionPlane OnClose={() => setShowSubscriptionModal(false)} showAllPlans={false} />}
      
      {/* Limit Reached Modal */}
      {showLimitReachedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-[90%] text-center animate-slideUp">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-white text-xl font-semibold mb-2">Plan Limit Reached</h3>
            <p className="text-white/60 text-sm mb-6">
              You have reached your daily usage limit. Upgrade your plan to continue your journey.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleUpgradePlan}
                className="w-full py-3 rounded-xl bg-[#D9D9D9] text-black font-semibold
                           hover:bg-white transition-all duration-300"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => setShowLimitReachedModal(false)}
                className="w-full py-3 rounded-xl border border-white/20 text-white/70 font-medium
                           hover:bg-white/10 transition-all duration-300"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default AiChat;