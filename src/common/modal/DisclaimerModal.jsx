import React, { useState } from 'react';
import "../../styles/modal.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function DisclaimerModal({ OnClose, onConfirm, hideFooter }) {
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md animate-fadeIn z-50">
            <div className="glass-card flex flex-col items-center relative overflow-hidden animate-slideUp rounded-3xl"
                style={{ width: 'min(900px, calc(100% - 48px))', maxHeight: 'calc(100vh - 48px)' }}
            >
                {/* Header */}
                <div className="w-full flex items-center justify-between px-8 py-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <InfoOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.5rem' }} />
                        </div>
                        <h2 className="text-2xl font-bold text-white cursor-default">Important Disclaimer</h2>
                    </div>
                    <CloseRoundedIcon
                        onClick={OnClose}
                        className="cursor-pointer hover:bg-white/20 rounded-full p-1 transition-all"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.75rem' }}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-5 w-full px-8 py-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 280px)' }}>

                    {/* Section 1 */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
                        <h3 className="text-lg font-semibold text-white mb-3">1. Not Medical or Mental Health Advice</h3>
                        <p className="text-white/70 leading-relaxed mb-3">
                            The content, insights, and conversations provided by "Cosmic Wisdom" are for <span className="text-white/90 font-medium">informational, educational, and entertainment purposes only</span>. The AI is designed to provide supportive and empathetic conversation based on user input.
                        </p>
                        <p className="text-white/90 font-medium bg-white/10 rounded-lg px-4 py-2 mb-3">
                            ⚠️ It is NOT a substitute for professional medical advice, diagnosis, or treatment.
                        </p>
                        <p className="text-white/60 text-sm leading-relaxed bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                            If you are experiencing a medical emergency, mental health crisis, or thoughts of self-harm, please discontinue use immediately and contact a certified healthcare professional, emergency services, or a suicide prevention hotline.
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
                        <h3 className="text-lg font-semibold text-white mb-3">2. AI Limitations & Accuracy</h3>
                        <p className="text-white/70 leading-relaxed">
                            This Application utilizes <span className="text-white/90 font-medium">Large Language Models (LLMs)</span> and <span className="text-white/90 font-medium">RAG (Retrieval-Augmented Generation)</span> technologies. While we strive for accuracy, AI systems can occasionally generate incorrect, misleading, or "hallucinated" information. You should not rely solely on the Application's responses for critical life decisions (financial, legal, or health-related).
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
                        <h3 className="text-lg font-semibold text-white mb-3">3. User Responsibility</h3>
                        <p className="text-white/70 leading-relaxed">
                            By using this Application, you acknowledge that you are interacting with an AI system. You agree that the creators of Cosmic Wisdom are <span className="text-white/90 font-medium">not responsible for any actions</span> you take based on the information provided by the AI.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                {!hideFooter && (
                    <div className="w-full px-8 py-5 border-t border-white/10 bg-white/5">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${acceptedTerms
                                    ? 'bg-white/90 border-white/90'
                                    : 'border-white/30 group-hover:border-white/50'
                                    }`}>
                                    {acceptedTerms && (
                                        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    id="acceptTerms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="sr-only"
                                />
                                <span className="text-white/80 group-hover:text-white transition-colors select-none">
                                    I have read and accept the Terms and Conditions
                                </span>
                            </label>

                            <button
                                onClick={onConfirm}
                                disabled={!acceptedTerms}
                                className={`px-8 py-3 text-base rounded-xl font-semibold shadow-lg transition-all duration-300 ${acceptedTerms
                                    ? "bg-white/90 text-black cursor-pointer hover:bg-white hover:shadow-xl transform hover:-translate-y-0.5"
                                    : "bg-white/10 text-white/30 cursor-not-allowed"
                                    }`}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
