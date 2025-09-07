import React, { useState, useContext, useRef, useEffect } from "react";
import "./modal.css";
import { Context } from "../helper/Context";

export default function ExitModal({ OnClose }) {
    const { setLoadGuidance } = useContext(Context)

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-2 animate-fadeIn">
            {/* Main Modal Container */}
            <div
                className="glass-card flex flex-col items-start h-[23%] w-[13%] relative animate-slideUp overflow-hidden rounded-lg p-5">
                <div className="text-xs pb-[7%]">
                    Do you really want  to close the session?
                </div>
                <div className="flex flex-col gap-1 w-[100%] h-[50%]">
                    <button
                        className="w-[90%] py-1 rounded-lg font-light text-xs transition-all duration-300 transform hover:scale-102 cursor-pointer text-white bg-gray-700 opacity-70"
                        onClick={() => setLoadGuidance(false)}
                    >
                        Yes
                    </button>
                    <button
                        className="w-[90%] py-1 rounded-lg font-light text-xs transition-all duration-300 transform hover:scale-102 cursor-pointer text-white bg-gray-700 opacity-70"
                        onClick={() => OnClose()}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
