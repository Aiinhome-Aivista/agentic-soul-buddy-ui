import React, { useEffect, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import BoltIcon from "@mui/icons-material/Bolt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";
import PersonIcon from "../../assets/icons/Untitled design.svg";
import { apiService } from "../../service/apiService";
import { POST_url1 } from "../../connection/connection";
import { Stepper, Step, StepLabel } from "@mui/material";

export default function WellBeingProfile({ onClose, onContinue }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Analyzing Responses",
    "Calculating Metrics",
    "Generating Profile",
  ];

  useEffect(() => {
    // Stepper animation
    if (loading) {
      const interval = setInterval(() => {
        setActiveStep((prev) => {
          return prev < steps.length - 1 ? prev + 1 : prev;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const payload = {
          user_id: userId,
        };

        const response = await apiService({
          url: POST_url1.wellbeing,
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (
          response &&
          (response.status === "success" || response.statusCode === 200)
        ) {
          // Ensure the stepper finishes visually before showing data (optional polish)
          setActiveStep(steps.length);
          setTimeout(() => {
            setProfileData(response.data);
            setLoading(false);
          }, 500);
        } else {
          console.error("Failed to load profile:", response);
          setLoading(false); // meaningful error handling would be better
        }
      } catch (error) {
        console.error("Error fetching wellbeing profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getLevelStyles = (level) => {
    const lvl = level ? level.toLowerCase() : "low";
    switch (lvl) {
      case "high":
        return {
          badgeBg: "bg-red-400/20",
          badgeText: "text-red-300",
          gaugePos: "90%",
          alertBg: "bg-red-400/10",
          alertBorder: "border-red-400/20",
          alertIconBg: "bg-red-400",
          alertTextHead: "text-red-200",
          alertTextBody: "text-red-100/80",
        };
      case "medium":
        return {
          badgeBg: "bg-orange-400/20",
          badgeText: "text-orange-300",
          gaugePos: "60%",
          alertBg: "bg-orange-400/10",
          alertBorder: "border-orange-400/20",
          alertIconBg: "bg-orange-400",
          alertTextHead: "text-orange-200",
          alertTextBody: "text-orange-100/80",
        };
      case "normal":
        return {
          badgeBg: "bg-blue-400/20",
          badgeText: "text-blue-300",
          gaugePos: "35%",
          alertBg: "bg-blue-400/10",
          alertBorder: "border-blue-400/20",
          alertIconBg: "bg-blue-400",
          alertTextHead: "text-blue-200",
          alertTextBody: "text-blue-100/80",
        };
      default: // Low
        return {
          badgeBg: "bg-green-400/20",
          badgeText: "text-green-300",
          gaugePos: "10%",
          alertBg: "bg-green-400/10",
          alertBorder: "border-green-400/20",
          alertIconBg: "bg-green-400",
          alertTextHead: "text-green-200",
          alertTextBody: "text-green-100/80",
        };
    }
  };

  const styles = getLevelStyles(profileData?.negative_effects_level);

  return (
    <div className="fixed inset-0 flex  flex-col items-center justify-center gap-[2%] bg-white/10 dark:bg-black/10 backdrop-blur-sm animate-fadeIn z-50">
      <div
        className={`glass-card flex flex-col items-center ${
          loading ? "max-w-md h-[30%] justify-center" : "max-w-md justify-start"
        } relative overflow-y-auto rounded-3xl p-6 max-h-[90vh] transition-all duration-500 custom-scrollbar`}
      >
        <div className="h-full overflow-y-auto custom-scrollbar">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .custom-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {loading ? (
            <div className="flex flex-col items-center justify-center max-w-md h-full gap-6">
              <h2 className="text-xl font-bold text-text-main dark:text-white text-center animate-pulse transition-colors">
                Generating your profile...
              </h2>
              <div className="max-w-md">
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel
                        sx={{
                          "& .MuiStepLabel-label": {
                            color: "rgba(255,255,255,0.7) !important",
                          },
                          "& .MuiStepLabel-label.Mui-active": {
                            color: "#ffffff !important",
                            fontWeight: "bold",
                          },
                          "& .MuiStepLabel-label.Mui-completed": {
                            color: "#ffffff !important",
                          },
                          "& .MuiStepIcon-root": {
                            color: "rgba(255,255,255,0.3)",
                          },
                          "& .MuiStepIcon-root.Mui-active": {
                            color: "#D9D9D9",
                          },
                          "& .MuiStepIcon-root.Mui-completed": {
                            color: "#D9D9D9",
                          },
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </div>
          ) : !profileData ? (
            <div className="flex flex-col items-center justify-center h-40">
              <div className="text-text-main dark:text-white mb-4 transition-colors">No profile data available.</div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary/20 dark:bg-white/10 rounded-full text-text-main dark:text-white hover:bg-primary/30 dark:hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="max-w-md flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-text-main dark:text-white text-center max-w-md transition-colors">
                  Summary of your Well-being Profile
                </h2>
                {/* <button onClick={onClose} className="absolute right-4 top-4 hover:bg-white/10 rounded-full p-1 transition">
                                <CloseRoundedIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                            </button> */}
              </div>

              {/* Main Gauge Card */}
              <div className="rounded-2xl p-4 max-w-md mb-4 shadow-sm relative bg-primary/5 dark:bg-white/5 border border-border-light dark:border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-text-main dark:text-white transition-colors">
                    Negative effects level
                  </span>
                  <span
                    className={`${styles.badgeBg} ${styles.badgeText} px-2 py-0.5 rounded text-sm font-semibold`}
                  >
                    {profileData.negative_effects_level}
                  </span>
                </div>

                {/* Person Image Placeholder */}
                {/* <div className="flex justify-center mb-4 relative">
                                <div className="w-40 h-50 rounded-lg overflow-hidden relative flex items-center justify-center">
                                    <img
                                        src={PersonIcon}
                                        alt="Person"
                                        className="max-w-md h-full object-contain"
                                    />
                                </div>
                            </div> */}

                {/* Gauge Slider */}
                <div className="relative pt-6 pb-2 px-2">
                  {/* Tooltip for 'Your level' */}
                  <div
                    className="absolute top-0 flex flex-col items-center"
                    style={{
                      left: styles.gaugePos,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="bg-white text-black text-xs px-2 py-1 rounded mb-1 whitespace-nowrap">
                      Your level
                    </div>
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-white"></div>
                  </div>
                  <br />
                  <div className="h-2 max-w-md rounded-full bg-gradient-to-r from-blue-200 via-green-200 to-red-400 relative">
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 ${styles.alertIconBg.replace(
                        "bg-",
                        "border-"
                      )} rounded-full shadow`}
                      style={{ left: styles.gaugePos }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-text-muted dark:text-white/50 mt-1 font-medium transition-colors">
                    <span>Low</span>
                    <span>Normal</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Alert Box */}
                <div
                  className={`${styles.alertBg} ${styles.alertBorder} border rounded-xl p-3 mt-4 flex gap-3 items-start`}
                >
                  <div
                    className={`${styles.alertIconBg} rounded-full p-1 text-white flex items-center justify-center`}
                  >
                    <WarningRoundedIcon sx={{ fontSize: "1rem" }} />
                  </div>
                  <div>
                    <div
                      className={`font-bold ${styles.alertTextHead} text-sm`}
                    >
                      {profileData.negative_effects_level} level
                    </div>
                    <p
                      className={`${styles.alertTextBody} text-xs mt-1 leading-snug`}
                    >
                      {profileData.explanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 w-full mb-6">
                {/* Card 1 */}
                <div className="bg-primary/5 dark:bg-white/5 border col-span-2 border-border-light dark:border-white/10 rounded-xl p-3 flex gap-3 items-center shadow-sm">
                  <div className="bg-primary/10 dark:bg-white/10 p-2 rounded-lg text-primary-dark dark:text-white">
                    <CrisisAlertIcon />
                  </div>
                  <div>
                    <div className="text-xs text-text-muted dark:text-white/60 transition-colors">Main difficulty</div>
                    <div className="font-bold text-text-main dark:text-white text-sm transition-colors">
                      {profileData.main_difficulty}
                    </div>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="bg-primary/5 dark:bg-white/5 border col-span-2 border-border-light dark:border-white/10 rounded-xl p-3 flex gap-3 items-center shadow-sm">
                  <div className="bg-primary/10 dark:bg-white/10 p-2 rounded-lg text-primary-dark dark:text-white">
                    <BoltIcon />
                  </div>
                  <div>
                    <div className="text-xs text-text-muted dark:text-white/60 transition-colors">Trigger</div>
                    <div
                      className="font-bold text-text-main dark:text-white text-sm transition-colors"
                      title={profileData.trigger}
                    >
                      {profileData.trigger}
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-primary/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-xl p-3 flex gap-3 items-center shadow-sm">
                  <div className="bg-primary/10 dark:bg-white/10 p-2 rounded-lg text-primary-dark dark:text-white">
                    <CalendarMonthIcon />
                  </div>
                  <div>
                    <div className="text-xs text-text-muted dark:text-white/60 transition-colors">
                      Challenging period
                    </div>
                    <div className="font-bold text-text-main dark:text-white text-sm transition-colors">
                      {profileData.challenging_period}
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-primary/5 dark:bg-white/5 border border-border-light dark:border-white/10 rounded-xl p-3 flex gap-3 items-center shadow-sm">
                  <div className="bg-primary/10 dark:bg-white/10 p-2 rounded-lg text-primary-dark dark:text-white">
                    <BatteryAlertIcon />
                  </div>
                  <div>
                    <div className="text-xs text-text-muted dark:text-white/60 transition-colors">Energy level</div>
                    <div className="font-bold text-text-main dark:text-white text-sm transition-colors">
                      {profileData.energy_level}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Button */}
              <button
                onClick={onContinue || onClose}
                className="w-full cursor-pointer py-3 rounded-full bg-primary-dark dark:bg-[#D9D9D9] text-white dark:text-black/95 font-bold text-lg hover:bg-primary-deep dark:hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-colors"
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
