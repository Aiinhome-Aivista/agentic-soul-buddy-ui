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
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen to-black text-white p-6"
      onMouseEnter={handlePlay}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 drop-shadow-lg">
          Welcome, Soul Seeker
        </h1>
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
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              placeholder="Enter your full name"
              className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="age" className="text-sm text-gray-300 mb-1">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.age}
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
              name="gender"
              onChange={formik.handleChange}
              value={formik.values.gender}
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
            <label htmlFor="profession" className="text-sm text-gray-300 mb-1">
              Profession
            </label>
            <input
              id="profession"
              name="profession"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.profession}
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
              name="health_status"
              onChange={formik.handleChange}
              value={formik.values.health_status}
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
              name="emotional_status"
              onChange={formik.handleChange}
              value={formik.values.emotional_status}
              className="bg-[#2a2a3d] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
            >
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

        <div className="flex flex-col">
          <label htmlFor="relationship_status" className="text-sm text-gray-300 mb-1">
            Relationship Status
          </label>
          <select
            id="relationship_status"
            name="relationship_status"
            onChange={formik.handleChange}
            value={formik.values.relationship_status}
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
          className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold shadow-lg hover:opacity-90 transition"
        >
          Begin Sacred Journey
        </button>
      </form>

      <audio ref={audioRef} src={bgAudio} preload="auto" />
    </div>
  );
}
export default UserDetails;
