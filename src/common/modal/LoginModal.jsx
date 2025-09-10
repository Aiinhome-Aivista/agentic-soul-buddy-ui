import React, { useState, useContext, useRef, useEffect } from "react";
import "./modal.css";
import { Context } from "../helper/Context";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

export default function LoginModal({ OnClose }) {
    const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User:", result.user); // You can save user in Context or State
      OnClose(); // close modal after login
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }}
    const {setIsLoggedIn } = useContext(Context)
    setIsLoggedIn(true)

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-15 animate-fadeIn">
            {/* Main Modal Container */}
            <div
                className="glass-card flex flex-col items-center justify-center h-[36%] w-[25%] relative animate-slideUp overflow-hidden rounded-2xl p-2">
                <div className="flex items-start justify-end w-[100%] h-[10%]">
                    <CloseRoundedIcon onClick={OnClose} className="cursor-pointer modalCloseIcon" sx={{ backgroundColor: "rgba(255, 255, 255, 0.54)", borderRadius: '50%' }} />
                </div>
                <div className="flex flex-col items-center justify-center gap-7 w-[100%] h-[90%] pb-[10%]">
                    <div className="text-xl font-bold text-white">Login</div>
                    <div className="flex gap-3">
                        <div className="text-center rounded-full w-[2rem] h-[2rem] bg-[#D9D9D9]/12 text-[#FFFFFF]/54 p-1"     onClick={handleGoogleSignIn}>G</div>
                        <div className="text-center rounded-full w-[2rem] h-[2rem] bg-[#D9D9D9]/12 text-[#FFFFFF]/54 p-1">f</div>
                    </div>
                    <div className="text-xs text-[#FFFFFF]/54 text-center">Authenticate with google or facebook</div>
                </div>
            </div>
        </div>
    );
}
