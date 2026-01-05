import React, { useState, useEffect, useContext } from 'react';
import { apiService } from '../../service/apiService';
import { get_url1 } from '../../connection/connection';
import "../../styles/modal.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Context } from '../helper/Context';

export default function FaqModal({ onClose }) {
    const { setFaqModal } = useContext(Context);
    const [faqData, setFaqData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCategory, setExpandedCategory] = useState(null); // Or expanded question, depending on design. Let's do categories first since they are nested.

    // Actually, looking at the data structure, it's Category -> FAQs. 
    // It might be cleaner to expand questions individually.
    // Let's assume we show categories as sections and questions as accordions within them.
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            setFaqModal(false);
        }
    };

    const toggleQuestion = (question) => {
        setExpandedQuestion(expandedQuestion === question ? null : question);
    };

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await apiService({
                    url: get_url1.faq,
                    method: 'GET'
                });
                if (response && response.success && response.data) {
                    setFaqData(response.data);
                }
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
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
                            <HelpOutlineRoundedIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.5rem' }} />
                        </div>
                        <h2 className="text-2xl font-bold text-white cursor-default">Frequently Asked Questions</h2>
                    </div>
                    <CloseRoundedIcon
                        onClick={handleClose}
                        className="cursor-pointer hover:bg-white/20 rounded-full p-1 transition-all"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.75rem' }}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6 w-full px-8 py-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 120px)' }}>
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
                        faqData.map((category, catIndex) => (
                            <div key={catIndex} className="flex flex-col gap-3">
                                <h3 className="text-xl font-bold text-white/90 px-1 sticky top-0 bg-[#352F44]/50 backdrop-blur-sm py-2 rounded-lg -mx-1 z-10">{category.category}</h3>
                                <div className="flex flex-col gap-3">
                                    {category.faqs.map((faq, faqIndex) => {
                                        const uniqueId = `${catIndex}-${faqIndex}`;
                                        const isExpanded = expandedQuestion === uniqueId;

                                        return (
                                            <div
                                                key={uniqueId}
                                                className={`bg-white/5 rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-white/20 bg-white/10' : 'border-white/10 hover:border-white/20'}`}
                                            >
                                                <button
                                                    onClick={() => toggleQuestion(uniqueId)}
                                                    className="w-full flex items-center justify-between p-5 text-left"
                                                >
                                                    <span className="text-lg font-medium text-white pr-4">{faq.question}</span>
                                                    <ExpandMoreIcon
                                                        sx={{
                                                            color: 'white',
                                                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                            transition: 'transform 0.3s ease'
                                                        }}
                                                    />
                                                </button>

                                                <div
                                                    className={`px-5 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                                                >
                                                    <p className="text-white/70 leading-relaxed border-t border-white/10 pt-4">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
