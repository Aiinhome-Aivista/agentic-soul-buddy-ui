import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: "visibility",
            title: "Information We Collect",
            content: "We collect information you provide directly, such as your name, email address, and any content you create within the app. We also collect usage data to improve your experience, including how you interact with our features and the time you spend in different areas of the sanctuary."
        },
        {
            icon: "security",
            title: "How We Protect Your Data",
            content: "Your data is encrypted using industry-standard protocols. We employ advanced security measures including SSL encryption, secure servers, and regular security audits. Your spiritual journey and personal reflections are kept completely private and are never shared with third parties."
        },
        {
            icon: "share",
            title: "Data Sharing",
            content: "We do not sell, trade, or rent your personal information to third parties. We may share anonymized, aggregate data for research purposes, but this data cannot be traced back to you. Your trust is sacred to us."
        },
        {
            icon: "cookie",
            title: "Cookies & Tracking",
            content: "We use essential cookies to maintain your session and preferences. We do not use invasive tracking or advertising cookies. You can control cookie preferences through your browser settings at any time."
        },
        {
            icon: "storage",
            title: "Data Retention",
            content: "We retain your data only as long as necessary to provide our services. You can request deletion of your account and all associated data at any time. Upon deletion, your data is permanently removed from our servers within 30 days."
        },
        {
            icon: "child_care",
            title: "Children's Privacy",
            content: "Our service is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately."
        },
        {
            icon: "edit_note",
            title: "Your Rights",
            content: "You have the right to access, correct, or delete your personal data. You can export your data at any time. You may also opt out of non-essential communications while still using our services."
        },
        {
            icon: "update",
            title: "Policy Updates",
            content: "We may update this policy periodically. We will notify you of any material changes via email or through the app. Your continued use of our services after changes constitutes acceptance of the updated policy."
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-gray-100 font-display">
            {/* Header */}
            <header className="w-full border-b border-white/5 bg-background-dark/90 backdrop-blur-sm sticky top-0 z-50">
                <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1280px] mx-auto">
                    <div onClick={() => navigate('/')} className="flex items-center gap-3 text-white cursor-pointer group">
                        <h2 className="text-3xl font-semibold tracking-wide uppercase text-primary">Soul Junction</h2>
                    </div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 px-6 md:px-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>

                <div className="max-w-[900px] mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                        <span className="material-symbols-outlined">shield</span>
                        <span className="text-sm font-semibold uppercase tracking-wider">Your Privacy Matters</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white mb-6">
                        Privacy <span className="font-serif italic text-primary">Policy</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Your spiritual journey is sacred and private. We are committed to protecting your personal information with the utmost care and transparency.
                    </p>
                    <p className="text-sm text-text-muted mt-6">Last updated: January 7, 2026</p>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-16 px-6 md:px-12">
                <div className="max-w-[900px] mx-auto">
                    <div className="grid gap-6">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:bg-white/[0.07]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <span className="material-symbols-outlined text-primary">{section.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-3">{section.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">{section.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            {/* <section className="py-16 px-6 md:px-12 bg-white/5 border-t border-white/5">
                <div className="max-w-[600px] mx-auto text-center">
                    <span className="material-symbols-outlined text-4xl text-secondary mb-4">mail</span>
                    <h2 className="text-2xl font-light text-white mb-4">Questions About Your Privacy?</h2>
                    <p className="text-gray-400 mb-6">
                        If you have any questions or concerns about our privacy practices, we're here to help.
                    </p>
                    <button
                        onClick={() => navigate('/contact')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-dark text-white font-medium hover:bg-primary-deep transition-colors"
                    >
                        <span>Contact Our Privacy Team</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </section> */}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
