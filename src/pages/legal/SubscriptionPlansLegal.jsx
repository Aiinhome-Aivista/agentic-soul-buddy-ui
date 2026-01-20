import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { apiService } from "../../service/apiService";
import { get_url1 } from "../../connection/connection";

const SubscriptionPlansLegal = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
    const [activeFaqIndex, setActiveFaqIndex] = useState(0);

    const toggleFaq = (index) => {
        setActiveFaqIndex(activeFaqIndex === index ? -1 : index);
    }

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await apiService({
                    url: get_url1.subscription_plan,
                    method: 'GET'
                });
                if (response && response.status === "success" && response.data) {
                    const transformedPlans = response.data.map(plan => ({
                        ...plan,
                        // Parse features if they are not already an array (assuming they might come as JSON string or need parsing logic similar to policy page)
                        // existing policy page logic hardcodes features based on title for now, reusing that logic for consistency
                        features: plan.isTrial
                            ? ["14 days free trial", `${plan.usage}`, "Basic features access", "Personalized recommendations"]
                            : plan.title.toLowerCase().includes("silver")
                                ? [`${plan.validityDays} days access`, `${plan.usage}`, "Priority support", "Advanced analytics", "Journal features"]
                                : [`${plan.validityDays} days access`, `${plan.usage}`, "All Silver features", "Exclusive workshops", "Early access to features", "Best value"],
                        highlighted: plan.title.toLowerCase().includes("gold")
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

    const faqs = [
        {
            question: "How does the free trial work?",
            answer: "You can try our premium features for 14 days completely free. requires no commitment and you can cancel anytime before the trial ends."
        },
        {
            question: "Can I change my plan later?",
            answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, debit cards, and UPI payments for your convenience."
        },
        {
            question: "Is there a refund policy?",
            answer: "We offer a 14-day money-back guarantee for all new paid subscriptions if you are not completely satisfied."
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
            <section className="relative py-20 px-6 md:px-12 overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white mb-6 relative z-10">
                    Subscription <span className="font-serif italic text-primary">Plans</span>
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed relative z-10 mb-10">
                    Choose the perfect plan for your journey to inner peace.
                </p>

                {/* Billing Toggle */}
                <div className="relative z-10 inline-flex items-center bg-white/5 rounded-full p-1 border border-white/10 mb-8">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-primary text-black shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${billingCycle === 'yearly' ? 'bg-primary text-black shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Yearly
                    </button>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className="py-8 px-6 md:px-12">
                <div className="max-w-[1200px] mx-auto">
                    {loading ? (
                        <div className="text-center text-white/60">Loading plans...</div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {plans
                                .filter(plan => {
                                    if (plan.isTrial) return true;
                                    if (billingCycle === 'monthly') return plan.validityDays !== 365;
                                    if (billingCycle === 'yearly') return plan.validityDays === 365;
                                    return true;
                                })
                                .map((plan, index) => {
                                    const period = plan.validityDays === 365 ? "per year" : "per month";

                                    return (
                                        <div
                                            key={index}
                                            className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col ${plan.highlighted
                                                ? 'bg-gradient-to-b from-primary-dark/30 to-primary-deep/20 border-primary/30 scale-105 shadow-2xl shadow-primary/10'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            {plan.highlighted && (
                                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                    <span className="px-3 py-1 bg-[#1a1a1a] border border-primary/30 text-primary text-xs font-semibold rounded-full shadow-lg">Most Popular</span>
                                                </div>
                                            )}

                                            <div className="mb-6">
                                                <h3 className="text-xl font-semibold text-white mb-2">{plan.name || plan.planName}</h3>

                                                {/* Original Price and Discount for paid plans */}
                                                {!plan.isTrial && plan.originalPrice && (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-gray-500 line-through text-sm">${plan.originalPrice}</span>
                                                        {plan.discount && plan.discount !== '0%' && (
                                                            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-medium border border-primary/20">
                                                                {plan.discount} OFF
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-bold text-white">
                                                        {plan.isTrial ? 'Free' : `$${plan.finalPrice}`}
                                                    </span>
                                                    {!plan.isTrial && <span className="text-gray-400 text-sm">{period}</span>}
                                                </div>
                                                {/* Show monthly equivalent for yearly plans */}
                                                {billingCycle === 'yearly' && !plan.isTrial && (
                                                    <div className="text-xs text-green-400 mt-1">
                                                        Equivalent to ${Math.floor(plan.finalPrice / 12)}/month
                                                    </div>
                                                )}
                                            </div>

                                            <ul className="space-y-4 mb-8 flex-grow">
                                                {plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                                        <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Static CTA Button */}
                                            {/* <button className={`w-full py-3 rounded-xl font-medium transition-all ${plan.highlighted
                                                ? 'bg-primary text-black hover:bg-primary-light'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}>
                                                View Details
                                            </button> */}
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6 md:px-12 bg-white/5">
                <div className="max-w-[800px] mx-auto">
                    <h2 className="text-3xl font-light text-white text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-white/10 rounded-2xl overflow-hidden bg-background-dark/50 transition-all duration-300 hover:border-white/20"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                                >
                                    <span className="text-lg font-medium text-white">{faq.question}</span>
                                    <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${activeFaqIndex === index ? 'rotate-180' : ''}`}>
                                        keyboard_arrow_down
                                    </span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SubscriptionPlansLegal;
