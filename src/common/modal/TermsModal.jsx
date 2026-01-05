import React, { useContext } from 'react';
import "../../styles/modal.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Context } from '../helper/Context';

export default function TermsModal({ onClose }) {
    const { setTermsModal } = useContext(Context);

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            setTermsModal(false);
        }
    };

    const termsData = [
        {
            "content": "By creating an account, accessing, or using Soul Buddy, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.",
            "effective_date": "Sat, 03 Jan 2026 00:00:00 GMT",
            "id": 1,
            "title": "Acceptance of Terms"
        },
        {
            "content": "Soul Buddy is an AI-powered personalized assistant that uses data analysis and natural language processing to provide conversational support and insights based on user-uploaded data and profiles.",
            "effective_date": "Sat, 03 Jan 2026 00:00:00 GMT",
            "id": 2,
            "title": "Description of Service"
        },
        {
            "content": "Account Creation: You must provide accurate and complete information (including age, gender, and work details) to allow the AI to function correctly.\n\nCredentials: You are responsible for maintaining the confidentiality of your login credentials.\n\nAge Restriction: This Service is intended for users who are at least 18 years old (or the age of majority in your jurisdiction).",
            "effective_date": "Sat, 03 Jan 2026 00:00:00 GMT",
            "id": 3,
            "title": "User Accounts and Security"
        },
        {
            "content": "Data Collection: We collect data such as your name, age, emotional state, survey responses, and conversation history to personalize your experience.\n\nData Usage: Your data is processed by our AI models (e.g., Mistral) and stored in our databases (MySQL, ChromaDB) to maintain conversation context.\n\nAudio Data: Voice interactions are processed to generate text and audio responses.\n\nConsent: By using the Service, you consent to this data processing. Please refer to our Privacy Policy for full details.",
            "effective_date": "Sat, 03 Jan 2026 00:00:00 GMT",
            "id": 4,
            "title": "User Data and Privacy"
        },
        {
            "content": "You agree not to upload illegal, harmful, threatening, or abusive content; attempt to reverse-engineer the AI or inject malicious code (including prompt injection attacks); or harass or harm others.",
            "effective_date": "Sat, 03 Jan 2026 00:00:00 GMT",
            "id": 5,
            "title": "Acceptable Use"
        },
        {
            "content": "The Service and its original content (excluding user-uploaded data), features, and functionality are and will remain the exclusive property of the creators of Soul Buddy.",
            "effective_date": "Sat, 03 Jan 2026 00:00:00 GMT",
            "id": 6,
            "title": "Intellectual Property"
        },
        {
            "content": "In no event shall the creators of Soul Buddy, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.",
            "effective_date": "Sat, 03 Jan 2026 00:00:00 GMT",
            "id": 7,
            "title": "Limitation of Liability"
        },
        {
            "content": "We reserve the right to modify or replace these Terms at any time. Continued use of the Service after any such changes constitutes your acceptance of the new Terms.",
            "effective_date": "Sat, 03 Jan 2026 00:00:00 GMT",
            "id": 8,
            "title": "Changes to Terms"
        },
        {
            "content": "If you have any questions about these Terms, please contact us at: support@soulbuddy.app",
            "effective_date": "Sat, 03 Jan 2026 00:00:00 GMT",
            "id": 9,
            "title": "Contact Us"
        }
    ];

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md animate-fadeIn z-50">
            <div className="glass-card flex flex-col items-center relative overflow-hidden animate-slideUp rounded-3xl"
                style={{ width: 'min(900px, calc(100% - 48px))', maxHeight: 'calc(100vh - 48px)' }}
            >
                {/* Header */}
                <div className="w-full flex items-center justify-between px-8 py-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <DescriptionOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.5rem' }} />
                        </div>
                        <h2 className="text-2xl font-bold text-white cursor-default">Terms and Conditions</h2>
                    </div>
                    <CloseRoundedIcon
                        onClick={handleClose}
                        className="cursor-pointer hover:bg-white/20 rounded-full p-1 transition-all"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.75rem' }}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-5 w-full px-8 py-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                    <style jsx>{`
                        .custom-scrollbar::-webkit-scrollbar {
                          width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                          background: rgba(255, 255, 255, 0.05);
                          border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                          background: rgba(255, 255, 255, 0.2);
                          border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                          background: rgba(255, 255, 255, 0.3);
                        }
                      `}</style>

                    {termsData.map((term, index) => (
                        <div key={term.id} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-3">
                                <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-white/70">{index + 1}</span>
                                {term.title}
                            </h3>
                            <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                                {term.content}
                            </p>
                        </div>
                    ))}

                    <div className="mt-4 text-center text-white/30 text-xs pb-4">
                        Last updated: 03 Jan 2026
                    </div>
                </div>
            </div>
        </div>
    );
}
