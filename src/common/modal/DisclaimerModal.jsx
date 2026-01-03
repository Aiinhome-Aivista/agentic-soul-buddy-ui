import React, { useState } from 'react';
import "../../styles/modal.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function DisclaimerModal({ OnClose, onConfirm }) {

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-[2%] bg-black/10 backdrop-blur-sm animate-fadeIn z-50">
            <div className="glass-card flex flex-col items-center justify-center relative overflow-hidden animate-slideUp rounded-2xl p-6"
                style={{ width: 'calc(100% - 80px)', height: 'calc(100% - 80px)', margin: '40px' }}
            >
                <div className="flex items-start justify-end w-full h-[5%] m-0">
                    <CloseRoundedIcon
                        onClick={OnClose}
                        className="cursor-pointer modalCloseIcon"
                        sx={{ backgroundColor: "rgba(255, 255, 255, 0.54)", borderRadius: '50%', fontSize: '1.5rem' }}
                    />
                </div>

                <div className="flex flex-col items-center gap-6 w-full h-[95%] px-[5%] pb-[2%] overflow-hidden">
                    <h2 className="text-3xl font-bold text-[#D9D9D9] cursor-default text-center mb-4">Disclaimer for Cosmic Wisdom</h2>

                    <div className="text-[#D9D9D9]/80 text-lg leading-relaxed overflow-y-auto pr-4 custom-scrollbar flex flex-col gap-6 text-justify w-full max-w-[90%]">
                        <div>
                            <p className="font-bold mb-2">1. Not Medical or Mental Health Advice</p>
                            <p>
                                The content, insights, and conversations provided by "Cosmic Wisdom" (the "Application") are for informational, educational, and entertainment purposes only. The Artificial Intelligence (AI) used in this Application is designed to provide supportive and empathetic conversation based on user input. <b>It is NOT a substitute for professional medical advice, diagnosis, or treatment.</b>
                            </p>
                            <p className="mt-2 text-red-300">
                                If you are experiencing a medical emergency, a mental health crisis, or thoughts of self-harm, please discontinue use of this Application immediately and contact a certified healthcare professional, emergency services, or a suicide prevention hotline in your country.
                            </p>
                        </div>

                        <div>
                            <p className="font-bold mb-2">2. AI Limitations & Accuracy</p>
                            <p>
                                This Application utilizes Large Language Models (LLMs) and RAG (Retrieval-Augmented Generation) technologies. While we strive for accuracy, AI systems can occasionally generate incorrect, misleading, or "hallucinated" information. You should not rely solely on the Application's responses for critical life decisions (financial, legal, or health-related).
                            </p>
                        </div>

                        <div>
                            <p className="font-bold mb-2">3. User Responsibility</p>
                            <p>
                                By using this Application, you acknowledge that you are interacting with an AI system. You agree that the creators of Cosmic Wisdom are not responsible for any actions you take based on the information provided by the AI.
                            </p>
                        </div>
                    </div>

                    <div className="pt-[2%] w-full flex justify-center">
                        <button
                            onClick={onConfirm}
                            className="px-10 py-3 text-lg rounded-xl bg-[#D9D9D9]/25 text-[#D9D9D9]/90 border-2 border-[#D9D9D9]/25 font-semibold cursor-pointer shadow-lg transition hover:text-[#D9D9D9] hover:bg-[#D9D9D9]/35 hover:ring-1 hover:ring-[#D9D9D9]/25"
                        >
                            I Understand & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
