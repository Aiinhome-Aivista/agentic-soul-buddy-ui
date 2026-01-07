import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Information We Collect",
            content: "We collect information that you provide directly to us, including your name, email address, and any other information you choose to provide. We also automatically collect certain information about your device when you use our services, including your IP address, browser type, and usage data."
        },
        {
            title: "How We Use Your Information",
            content: "We use the information we collect to provide, maintain, and improve our services, to personalize your experience, to communicate with you, and to protect the safety and security of our users. We will never sell your personal information to third parties."
        },
        {
            title: "Data Storage and Security",
            content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. Your data is encrypted both in transit and at rest."
        },
        {
            title: "Your Rights and Choices",
            content: "You have the right to access, update, or delete your personal information at any time. You can export your journal entries and other data, or request complete account deletion. We will respond to such requests within 30 days."
        },
        {
            title: "Cookies and Tracking",
            content: "We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service."
        },
        {
            title: "Third-Party Services",
            content: "We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, or assist us in analyzing how our service is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose."
        },
        {
            title: "Children's Privacy",
            content: "Our service is not intended for children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us."
        },
        {
            title: "Changes to This Policy",
            content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date. You are advised to review this Privacy Policy periodically for any changes."
        },
        {
            title: "Contact Us",
            content: "If you have any questions about this Privacy Policy, please contact us at privacy@cosmicwisdom.com. We are committed to resolving any concerns you may have about your privacy."
        }
    ];

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
                            <ShieldOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.75rem' }} />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-[-0.02em] text-white mb-6">
                        Privacy <span className="font-serif italic text-primary">Policy</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed text-gray-300 max-w-2xl mx-auto">
                        Your privacy is sacred to us. Learn how we protect and respect your personal information.
                    </p>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all"
                            >
                                <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm text-white/70 font-bold">
                                        {index + 1}
                                    </span>
                                    {section.title}
                                </h3>
                                <p className="text-white/70 leading-relaxed text-base md:text-lg pl-12">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Last Updated */}
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <span className="material-symbols-outlined text-white/50 text-sm">schedule</span>
                            <span className="text-white/50 text-sm">Last updated: 03 Jan 2026</span>
                        </div>
                    </div>

                    {/* Privacy Pledge */}
                    <div className="mt-12 bg-gradient-to-br from-primary-dark/20 to-primary-deep/20 rounded-3xl p-8 md:p-12 border border-white/10">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-secondary text-3xl">lock</span>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">Our Privacy Pledge</h3>
                                <p className="text-white/70 leading-relaxed">
                                    We believe your spiritual journey is private. We never sell your data, we don't use manipulative
                                    algorithms to keep you scrolling, and you can export your journal entries or delete your account
                                    fully at any time. This is a safe container.
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

export default PrivacyPolicy;
