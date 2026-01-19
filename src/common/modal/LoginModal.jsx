import React, { useState, useContext, useRef, useEffect } from "react";
import "../../styles/modal.css";
import { Context } from "../helper/Context";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { auth, googleProvider, facebookProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { apiService } from "../../service/apiService";
import { POST_url1, get_url1 } from "../../connection/connection";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';

export default function LoginModal({ OnClose }) {
    const { setIsLoggedIn, setSignupModal, setTempUserName, setTempUserId, setAudioUrl, setIsLoading } = useContext(Context)
    const navigate = useNavigate();
    const [view, setView] = useState('login'); // 'login', 'email_login', 'forgot_request', 'forgot_reset'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Forgot Password States
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Captcha States
    const [captchaId, setCaptchaId] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const [captchaLoading, setCaptchaLoading] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useRef(null);

    const showToast = (severity, summary, detail) => {
        let style = {};
        const commonStyle = { borderRadius: '12px', border: 'none', minWidth: '400px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#fff' };

        switch (severity) {
            case 'success':
                style = { ...commonStyle, background: 'linear-gradient(135deg, #8aa399 0%, #61897c 100%)' };
                break;
            case 'error':
                style = { ...commonStyle, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' };
                break;
            case 'warn':
                style = { ...commonStyle, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' };
                break;
            case 'info':
                style = { ...commonStyle, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' };
                break;
            default:
                style = { borderRadius: '12px', minWidth: '400px' };
        }
        toast.current.show({ severity, summary, detail, life: 3000, style, className: 'custom-toast-message' });
    };

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
                            localStorage.setItem('loginType', response.login_type);
                            navigate('/home');
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
                            OnClose();
                            navigate('/questionnaire')
                        }
                    }
                } else {
                    console.error('Submission failed:', response?.message);
                    showToast('error', 'Error', response?.message || 'Submission failed');
                }
            } catch (error) {
                console.error('An error occurred during submission:', error);
                showToast('error', 'Error', 'An error occurred. Please try again later.');
            } finally {
                // OnClose(); 
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            showToast('error', 'Error', 'Google Sign-In failed');
        }
    }



    const fetchCaptcha = async () => {
        setCaptchaLoading(true);
        try {
            const response = await apiService({
                url: get_url1.capcha,
                method: 'GET',
            });
            if (response && response.status === "success") {
                setCaptchaId(response.captchaId);
                setCaptchaText(response.captchaText);
            } else {
                showToast('error', 'Error', 'Failed to load captcha');
            }
        } catch (error) {
            console.error("Captcha Fetch Error:", error);
        } finally {
            setCaptchaLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'email_login') {
            fetchCaptcha();
        }
    }, [view]);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            showToast('warn', 'Warning', 'Please enter both email and password');
            return;
        }
        if (!captchaValue) {
            showToast('warn', 'Warning', 'Please enter the captcha');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                "email": email,
                "password": password,
                "captchaId": captchaId,
                "captchaValue": captchaValue
            }
            const response = await apiService({
                url: POST_url1.login_with_email,
                method: 'POST',
                data: payload,
            });

            if (response && response.status === "success") {
                setIsLoggedIn(true);
                OnClose();
                localStorage.setItem('userId', response.user_id);
                localStorage.setItem('name', response.full_name);
                localStorage.setItem('sessionId', response.session_id);
                localStorage.setItem("loginType", response.login_type);
                navigate('/home');
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                    setAudioUrl(response.audio_url);
                }, 3000);
            } else {
                showToast('error', 'Login Failed', response?.message || 'Invalid credentials.');
                fetchCaptcha();
                setCaptchaValue('');
            }
        } catch (error) {
            console.error('Email login error:', error);
            showToast('error', 'Error', 'An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPasswordRequest = async (e) => {
        e.preventDefault();
        if (!email) {
            showToast('warn', 'Warning', 'Please enter your email');
            return;
        }
        setIsSubmitting(true);
        try {
            // 1st API endpoint: request OTP
            const payload = { "email": email };
            const response = await apiService({
                url: POST_url1.password_reset_request,
                method: 'POST',
                data: payload
            });

            if (response && response.status === "success") {
                showToast('success', 'OTP Sent', response.message);
                setView('forgot_reset');
            } else {
                showToast('error', 'Error', response?.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error("Forgot Password Request Error:", error);
            showToast('error', 'Error', 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) {
            showToast('warn', 'Warning', 'Please enter OTP and new password');
            return;
        }
        setIsSubmitting(true);
        try {
            // 2nd API endpoint: reset password
            const payload = {
                "email": email,
                "otp": otp,
                "new_password": newPassword
            };
            const response = await apiService({
                url: POST_url1.password_reset,
                method: 'POST',
                data: payload
            });

            if (response && response.status === "success") {
                showToast('success', 'Success', response.message);
                setTimeout(() => {
                    setView('email_login');
                    setPassword('');
                    setOtp('');
                    setNewPassword('');
                }, 2000);
            } else {
                showToast('error', 'Error', response?.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error("Password Reset Error:", error);
            showToast('error', 'Error', 'An error occurred.');
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
            <Toast ref={toast} />
            {/* Main Modal Container */}
            <div
                className={`glass-card flex flex-col items-center justify-center ${view !== 'login' ? 'h-auto min-h-[45%]' : 'h-[36%]'} w-[25%] min-w-[320px] relative animate-slideUp overflow-hidden rounded-2xl p-2`}>
                <div className="flex items-start justify-between w-[100%] h-[10%] p-2">
                    {view !== 'login' ? (
                        <button
                            type="button"
                            onClick={() => {
                                if (view === 'forgot_reset') setView('forgot_request');
                                else if (view === 'forgot_request') setView('email_login');
                                else setView('login');
                            }}
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
                    <div className="text-2xl font-bold text-white cursor-default">
                        {view === 'login' && 'Sign In'}
                        {view === 'email_login' && 'Sign In'}
                        {view === 'forgot_request' && 'Forgot Password'}
                        {view === 'forgot_reset' && 'Reset Password'}
                    </div>

                    {/* Login View Content */}

                    {view === 'login' && (
                        <>
                            <div className="flex gap-3">
                                <div
                                    className="flex justify-center items-center text-center rounded-full w-[2.5rem] h-[2.5rem] bg-[#D9D9D9]/12 hover:bg-[#D9D9D9]/20 text-[#FFFFFF]/70 hover:text-[#FFFFFF]/90 p-1 cursor-pointer transition-all"
                                    onClick={handleGoogleSignIn}
                                    title="Sign in with Google"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                </div>
                                <div
                                    className="flex justify-center items-center text-center rounded-full w-[2.5rem] h-[2.5rem] bg-[#D9D9D9]/12 hover:bg-[#D9D9D9]/20 text-[#FFFFFF]/70 hover:text-[#FFFFFF]/90 p-1 cursor-pointer transition-all"
                                    onClick={() => setView('email_login')}
                                    title="Sign in with Email"
                                >
                                    <span className="material-symbols-outlined text-xl">mail</span>
                                </div>
                            </div>
                            <div className="text-base text-[#FFFFFF]/54 text-center cursor-default">Authenticate with Google or Email</div>
                        </>
                    )}

                    {view === 'email_login' && (
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
                                    onClick={() => setView('forgot_request')}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Captcha Section */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-[#FFFFFF]/70">Security Check</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-white/90 text-lg font-bold tracking-widest select-none font-mono tracking-[0.2em] relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                                        {captchaLoading ? '...' : captchaText}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchCaptcha}
                                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 transition-colors"
                                        title="Refresh Captcha"
                                    >
                                        <span className="material-symbols-outlined">refresh</span>
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={captchaValue}
                                    onChange={(e) => setCaptchaValue(e.target.value)}
                                    placeholder="Enter Captcha"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                                    required
                                />
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

                    {view === 'forgot_request' && (
                        <form onSubmit={handleForgotPasswordRequest} className="flex flex-col gap-4 w-full">
                            <div className="text-sm text-[#FFFFFF]/54 text-center mb-2">
                                Enter your email address to receive an OTP for password reset.
                            </div>
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
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 mt-2 bg-primary-dark hover:bg-primary-deep text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {view === 'forgot_reset' && (
                        <form onSubmit={handlePasswordReset} className="flex flex-col gap-4 w-full">
                            <div className="text-sm text-[#FFFFFF]/54 text-center mb-2">
                                Enter the OTP sent to {email} and your new password.
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-[#FFFFFF]/70">OTP code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-[#FFFFFF]/70">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FFFFFF]/50 hover:text-[#FFFFFF]/80 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl mt-1">
                                            {showNewPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 mt-2 bg-primary-dark hover:bg-primary-deep text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    {view === 'login' && (
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
                    )}
                </div>
            </div>
        </div>
    );
}