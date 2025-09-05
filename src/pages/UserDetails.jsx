import React from 'react'

function UserDetails() {
  return (
    <div>
        <div>
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
                        <button type="submit">
                            Begin Sacred Journey
                        </button>
                    </div>
            </form>
        </div>
    </div>
  )
}

export default UserDetails