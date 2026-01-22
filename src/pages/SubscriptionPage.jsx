import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Toast } from 'primereact/toast';
import { apiService } from "../service/apiService";
import { POST_url1, get_url1 } from "../connection/connection";
import "../styles/modal.css";

export default function SubscriptionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [currentPlanId, setCurrentPlanId] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);

    // Check if this is a new signup flow
    const isNewSignup = location.state?.isNewSignup || false;

    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            try {
                // Fetch subscription status for existing users
                if (!isNewSignup) {
                    const userId = localStorage.getItem('userId');
                    if (userId) {
                        try {
                            const statusResponse = await apiService({
                                url: `${get_url1.subscription_status}?user_id=${userId}`,
                                method: 'GET'
                            });
                            if (statusResponse) {
                                setSubscriptionStatus(statusResponse);
                            }
                        } catch (err) {
                            console.error('Error fetching subscription status:', err);
                        }
                    }
                }

                const response = await apiService({
                    url: get_url1.subscription_plan,
                    method: 'GET'
                });
                if (response && response.status === 'success') {
                    // Show all plans for both new signup and upgrade
                    setPlans(response.data);

                    // Check local storage for current plan (only for existing users)
                    if (!isNewSignup) {
                        const savedPlan = localStorage.getItem('currentPlan');
                        if (savedPlan) {
                            // If it's a number (ID)
                            if (!isNaN(savedPlan)) {
                                setCurrentPlanId(parseInt(savedPlan));
                            } else {
                                // If it's a name, find the ID
                                const matchedPlan = response.data.find(p => p.planName === savedPlan || p.title === savedPlan);
                                if (matchedPlan) {
                                    setCurrentPlanId(matchedPlan.id);
                                }
                            }
                        }
                    }

                    // For new signup, select trial plan by default if available
                    if (isNewSignup) {
                        const trialPlan = response.data.find(p => p.isTrial);
                        setSelectedPlanId(trialPlan?.id || response.data[0]?.id);
                    }
                }
            } catch (error) {
                console.error("Error fetching subscription plans:", error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load subscription plans.', life: 3000 });
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, [isNewSignup]);

    const handleUpgrade = (plan) => {
        navigate('/payment', { state: { plan, isNewSignup } });
    };

    // Handle plan selection for new signup flow
    const handleSelectPlan = (plan) => {
        setSelectedPlanId(plan.id);
    };

    // Handle continue button for new signup
    const handleContinue = async () => {
        const selectedPlan = plans.find(p => p.id === selectedPlanId);
        if (selectedPlan) {
            // Check if it's a free trial plan
            if (selectedPlan.isTrial || selectedPlan.finalPrice === 0) {
                // For free trial, call API then go to home
                setLoading(true);
                try {
                    const userId = localStorage.getItem('userId');
                    const userName = localStorage.getItem('name');
                    const userEmail = localStorage.getItem('email');

                    if (!userId) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'User session not found.', life: 3000 });
                        setLoading(false);
                        return;
                    }

                    const payload = {
                        user_id: userId,
                        plan_name: selectedPlan.planName,
                        email: userEmail || '',
                        full_name: userName || ''
                    };

                    const response = await apiService({
                        url: POST_url1.start_subscription,
                        method: 'POST',
                        data: payload
                    });

                    if (response && (response.status === 'FREE' || response.status === 'PAID' || response.status === 'ACTIVE')) {
                        localStorage.setItem('currentPlan', selectedPlan.planName);
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Free plan activated successfully!', life: 2000 });
                        setTimeout(() => {
                            navigate('/home');
                        }, 1500);
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: response?.message || 'Failed to activate plan.', life: 3000 });
                    }
                } catch (error) {
                    console.error('Error starting free plan:', error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to activate plan.', life: 3000 });
                } finally {
                    setLoading(false);
                }
            } else {
                // Navigate to payment page
                navigate('/payment', { state: { plan: selectedPlan, isNewSignup: true } });
            }
        }
    };

    // Start free trial without payment
    const startFreeTrial = async (plan) => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const userName = localStorage.getItem('name');

            if (!userId) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'User session not found.', life: 3000 });
                setLoading(false);
                return;
            }

            const payload = {
                user_id: userId,
                plan_name: plan.planName,
                email: localStorage.getItem('email') || '',
                full_name: userName || '',
                billing: {
                    address_line1: '',
                    address_line2: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    country: 'India'
                },
                payment: {
                    method: 'FREE_TRIAL',
                    amount: 0,
                    currency: 'USD'
                }
            };

            const response = await apiService({
                url: POST_url1.start_subscription,
                method: 'POST',
                data: payload
            });

            if (response && (response.status === 'PAID' || response.status === 'ACTIVE')) {
                localStorage.setItem('currentPlan', plan.planName);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Free trial activated successfully!', life: 2000 });
                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response?.message || 'Failed to activate trial.', life: 3000 });
            }
        } catch (error) {
            console.error('Error starting trial:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to activate trial.', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-full flex flex-col p-4 md:p-8 animate-fadeIn overflow-y-auto relative bg-white/5 backdrop-blur-sm">
            <Toast ref={toast} className="custom-toast-message" position="top-right" />

            {/* Header with Back Button */}
            <div className="flex items-center justify-center mb-8 relative">
                {!isNewSignup && (
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                    >
                        <ArrowBackRoundedIcon sx={{ fontSize: "1.5rem" }} />
                    </button>
                )}
                <h1 className="text-3xl font-bold text-white tracking-wide text-center">
                    {isNewSignup ? 'Choose Your Plan' : 'Subscription Plans'}
                </h1>
            </div>

            {/* Current Plan Card for Upgrade Flow */}
            {!isNewSignup && currentPlanId && (
                <div className="w-full max-w-6xl mx-auto mb-6">
                    <div className="glass-card rounded-2xl p-6 border border-green-500/30 bg-green-500/5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <span className="text-green-400 text-xl">✓</span>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Your Current Plan</p>
                                    <h3 className="text-xl font-bold text-white">
                                        {plans.find(p => p.id === currentPlanId)?.planName || localStorage.getItem('currentPlan')}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6 text-sm">{subscriptionStatus?.daily_minutes_left !== undefined && (
                                <div>
                                    <p className="text-white/50">Remaining Time</p>
                                    <p className="text-white font-medium">
                                        {subscriptionStatus.daily_minutes_left}
                                        {subscriptionStatus?.plan?.toLowerCase() !== "gold plan" && subscriptionStatus?.plan?.toLowerCase() !== "gold pro"
                                            && " min"}
                                    </p>
                                </div>
                            )}



                                <div>
                                    <p className="text-white/50">Price</p>
                                    <p className="text-white font-medium">
                                        {plans.find(p => p.id === currentPlanId)?.isTrial || plans.find(p => p.id === currentPlanId)?.finalPrice === 0
                                            ? 'FREE'
                                            : `$${plans.find(p => p.id === currentPlanId)?.finalPrice || '—'}`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white/50">Valid Till</p>
                                    <p className="text-white font-medium">
                                        {subscriptionStatus?.validity_days_left !== undefined
                                            ? new Date(Date.now() + subscriptionStatus.validity_days_left * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                            : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white/50">Usage</p>
                                    <p className="text-white font-medium">{plans.find(p => p.id === currentPlanId)?.usage || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-white/50">Status</p>
                                    <p className="text-green-400 font-medium">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section Title for Upgrade */}
            {!isNewSignup && (
                <div className="w-full max-w-6xl mx-auto mb-2 text-center">
                    <h2 className="text-xl font-semibold text-white/80">Upgrade Your Plan</h2>
                    <p className="text-white/50 text-sm mt-1">Choose a plan that suits your needs</p>
                </div>
            )}

            {/* Main Content Card */}
            <div className="glass-card w-full max-w-6xl mx-auto rounded-3xl p-5  flex flex-col gap-8">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan) => {
                                const isCurrent = !isNewSignup && plan.id === currentPlanId;
                                const isSelected = isNewSignup && plan.id === selectedPlanId;
                                return (
                                    <div
                                        key={plan.id}
                                        onClick={() => isNewSignup && handleSelectPlan(plan)}
                                        className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${isNewSignup ? 'cursor-pointer' : ''
                                            } ${isCurrent
                                                ? "bg-white/10 border-green-500/50 shadow-[0_0_25px_rgba(34,197,94,0.15)]"
                                                : isSelected
                                                    ? "bg-white/15 border-white/50 shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-xl"
                                            }`}
                                    >
                                        {/* Selection Radio for New Signup */}
                                        {isNewSignup && (
                                            <div className="absolute top-4 right-4">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-white/30'
                                                    }`}>
                                                    {isSelected && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Discount Badge */}
                                        {plan.discount !== "0%" && (
                                            <div className="absolute top-0 left-0 bg-gradient-to-r from-green-500 to-green-600 text-black text-xs font-bold px-3 py-1.5 rounded-br-xl rounded-tl-xl shadow-md">
                                                {plan.discount} OFF
                                            </div>
                                        )}

                                        {/* Trial Badge */}
                                        {plan.isTrial && (
                                            <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-br-xl rounded-tl-xl shadow-md">
                                                FREE TRIAL
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-6 mt-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-3">{plan.planName}</h3>
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-3xl font-bold text-green-400">
                                                        {plan.isTrial ? 'FREE' : `$${plan.finalPrice}`}
                                                    </span>
                                                    {plan.originalPrice && !plan.isTrial && (
                                                        <span className="text-sm text-white/40 line-through">${plan.originalPrice}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 text-sm text-white/70">
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                    <span>Validity</span>
                                                    <span className="text-white font-medium">{plan.validityDays} Days</span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                    <span>Usage</span>
                                                    <span className="text-white font-medium">{plan.usage}</span>
                                                </div>
                                                {!isNewSignup && (
                                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                        <span>Status</span>
                                                        <span className={`font-medium ${isCurrent ? "text-green-400" : "text-white/50"}`}>
                                                            {isCurrent ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Button for upgrade flow (not new signup) */}
                                        {!isNewSignup && (
                                            <div className="mt-8">
                                                {plan.id > currentPlanId ? (
                                                    <button
                                                        onClick={() => handleUpgrade(plan)}
                                                        className="w-full py-3.5 rounded-xl font-bold tracking-wide transition-all bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-white/20 active:scale-95"
                                                    >
                                                        Upgrade Now
                                                    </button>
                                                ) : isCurrent ? (
                                                    <button
                                                        disabled
                                                        className="w-full py-3.5 rounded-xl font-bold tracking-wide transition-all bg-green-500/20 text-green-400 cursor-default border border-green-500/20"
                                                    >
                                                        Current Plan
                                                    </button>
                                                ) : (
                                                    <div className="w-full py-3.5 h-[52px]"></div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Continue Button for New Signup */}
                        {isNewSignup && (
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={handleContinue}
                                    disabled={!selectedPlanId || loading}
                                    className={`px-12 py-4 rounded-xl font-bold text-lg tracking-wide transition-all transform ${selectedPlanId && !loading
                                        ? 'bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-white/20 active:scale-95 hover:scale-[1.02]'
                                        : 'bg-white/20 text-white/50 cursor-not-allowed'
                                        }`}
                                >
                                    {loading ? 'Processing...' : 'Continue'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
