import React, { useState, useContext, useRef, useEffect } from "react";
import "./modal.css";
import { Context } from "../helper/Context";

export default function ExitModal({ OnClose }) {
    const { setLoadGuidance } = useContext(Context)

    return (
        <div className="fixed inset-0 flex items-start justify-start p-2 bg-black/20  z-2 animate-fadeIn">
            {/* Main Modal Container */}
            <div
                className="glass-card flex flex-col items-center h-[20%] w-[12%] relative animate-slideUp overflow-hidden rounded-lg p-3"

            >
                <div className="font-semibold text-sm pb-[3%]">
                    Do you really want to close the session?
                </div>
                <div>
                    <button
                        className="w-[100%] rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-102 cursor-pointer text-white bg-yellow-600"
                        onClick={() => setLoadGuidance(false)}
                    >
                        Yes
                    </button>
                    <button
                        className="w-full rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-102 cursor-pointer text-white bg-yellow-200"
                        onClick={() => OnClose()}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
