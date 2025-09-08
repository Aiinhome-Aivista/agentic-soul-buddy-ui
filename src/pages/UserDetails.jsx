import React, { useEffect, useRef, useContext } from 'react';
import bgAudio from '../assets/audio/uplifting-pad-texture-113842.mp3';
import { useFormik } from 'formik';
import { apiService } from '../service/apiService';
import { POST_url } from '../connection/connection';
import { Context } from '../common/helper/Context';

function UserDetails() {
    const audioRef = useRef(null);
    const { setLoadGuidance, setUserData } = useContext(Context)

    useEffect(() => {
        handlePlay();
    }, []);

    const handlePlay = () => {
        audioRef.current?.play().catch((error) => {
            console.error('Audio playback failed. User interaction may be required:', error);
        });
    };

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
                console.log(values)
                const response = await apiService({
                    url: POST_url.login,
                    method: 'POST',
                    data: values,
                });
                console.log(JSON.stringify(values))
                if (response && !response.error) {
                    setUserData(response)
                    setLoadGuidance(true)
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
        <div
            className="flex flex-col items-center justify-center w-full h-screen to-black text-white p-6"
            onMouseEnter={handlePlay}
        >
            <div className="text-center mb-8">
                <p className="text-3xl md:text-4xl font-bold text-yellow-400 drop-shadow-lg">
                    Welcome, Soul Seeker
                </p>
                <p className="text-gray-300 mt-2">
                    Share your details to begin your personalized spiritual journey
                </p>
            </div>
            <form
                onSubmit={formik.handleSubmit}
                className="w-full max-w-2xl p-6 md:p-8 shadow-lg space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-sm text-gray-300 mb-1">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="Full Name"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values["Full Name"]}
                            placeholder='Enter your full name'
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="age" className="text-sm text-gray-300 mb-1">
                            Age
                        </label>
                        <input
                            id="age"
                            name="input.age"
                            type="number"
                            onChange={(e) => formik.setFieldValue("input.age", Number(e.target.value))}
                            value={formik.values.input.age}
                            placeholder="Your age"
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="gender" className="text-sm text-gray-300 mb-1">
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="input.gender"
                            onChange={formik.handleChange}
                            value={formik.values.input.gender}
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="work" className="text-sm text-gray-300 mb-1">
                            Profession
                        </label>
                        <input
                            id="work"
                            name="input.work"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.input.work}
                            placeholder="Your profession"
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="health_status" className="text-sm text-gray-300 mb-1">
                            Health Status
                        </label>
                        <select
                            id="health_status"
                            name="input.health"
                            onChange={formik.handleChange}
                            value={formik.values.input.health}
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">Select health status</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="emotional_status" className="text-sm text-gray-300 mb-1">
                            Current Emotional State
                        </label>
                        <select
                            id="emotional_status"
                            name="input.emotional_state"
                            onChange={formik.handleChange}
                            value={formik.values.input.emotional_state}
                            className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
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
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="relationship_status" className="text-sm text-gray-300 mb-1">
                        Relationship Status
                    </label>
                    <select
                        id="relationship_status"
                        name="input.relationship"
                        onChange={formik.handleChange}
                        value={formik.values.input.relationship}
                        className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                        <option value="">Select relationship status</option>
                        <option value="Single">Single</option>
                        <option value="In a relationship">In a relationship</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Complicated">It's Complicated</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {formik.isSubmitting ? 'Submitting...' : 'Begin Your Journey'}
                </button>
            </form>

            <audio ref={audioRef} src={bgAudio} preload="auto" />
        </div>
    );
}
export default UserDetails;
