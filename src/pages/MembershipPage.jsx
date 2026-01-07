import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import crown from "../assets/icons/crown.svg";
import { apiService } from "../service/apiService";
import { devUrl1 } from "../env/env";

const MembershipPage = () => {
    const [selectedPlan, setSelectedPlan] = useState("1-month");
    const navigate = useNavigate();

    const plans = useMemo(
        () => [
            {
                id: "7-day",
                title: "7-DAY PLAN",
                originalPrice: "₹3,555.24",
                finalPrice: "₹935.54",
                price: "₹133.27",
                period: "Per day",
                amount: 935.54,
                highlighted: false,
            },
            {
                id: "1-month",
                title: "1-MONTH PLAN",
                originalPrice: "₹3,555.24",
                finalPrice: "₹935.54",
                price: "₹50.94",
                period: "Per day",
                amount: 1527.00,
                highlighted: true,
            },
            {
                id: "3-month",
                title: "3-MONTH PLAN",
                originalPrice: "₹3,555.24",
                finalPrice: "₹935.54",
                price: "₹29.60",
                period: "Per day",
                amount: 2664.00,
                highlighted: false,
            },
        ],
        []
    );

    const handleContinue = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const selectedPlanData = plans.find(p => p.id === selectedPlan);

            if (!userId) {
                console.error('User ID not found in localStorage');
                return;
            }

            const payload = {
                user_id: userId,
                amount: selectedPlanData?.amount || 9.99,
                transaction_id: "TID-123456789-20251215"
            };

            const response = await apiService({
                url: devUrl1 + "subscribe",
                method: 'POST',
                data: payload
            });

            if (response && !response.error) {
                console.log('Subscription successful:', response);
                navigate('/home');
            } else {
                console.error('Subscription failed:', response?.message);
            }
        } catch (error) {
            console.error('Error during subscription:', error);
        }
    };

    const splitPrice = (p) => {
        const currency = p?.trim()?.startsWith("₹") ? "₹" : "";
        const raw = p?.replace("₹", "") ?? "";
        const [intPart, decPart] = raw.split(".");
        return { currency, intPart, decPart };
    };

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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        <span className="text-xs font-semibold uppercase tracking-widest">Membership Plans</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-[-0.02em] text-white mb-6">
                        Choose Your <span className="font-serif italic text-primary">Sacred Journey</span>
                    </h1>
                    <p className="text-lg font-light leading-relaxed text-gray-300 max-w-2xl mx-auto">
                        Your personalised plan is ready. Select the membership that resonates with your path to inner oneness.
                    </p>
                </div>

                {/* Subscription Plans */}
                <div className="max-w-3xl mx-auto mb-16">
                    <div className="space-y-4">
                        {plans.map((plan) => {
                            const isSelected = selectedPlan === plan.id;
                            const { currency, intPart, decPart } = splitPrice(plan.price);

                            return (
                                <button
                                    type="button"
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={[
                                        "relative w-full text-left rounded-2xl",
                                        "border transition-all duration-300 ease-out",
                                        isSelected ? "border-white/90 shadow-lg shadow-white/10" : "border-white/10",
                                        "bg-white/[0.05]",
                                        "hover:scale-[1.02] hover:bg-white/[0.08]",
                                        !isSelected && "hover:border-white/20",
                                        "active:scale-[0.98]",
                                    ].join(" ")}
                                >
                                    <div className="flex items-center justify-between h-18 gap-3 p-5">
                                        {/* Left: radio + text */}
                                        <div className="flex items-center gap-4 min-w-0 h-full">
                                            {/* radio */}
                                            <div className="flex flex-col justify-between h-full">
                                                <div
                                                    className={[
                                                        "grid place-items-center w-[20px] h-[20px] rounded-full border",
                                                        isSelected ? "border-white/90" : "border-white/30",
                                                    ].join(" ")}
                                                >
                                                    <span
                                                        className={[
                                                            "w-[10px] h-[10px] rounded-full transition-opacity",
                                                            isSelected
                                                                ? "bg-white opacity-100"
                                                                : "bg-white opacity-0",
                                                        ].join(" ")}
                                                    />
                                                </div>
                                                {plan.highlighted && isSelected && (
                                                    <img
                                                        src={crown}
                                                        alt="crown"
                                                        className="w-5 h-5"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0 h-full">
                                                <div
                                                    className={[
                                                        "text-[13px] tracking-[0.22em] font-semibold",
                                                        isSelected ? "text-white/90" : "text-white/35",
                                                    ].join(" ")}
                                                >
                                                    {plan.title}
                                                </div>

                                                {/* small crossed + final price line */}
                                                {(plan.originalPrice || plan.finalPrice) && (
                                                    <div className="mt-1 text-[11px] text-white/30">
                                                        {plan.originalPrice && (
                                                            <span className="line-through mr-2">
                                                                {plan.originalPrice}
                                                            </span>
                                                        )}
                                                        {plan.finalPrice && <span>{plan.finalPrice}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: price badge */}
                                        <div
                                            className={[
                                                "shrink-0 flex gap-2 h-full rounded-xl px-3 py-4 text-center",
                                                isSelected ? "bg-white/90" : "bg-white/10",
                                            ].join(" ")}
                                        >
                                            <div
                                                className={[
                                                    "leading-none font-bold",
                                                    isSelected ? "text-[#656265]" : "text-[#D9D9D9B2]",
                                                ].join(" ")}
                                            >
                                                <span className="text-[24px]">
                                                    {currency}
                                                    {intPart}
                                                </span>
                                                {decPart && (
                                                    <span className="align-top text-[11px] font-semibold ml-[1px]">
                                                        {decPart}
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className={[
                                                    "mt-1 text-[10px]",
                                                    isSelected ? "text-black/60" : "text-[#D9D9D9B2]",
                                                ].join(" ")}
                                            >
                                                {plan.period}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Continue button */}
                    <button
                        onClick={handleContinue}
                        className="mt-8 w-full rounded-xl py-3 text-[16px] font-semibold
                       bg-[#D9D9D9] text-black/95 border border-white/10
                       hover:bg-white hover:shadow-lg hover:shadow-white/20
                       active:scale-[0.97] transition-all duration-300 ease-out
                       transform hover:scale-[1.01]"
                    >
                        Continue
                    </button>
                </div>

                {/* Benefits Section */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-light text-white text-center mb-12">
                        What's <span className="font-serif italic text-secondary">Included</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                            <span className="material-symbols-outlined text-primary text-3xl">spa</span>
                            <div>
                                <h4 className="font-bold text-white mb-2">Emotional Safety</h4>
                                <p className="text-sm text-white/70 leading-relaxed">A safe container for your spiritual journey with no judgment or pressure.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                            <span className="material-symbols-outlined text-primary text-3xl">self_improvement</span>
                            <div>
                                <h4 className="font-bold text-white mb-2">Personalized Practices</h4>
                                <p className="text-sm text-white/70 leading-relaxed">Daily rituals tailored to your emotional profile and current state.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                            <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                            <div>
                                <h4 className="font-bold text-white mb-2">Cognitive Rest</h4>
                                <p className="text-sm text-white/70 leading-relaxed">Guided audio, journaling prompts, and moments of intentional silence.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                            <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                            <div>
                                <h4 className="font-bold text-white mb-2">Privacy First</h4>
                                <p className="text-sm text-white/70 leading-relaxed">Your data is sacred. No selling, no manipulation, complete control.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy Note */}
                <div className="mt-16 max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 mb-4 text-text-muted/80">
                        <span className="material-symbols-outlined text-lg">lock</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Your Data is Sacred</span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                        We believe your spiritual journey is private. We never sell your data, we don't use manipulative algorithms to keep you scrolling, and you can export your journal entries or delete your account fully at any time. This is a safe container.
                    </p>
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

export default MembershipPage;
