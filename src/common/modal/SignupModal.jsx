import React, { useState, useContext, useRef, useEffect } from "react";
import "./modal.css";
import { Context } from "../helper/Context";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useFormik } from 'formik';

export default function SignupModal({ OnClose }) {
    const { } = useContext(Context)

    const formik = useFormik({
        initialValues: {
            "Full Name": "",
            input: {
                age: null,
                gender: "",
                work: "",
                health: "",
                emotional_state: "",
                relationship: "",
            },
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await apiService({
                    url: POST_url.login,
                    method: 'POST',
                    data: values,
                });
                console.log(JSON.stringify(values))
                if (response && !response.error) {
                    if (response !== null) {
                        /* setUserData(response)
                        setLoadGuidance(true) */
                    }
                } else {
                    console.error('Submission failed:', response?.message);
                    alert(`Submission failed: ${response?.message || 'An error occurred.'}`);
                }
            } catch (error) {
                console.error('An error occurred during submission:', error);
                alert('An error occurred. Please try again later.');
            } finally {
                setSubmitting(false);
            }
        },
    });


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-15 animate-fadeIn">
            {/* Main Modal Container */}
            <div
                className="glass-card flex flex-col items-center justify-center  w-[25%] relative animate-slideUp overflow-auto rounded-2xl p-2">
                <div className="flex items-start justify-end w-[100%] h-[10%]">
                    <CloseRoundedIcon onClick={OnClose} className="cursor-pointer modalCloseIcon" sx={{ backgroundColor: "rgba(255, 255, 255, 0.54)", borderRadius: '50%' }} />
                </div>
                <div className="flex flex-col items-center justify-center gap-7 w-[100%] h-[90%] pb-[10%]">
                    <div className="text-xl font-bold text-white">Complete Signup</div>
                    <form onSubmit={formik.handleSubmit}>

                        <input
                            id="name"
                            name="Full Name"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values["Full Name"]}
                            placeholder='Enter your full name'
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-white"
                            required
                        />
                        <input
                            id="age"
                            name="input.age"
                            type="number"
                            onChange={(e) => formik.setFieldValue("input.age", Number(e.target.value))}
                            value={formik.values.input.age}
                            placeholder="Your age"
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-white"
                            required
                        />
                        <select
                            id="gender"
                            name="input.gender"
                            onChange={formik.handleChange}
                            value={formik.values.input.gender}
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-white"
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer not to say">Prefer not to say</option>
                        </select>

                        <input
                            id="work"
                            name="input.work"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.input.work}
                            placeholder="Your profession"
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-white"
                            required
                        />
                        <select
                            id="health_status"
                            name="input.health"
                            onChange={formik.handleChange}
                            value={formik.values.input.health}
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-white"
                            required
                        >
                            <option value="">Select health status</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>

                        <select
                            id="emotional_status"
                            name="input.emotional_state"
                            onChange={formik.handleChange}
                            value={formik.values.input.emotional_state}
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-white"
                        >
                            <option value="">How are you feeling?</option>
                            <option value="Happy">Happy</option>
                            <option value="Sad">Sad</option>
                            <option value="Angry">Angry</option>
                            <option value="Depressed">Depressed</option>
                            <option value="Stressed">Stressed</option>
                            <option value="Peaceful">Peaceful</option>
                            <option value="Other">Other</option>
                        </select>

                        <select
                            id="relationship_status"
                            name="input.relationship"
                            onChange={formik.handleChange}
                            value={formik.values.input.relationship}
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-white"
                            required
                        >
                            <option value="" style={{ color: 'gray' }}>Select relationship status</option>
                            <option value="Single">Single</option>
                            <option value="In a relationship">In a relationship</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Complicated">It's Complicated</option>
                        </select>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-gray-300 to-gray-300 text-black font-semibold cursor-pointer shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {formik.isSubmitting ? 'Submitting...' : 'Signup'}
                        </button>
                    </form>
                </div>
            </div>
        </div >
    );
}