import React, { useState, useContext, useRef, useEffect } from "react";
import "./modal.css";
import { Context } from "../helper/Context";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useFormik } from 'formik';
import { apiService } from "../../service/apiService";
import { POST_url } from "../../connection/connection";
import { Dropdown } from 'primereact/dropdown';

export default function SignupModal({ OnClose }) {
    const { tempUserName, tempUserId } = useContext(Context)

    const Genders = [
        { gender: 'Male' },
        { gender: 'Female' },
        { gender: 'Other' },
        { gender: 'Prefer Not to Say' },
    ];

    const Health_Status = [
        { health: 'Excellent' },
        { health: 'Good' },
        { health: 'Fair' },
        { health: 'Poor' },
    ];

    const Relationship_Status = [
        { relationship: 'Single' },
        { relationship: 'In a relationship' },
        { relationship: 'Married' },
        { relationship: 'Divorced' },
        { relationship: "It's Complicated" },
    ];

    const formik = useFormik({
        initialValues: {
            full_name: tempUserName,
            user_id: tempUserId,
            input: {
                age: '',
                gender: "",
                work: "",
                health: "",
                emotional_state: "",
                relationship: ""
            }
        },
        onSubmit: async (values, { setSubmitting }) => {
            console.log(JSON.stringify(values))
            try {
                const response = await apiService({
                    url: POST_url.signup,
                    method: 'POST',
                    data: values,
                });
                console.log(values)
                if (response && !response.error) {
                    if (response !== null) {
                        sessionStorage.setItem('userId', response.user.uid);
                        sessionStorage.setItem('sessionId', response.session_id);
                        setIsLoggedIn(true)
                        OnClose()
                    }
                } else {
                    console.error('Submission failed:', response?.message);
                    alert(`Submission failed: ${response?.message || 'An error occurred.'}`);
                    OnClose()
                }
            } catch (error) {
                console.error('An error occurred during submission:', error);
                OnClose()
            } finally {
                setSubmitting(false);
                OnClose()
            }
        },
    });


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-15 animate-fadeIn">
            {/* Main Modal Container */}
            <div
                className="glass-card flex flex-col items-center justify-center  w-[28%] relative animate-slideUp overflow-auto rounded-2xl p-2">
                <div className="flex items-start justify-end w-[100%] h-[10%] p-0 m-0">
                    <CloseRoundedIcon onClick={OnClose} className="cursor-pointer modalCloseIcon" sx={{ backgroundColor: "rgba(255, 255, 255, 0.54)", borderRadius: '50%', fontSize: '1.1rem' }} />
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col items-center justify-center gap-4 w- h-[90%] pb-[10%]">
                        <div className="text-xl font-bold text-white">Complete Signup</div>
                        <input
                            id="age"
                            name="input.age"
                            type="number"
                            onChange={formik.handleChange}
                            value={formik.values.input.age}
                            placeholder="Age"
                            className="bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 rounded-lg w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
                            required
                        />
                        <input
                            id="work"
                            name="input.work"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.input.work}
                            placeholder="Profession"
                            className="bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 rounded-lg w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
                            required
                        />
                        <Dropdown
                            id="gender"
                            name="input.gender"
                            value={formik.values.input.gender}
                            onChange={(e) => formik.setFieldValue('input.gender', e.value)}
                            options={Genders}
                            optionLabel="gender"
                            optionValue="gender"
                            placeholder="Gender"
                            className="bg-inherit text-[#D9D9D9]/25 placeholder:text-[#D9D9D9]/50 rounded-lg w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
                            panelClassName="bg-[#434141] rounded-lg"
                            checkmark={true}
                            highlightOnSelect={false} />

                        <Dropdown
                            id="health"
                            name="input.health"
                            value={formik.values.input.health}
                            onChange={(e) => formik.setFieldValue('input.health', e.value)}
                            options={Health_Status}
                            optionLabel="health"
                            optionValue="health"
                            placeholder="Health Status"
                            className="bg-inherit text-[#D9D9D9]/25 placeholder:text-[#D9D9D9]/50 rounded-lg w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
                            panelClassName="bg-[#434141] rounded-lg"
                            checkmark={true}
                            highlightOnSelect={false} />

                        <input
                            id="emotional_state"
                            name="input.emotional_state"
                            type="text"
                            onChange={formik.handleChange}
                            placeholder="How are you feeling?"
                            value={formik.values.input.emotional_state}
                            className="bg-inherit text-[#D9D9D9] placeholder:text-[#D9D9D9]/50 rounded-lg w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
                        />

                        <Dropdown
                            id="relationship"
                            name="input.relationship"
                            value={formik.values.input.relationship}
                            onChange={(e) => formik.setFieldValue('input.relationship', e.value)}
                            options={Relationship_Status}
                            optionLabel="relationship"
                            optionValue="relationship"
                            placeholder="Relationship Status"
                            className="bg-inherit text-[#D9D9D9]/25 placeholder:text-[#D9D9D9]/50 rounded-lg w-full px-4 py-2 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
                            panelClassName="bg-[#434141] rounded-lg"
                            checkmark={true}
                            highlightOnSelect={false} />
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full py-2 rounded-xl bg-[#D9D9D9]/25 text-[#D9D9D9]/50 border-2 border-[#D9D9D9]/25 font-semibold cursor-pointer shadow-lg hover:bg- transition disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#D9D9D9]/25"
                        >
                            {formik.isSubmitting ? 'Submitting...' : 'Signup'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}