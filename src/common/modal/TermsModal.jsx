import { apiService } from '../../service/apiService';
import { get_url1 } from '../../connection/connection';
import React, { useContext, useEffect, useState } from 'react';
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

    const [termsData, setTermsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const response = await apiService({
                    url: get_url1.terms,
                    method: 'GET'
                });
                if (response && response.success && response.data) {
                    setTermsData(response.data);
                }
            } catch (error) {
                console.error("Error fetching terms:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTerms();
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

                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        termsData.map((term, index) => (
                            <div key={term.id} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-3">
                                    <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-white/70">{index + 1}</span>
                                    {term.title}
                                </h3>
                                <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                                    {term.content}
                                </p>
                            </div>
                        )))}

                    <div className="mt-4 text-center text-white/30 text-xs pb-4">
                        Last updated: 03 Jan 2026
                    </div>
                </div>
            </div>
        </div>
    );
}
