import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { apiService } from "../../service/apiService";
import { get_url1 } from "../../connection/connection";

const SubscriptionPolicy = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await apiService({
                    url: get_url1.subscription_plan,
                    method: 'GET'
                });
                if (response && response.status === "success" && response.data) {
                    const transformedPlans = response.data.map(plan => ({
                        name: plan.planName,
                        price: `₹${plan.finalPrice}`,
                        originalPrice: plan.originalPrice ? `₹${plan.originalPrice}` : null,
                        period: "",
                        perDay: plan.usage,
                        discount: plan.discount,
                        validityDays: plan.validityDays,
                        isTrial: plan.isTrial,
                        features: plan.isTrial
                            ? ["14 days free trial", `${plan.usage}`, "Basic features access", "Personalized recommendations"]
                            : plan.title.toLowerCase() === "silver"
                                ? [`${plan.validityDays} days access`, `${plan.usage}`, "Priority support", "Advanced analytics", "Journal features"]
                                : [`${plan.validityDays} days access`, `${plan.usage}`, "All Silver features", "Exclusive workshops", "Early access to features", "Best value"],
                        highlighted: plan.title.toLowerCase() === "gold"
                    }));
                    setPlans(transformedPlans);
                }
            } catch (error) {
                console.error('Error fetching subscription plans:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const policies = [
        {
            icon: "event_repeat",
            title: "Billing Cycle",
            content: "Subscriptions are billed at the beginning of each billing period. Monthly plans renew every 30 days, while 90-day plans renew every 90 days from your start date."
        },
        {
            icon: "cancel",
            title: "Cancellation",
            content: "You can cancel your subscription at any time. Your access will continue until the end of your current billing period. We don't believe in punishing those who need to step away."
        },
        {
            icon: "replay",
            title: "Refund Policy",
            content: "We offer a 14-day money-back guarantee for new subscriptions. If our sanctuary isn't the right fit, we'll refund your payment, no questions asked."
        },
        {
            icon: "upgrade",
            title: "Plan Changes",
            content: "You can upgrade or downgrade your plan at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the start of your next billing cycle."
        },
        {
            icon: "pause_circle",
            title: "Pause Subscription",
            content: "Life happens. You can pause your subscription for up to 3 months. During this time, you won't be charged, and your data and progress will be safely preserved."
        },
        {
            icon: "card_giftcard",
            title: "Gift Subscriptions",
            content: "Gift subscriptions are non-refundable but can be transferred. Recipients receive the full duration of the gifted plan starting from activation."
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-gray-100 font-display">
            {/* Header */}
            <header className="w-full border-b border-white/5 bg-background-dark/90 backdrop-blur-sm sticky top-0 z-50">
                <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-[1280px] mx-auto">
                    <div onClick={() => navigate('/')} className="flex items-center gap-3 text-white cursor-pointer group">
                        <h2 className="text-lg font-semibold tracking-wide uppercase text-primary">Soul Junction</h2>
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
                <div className="absolute top-20 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>

                <div className="max-w-[900px] mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                        <span className="material-symbols-outlined">loyalty</span>
                        <span className="text-sm font-semibold uppercase tracking-wider">Fair & Flexible</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white mb-6">
                        Subscription <span className="font-serif italic text-primary">Policy</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        We believe in a relationship, not a transaction. Our subscription terms are designed to be fair, flexible, and respectful of your journey.
                    </p>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className="py-12 px-6 md:px-12">
                <div className="max-w-[1000px] mx-auto">
                    <h2 className="text-2xl font-light text-white text-center mb-10">Our Membership Tiers</h2>
                    {loading ? (
                        <div className="text-center text-white/60">Loading plans...</div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`relative rounded-2xl p-6 border transition-all duration-300 ${plan.highlighted
                                        ? 'bg-gradient-to-b from-primary-dark/30 to-primary-deep/20 border-primary/30 scale-105'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    {plan.highlighted && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <span className="px-3 py-1 bg-[#1a1a1a] border border-primary/30 text-primary text-xs font-semibold rounded-full shadow-lg">Most Popular</span>
                                        </div>
                                    )}
                                    {plan.isTrial && (
                                        <div className="text-center mb-4">
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">Free Trial</span>
                                        </div>
                                    )}
                                    {plan.discount && plan.discount !== "0%" && !plan.isTrial && (
                                        <div className="text-center mb-4">
                                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full">{plan.discount} OFF</span>
                                        </div>
                                    )}
                                    <h3 className="text-xl font-semibold text-white text-center mb-2">{plan.name}</h3>
                                    <div className="text-center mb-2">
                                        {plan.originalPrice && (
                                            <span className="text-lg text-gray-500 line-through mr-2">{plan.originalPrice}</span>
                                        )}
                                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                                        <span className="text-gray-400">{plan.period}</span>
                                    </div>
                                    <div className="text-center mb-6">
                                        <span className="text-sm text-primary font-medium">{plan.perDay}</span>
                                    </div>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                                                <span className="material-symbols-outlined text-primary text-base">check</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Policy Details */}
            <section className="py-16 px-6 md:px-12 bg-white/5">
                <div className="max-w-[900px] mx-auto">
                    <h2 className="text-2xl font-light text-white text-center mb-10">Policy Details</h2>
                    <div className="grid gap-6">
                        {policies.map((policy, index) => (
                            <div
                                key={index}
                                className="group bg-background-dark/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <span className="material-symbols-outlined text-primary">{policy.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{policy.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">{policy.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            {/* <section className="py-16 px-6 md:px-12">
                <div className="max-w-[600px] mx-auto text-center">
                    <span className="material-symbols-outlined text-4xl text-secondary mb-4">support_agent</span>
                    <h2 className="text-2xl font-light text-white mb-4">Need Help With Your Subscription?</h2>
                    <p className="text-gray-400 mb-6">
                        Our support team is here to assist you with any billing questions or subscription changes.
                    </p>
                    <button
                        onClick={() => navigate('/contact')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-dark text-white font-medium hover:bg-primary-deep transition-colors"
                    >
                        <span>Contact Support</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </section> */}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default SubscriptionPolicy;
