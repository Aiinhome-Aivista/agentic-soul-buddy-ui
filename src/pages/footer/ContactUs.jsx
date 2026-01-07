import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const ContactUs = () => {
    const navigate = useNavigate();

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
                            <EmailOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.75rem' }} />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-[-0.02em] text-white mb-6">
                        Get in <span className="font-serif italic text-primary">Touch</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed text-gray-300 max-w-2xl mx-auto">
                        We're here to support your journey. Reach out to us anytime.
                    </p>
                </div>

                {/* Contact Information */}
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-primary text-3xl">email</span>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                                    <p className="text-white/70 mb-3">For general inquiries and support</p>
                                    <a href="mailto:support@cosmicwisdom.com" className="text-primary hover:text-primary-dark transition-colors">
                                        support@cosmicwisdom.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Response Time</h3>
                                    <p className="text-white/70 mb-3">We typically respond within</p>
                                    <p className="text-primary font-semibold">24-48 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Subject</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Message</label>
                                <textarea
                                    rows="6"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors resize-none"
                                    placeholder="Tell us what's on your mind..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-8 py-3 bg-primary-dark text-white font-semibold rounded-xl hover:bg-primary-deep transition-all hover:scale-105 shadow-lg shadow-primary-dark/20"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 bg-gradient-to-br from-primary-dark/20 to-primary-deep/20 rounded-3xl p-8 md:p-12 border border-white/10">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-secondary text-3xl">info</span>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">Before You Reach Out</h3>
                                <p className="text-white/70 leading-relaxed mb-4">
                                    Please check our FAQ section for quick answers to common questions. For account-specific issues,
                                    make sure to include your registered email address in your message.
                                </p>
                                <p className="text-white/70 leading-relaxed">
                                    We value your privacy and will never share your information with third parties.
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
        </div>
    );
};

export default ContactUs;
