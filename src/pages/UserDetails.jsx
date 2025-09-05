import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bgAudio from '../assets/audio/uplifting-pad-texture-113842.mp3';
import { useFormik } from 'formik';

function UserDetails() {
    const audioRef = useRef(null);
    const navigate = useNavigate();

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
            name: '',
            age: '',
            gender: '',
            profession: '',
            health_status: '',
            emotional_status: '',
            relationship_status: '',
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <div className="flex flex-col items-center w-[100%] h-[100%] p-[0.5rem]"
            onMouseEnter={handlePlay}>
            <div className='flex flex-col items-center gap-[3%] h-[40%]'>
                <h1>Welcome, Soul Seeker</h1>
                <p>Share your details to begin your personalized spiritual journey</p>
            </div>
            <div>
                <div className='flex flex-col gap-3'>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex">
                            <div className='flex flex-col'>
                                <label htmlFor="name">Full Name</label>
                                <input id="name"
                                    name="name"
                                    type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    placeholder="Enter your full name" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor='age'>Age</label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.age} placeholder="Enter your age" />
                            </div>
                        </div>
                        <div className="flex">
                            <div className='flex flex-col'>
                                <label htmlFor='gender'>Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    onChange={formik.handleChange}
                                    value={formik.values.gender}>
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor='profession'>Profession</label>
                                <input
                                    id="profession"
                                    name="profession"
                                    type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.profession} placeholder="Enter your profession" />
                            </div>
                        </div>
                        <div className='flex'>
                            <div className="flex flex-col">
                                <label htmlFor='health_status'>Health status</label>
                                <select
                                    id="health_status"
                                    name="health_status"
                                    onChange={formik.handleChange}
                                    value={formik.values.health_status}>
                                    <option value="">Select health status</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Poor">Poor</option>
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor='emotional_status'>Current Emotional State</label>
                                <select
                                    id="emotional_status"
                                    name="emotional_status"
                                    onChange={formik.handleChange}
                                    value={formik.values.emotional_status}>
                                    <option value="">How are you feeling?</option>
                                    <option value="Happy">Happy</option>
                                    <option value="Sad">Sad</option>
                                    <option value="Angry">Angry</option>
                                    <option value="Depressed">Depressed</option>
                                    <option value="Stressed">Stressed</option>
                                    <option value="Peaceful">Peaceful</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='relationship_status'>Relationship Status</label>
                            <select
                                id="relationship_status"
                                name="relationship_status"
                                onChange={formik.handleChange}
                                value={formik.values.relationship_status}>
                                <option value="">Select relationship status</option>
                                <option value="Single">Single</option>
                                <option value="In a relationship">In a relationship</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Complicated">It's Complicated</option>
                            </select>
                        </div>
                        <button type="submit"
                            className="cursor-pointer">
                            Begin Sacred Journey
                        </button>
                    </form>
                </div>
            </div >
            <audio ref={audioRef} src={bgAudio} preload="auto" />
        </div >
    )
}
export default UserDetails