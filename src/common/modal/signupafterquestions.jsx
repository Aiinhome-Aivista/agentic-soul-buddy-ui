import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/modal.css";
import { Context } from "../helper/Context";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useFormik, setNestedObjectValues } from "formik";
import * as Yup from "yup";
import { apiService } from "../../service/apiService";
import { POST_url1 } from "../../connection/connection";
import { Dropdown } from "primereact/dropdown";

export default function SignupModal2({ OnClose, onSuccess, answers }) {
  const { tempUserName, tempUserId, setIsLoggedIn, setAudioUrl, setIsLoading } =
    useContext(Context);

  // Single-error banner visibility + auto-hide timer
  const [bannerVisible, setBannerVisible] = useState(false);
  const hideTimerRef = useRef(null);

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

  const validationSchema = Yup.object({
    full_name: Yup.string().required("Full name is required."),
    email: Yup.string().email("Invalid email").required("Email is required."),
    // password: Yup.string().required("Password is required."),
    age: Yup.number()
      .min(18, "Age must be at least 18 years.")
      .max(120, "Invalid age!")
      .required("Age is required!"),
    gender: Yup.string().required("Gender is required."),
    work: Yup.string()
      .min(3, "Please enter a valid profession.")
      .matches(/(.*[a-zA-Z]){2,}/, "Please enter a valid profession.")
      .required("Profession is required."),
    health: Yup.string().required("Health status is required."),
    emotional_state: Yup.string().nullable(),
    relationship: Yup.string().required("Relationship status is required."),
  });

  const formik = useFormik({
    initialValues: {
      full_name: sessionStorage.getItem("signupName") || "",
      email: sessionStorage.getItem("signupEmail") || "",
      // password: "",
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

          // Call onSuccess callback to show subscription modal
          if (onSuccess) {
            onSuccess();
          } else {
            OnClose();
          }
        } else {
          console.error("Submission failed:", response?.message);
        }
      } catch (error) {
        console.error("An error occurred during submission:", error);
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
      // 'password',
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
    if (shouldShow) {
      setBannerVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setBannerVisible(false), 3000);
    } else {
      setBannerVisible(false);
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [shouldShow, firstError]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      formik.handleSubmit(e);
    } else {
      formik.setTouched(setNestedObjectValues(errors, true));
      setBannerVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setBannerVisible(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-[2%] bg-black/10 backdrop-blur-sm animate-fadeIn z-5">
      <div className="glass-card flex flex-col items-center justify-center w-[25%] relative overflow-auto animate-slideUp rounded-2xl p-2 max-h-[90vh]">
        {/* <div className="flex items-start justify-end w-full pt-2 mr-2">
                    <CloseRoundedIcon
                        onClick={OnClose}
                        className="cursor-pointer modalCloseIcon hover:scale-110 transition-transform"
                        sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: '50%', fontSize: '1.2rem', padding: '2px', color: 'white' }}
                    />
                </div> */}

        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col items-center pb-4"
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

            {/* Email */}
            <input
              id="email"
              name="email"
              type="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Email Address"
              readOnly={!!sessionStorage.getItem("signupEmail")}
              className={`bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 focus:text-white rounded-xl w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 transition-all ${sessionStorage.getItem("signupEmail") ? "opacity-50 cursor-not-allowed" : ""
                }`}
            />

            {/* Password */}
            {/* <input
                            id="password"
                            name="password"
                            type="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            placeholder="Password"
                            className="bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 focus:text-white rounded-xl w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 transition-all"
                        /> */}

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

      {/* Error Banner */}
      {firstError ? (
        <div
          className={`glass-card flex justify-between items-center w-[25%] rounded-2xl p-2 mt-4
           transition-opacity duration-300 ease-in-out
           ${bannerVisible && firstError
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
            }`}
        >
          <div className="flex gap-2 h-full items-center">
            <WarningRoundedIcon
              sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "1.2rem" }}
            />
            <p className="text-white/80 text-xs font-medium">
              {firstError || ""}
            </p>
          </div>
          <CloseRoundedIcon
            className="cursor-pointer modalCloseIcon"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              fontSize: "1rem",
              color: "white",
            }}
            onClick={() => setBannerVisible(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
