import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bgAudio from '../assets/audio/uplifting-pad-texture-113842.mp3';

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

    return (
        <div className="flex flex-col items-center w-[100%] h-[100%] p-[0.5rem]"
            onMouseEnter={handlePlay}>
            <div className='flex flex-col '>
                <h1>Welcome, Soul Seeker</h1>
                <p>Share your details to begin your personalized spiritual journey</p>
            </div>
            <div>
                <form action="">
                    <div className='flex'>
                        <div>
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your full name" />
                        </div>
                        <div>
                            <label>Age</label>
                            <input type="number" placeholder="Enter your age" />
                        </div>
                        <div>
                            <label>Gender</label>
                            <select>
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                        <div>
                            <label>Profession</label>
                            <input type="text" placeholder="Enter your profession" />
                        </div>
                        <div>
                            <label>Health status</label>
                            <select>
                                <option value="">Select health status</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>

                            </select>
                        </div>
                        <div>
                            <label>Current Emotional State</label>
                            <select>
                                <option value="">How are you feeling?</option>
                                <option value="Happy">Happy</option>
                                <option value="Sad">Sad</option>
                                <option value="Angry">Angry</option>
                                <option value="Depressed">Depressed</option>
                                <option value="Stressed">Stressed</option>
                                <option value="Peaceful">Peaceful</option>
                            </select>
                        </div>
                        <div>
                            <label>Relationship Status</label>
                            <select>
                                <option value="">Select relationship status</option>
                                <option value="Single">Single</option>
                                <option value="In a relationship">In a relationship</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Complicated">It's Complicated</option>
                            </select>
                        </div>
                      
                        <button type="button" onClick={() => navigate('/guidance')}
                            className="cursor-pointer">
                            Begin Sacred Journey
                        </button>
                    </div>
                </form>
            </div>
            <audio ref={audioRef} src={bgAudio} preload="auto" />
            {/* <div className='flex flex-row h-60 w-60 bg-white rounded-4xl p-3 gap-3 justify-end items-center'>
                <div className='h-10 w-10 bg-black rounded-full'></div>
                <div className='h-10 w-10 bg-black rounded-full'></div>
            </div> */}
        </div>
    )
}

export default UserDetails