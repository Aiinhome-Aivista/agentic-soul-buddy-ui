import React, { useState, useEffect } from 'react';
import { apiService } from '../../service/apiService';
import { get_url1 } from '../../connection/connection';
import "../../styles/modal.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function DisclaimerModal({ OnClose, onConfirm, hideFooter }) {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [disclaimerData, setDisclaimerData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDisclaimer = async () => {
            try {
                const response = await apiService({
                    url: get_url1.disclaimer,
                    method: 'GET'
                });
                if (response && response.success && response.data) {
                    setDisclaimerData(response.data);
                }
            } catch (error) {
                console.error("Error fetching disclaimer:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDisclaimer();
    }, []);

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

                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        disclaimerData.map((item, index) => (
                            <div key={item.id} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
                                <h3 className="text-lg font-semibold text-white mb-3">{index + 1}. {item.title}</h3>
                                <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                                    {item.content}
                                </p>
                            </div>
                        ))
                    )}
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
