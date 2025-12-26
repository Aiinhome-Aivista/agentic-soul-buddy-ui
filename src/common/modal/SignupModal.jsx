// import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
// import "../../styles/modal.css";
// import { Context } from "../helper/Context";
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
// import { useFormik, setNestedObjectValues } from 'formik';
// import * as Yup from "yup";
// import { apiService } from "../../service/apiService";
// import { POST_url } from "../../connection/connection";
// import { Dropdown } from 'primereact/dropdown';

// export default function SignupModal({ OnClose }) {
//     const { tempUserName, tempUserId, setIsLoggedIn, setAudioUrl, setIsLoading } = useContext(Context);

//     // Single-error banner visibility + auto-hide timer
//     const [bannerVisible, setBannerVisible] = useState(false);
//     const hideTimerRef = useRef(null);

//     const Genders = [
//         { gender: 'Male' },
//         { gender: 'Female' },
//         { gender: 'Other' },
//         { gender: 'Prefer Not to Say' },
//     ];

//     const Health_Status = [
//         { health: 'Excellent' },
//         { health: 'Good' },
//         { health: 'Fair' },
//         { health: 'Poor' },
//     ];

//     const Relationship_Status = [
//         { relationship: 'Single' },
//         { relationship: 'In a relationship' },
//         { relationship: 'Married' },
//         { relationship: 'Divorced' },
//         { relationship: "It's Complicated" },
//     ];

//     const validationSchema = Yup.object({
//         input: Yup.object({
//             age: Yup.number()
//                 .min(18, "Age must be at least 18 years.")
//                 .max(120, "Invalid age!")
//                 .required("Age is required!"),
//             work: Yup.string()
//                 .min(3, "Please enter a valid profession.")
//                 .matches(/(.*[a-zA-Z]){2,}/, "Please enter a valid profession.")
//                 .required("Profession is required."),
//             gender: Yup.string().required("Gender is required."),
//             health: Yup.string().required("Health status is required."),
//             relationship: Yup.string().required("Relationship status is required."),
//             emotional_state: Yup.string().nullable(),
//         }),
//     });

//     const formik = useFormik({
//         initialValues: {
//             full_name: tempUserName,
//             user_id: tempUserId,
//             input: {
//                 age: "",
//                 gender: "",
//                 work: "",
//                 health: "",
//                 emotional_state: "",
//                 relationship: "",
//             },
//         },
//         validationSchema,
//         onSubmit: async (values, { setSubmitting }) => {
//             try {
//                 const response = await apiService({
//                     url: POST_url.signup,
//                     method: 'POST',
//                     data: values,
//                 });

//                 if (response && !response.error && response !== null) {
//                     setIsLoggedIn(true);
//                     localStorage.setItem('userId', response.user_id);
//                     localStorage.setItem('sessionId', response.session_id);

//                     setIsLoading(true);
//                     setTimeout(() => {
//                         setIsLoading(false);
//                         setAudioUrl(response.Data?.audio_url);
//                     }, 3000);

//                     OnClose();
//                 } else {
//                     console.error('Submission failed:', response?.message);
//                 }
//             } catch (error) {
//                 console.error('An error occurred during submission:', error);
//             } finally {
//                 setSubmitting(false);
//             }
//         },
//     });

//     // Helper: pick exactly one error by priority, avoiding concatenation or mapping
//     const pickFirstError = (errorsObj) => {
//         // Priority order; adjust as needed
//         const priority = [
//             'input.age',
//             'input.work',
//             'input.gender',
//             'input.health',
//             'input.relationship',
//             'input.emotional_state'
//         ];

//         const getInPath = (obj, path) =>
//             path.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), obj);

//         for (const path of priority) {
//             const msg = getInPath(errorsObj, path);
//             if (typeof msg === 'string' && msg.trim()) return msg;
//         }

