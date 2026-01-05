import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import { VoiceRecognizer } from '../common/helper/VoiceRecognizer'
import { Context } from '../common/helper/Context';
import { apiService } from '../service/apiService';
import { POST_url1 } from '../connection/connection';
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
  const [userName, setUserName] = useState('');

  // Get user initials from name
  const getInitials = (name) => {
    if (!name) return '👤';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Load user name from localStorage
  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      setUserName(name);
    }
  }, [isLoggedIn]);
  
  // Audio analysis state
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const micStreamRef = useRef(null);
  const micAnalyserRef = useRef(null);
  const [audioLevels, setAudioLevels] = useState(Array(16).fill(0));

  // Audio-reactive visualizer component
  const AudioReactiveVisualizer = ({ levels, isActive, color = 'violet' }) => {
    const colorMap = {
      violet: {
        from: 'from-violet-500',
        to: 'to-purple-400',
        glow: 'shadow-violet-500/50',
        bg: 'bg-violet-500'
      },
      emerald: {
        from: 'from-emerald-500',
        to: 'to-teal-400',
        glow: 'shadow-emerald-500/50',
        bg: 'bg-emerald-500'
      }
    };
    const colors = colorMap[color] || colorMap.violet;

    return (
      <div className="flex items-center justify-center gap-[3px] h-20 px-4">
        {levels.map((level, i) => {
          // Normalize level to 0-1 range and calculate height
          const normalizedLevel = Math.max(0, Math.min(1, level));
          const minHeight = 8;
          const maxHeight = 64;
          const height = minHeight + normalizedLevel * (maxHeight - minHeight);
          
          return (
            <div
              key={i}
              className={`w-[6px] rounded-full bg-gradient-to-t ${colors.from} ${colors.to} transition-all duration-75 ease-out`}
              style={{
                height: `${height}px`,
                opacity: 0.6 + normalizedLevel * 0.4,
                boxShadow: isActive && normalizedLevel > 0.3 
                  ? `0 0 ${8 + normalizedLevel * 12}px ${color === 'violet' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`
                  : 'none'
              }}
            />
          );
        })}
      </div>
    );
  };

  // Set up audio analysis for playback
  useEffect(() => {
    if (!isPlaying || !audioRef.current) {
      // Cleanup and reset levels when not playing
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAudioLevels(Array(16).fill(0));
      return;
    }

    const setupAudioAnalysis = () => {
      try {
        // Create audio context if needed
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;
        
        // Resume context if suspended
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }

        // Only create source if not already connected
        if (!sourceRef.current) {
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.8;
          
          const source = audioContext.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          
          analyserRef.current = analyser;
          sourceRef.current = source;
        }

        // Animation loop for reading audio data
        const updateLevels = () => {
          if (!analyserRef.current || !isPlaying) return;

          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);

          // Sample 16 bars from the frequency data
          const barCount = 16;
          const step = Math.floor(dataArray.length / barCount);
          const newLevels = [];
          
          for (let i = 0; i < barCount; i++) {
            const value = dataArray[i * step] || 0;
            // Normalize to 0-1 with some amplification
            newLevels.push(Math.min(1, (value / 255) * 1.3));
          }
          
          setAudioLevels(newLevels);
          animationRef.current = requestAnimationFrame(updateLevels);
        };

        updateLevels();
      } catch (err) {
        console.warn('Audio analysis not available, using fallback:', err);
        // Fallback animation when Web Audio API fails
        const fallbackAnimation = () => {
          if (!isPlaying) return;
          
          const time = Date.now() / 1000;
          const newLevels = Array(16).fill(0).map((_, i) => {
            return 0.3 + 0.4 * Math.sin(time * 3 + i * 0.5) + Math.random() * 0.2;
          });
          
          setAudioLevels(newLevels);
          animationRef.current = requestAnimationFrame(fallbackAnimation);
        };
        fallbackAnimation();
      }
    };

    // Small delay to ensure audio element is ready
    const timer = setTimeout(setupAudioAnalysis, 100);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Recording visualization effect with real microphone audio
  useEffect(() => {
    if (!isRecording) {
      // Cleanup mic stream when not recording
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
        micStreamRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAudioLevels(Array(16).fill(0));
      return;
    }

    const setupMicAnalysis = async () => {
      try {
        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        // Create audio context if needed
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;
        
        // Resume context if suspended
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        // Create analyser for microphone
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.75;
        
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        // Don't connect to destination to avoid feedback
        
        micAnalyserRef.current = analyser;

        // Animation loop for reading microphone audio data
        const updateLevels = () => {
          if (!micAnalyserRef.current || !isRecording) return;

          const dataArray = new Uint8Array(micAnalyserRef.current.frequencyBinCount);
          micAnalyserRef.current.getByteFrequencyData(dataArray);

          // Sample 16 bars from the frequency data
          const barCount = 16;
          const step = Math.floor(dataArray.length / barCount);
          const newLevels = [];
          
          for (let i = 0; i < barCount; i++) {
            const value = dataArray[i * step] || 0;
            // Normalize to 0-1 with amplification for voice frequencies
            newLevels.push(Math.min(1, (value / 255) * 1.8));
          }
          
          setAudioLevels(newLevels);
          animationRef.current = requestAnimationFrame(updateLevels);
        };

        updateLevels();
      } catch (err) {
        console.warn('Microphone access not available, using fallback animation:', err);
        // Fallback animation when microphone access fails
        const fallbackAnimation = () => {
          if (!isRecording) return;
          
          const time = Date.now() / 1000;
          const newLevels = Array(16).fill(0).map((_, i) => {
            const base = 0.2 + 0.3 * Math.sin(time * 4 + i * 0.3);
            const variation = Math.random() * 0.4;
            return Math.min(1, base + variation);
          });
          
          setAudioLevels(newLevels);
          animationRef.current = requestAnimationFrame(fallbackAnimation);
        };
        fallbackAnimation();
      }
    };

    setupMicAnalysis();

    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
        micStreamRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  const handleDisclaimerConfirm = () => {
    setDisclaimerModal(false);
    navigate('/questionnaire');
  };

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
    <div className="flex flex-col items-center w-full h-full bg-gradient-to-b from-slate-900 via-purple-950/30 to-slate-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between w-full px-6 py-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white text-lg">✧</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg tracking-wide">Cosmic Wisdom</h1>
            <p className="text-emerald-400 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isLoggedIn && (
            <button
              onClick={() => setDisclaimerModal(true)}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              Sign Up
            </button>
          )}
          <LoginLogoutIcon />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col items-center justify-center px-6 relative z-10">
        
        {/* Conversation Avatars - Only show when logged in */}
        {isLoggedIn && (
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* AI Avatar */}
            <div className={`flex flex-col items-center transition-all duration-500 ${isPlaying ? 'scale-110' : 'scale-100 opacity-70'}`}>
              <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl ${isPlaying ? 'shadow-violet-500/50 ring-4 ring-violet-400/30' : 'shadow-violet-500/20'}`}>
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full bg-violet-400/20 animate-ping"></div>
                )}
                <span className="text-3xl">🌙</span>
              </div>
              <span className="mt-2 text-violet-300 text-sm font-medium">Cosmic AI</span>
              {isPlaying && <span className="text-violet-400 text-xs animate-pulse">Speaking...</span>}
            </div>

            {/* Connection indicator */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 rounded-full transition-all duration-300 ${
                      (isRecording || isPlaying) 
                        ? isRecording ? 'bg-emerald-400' : 'bg-violet-400'
                        : 'bg-gray-600'
                    }`}
                    style={{
                      height: (isRecording || isPlaying) ? `${8 + Math.sin(Date.now() / 200 + i) * 8}px` : '4px',
                      animation: (isRecording || isPlaying) ? `wave 0.5s ease-in-out ${i * 0.1}s infinite` : 'none'
                    }}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-xs">
                {isRecording ? 'Listening...' : isPlaying ? 'Speaking...' : isLoading ? 'Thinking...' : 'Voice Chat'}
              </span>
            </div>

            {/* User Avatar */}
            <div className={`flex flex-col items-center transition-all duration-500 ${isRecording ? 'scale-110' : 'scale-100 opacity-70'}`}>
              <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl ${isRecording ? 'shadow-emerald-500/50 ring-4 ring-emerald-400/30' : 'shadow-emerald-500/20'}`}>
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping"></div>
                )}
                {userName ? (
                  <span className="text-2xl font-bold text-white">{getInitials(userName)}</span>
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              <span className="mt-2 text-emerald-300 text-sm font-medium">{userName || 'You'}</span>
              {isRecording && <span className="text-emerald-400 text-xs animate-pulse">Speaking...</span>}
            </div>
          </div>
        )}

        {/* Status Card */}
        <div className="w-full max-w-md mb-8">
          {isLoading ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-pulse">
                  <span className="text-xl">🌙</span>
                </div>
                <span className="text-white/80 text-sm">Cosmic AI is thinking...</span>
                {/* Animated thinking dots */}
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-400 to-purple-400"
                      style={{
                        animation: 'thinkingBounce 1.4s ease-in-out infinite',
                        animationDelay: `${i * 0.16}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : isPlaying ? (
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-6 border border-violet-500/30 shadow-2xl shadow-violet-500/10">
              <div className="flex flex-col items-center gap-4">
                <AudioReactiveVisualizer 
                  levels={audioLevels} 
                  isActive={isPlaying} 
                  color="violet" 
                />
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-3 h-3 rounded-sm bg-red-400"></div>
                  Stop
                </button>
              </div>
            </div>
          ) : isRecording ? (
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
              <div className="flex flex-col items-center gap-4">
                <AudioReactiveVisualizer 
                  levels={audioLevels} 
                  isActive={isRecording} 
                  color="emerald" 
                />
                <p className="text-emerald-300 text-sm">Tap the mic when done speaking</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Main Mic Button */}
        <div className="relative">
          <button
            onClick={handleMicClick}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${
              isRecording 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/50 scale-110' 
                : 'bg-gradient-to-br from-slate-700 to-slate-800 shadow-xl hover:shadow-2xl hover:scale-105 hover:from-slate-600 hover:to-slate-700'
            }`}
          >
            {/* Pulsing rings when recording */}
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
                <div className="absolute inset-[-8px] rounded-full border-2 border-emerald-400/40 animate-pulse"></div>
                <div className="absolute inset-[-16px] rounded-full border border-emerald-400/20 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </>
            )}
            <MicIcon 
              sx={{ 
                fontSize: '2.5rem', 
                color: isRecording ? '#ffffff' : '#a1a1aa',
                transition: 'color 0.3s'
              }} 
            />
          </button>
          
          {/* Mic label */}
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm whitespace-nowrap">
            {isRecording ? 'Tap to send' : isLoggedIn ? 'Tap to speak' : 'Login to start'}
          </p>
        </div>
      </div>

      {/* Footer Message */}
      <div className="w-full py-6 px-6 text-center z-10">
        <p className="text-gray-500 text-sm">
          ✨ Share your thoughts and receive ancient Indian wisdom ✨
        </p>
      </div>

      {/* Keyframe animations */}
      <style>
        {`
          @keyframes wave {
            0%, 100% { transform: scaleY(0.5); }
            50% { transform: scaleY(1); }
          }
          @keyframes thinkingBounce {
            0%, 80%, 100% { 
              transform: scale(0.6);
              opacity: 0.5;
            }
            40% { 
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>

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
    </div>
  );
};

export default AiChat;