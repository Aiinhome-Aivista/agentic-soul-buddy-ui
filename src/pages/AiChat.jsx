import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MicIcon from "@mui/icons-material/Mic";
import { VoiceRecognizer } from "../common/helper/VoiceRecognizer";
import { Context } from "../common/helper/Context";
import { apiService } from "../service/apiService";
import { POST_url1, get_url1 } from "../connection/connection";
import TypingDots from "../components/TypingDots";
import CanvasVisualizerSim from "../components/CanvasVisualizerSim";
import LoginLogoutIcon from "../components/LoginLogoutIcon";
import LoginModal from "../common/modal/LoginModal";
// import SignupModal from '../common/modal/SignupMOdal';
import SignupModal2 from "../common/modal/signupafterquestions";
import WellBeingProfile from "../common/modal/WellBeingProfile";
import DisclaimerModal from "../common/modal/DisclaimerModal";
import AccountModal from "../common/modal/AccountModal";
import { useMicVolume } from "../common/hooks/useMicVolume";
import { BackgroundAudioContext } from "../common/helper/BackgroundAudioProvider";

const AiChat = () => {
  const navigate = useNavigate();
  const {
    recognizedText,
    isLoggedIn,
    loginModal,
    setLoginModal,
    signupModal,
    setSignupModal,
    signupModal2,
    setSignupModal2,
    audioUrl,
    setAudioUrl,
    isLoading,
    setIsLoading,
    accountModal,
    setAccountModal,
  } = useContext(Context);
  const audioRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [disclaimerModal, setDisclaimerModal] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [dailyMinutesLeft, setDailyMinutesLeft] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(
    localStorage.getItem("currentPlan") || "",
  );
  const [plans, setPlans] = useState([]);
  const [showLimitReachedModal, setShowLimitReachedModal] = useState(false);
  const [isPlanHovered, setIsPlanHovered] = useState(false);

  // Use the new hook
  const volume = useMicVolume(isRecording);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiService({
          url: get_url1.subscription_plan,
          method: "GET",
        });
        if (response && response.status === "success" && response.data) {
          setPlans(response.data);
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const handleDisclaimerConfirm = () => {
    setDisclaimerModal(false);
    navigate("/questionnaire");
  };
  const [name, setName] = useState(localStorage.getItem("name") || "");
  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId"));
      setSessionId(localStorage.getItem("sessionId"));
      const storedName = localStorage.getItem("name");
      console.log("Retrieved userName from storage:", storedName);
      setName(storedName);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsRecording(false);
    }
  }, [isLoggedIn]);

  const checkSubscriptionStatus = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await apiService({
          url: `${get_url1.subscription_status}?user_id=${userId}`,
          method: "GET",
        });
        if (response && !response.error) {
          setSubscriptionActive(response.active);
          setDailyMinutesLeft(response.daily_minutes_left);

          if (response.plan) {
            localStorage.setItem("currentPlan", response.plan);
            setCurrentPlan(response.plan);
          }

          const canUseVoice =
            response.active &&
            (response.daily_minutes_left === "unlimited" ||
              response.daily_minutes_left > 0);

          return canUseVoice;
        } else {
          setSubscriptionActive(false);
          setDailyMinutesLeft(0);
          return false;
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
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
    const hasGreeted = sessionStorage.getItem("hasGreeted");
    if (isLoggedIn && !hasGreeted) {
      handleVoiceQuery("");
      sessionStorage.setItem("hasGreeted", "true");
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
      user_id: localStorage.getItem("userId"),
      // "session_id": localStorage.getItem('sessionId'),
      text: textValue,
    };
    try {
      console.log(payload);
      const response = await apiService({
        url: POST_url1.ask,
        method: "POST",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check subscription status after each ask API call
      const isActive = await checkSubscriptionStatus();
      setIsLoading(false);
      if (!isActive) {
        setShowLimitReachedModal(true);
        return;
      }

      if (response && !response.error) {
        console.log(response);
        setAudioUrl(response.audio_url);
      } else {
        console.error("Submission failed:", response?.message);
        console.log(
          `Submission failed: ${response?.message || "An error occurred."}`,
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("An error occurred during submission:", error);
      console.log("An error occurred. Please try again later.");
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
    } else {
      setLoginModal(true);
    }
  };

  const handleUpgradePlan = () => {
    setShowLimitReachedModal(false);
    // Navigate to subscription page for upgrade
    navigate("/subscription");
  };

  /* New context usage for background audio */
  const {
    playing: bgPlaying,
    play: bgPlay,
    pause: bgPause,
  } = useContext(BackgroundAudioContext);

  const toggleBackgroundAudio = () => {
    if (bgPlaying) {
      bgPause();
    } else {
      bgPlay();
    }
  };

  return (
    <div className="flex flex-col items-center w-[100%] h-[100%]">
      <div className={`flex items-start justify-between gap-[1%] w-[100%] `}>
        {/* Background Audio Toggle */}
        {/* Background Audio Toggle Switch */}
        <div
          onClick={toggleBackgroundAudio}
          className="h-[2.5rem] px-3 pr-2 rounded-[1rem] border-2 border-[#333333] bg-[#474747]/22 cursor-pointer flex items-center gap-3 hover:bg-[#474747]/40 transition-colors"
        >
          <span className="text-[0.75rem] font-medium text-[#7D7E7F]">
            Background Music
          </span>

          {/* Switch Track */}
          <div
            className={`relative w-8 h-4 rounded-full transition-colors duration-300 ${bgPlaying ? "bg-green-500/20" : "bg-red-500/20"}`}
          >
            {/* Switch Dot */}
            <div
              className={`absolute top-0.5 w-3 h-3 rounded-full shadow-sm transform transition-all duration-300 ${bgPlaying ? "translate-x-4 bg-green-500" : "translate-x-0.5 bg-red-500"}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn &&
            currentPlan &&
            (() => {
              // Find the plan details from the fetched plans
              // Find the plan details from the fetched plans
              // Use strict matching to distinguish between "Silver" and "Silver Pro", etc.
              const details = plans.find(
                (p) =>
                  p.planName?.toLowerCase() === currentPlan.toLowerCase() ||
                  p.title?.toLowerCase() === currentPlan.toLowerCase(),
              );

              const isGold = details?.title?.toLowerCase().includes("gold");
              const isSilver = details?.title?.toLowerCase().includes("silver");

              const badgeStyle = isGold
                ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                : isSilver
                  ? "border-gray-300/50 bg-gray-300/10 text-gray-200 shadow-[0_0_10px_rgba(209,213,219,0.2)]"
                  : "border-[#333333] bg-[#474747]/22 text-[#7D7E7F]";

              return (
                <div
                  className={`relative h-[2.5rem] px-3 rounded-[1rem] border-2 flex items-center gap-1 cursor-pointer transition-all duration-300 ${badgeStyle}`}
                  onMouseEnter={() => setIsPlanHovered(true)}
                  onMouseLeave={() => setIsPlanHovered(false)}
                >
                  {/* <span className="text-[#D9D9D9]">✨</span> */}
                  <span className="font-medium text-[0.75rem]">
                    {currentPlan}
                  </span>

                  {isPlanHovered && (
                    <div className="absolute top-full right-0 mt-2 w-48 p-3 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-xl backdrop-blur-md z-50 text-left">
                      {(() => {
                        if (!details) return null;
                        return (
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-1">
                              <span className="text-white font-semibold text-sm">
                                {details.planName}
                              </span>
                              {/* {details.discount !== "0%" && <span className="text-[0.65rem] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">{details.discount} OFF</span>} */}
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Price</span>
                                <span className="text-white font-medium">
                                  ${details.finalPrice}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Usage</span>
                                <span className="text-white font-medium">
                                  {details.usage}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Validity</span>
                                <span className="text-white font-medium">
                                  {details.validityDays} Days
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })()}
          {!isLoggedIn && (
            <button
              onClick={() => navigate("/questionnaire")}
              className="h-[2.5rem] px-3 rounded-[1rem] border-2 border-[#333333] bg-[#474747]/22 text-[0.75rem] font-medium text-[#7D7E7F] hover:bg-[#474747]/40 transition-colors cursor-pointer"
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
      </div>

      <div className="flex flex-col items-center gap-[3%] h-[40%]">
        <p className="text-4xl font-bold text-white pt-[12%]  cursor-default">
          Soul Junction
        </p>
        <p className="text-white text-xl font-light  cursor-default">
          "Grow With Ancient Indian Guidance..."
        </p>
      </div>
      <div className="flex flex-col items-center h-[45%] pt-[2%]">
        {isRecording ? (
          <div className="relative pb-[1%] flex items-center justify-center">
            {/* Outer pulsing ring with dynamic volume scale */}
            <div
              className="absolute w-20 h-20 rounded-full bg-[#e57373]/40"
              style={{
                transform: `scale(${1 + volume * 0.8})`,
                transition: "transform 0.1s ease-out",
              }}
            />
            {/* Main red circular button */}
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: "#e54b4b",
                boxShadow: "0 4px 15px rgba(229, 75, 75, 0.4)",
              }}
              onClick={handleMicClick}
            >
              <MicIcon
                sx={{
                  fontSize: "2rem",
                  color: "#FFFFFF",
                }}
              />
            </div>
          </div>
        ) : isLoading ? (
          <TypingDots />
        ) : isPlaying ? (
          <div className="pb-[1%]">
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
          <div className="relative pb-[1%] flex flex-col items-center justify-center">
            <MicIcon
              sx={{
                fontSize: "2.5rem",
                color: "#D9D9D9",
                transition: "color 0.2s, font-size 0.2s",
                "&:hover": {
                  color: "#fdfdfdff",
                  fontSize: "2.6rem",
                },
              }}
              onClick={handleMicClick}
              className="cursor-pointer"
            />
            <p className="text-sm text-white/50 mt-4 cursor-default font-light tracking-wide">
              Click to speak
            </p>
          </div>
        )}
        {isPlaying ? (
          <div className="pb-[40%] font-light text-xs text-white">
            <div></div>
            <div className="flex items-center rounded-3xl bg-[#474747]/22 border-2 border-gray-500 p-1 cursor-pointer">
              <div
                className="rounded-full h-[1rem] w-[1rem] bg-[#D9D9D9]/54"
                onClick={handleStop}
              ></div>
              <p className="flex items-center justify-center text-sm text-[#7D7E7F] px-1">
                Stop
              </p>
            </div>
          </div>
        ) : (
          <div className="pb-[40%] font-light text-xs text-white"></div>
        )}
      </div>
      <p className="text-large text-[#D9D9D9] text-center font-light pb-[5%] cursor-default">
        Unlock your potential and embrace the path to a new you
      </p>
      <VoiceRecognizer
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />

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
      {showProfile && (
        <WellBeingProfile onClose={() => setShowProfile(false)} />
      )}
      {disclaimerModal && (
        <DisclaimerModal
          OnClose={() => setDisclaimerModal(false)}
          onConfirm={handleDisclaimerConfirm}
        />
      )}
      {accountModal && <AccountModal OnClose={() => setAccountModal(false)} />}

      {/* Limit Reached Modal */}
      {showLimitReachedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-[90%] text-center animate-slideUp">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Plan Limit Reached
            </h3>
            <p className="text-white/60 text-sm mb-6">
              You have reached your daily usage limit. Upgrade your plan to
              continue your journey.
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
    </div>
  );
};

export default AiChat;
