import React, { useState, useContext, useRef, useEffect } from "react";
import "../../styles/modal.css";
import { Context } from "../helper/Context";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { auth, googleProvider, facebookProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { apiService } from "../../service/apiService";
import { POST_url1 } from "../../connection/connection";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ OnClose }) {
    const { setIsLoggedIn, setSignupModal, setTempUserName, setTempUserId, setAudioUrl, setIsLoading } = useContext(Context)
    const navigate = useNavigate();
    const [showEmailLogin, setShowEmailLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("User:", result.user);
            //apicall
            const payload = {
                "full_name": result.user.displayName,
                "login_type": "google",
                "user_id": result.user.uid,
                "email": result.user.email,
            }
            try {
                const response = await apiService({
                    url: POST_url1.login,
                    method: 'POST',
                    data: payload,
                });
                console.log(payload)
                if (response && !response.error) {
                    if (response !== null) {
                        console.log("api res on login", response);
                        if (response.status === "success") {
                            setIsLoggedIn(true)
                            OnClose();
                            // Use backend's user_id for returning users
                            localStorage.setItem('userId', response.user_id || result.user.uid);
                            localStorage.setItem('name', response.full_name);
                            localStorage.setItem('sessionId', response.session_id);
                            setIsLoading(true);
                            setTimeout(() => {
                                setIsLoading(false);
                                setAudioUrl(response.audio_url);
                            }, 3000);

                        }
                        if (response.status === "new_user") {
                            sessionStorage.setItem("signupName", result.user.displayName);
                            sessionStorage.setItem("signupEmail", result.user.email);
                            // Store Firebase UID for signup process
                            sessionStorage.setItem("firebaseUid", result.user.uid);
                            localStorage.setItem('sessionId', response.session_id);
                            navigate('/questionnaire')
                            // setSignupModal(true)
                            // setTempUserName(result.user.displayName)
                            // setTempUserId(result.user.uid)
                            // OnClose()
                        }
                    }
                } else {
                    console.error('Submission failed:', response?.message);
                    alert(`Submission failed: ${response?.message || 'An error occurred.'}`);
                }
            } catch (error) {
                console.error('An error occurred during submission:', error);
                alert('An error occurred. Please try again later.');
            } finally {
                OnClose();
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    }

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = {
                "email": email,
                "password": password,
                "login_type": "email",
            }
            const response = await apiService({
                url: POST_url1.login,
                method: 'POST',
                data: payload,
            });
            if (response && !response.error) {
                if (response.status === "success") {
                    setIsLoggedIn(true);
                    OnClose();
                    localStorage.setItem('userId', response.user_id);
                    localStorage.setItem('name', response.full_name);
                    localStorage.setItem('sessionId', response.session_id);
                    setIsLoading(true);
                    setTimeout(() => {
                        setIsLoading(false);
                        setAudioUrl(response.audio_url);
                    }, 3000);
                } else if (response.status === "new_user") {
                    sessionStorage.setItem("signupEmail", email);
                    localStorage.setItem('sessionId', response.session_id);
                    navigate('/questionnaire');
                }
            } else {
                alert(`Login failed: ${response?.message || 'Invalid credentials.'}`);
            }
        } catch (error) {
            console.error('Email login error:', error);
            alert('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            //setUser(result.user);
            OnClose();
        } catch (error) {
            console.error("Facebook Sign-In Error:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-15 animate-fadeIn">
            {/* Main Modal Container */}
            <div
                className={`glass-card flex flex-col items-center justify-center ${showEmailLogin ? 'h-auto min-h-[45%]' : 'h-[36%]'} w-[25%] min-w-[320px] relative animate-slideUp overflow-hidden rounded-2xl p-2`}>
                <div className="flex items-start justify-between w-[100%] h-[10%] p-2">
                    {showEmailLogin ? (
                        <button
                            type="button"
                            onClick={() => setShowEmailLogin(false)}
                            className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#FFFFFF]/70 hover:text-[#FFFFFF]/90 transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
                        </button>
                    ) : (
                        <div></div>
                    )}
                    <CloseRoundedIcon onClick={OnClose} className="cursor-pointer modalCloseIcon" sx={{ backgroundColor: "rgba(255, 255, 255, 0.54)", borderRadius: '50%', fontSize: '1.1rem' }} />
                </div>
                <div className="flex flex-col items-center justify-center gap-5 w-[100%] h-[90%] pb-[10%] px-6">
                    <div className="text-2xl font-bold text-white cursor-default">Sign In</div>
                    
                    {!showEmailLogin ? (
                        <>
                            <div className="flex gap-3">
                                <div 
                                    className="flex justify-center items-center text-center rounded-full w-[2.5rem] h-[2.5rem] bg-[#D9D9D9]/12 hover:bg-[#D9D9D9]/20 text-[#FFFFFF]/70 hover:text-[#FFFFFF]/90 p-1 cursor-pointer transition-all" 
                                    onClick={handleGoogleSignIn}
                                    title="Sign in with Google"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                </div>
                                <div 
                                    className="flex justify-center items-center text-center rounded-full w-[2.5rem] h-[2.5rem] bg-[#D9D9D9]/12 hover:bg-[#D9D9D9]/20 text-[#FFFFFF]/70 hover:text-[#FFFFFF]/90 p-1 cursor-pointer transition-all" 
                                    onClick={() => setShowEmailLogin(true)}
                                    title="Sign in with Email"
                                >
                                    <span className="material-symbols-outlined text-xl">mail</span>
                                </div>
                            </div>
                            <div className="text-base text-[#FFFFFF]/54 text-center cursor-default">Authenticate with Google or Email</div>
                        </>
                    ) : (
                        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-[#FFFFFF]/70">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-[#FFFFFF]/70">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FFFFFF]/50 hover:text-[#FFFFFF]/80 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl mt-1">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="text-xs text-primary hover:text-primary-dark transition-colors cursor-pointer text-right"
                                    onClick={() => {/* TODO: Add forgot password handler */}}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 mt-2 bg-primary-dark hover:bg-primary-deep text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    )}
                    
                    <div className="text-sm text-[#FFFFFF]/54 text-center">
                        New to <span className="text-primary font-medium">Soul Junction</span>? {' '}
                        <button 
                            type="button"
                            onClick={() => { OnClose(); navigate('/questionnaire'); }}
                            className="text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer underline"
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
