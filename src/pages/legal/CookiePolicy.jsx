import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const CookiePolicy = () => {
    const navigate = useNavigate();

    const cookieTypes = [
        {
            type: "Essential Cookies",
            icon: "lock",
            description: "These cookies are necessary for the website to function properly. They enable core functionality such as security, session management, and accessibility.",
            examples: ["Session ID", "Authentication tokens", "Security preferences"],
            canDisable: false
        },
        {
            type: "Preference Cookies",
            icon: "tune",
            description: "These cookies remember your preferences and settings to provide a more personalized experience when you return to our sanctuary.",
            examples: ["Language preferences", "Theme settings", "Audio preferences"],
            canDisable: true
        },
        {
            type: "Analytics Cookies",
            icon: "analytics",
            description: "These cookies help us understand how visitors interact with our website, helping us improve your experience.",
            examples: ["Page visit tracking", "Feature usage", "Performance metrics"],
            canDisable: true
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-gray-100 font-display">
            {/* Header */}
            <header className="w-full border-b border-white/5 bg-background-dark/90 backdrop-blur-sm sticky top-0 z-50">
                <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1280px] mx-auto">
                    <div onClick={() => navigate('/')} className="flex items-center gap-3 text-white cursor-pointer group">
                        <h2 className="text-lg font-semibold tracking-wide uppercase text-primary">Cosmic Wisdom</h2>
                    </div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 px-6 md:px-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent"></div>
                <div className="absolute top-10 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="max-w-[900px] mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6">
                        <span className="material-symbols-outlined">cookie</span>
                        <span className="text-sm font-semibold uppercase tracking-wider">Transparency First</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white mb-6">
                        Cookie <span className="font-serif italic text-secondary">Policy</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        We believe in complete transparency about how we use cookies. Here's everything you need to know about our cookie practices.
                    </p>
                    <p className="text-sm text-text-muted mt-6">Last updated: January 7, 2026</p>
                </div>
            </section>

            {/* What Are Cookies */}
            <section className="py-12 px-6 md:px-12">
                <div className="max-w-[900px] mx-auto">
                    <div className="bg-gradient-to-br from-primary-dark/20 to-primary-deep/20 rounded-3xl p-8 md:p-12 border border-primary/20">
                        <div className="flex items-start gap-4 mb-6">
                            <span className="material-symbols-outlined text-3xl text-primary">help</span>
                            <div>
                                <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Cookies are small text files that are placed on your device when you visit a website. They help the website remember your preferences and provide a better experience. We use cookies sparingly and only when necessary to improve your journey through our sanctuary.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cookie Types */}
            <section className="py-12 px-6 md:px-12">
                <div className="max-w-[900px] mx-auto">
                    <h2 className="text-2xl font-light text-white text-center mb-10">Types of Cookies We Use</h2>
                    <div className="grid gap-6">
                        {cookieTypes.map((cookie, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-secondary/30 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-2xl text-secondary">{cookie.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-xl font-semibold text-white">{cookie.type}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${cookie.canDisable ? 'bg-primary/10 text-primary' : 'bg-white/10 text-gray-400'}`}>
                                                {cookie.canDisable ? 'Optional' : 'Required'}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 leading-relaxed mb-4">{cookie.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {cookie.examples.map((example, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-sm text-gray-500">
                                                    {example}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Managing Cookies */}
            <section className="py-16 px-6 md:px-12 bg-white/5">
                <div className="max-w-[900px] mx-auto">
                    <div className="text-center mb-10">
                        <span className="material-symbols-outlined text-4xl text-primary mb-4">settings</span>
                        <h2 className="text-2xl font-light text-white mb-4">Managing Your Cookie Preferences</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            You have full control over your cookie preferences. You can manage cookies through your browser settings or use our preference center.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <span className="material-symbols-outlined text-2xl text-secondary mb-4">computer</span>
                            <h3 className="text-lg font-semibold text-white mb-2">Browser Settings</h3>
                            <p className="text-gray-400 text-sm">
                                Most browsers allow you to control cookies through their settings. You can delete existing cookies and set preferences for new ones.
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <span className="material-symbols-outlined text-2xl text-secondary mb-4">toggle_on</span>
                            <h3 className="text-lg font-semibold text-white mb-2">Our Preference Center</h3>
                            <p className="text-gray-400 text-sm">
                                Use our built-in preference center to customize which optional cookies you'd like to accept while using our platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CookiePolicy;
