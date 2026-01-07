import React from 'react';
import { useNavigate } from 'react-router-dom';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';

const TermsOfUse = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Acceptance of Terms",
            content: "By accessing and using Cosmic Wisdom, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
        },
        {
            title: "Use License",
            content: "Permission is granted to temporarily access the materials (information or software) on Cosmic Wisdom for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose; attempt to decompile or reverse engineer any software contained on Cosmic Wisdom; or remove any copyright or other proprietary notations from the materials."
        },
        {
            title: "User Account",
            content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password. Cosmic Wisdom reserves the right to refuse service, terminate accounts, or remove or edit content in its sole discretion."
        },
        {
            title: "User Content",
            content: "Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post on or through the service, including its legality, reliability, and appropriateness. By posting content, you represent and warrant that you have the right to do so."
        },
        {
            title: "Prohibited Uses",
            content: "You may not use our service: for any unlawful purpose or to solicit others to perform or participate in any unlawful acts; to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; to infringe upon or violate our intellectual property rights or the intellectual property rights of others; to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate; to submit false or misleading information; or to upload or transmit viruses or any other type of malicious code."
        },
        {
            title: "Intellectual Property",
            content: "The service and its original content, features, and functionality are and will remain the exclusive property of Cosmic Wisdom and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Cosmic Wisdom."
        },
        {
            title: "Termination",
            content: "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the service or contact us to delete your account."
        },
        {
            title: "Limitation of Liability",
            content: "In no event shall Cosmic Wisdom, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service."
        },
        {
            title: "Disclaimer",
            content: "Your use of the service is at your sole risk. The service is provided on an 'AS IS' and 'AS AVAILABLE' basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance."
        },
        {
            title: "Governing Law",
            content: "These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Cosmic Wisdom operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
        },
        {
            title: "Changes to Terms",
            content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion."
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
                            <GavelOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.75rem' }} />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-[-0.02em] text-white mb-6">
                        Terms of <span className="font-serif italic text-primary">Use</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed text-gray-300 max-w-2xl mx-auto">
                        Please read these terms carefully before using our service.
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

                    {/* Contact Info */}
                    <div className="mt-12 bg-gradient-to-br from-primary-dark/20 to-primary-deep/20 rounded-3xl p-8 md:p-12 border border-white/10">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-secondary text-3xl">help</span>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">Questions About These Terms?</h3>
                                <p className="text-white/70 leading-relaxed">
                                    If you have any questions about these Terms of Use, please contact us at legal@cosmicwisdom.com.
                                    We're here to help clarify any concerns you may have.
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

export default TermsOfUse;
