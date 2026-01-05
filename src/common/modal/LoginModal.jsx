import React, { useState, useContext, useRef, useEffect } from "react";
import "../../styles/modal.css";
import { Context } from "../helper/Context";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { auth, googleProvider, facebookProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { apiService } from "../../service/apiService";
import { POST_url1 } from "../../connection/connection";
import { useNavigate } from "react-router-dom";
import DisclaimerModal from "./DisclaimerModal";

export default function LoginModal({ OnClose }) {
    const { setIsLoggedIn, setSignupModal, setTempUserName, setTempUserId, setAudioUrl, setIsLoading } = useContext(Context)
    const navigate = useNavigate();
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [pendingUserData, setPendingUserData] = useState(null);

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
                            setPendingUserData({
                                displayName: result.user.displayName,
                                email: result.user.email,
                                uid: result.user.uid,
                                sessionId: response.session_id
                            });
                            setShowDisclaimer(true);
                        }
                    }
                } else {
                    console.error('Submission failed:', response?.message);
                    alert(`Submission failed: ${response?.message || 'An error occurred.'}`);
                    OnClose();
                }
            } catch (error) {
                console.error('An error occurred during submission:', error);
                alert('An error occurred. Please try again later.');
                OnClose();
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    }

    const handleDisclaimerConfirm = () => {
        if (pendingUserData) {
            sessionStorage.setItem("signupName", pendingUserData.displayName);
            sessionStorage.setItem("signupEmail", pendingUserData.email);
            // Store Firebase UID for signup process
            sessionStorage.setItem("firebaseUid", pendingUserData.uid);
            localStorage.setItem('sessionId', pendingUserData.sessionId);
            navigate('/questionnaire');
            // OnClose(); // Do not close here, let navigation happen. But if we want to ensure modal unmounts:
            // Since we navigate, the component holding LoginModal (AiChat) might unmount or re-render. 
            // In AiChat, loginModal state is true. If we navigate to /questionnaire, AiChat unmounts.
            // So OnClose is not strictly necessary but good practice if logic changes.
            // However, we can just call OnClose() to be sure context updates.
            OnClose();
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

    if (showDisclaimer) {
        return (
            <DisclaimerModal
                OnClose={OnClose}
                onConfirm={handleDisclaimerConfirm}
            />
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-15 animate-fadeIn">
            {/* Main Modal Container */}
            <div
                className="glass-card flex flex-col items-center justify-center h-[36%] w-[25%] relative animate-slideUp overflow-hidden rounded-2xl p-2">
                <div className="flex items-start justify-end w-[100%] h-[10%]">
                    <CloseRoundedIcon onClick={OnClose} className="cursor-pointer modalCloseIcon" sx={{ backgroundColor: "rgba(255, 255, 255, 0.54)", borderRadius: '50%', fontSize: '1.1rem' }} />
                </div>
                <div className="flex flex-col items-center justify-center gap-7 w-[100%] h-[90%] pb-[10%]">
                    <div className="text-2xl font-bold text-white  cursor-default">Login</div>
                    <div className="flex gap-3">
                        <div className="flex justify-center items-center text-center text-lg font-semibold rounded-full w-[2.5rem] h-[2.5rem] bg-[#D9D9D9]/12 hover:bg-[#D9D9D9]/20 text-[#FFFFFF]/54 hover:text-[#FFFFFF]/64 p-1 cursor-pointer" onClick={handleGoogleSignIn}>G</div>
                        <div className="flex justify-center items-center text-center text-lg font-semibold rounded-full w-[2.5rem] h-[2.5rem] bg-[#D9D9D9]/12 hover:bg-[#D9D9D9]/20 text-[#FFFFFF]/54 hover:text-[#FFFFFF]/64 p-1 cursor-pointer" onClick={handleFacebookSignIn}>f</div>
                    </div>
                    <div className="text-base text-[#FFFFFF]/54 text-center  cursor-default">Authenticate with google or facebook</div>
                </div>
            </div>
        </div>
    );
}
