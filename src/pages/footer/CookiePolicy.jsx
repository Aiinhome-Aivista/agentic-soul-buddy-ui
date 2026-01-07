import React from 'react';
import { useNavigate } from 'react-router-dom';
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined';

const CookiePolicy = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "What Are Cookies",
            content: "Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the service or a third-party to recognize you and make your next visit easier and the service more useful to you. Cookies can be 'persistent' or 'session' cookies."
        },
        {
            title: "How We Use Cookies",
            content: "When you use and access our service, we may place a number of cookie files in your web browser. We use cookies for the following purposes: to enable certain functions of the service, to provide analytics, to store your preferences, and to enable advertisements delivery, including behavioral advertising."
        },
        {
            title: "Essential Cookies",
            content: "These cookies are strictly necessary to provide you with services available through our website and to use some of its features. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our website functions. You can block or delete them by changing your browser settings."
        },
        {
            title: "Analytics Cookies",
            content: "We use analytics cookies to track information about how our website is used so that we can make improvements. These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are."
        },
        {
            title: "Preference Cookies",
            content: "Preference cookies enable our website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in. These cookies help us provide you with a personalized experience."
        },
        {
            title: "Third-Party Cookies",
            content: "In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on. These third-party cookies are subject to the respective privacy policies of these external services."
        },
        {
            title: "Your Choices Regarding Cookies",
            content: "If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly."
        },
        {
            title: "Managing Cookies in Your Browser",
            content: "Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like login information."
        },
        {
            title: "Updates to This Policy",
            content: "We may update our Cookie Policy from time to time to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies."
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
                            <CookieOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.75rem' }} />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-[-0.02em] text-white mb-6">
                        Cookie <span className="font-serif italic text-primary">Policy</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed text-gray-300 max-w-2xl mx-auto">
                        Learn about how we use cookies to improve your experience on our platform.
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

                    {/* Cookie Types Table */}
                    <div className="mt-12 bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6">Types of Cookies We Use</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Essential Cookies</h4>
                                    <p className="text-sm text-white/70">Required for basic website functionality</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                <span className="material-symbols-outlined text-primary">analytics</span>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Analytics Cookies</h4>
                                    <p className="text-sm text-white/70">Help us understand how visitors use our site</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                <span className="material-symbols-outlined text-primary">tune</span>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Preference Cookies</h4>
                                    <p className="text-sm text-white/70">Remember your settings and preferences</p>
                                </div>
                            </div>
                        </div>
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
                            <span className="material-symbols-outlined text-secondary text-3xl">contact_support</span>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">Questions About Cookies?</h3>
                                <p className="text-white/70 leading-relaxed">
                                    If you have any questions about our use of cookies or other technologies, please email us at
                                    privacy@cosmicwisdom.com or contact us through our contact form.
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

export default CookiePolicy;
