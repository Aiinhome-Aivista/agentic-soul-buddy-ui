import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';

const SubscriptionPolicy = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Subscription Plans",
            content: "Cosmic Wisdom offers various subscription plans including 7-day, 1-month, and 3-month options. Each plan provides full access to all features and content available on our platform. You can choose the plan that best fits your spiritual journey and upgrade or downgrade at any time."
        },
        {
            title: "Billing and Payment",
            content: "Subscriptions are billed in advance on a recurring basis according to your chosen plan (7-day, monthly, or quarterly). Payment will be charged to your selected payment method at confirmation of purchase and at the start of each renewal period. We accept various payment methods including credit cards, debit cards, and digital wallets."
        },
        {
            title: "Free Trial",
            content: "New users may be eligible for a 7-day free trial period. During the trial, you will have full access to all premium features. If you do not cancel before the trial ends, you will automatically be charged for your selected subscription plan. You can cancel anytime during the trial period without being charged."
        },
        {
            title: "Automatic Renewal",
            content: "Your subscription will automatically renew at the end of each billing period unless you cancel it before the renewal date. The renewal charge will be the same as your initial subscription fee unless we notify you in advance of a price change. You will receive a reminder email before each renewal."
        },
        {
            title: "Cancellation Policy",
            content: "You may cancel your subscription at any time through your account settings or by contacting our support team. Upon cancellation, you will continue to have access to premium features until the end of your current billing period. No refunds will be provided for partial periods, but you will not be charged for subsequent periods."
        },
        {
            title: "Refund Policy",
            content: "We offer a 14-day money-back guarantee for first-time subscribers. If you're not satisfied with our service within the first 14 days of your initial subscription, contact us for a full refund. Refunds for subsequent renewals are handled on a case-by-case basis. Please contact our support team to discuss your specific situation."
        },
        {
            title: "Price Changes",
            content: "Cosmic Wisdom reserves the right to modify subscription prices at any time. We will provide you with at least 30 days' notice before any price change takes effect. If you do not agree with the price change, you may cancel your subscription before the new price takes effect."
        },
        {
            title: "Account Sharing",
            content: "Your subscription is personal to you and should not be shared with others. Each subscription is intended for individual use only. We reserve the right to terminate accounts that violate this policy. If you need multiple accounts for your family or organization, please contact us about our group plans."
        },
        {
            title: "Service Modifications",
            content: "We continuously work to improve our service and may add, modify, or remove features at any time. While we strive to enhance your experience, we cannot guarantee that all features will remain available indefinitely. We will notify you of any significant changes to the service."
        },
        {
            title: "Suspension and Termination",
            content: "We reserve the right to suspend or terminate your subscription if you violate our Terms of Service or engage in fraudulent activity. In such cases, you will not be entitled to a refund. We will make reasonable efforts to notify you before taking such action unless prohibited by law or if immediate action is necessary."
        },
        {
            title: "Data Retention After Cancellation",
            content: "After you cancel your subscription, your account data will be retained for 90 days, during which you can reactivate your subscription and retain all your previous data. After 90 days, your data may be permanently deleted. You can request immediate deletion of your data by contacting our support team."
        },
        {
            title: "Contact for Subscription Issues",
            content: "If you have any questions about your subscription, billing, or need assistance with cancellation, please contact our support team at support@cosmicwisdom.com. We're here to help ensure your experience with Cosmic Wisdom is smooth and fulfilling."
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
                            <CardMembershipOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.75rem' }} />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-[-0.02em] text-white mb-6">
                        Subscription <span className="font-serif italic text-primary">Policy</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed text-gray-300 max-w-2xl mx-auto">
                        Everything you need to know about your membership with Cosmic Wisdom.
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

                    {/* Quick Reference */}
                    <div className="mt-12 bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6">Quick Reference</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                                <span className="material-symbols-outlined text-secondary">schedule</span>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Free Trial</h4>
                                    <p className="text-sm text-white/70">7 days, no charge</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                                <span className="material-symbols-outlined text-secondary">replay</span>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Money-Back Guarantee</h4>
                                    <p className="text-sm text-white/70">14 days for new subscribers</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                                <span className="material-symbols-outlined text-secondary">cancel</span>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Cancel Anytime</h4>
                                    <p className="text-sm text-white/70">No long-term commitment</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                                <span className="material-symbols-outlined text-secondary">storage</span>
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Data Retention</h4>
                                    <p className="text-sm text-white/70">90 days after cancellation</p>
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

                    {/* Our Commitment */}
                    <div className="mt-12 bg-gradient-to-br from-primary-dark/20 to-primary-deep/20 rounded-3xl p-8 md:p-12 border border-white/10">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-secondary text-3xl">favorite</span>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">Our Commitment to You</h3>
                                <p className="text-white/70 leading-relaxed mb-4">
                                    We don't punish absence. We celebrate return. Your membership is not a transaction—it's a
                                    relationship. The space will always be here, clean and quiet, ready to receive you whenever
                                    you need it.
                                </p>
                                <p className="text-white/70 leading-relaxed">
                                    Questions about your subscription? Contact us at support@cosmicwisdom.com. We're here to help.
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

export default SubscriptionPolicy;