//         // Fallback: breadth-first search for first string leaf
//         const queue = [errorsObj];
//         while (queue.length) {
//             const cur = queue.shift();
//             if (!cur || typeof cur !== 'object') continue;
//             for (const key of Object.keys(cur)) {
//                 const v = cur[key];
//                 if (typeof v === 'string' && v.trim()) return v;
//                 if (v && typeof v === 'object') queue.push(v);
//             }
//         }
//         return null;
//     };

//     const firstError = useMemo(() => pickFirstError(formik.errors), [formik.errors]);

//     // Gate visibility: show after submit attempt or when any invalid field is touched
//     const anyTouched = Object.keys(formik.touched).length > 0;
//     const shouldShow = Boolean(firstError) && (formik.submitCount > 0 || anyTouched);

//     // Auto-hide after 3s; fade with opacity transitions
//     useEffect(() => {
//         if (shouldShow) {
//             setBannerVisible(true);
//             if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
//             hideTimerRef.current = setTimeout(() => setBannerVisible(false), 3000);
//         } else {
//             setBannerVisible(false);
//         }
//         return () => {
//             if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
//         };
//     }, [shouldShow, firstError]);

//     // Validate and reveal errors; touch all error fields so validation state is visible
//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         const errors = await formik.validateForm();
//         if (Object.keys(errors).length === 0) {
//             formik.handleSubmit(e);
//         } else {
//             formik.setTouched(setNestedObjectValues(errors, true));
//             setBannerVisible(true);
//             if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
//             hideTimerRef.current = setTimeout(() => setBannerVisible(false), 3000);
//         }
//     };

//     return (
//         <div className="fixed inset-0 flex flex-col items-center justify-center gap-[2%] bg-black/10 backdrop-blur-sm animate-fadeIn z-5">
//             <div className="glass-card flex flex-col items-center justify-center w-[23%] relative overflow-auto animate-slideUp rounded-2xl p-2">
//                 <div className="flex items-start justify-end w-full h-[10%] pt-[2%] m-0">
//                     <CloseRoundedIcon
//                         onClick={OnClose}
//                         className="cursor-pointer modalCloseIcon"
//                         sx={{ backgroundColor: "rgba(255, 255, 255, 0.54)", borderRadius: '50%', fontSize: '1.1rem' }}
//                     />
//                 </div>

//                 <form onSubmit={formik.handleSubmit} className="w-full">
//                     <div className="flex flex-col items-center justify-center gap-3 w-full h-[90%] px-[5%]">
//                         <div className="text-xl font-bold text-[#D9D9D9] pb-[4%] cursor-default">Let the Journey Begin</div>

//                         <input
//                             id="age"
//                             name="input.age"
//                             type="number"
//                             onBlur={() => formik.setFieldTouched('input.age', true)}
//                             onChange={(e) => {
//                                 const value = e.target.value;
//                                 if (value === "" || Number(value) >= 0) {
//                                     formik.setFieldValue("input.age", value);
//                                 }
//                             }}
//                             value={formik.values.input.age}
//                             placeholder="Age"
//                             className="bg-inherit text-[#D9D9D9]/50 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 no-spinner"
//                             min={0}
//                         />

//                         <input
//                             id="work"
//                             name="input.work"
//                             type="text"
//                             onBlur={() => formik.setFieldTouched('input.work', true)}
//                             onChange={(e) => {
//                                 const value = e.target.value;
//                                 if (/^\d+$/.test(value)) {
//                                     formik.setFieldValue('input.work', '');
//                                 } else {
//                                     formik.handleChange(e);
//                                 }
//                             }}
//                             value={formik.values.input.work}
//                             placeholder="Profession"
//                             className="bg-inherit text-[#D9D9D9]/50 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
//                         />

