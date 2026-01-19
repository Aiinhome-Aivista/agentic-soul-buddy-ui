import React, { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function OtpVerificationModal({
  email,
  onClose,
  onVerifySuccess,
  onResendOtp,
  toast,
}) {
  const [otpValue, setOtpValue] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length !== 6) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter the complete 6-digit OTP.",
        life: 3000,
      });
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await onVerifySuccess(otpValue);
      if (response?.success) {
        // Close modal on success
        onClose();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setResendingOtp(true);
    try {
      await onResendOtp();
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setResendingOtp(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && otpValue && otpValue.length === 6) {
      handleVerifyOtp();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-none z-5">
      <div className="glass-card flex flex-col items-center justify-start w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] relative animate-slideUp rounded-2xl p-6">
        {/* Close Button */}
        <div className="flex items-start justify-end w-full">
          <CloseRoundedIcon
            onClick={onClose}
            className="cursor-pointer hover:scale-110 transition-transform"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              fontSize: "1.5rem",
              padding: "4px",
              color: "white",
            }}
          />
        </div>

        {/* Modal Content */}
        <div className="w-full flex flex-col items-center gap-4 mt-2">
          <h2 className="text-xl font-bold text-[#D9D9D9] cursor-default">
            Verify Your Email
          </h2>

          <p className="text-sm text-[#D9D9D9]/70 text-center px-4">
            We've sent a verification code to
            <br />
            <span className="font-medium text-[#D9D9D9]">{email}</span>
          </p>

          {/* OTP Input */}
          <div className="w-full px-6">
            <input
              id="otp"
              name="otp"
              type="text"
              value={otpValue}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                if (value.length <= 6) {
                  setOtpValue(value);
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              autoFocus
              className="bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 focus:text-white rounded-xl w-full px-4 py-3 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 transition-all text-center text-lg tracking-widest"
            />
          </div>

          {/* Buttons */}
          <div className="w-full px-6 flex justify-center gap-3">
            {/* Confirm OTP Button */}
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={verifyingOtp || !otpValue || otpValue.length !== 6}
              className="w-full flex-1 py-3 rounded-xl bg-[#D9D9D9]/25 text-[#D9D9D9]/80 border-2 border-[#D9D9D9]/25 font-bold cursor-pointer transition hover:bg-[#D9D9D9]/30 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyingOtp ? "Verifying..." : "Confirm OTP"}
            </button>

            {/* Resend OTP Button */}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendingOtp}
              className="w-full flex-1 py-2 rounded-xl bg-transparent text-[#D9D9D9]/60 border-2 border-[#D9D9D9]/15 font-medium text-sm cursor-pointer transition hover:bg-[#D9D9D9]/10 hover:text-[#D9D9D9]/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendingOtp ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
