import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const TermsOfUse = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: "handshake",
            title: "Acceptance of Terms",
            content: "By accessing and using Soul Junction, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our service. Your continued use of the platform constitutes acceptance of any updates to these terms."
        },
        {
            icon: "license",
            title: "Use License",
            content: "We grant you a personal, non-transferable, non-exclusive license to use Soul Junction for your personal spiritual growth. You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, or sell any content or software obtained from our service."
        },
        {
            icon: "account_circle",
            title: "User Account",
            content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms."
        },
        {
            icon: "edit",
            title: "User Content",
            content: "You retain ownership of any content you create within Soul Junction. By posting content, you grant us a license to use, store, and display that content solely for the purpose of providing our services to you. We will never share your personal reflections or journal entries with third parties."
        },
        {
            icon: "block",
            title: "Prohibited Uses",
            content: "You may not use our service for any unlawful purpose, to harass or harm others, to violate intellectual property rights, to transmit malicious code, or to interfere with the proper functioning of the platform. We reserve the right to terminate access for violations of these prohibitions."
        },
        {
            icon: "copyright",
            title: "Intellectual Property",
            content: "All content, features, and functionality of Soul Junction, including but not limited to text, graphics, logos, and software, are the exclusive property of Soul Junction Inc. and are protected by copyright, trademark, and other intellectual property laws."
        },
        {
            icon: "cancel",
            title: "Termination",
            content: "We may terminate or suspend your access to our service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the service will cease immediately. You may also terminate your account at any time through your account settings."
        },
        {
            icon: "gavel",
            title: "Limitation of Liability",
            content: "Soul Junction and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. Our total liability shall not exceed the amount you paid for the service in the past 12 months."
        },
        {
            icon: "info",
            title: "Disclaimer",
            content: "Our service is provided 'as is' without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free. Soul Junction is not a substitute for professional mental health care or medical advice."
        },
        {
            icon: "balance",
            title: "Governing Law",
            content: "These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms or your use of the service shall be resolved through binding arbitration."
        },
        {
            icon: "update",
            title: "Changes to Terms",
            content: "We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through the app. Your continued use of the service after changes take effect constitutes acceptance of the modified Terms."
        },
        {
            icon: "contact_support",
            title: "Contact Information",
            content: "If you have any questions about these Terms of Use, please contact us at legal@souljunction.com. We are committed to addressing your concerns and ensuring a positive experience with our service."
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
                        <span className="material-symbols-outlined">gavel</span>
                        <span className="text-sm font-semibold uppercase tracking-wider">Legal Agreement</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white mb-6">
                        Terms of <span className="font-serif italic text-primary">Use</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Please read these terms carefully before using Soul Junction. They outline your rights and responsibilities as a member of our community.
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
                    <span className="material-symbols-outlined text-4xl text-secondary mb-4">help</span>
                    <h2 className="text-2xl font-light text-white mb-4">Questions About These Terms?</h2>
                    <p className="text-gray-400 mb-6">
                        If you have any questions or concerns about our Terms of Use, we're here to help.
                    </p>
                    <button
                        onClick={() => navigate('/contact')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-dark text-white font-medium hover:bg-primary-deep transition-colors"
                    >
                        <span>Contact Our Legal Team</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </section> */}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default TermsOfUse;
