import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../service/apiService';
import { get_url1 } from '../connection/connection';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const TermsPage = () => {
    const navigate = useNavigate();
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
        <div className="min-h-screen bg-background-dark text-gray-100 font-display overflow-x-hidden">
            {/* Header */}
            <header className="w-full border-b border-white/5 bg-background-dark/90 backdrop-blur-sm sticky top-0 z-50">
                <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1280px] mx-auto">
                    <div className="flex items-center gap-3 text-white cursor-pointer group" onClick={() => navigate('/')}>
                        <h2 className="text-lg font-semibold tracking-wide uppercase text-primary">Cosmic Wisdom</h2>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm font-medium text-text-muted hover:text-primary-dark transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                            <DescriptionOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.75rem' }} />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-[-0.02em] text-white mb-6">
                        Terms and <span className="font-serif italic text-primary">Conditions</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed text-gray-300 max-w-2xl mx-auto">
                        Our commitment to transparency and your rights within this sacred space.
                    </p>
                </div>

                {/* Terms Content */}
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {termsData.map((term, index) => (
                                <div
                                    key={term.id}
                                    className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all"
                                >
                                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center gap-4">
                                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm text-white/70 font-bold">
                                            {index + 1}
                                        </span>
                                        {term.title}
                                    </h3>
                                    <p className="text-white/70 leading-relaxed whitespace-pre-wrap text-base md:text-lg pl-12">
                                        {term.content}
                                    </p>
                                </div>
                            ))}

                            {termsData.length === 0 && !loading && (
                                <div className="text-center py-16">
                                    <p className="text-white/50 text-lg">No terms and conditions available at this time.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Last Updated */}
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <span className="material-symbols-outlined text-white/50 text-sm">schedule</span>
                            <span className="text-white/50 text-sm">Last updated: 03 Jan 2026</span>
                        </div>
                    </div>
                </div>

                {/* Privacy Note */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <div className="bg-gradient-to-br from-primary-dark/20 to-primary-deep/20 rounded-3xl p-8 md:p-12 border border-white/10">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-secondary text-3xl">lock</span>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">Your Data is Sacred</h3>
                                <p className="text-white/70 leading-relaxed">
                                    We believe your spiritual journey is private. We never sell your data, we don't use manipulative algorithms to keep you scrolling, and you can export your journal entries or delete your account fully at any time. This is a safe container.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-background-dark border-t border-white/10 pt-12 pb-8 px-6 md:px-12 mt-16">
                <div className="max-w-[1280px] mx-auto text-center">
                    <p className="text-gray-500 text-xs">© 2023 Cosmic Wisdom Inc. All rights reserved.</p>
                </div>
            </footer>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
};

export default TermsPage;
