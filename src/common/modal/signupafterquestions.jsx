import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/modal.css";
import { Context } from "../helper/Context";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import WarningRoundedIcon from "@mui/icons-material/WarningRounded"; // Unused
import { useFormik, setNestedObjectValues } from "formik";
import * as Yup from "yup";
import { apiService } from "../../service/apiService";
import { POST_url1 } from "../../connection/connection";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

export default function SignupModal2({ OnClose, onSuccess, answers }) {
  const { tempUserName, tempUserId, setIsLoggedIn, setAudioUrl, setIsLoading } =
    useContext(Context);
  const navigate = useNavigate();

  const toast = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  // Email verification states
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Single-error banner visibility + auto-hide timer - REMOVED for Toast
  // const [bannerVisible, setBannerVisible] = useState(false);
  // const hideTimerRef = useRef(null);

  const Genders = [
    { gender: "Male" },
    { gender: "Female" },
    { gender: "Other" },
    { gender: "Prefer Not to Say" },
  ];

  const Health_Status = [
    { health: "Excellent" },
    { health: "Good" },
    { health: "Fair" },
    { health: "Poor" },
  ];

  const Relationship_Status = [
    { relationship: "Single" },
    { relationship: "In a relationship" },
    { relationship: "Married" },
    { relationship: "Divorced" },
    { relationship: "It's Complicated" },
  ];

  // Send OTP function
  const handleSendOtp = async () => {
    const email = formik.values.email;
    if (!email) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter your email address first.',
        life: 3000
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a valid email address.',
        life: 3000
      });
      return;
    }

    setSendingOtp(true);
    try {
      const response = await apiService({
        url: POST_url1.send_otp,
        method: "POST",
        data: { email },
      });

      if (response && response.success) {
        setOtpSent(true);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'OTP sent to your email.',
          life: 3000
        });
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response?.message || 'Failed to send OTP. Please try again.',
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send OTP. Please try again.',
        life: 3000
      });
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP function
  const handleVerifyOtp = async () => {
    const email = formik.values.email;
    if (!otpValue) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter the OTP.',
        life: 3000
      });
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await apiService({
        url: POST_url1.verify_otp,
        method: "POST",
        data: { email, otp: otpValue },
      });

      if (response && response.success) {
        setEmailVerified(true);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Email verified successfully!',
          life: 3000
        });
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: response?.message || 'Invalid OTP. Please try again.',
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to verify OTP. Please try again.',
        life: 3000
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const validationSchema = Yup.object({
    full_name: Yup.string().required("Full name is required."),
    email: Yup.string().email("Invalid email").required("Email is required."),
    password: Yup.string().required("Password is required."),
    age: Yup.number()
      .min(18, "Age must be at least 18 years.")
      .max(120, "Invalid age!")
      .required("Age is required!"),
    gender: Yup.string().required("Gender is required."),
    work: Yup.string().required("Profession is required."),
    health: Yup.string().required("Health status is required."),
    emotional_state: Yup.string().nullable(),
    relationship: Yup.string().required("Relationship status is required."),
  });

  const formik = useFormik({
    initialValues: {
      full_name: sessionStorage.getItem("signupName") || "",
      email: sessionStorage.getItem("signupEmail") || "",
      password: "",
      age: "",
      gender: "",
      work: "",
      health: "",
      emotional_state: "",
      relationship: "",
      user_id: sessionStorage.getItem("firebaseUid") || tempUserId, // Send Firebase UID to backend
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Formatting payload as per user JSON requirement
        // { "full_name":..., "email":..., "age":..., "gender":..., "work":..., "health":..., "emotional_state":..., "relationship":... }
        const response = await apiService({
          url: POST_url1.signup, // Verify if this endpoint accepts this payload structure
          method: "POST",
          data: values,
        });

        if (response && !response.error && response !== null) {
          setIsLoggedIn(true);
          // Store backend's user_id (not Firebase UID)
          localStorage.setItem("userId", response.user_id);
          localStorage.setItem("sessionId", response.session_id);
          const nameToStore = response.full_name || values.full_name;
          console.log("Setting name for fresh signup:", nameToStore);
          localStorage.setItem("name", nameToStore);
          // Store email for subscription
          localStorage.setItem("email", values.email);
          // Clean up temporary Firebase UID from sessionStorage
          sessionStorage.removeItem("firebaseUid");
          sessionStorage.removeItem("signupName");
          sessionStorage.removeItem("signupEmail");

          // Submit Questionnaire Responses
          if (answers) {
            try {
              const formattedResponses = Object.keys(answers).map((questionId) => {
                const val = answers[questionId];
                return {
                  question_id: Number(questionId),
                  answer_value: Array.isArray(val) ? val.join(", ") : val
                };
              });

              const responsePayload = {
                user_id: response.user_id,
                responses: formattedResponses
              };

              console.log("Submitting responses payload:", responsePayload);

              await apiService({
                url: POST_url1.submit_response,
                method: 'POST',
                data: responsePayload
              });

            } catch (resErr) {
              console.error("Error submitting responses:", resErr);
            }
          }

          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            setAudioUrl(response.Data?.audio_url);
          }, 3000);

          // Call onSuccess callback to show wellbeing profile modal
          if (onSuccess) {
            onSuccess();
          } else {
            // Fallback: Navigate to subscription page directly
            navigate('/subscription', { state: { isNewSignup: true } });
          }
        } else {
          console.error("Submission failed:", response?.message);
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: response?.message || 'Signup failed. Please try again.',
            life: 3000
          });
        }
      } catch (error) {
        console.error("An error occurred during submission:", error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'An unexpected error occurred. Please try again.',
          life: 3000
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Helper: pick exactly one error by priority
  const pickFirstError = (errorsObj) => {
    const priority = [
      "full_name",
      "email",
      'password',
      "age",
      "gender",
      "work",
      "health",
      "relationship",
      "emotional_state",
    ];

    for (const key of priority) {
      if (errorsObj[key]) return errorsObj[key];
    }
    return Object.values(errorsObj)[0] || null;
  };

  const firstError = useMemo(
    () => pickFirstError(formik.errors),
    [formik.errors]
  );

  const anyTouched = Object.keys(formik.touched).length > 0;
  const shouldShow =
    Boolean(firstError) && (formik.submitCount > 0 || anyTouched);

  useEffect(() => {
    if (shouldShow && firstError) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: firstError,
        life: 3000
      });
    }
  }, [shouldShow, firstError]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if email is verified
    if (!emailVerified) {
      toast.current.show({
        severity: 'error',
        summary: 'Email Not Verified',
        detail: 'Please verify your email address before signing up.',
        life: 3000
      });
      return;
    }

    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      formik.handleSubmit(e);
    } else {
      formik.setTouched(setNestedObjectValues(errors, true));
      // Toast execution handled by useEffect watching shouldShow/firstError
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-[2%] bg-black/10 backdrop-blur-sm animate-fadeIn z-5 ">
      <Toast ref={toast} position="top-right" className="custom-toast-message" />
      <div className="glass-card flex flex-col items-center justify-start w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] relative animate-slideUp rounded-2xl p-6 my-4 max-h-[90vh] ">
        {/* <div className="flex items-start justify-end w-full pt-2 mr-2">
                    <CloseRoundedIcon
                        onClick={OnClose}
                        className="cursor-pointer modalCloseIcon hover:scale-110 transition-transform"
                        sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: '50%', fontSize: '1.2rem', padding: '2px', color: 'white' }}
                    />
                </div> */}

        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col items-center pb-4 h-full overflow-y-auto "
        >
          <h2 className="text-xl font-bold text-[#D9D9D9] mb-4 cursor-default">
            Complete Your Profile
          </h2>

          <div className="flex flex-col items-center justify-center gap-3 w-full px-[8%]">
            {/* Full Name */}
            <input
              id="full_name"
              name="full_name"
              type="text"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.full_name}
              placeholder="Full Name"
              readOnly={!!sessionStorage.getItem("signupName")}
              className={`bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 focus:text-white rounded-xl w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 transition-all ${sessionStorage.getItem("signupName") ? "opacity-50 cursor-not-allowed" : ""
                }`}
            />

            {/* Email with Verify Button */}
            <div className="flex gap-2 w-full">
              <input
                id="email"
                name="email"
                type="email"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                  // Reset verification if email changes
                  if (emailVerified || otpSent) {
                    setEmailVerified(false);
                    setOtpSent(false);
                    setOtpValue("");
                  }
                }}
                value={formik.values.email}
                placeholder="Email Address"
                readOnly={!!sessionStorage.getItem("signupEmail") || emailVerified}
                className={`bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 focus:text-white rounded-xl flex-1 px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 transition-all ${(sessionStorage.getItem("signupEmail") || emailVerified) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              />
              {!emailVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !formik.values.email}
                  className="px-4 py-2 rounded-xl bg-[#D9D9D9]/25 text-[#D9D9D9]/80 border-2 border-[#D9D9D9]/25 font-medium text-sm cursor-pointer transition hover:bg-[#D9D9D9]/30 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {sendingOtp ? "Sending" : otpSent ? "Resend" : "Verify"}
                </button>
              )}
              {emailVerified && (
                <div className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 border-2 border-green-500/25 font-medium text-sm flex items-center">
                  ✓ Verified
                </div>
              )}
            </div>

            {/* OTP Input Field - shown after OTP is sent */}
            {otpSent && !emailVerified && (
              <div className="flex gap-2 w-full">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 focus:text-white rounded-xl flex-1 px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 transition-all"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || !otpValue}
                  className="px-4 py-2 rounded-xl bg-[#D9D9D9]/25 text-[#D9D9D9]/80 border-2 border-[#D9D9D9]/25 font-medium text-sm cursor-pointer transition hover:bg-[#D9D9D9]/30 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {verifyingOtp ? "Verifying..." : "Confirm OTP"}
                </button>
              </div>
            )}

            {/* Password */}
            {/* Password */}
            <div className="relative w-full">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Password"
                className="bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 focus:text-white rounded-xl w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D9D9D9]/70 hover:text-white transition-colors cursor-pointer flex items-center justify-center p-1"
              >
                {showPassword ? <VisibilityOff sx={{ fontSize: '1.2rem' }} /> : <Visibility sx={{ fontSize: '1.2rem' }} />}
              </button>
            </div>

            {/* Age */}
            <input
              id="age"
              name="age"
              type="number"
              onBlur={formik.handleBlur}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || Number(value) >= 0) {
                  formik.setFieldValue("age", value);
                }
              }}
              value={formik.values.age}
              placeholder="Age"
              className="bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 focus:text-white rounded-xl w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 transition-all no-spinner"
              min={0}
            />

            {/* Gender Dropdown */}
            <Dropdown
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={(e) => formik.setFieldValue("gender", e.value)}
              onBlur={() => formik.setFieldTouched("gender", true)}
              options={Genders}
              optionLabel="gender"
              optionValue="gender"
              placeholder="Gender"
              className="w-full"
            />

            {/* Profession */}
            <input
              id="work"
              name="work"
              type="text"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.work}
              placeholder="Profession"
              className="bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 focus:text-white rounded-xl w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 transition-all"
            />

            {/* Health Dropdown */}
            <Dropdown
              id="health"
              name="health"
              value={formik.values.health}
              onChange={(e) => formik.setFieldValue("health", e.value)}
              onBlur={() => formik.setFieldTouched("health", true)}
              options={Health_Status}
              optionLabel="health"
              optionValue="health"
              placeholder="Health Status"
              className="w-full"
            />

            {/* Relationship Dropdown */}
            <Dropdown
              id="relationship"
              name="relationship"
              value={formik.values.relationship}
              onChange={(e) => formik.setFieldValue("relationship", e.value)}
              onBlur={() => formik.setFieldTouched("relationship", true)}
              options={Relationship_Status}
              optionLabel="relationship"
              optionValue="relationship"
              placeholder="Relationship Status"
              className="w-full"
            />

            {/* Emotional State */}
            <input
              id="emotional_state"
              name="emotional_state"
              type="text"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="How are you feeling? (Optional)"
              value={formik.values.emotional_state}
              className="bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 focus:text-white rounded-xl w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 transition-all"
            />

            <div className="pt-4 w-full">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                onClick={handleFormSubmit}
                className="w-full py-2 rounded-xl bg-[#D9D9D9]/25 text-[#D9D9D9]/80 border-2 border-[#D9D9D9]/25 font-bold tracking-wide cursor-pointer shadow-lg transition hover:bg-[#D9D9D9]/30 hover:text-white"
              >
                {formik.isSubmitting ? "Submitting..." : "Sign Up"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Banner - Removed, using Toast instead */}
    </div>
  );
}
