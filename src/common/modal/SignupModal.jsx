import React, { useState, useContext, useRef, useEffect } from "react";
import "../../styles/modal.css";
import { Context } from "../helper/Context";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { apiService } from "../../service/apiService";
import { POST_url } from "../../connection/connection";
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

export default function SignupModal({ OnClose }) {
    const { tempUserName, tempUserId, setIsLoggedIn, setAudioUrl, setIsLoading } = useContext(Context)
    const toast = useRef(null);

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

    const validationSchema = Yup.object({
        input: Yup.object({
            age: Yup.number()
                .typeError("Age must be a number")
                .positive("Age must be a positive number")
                .integer("Age must be an integer")
                .required("Age is required"),
            gender: Yup.string()
                .required("Gender is required"),
            work: Yup.string()
                .min(2, "Please eneter a valid profession")
                .matches(/(.*[a-zA-Z]){2,}/, "Profession must contain at least two letters")
                .required("Profession is required"),
            health: Yup.string()
                .required("Health status is required"),
            relationship: Yup.string()
                .required("Relationship status is required"),
        }),
    });

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
        validationSchema,
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
                        setIsLoggedIn(true)
                        OnClose()
                        localStorage.setItem('userId', response.user_id);
                        localStorage.setItem('sessionId', response.session_id);

                        setIsLoading(true);
                        setTimeout(() => {
                            setIsLoading(false);
                            setAudioUrl(response.Data.audio_url)
                        }, 3000);


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

    const handleFormSubmit = (e) => {
        e.preventDefault();
        formik.validateForm().then(errors => {
            formik.setTouched(errors, true);
            if (Object.keys(errors).length === 0) {
                formik.handleSubmit(e);
            } else {
                toast.current.show({ detail: 'Please fill in all required fields correctly.', life: 3000 });
            }
        });
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-[2%] bg-black/10 backdrop-blur-sm z-5 animate-fadeIn">
            <Toast ref={toast} />
            <div className="glass-card flex flex-col items-center justify-center  w-[23%] relative animate-slideUp overflow-auto rounded-2xl p-2">
                <div className="flex items-start justify-end w-[100%] h-[10%] p-0 m-0">
                    <CloseRoundedIcon onClick={OnClose} className="cursor-pointer modalCloseIcon" sx={{ backgroundColor: "rgba(255, 255, 255, 0.54)", borderRadius: '50%', fontSize: '1.1rem' }} />
                </div>
                <form onSubmit={formik.handleSubmit} className="w-full">
                    <div className="flex flex-col items-center justify-center gap-3 w-full h-[90%] px-[5%]">
                        <div className="text-xl font-bold text-[#D9D9D9] pb-[4%]  cursor-default">Let the Journey Begin</div>
                        <input
                            id="age"
                            name="input.age"
                            type="number"
                            onChange={e => {
                                const value = e.target.value;
                                if (value === "" || Number(value) >= 0) {
                                    formik.setFieldValue("input.age", value);
                                }
                            }}
                            value={formik.values.input.age}
                            placeholder="Age"
                            className="bg-inherit text-[#D9D9D9]/50 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25 no-spinner"
                            min={0}
                        />
                        <input
                            id="work"
                            name="input.work"
                            type="text"
                            onBlur={formik.handleBlur}
                            onChange={e => {
                                const value = e.target.value;
                                if (/^\d+$/.test(value)) {
                                    formik.setFieldValue('input.work', '');
                                } else {
                                    formik.handleChange(e);
                                }
                            }}
                            value={formik.values.input.work}
                            placeholder="Profession"
                            className="bg-inherit text-[#D9D9D9]/50 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
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
                            className="bg-inherit text-[#D9D9D9]/25 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
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
                            className="bg-inherit text-[#D9D9D9]/25 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
                            panelClassName="bg-[#434141] rounded-lg"
                            checkmark={true}
                            highlightOnSelect={false} />
                        <input
                            id="emotional_state"
                            name="input.emotional_state"
                            type="text"
                            onChange={e => {
                                const value = e.target.value;
                                if (/^\d+$/.test(value)) {
                                    formik.setFieldValue('input.emotional_state', '');
                                } else {
                                    formik.handleChange(e);
                                }
                            }}
                            placeholder="How are you feeling?"
                            value={formik.values.input.emotional_state}
                            className="bg-inherit text-[#D9D9D9]/50 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
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
                            className="bg-inherit text-[#D9D9D9]/25 placeholder:text-[#D9D9D9]/50 focus:text-[#D9D9D9]/75 rounded-lg w-full px-4 py-1 outline-none border-2 border-[#D9D9D9]/25 focus:ring-2 focus:ring-[#D9D9D9]/25"
                            panelClassName="bg-[#434141] rounded-lg"
                            checkmark={true}
                            highlightOnSelect={false} />
                        <div className="pt-[5%] w-full">
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                onClick={handleFormSubmit}
                                className="w-full py-1 rounded-xl bg-[#D9D9D9]/25 text-[#D9D9D9]/55 border-2 border-[#D9D9D9]/25 font-semibold cursor-pointer shadow-lg hover:bg- transition disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#D9D9D9]/65 hover:ring-1 hover:ring-[#D9D9D9]/25"
                            >
                                {formik.isSubmitting ? 'Submitting...' : 'Signup'}
                            </button>
                        </div>
                    </div>
                </form>
            </div >
            <div className="glass-card flex justify-between items-center w-[23%] rounded-2xl p-2 mb-[-3.5%] opacity-0">
                <div className="flex gap-2 h-full">
                    <WarningRoundedIcon sx={{ color: "rgba(255, 255, 255, 0.29)", fontSize: '1.3rem' }} />
                    <p className="flex items-center justify-center text-[#D9D9D9]/65 text-xs text-center">Age must be at least 18 years.</p>
                </div>
                <CloseRoundedIcon className="cursor-pointer modalCloseIcon" sx={{ backgroundColor: "rgba(255, 255, 255, 0.29)", borderRadius: '50%', fontSize: '1rem' }} />
            </div>
        </div >
    );
}