//                         <Dropdown
//                             id="gender"
//                             name="input.gender"
//                             value={formik.values.input.gender}
//                             onChange={(e) => formik.setFieldValue('input.gender', e.value)}
//                             onBlur={() => formik.setFieldTouched('input.gender', true)}
//                             options={Genders}
//                             optionLabel="gender"
//                             optionValue="gender"
//                             placeholder="Gender"
//                             className="bg-inherit text-[#D9D9D9]/25 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
//                             panelClassName="bg-[#434141] rounded-lg"
//                             checkmark
//                             highlightOnSelect={false}
//                         />

//                         <Dropdown
//                             id="health"
//                             name="input.health"
//                             value={formik.values.input.health}
//                             onChange={(e) => formik.setFieldValue('input.health', e.value)}
//                             onBlur={() => formik.setFieldTouched('input.health', true)}
//                             options={Health_Status}
//                             optionLabel="health"
//                             optionValue="health"
//                             placeholder="Health Status"
//                             className="bg-inherit text-[#D9D9D9]/25 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
//                             panelClassName="bg-[#434141] rounded-lg"
//                             checkmark
//                             highlightOnSelect={false}
//                         />

//                         <input
//                             id="emotional_state"
//                             name="input.emotional_state"
//                             type="text"
//                             onBlur={() => formik.setFieldTouched('input.emotional_state', true)}
//                             onChange={(e) => {
//                                 const value = e.target.value;
//                                 if (/^\d+$/.test(value)) {
//                                     formik.setFieldValue('input.emotional_state', '');
//                                 } else {
//                                     formik.handleChange(e);
//                                 }
//                             }}
//                             placeholder="How are you feeling? (Optional)"
//                             value={formik.values.input.emotional_state}
//                             className="bg-inherit text-[#D9D9D9]/50 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
//                         />

//                         <Dropdown
//                             id="relationship"
//                             name="input.relationship"
//                             value={formik.values.input.relationship}
//                             onChange={(e) => formik.setFieldValue('input.relationship', e.value)}
//                             onBlur={() => formik.setFieldTouched('input.relationship', true)}
//                             options={Relationship_Status}
//                             optionLabel="relationship"
//                             optionValue="relationship"
//                             placeholder="Relationship Status"
//                             className="bg-inherit text-[#D9D9D9]/25 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
//                             panelClassName="bg-[#434141] rounded-lg"
//                             checkmark
//                             highlightOnSelect={false}
//                         />

//                         <div className="pt-[5%] w-full">
//                             <button
//                                 type="submit"
//                                 disabled={formik.isSubmitting}
//                                 onClick={handleFormSubmit}
//                                 className="w-full py-1 rounded-xl bg-[#D9D9D9]/25 text-[#D9D9D9]/55 border-2 border-[#D9D9D9]/25 font-semibold cursor-pointer shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#D9D9D9]/65 hover:ring-1 hover:ring-[#D9D9D9]/25"
//                             >
//                                 {formik.isSubmitting ? 'Submitting...' : 'Signup'}
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>

//             {/* Single-error inline banner with fade in/out and auto-hide (3s) */}
//             <div
//                 className={
//                     `glass-card flex justify-between items-center w-[23%] rounded-2xl p-2 mb-[-3.5%]
//            transition-opacity duration-500 ease-in-out
//            ${bannerVisible && firstError ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
//                 }
//                 aria-live="polite"
//             >
//                 <div className="flex gap-2 h-full">
//                     <WarningRoundedIcon sx={{ color: "rgba(255, 255, 255, 0.29)", fontSize: '1.3rem' }} />
//                     <p className="flex items-center justify-center text-[#D9D9D9]/65 text-xs text-center cursor-default">
//                         {firstError || ""}
//                     </p>
//                 </div>
//                 <CloseRoundedIcon
//                     className="cursor-pointer modalCloseIcon"
//                     sx={{ backgroundColor: "rgba(255, 255, 255, 0.29)", borderRadius: '50%', fontSize: '1rem' }}
//                     onClick={() => setBannerVisible(false)}
//                 />
//             </div>
//         </div>
//     );
// }