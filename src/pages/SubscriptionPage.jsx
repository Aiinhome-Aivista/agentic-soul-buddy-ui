import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Toast } from 'primereact/toast';
import { apiService } from "../service/apiService";
import { POST_url1, get_url1 } from "../connection/connection";
import "../styles/modal.css";

export default function SubscriptionPage() {
    const navigate = useNavigate();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [currentPlanId, setCurrentPlanId] = useState(1); // Default to Free Plan (id: 1)

    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            try {
                const response = await apiService({
                    url: get_url1.subscription_plan,
                    method: 'GET'
                });
                if (response && response.status === 'success') {
                    setPlans(response.data);

                    // Check local storage for current plan
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
                    } else {
                        // Fallback: Default to Free Plan (ID 1) if not set, or maybe logic to fetch user profile?
                        // For now keeping default 1.
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
    }, []);

    const handleUpgrade = async (plan) => {
        // setLoading(true); // Don't show full page loader for upgrade action as per user request to only show "before data not coming"
        // But if user wants feedback, we might need a different mechanism.
        // User said "only loader visible before data not coming". This implies initial fetch.
        // For upgrade, I'll keep the button disabled/processing state but maybe not the spinner replacing content.

        try {
            const payload = {
                user_id: localStorage.getItem("userId"),
                plan_name: plan.planName
            };

            console.log("Upgrading plan:", payload);

            const response = await apiService({
                url: POST_url1.start_subscription,
                method: 'POST',
                data: payload
            });

            if (response && response.status === 'success') {
                toast.current.show({ severity: 'success', summary: 'Success', detail: `You have switched to the ${plan.planName}.`, life: 3000 });
                setCurrentPlanId(plan.id);
                localStorage.setItem('currentPlan', plan.planName); // Update local storage
            } else {
                console.error("Upgrade failed", response);
                toast.current.show({ severity: 'error', summary: 'Error', detail: response?.message || "Failed to upgrade plan.", life: 3000 });
            }

        } catch (error) {
            console.error("Error upgrading plan:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: "An error occurred while upgrading.", life: 3000 });
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-4 md:p-8 animate-fadeIn overflow-y-auto relative">
            <Toast ref={toast} className="custom-toast-message" position="top-right" />

            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                    <ArrowBackRoundedIcon sx={{ fontSize: "1.5rem" }} />
                </button>
                <h1 className="text-3xl font-bold text-white tracking-wide">Subscription Plans</h1>
            </div>

            {/* Main Content Card */}
            <div className="glass-card w-full max-w-6xl mx-auto rounded-3xl p-6 md:p-10 flex flex-col gap-8">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => {
                            const isCurrent = plan.id === currentPlanId;
                            return (
                                <div
                                    key={plan.id}
                                    className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${isCurrent
                                        ? "bg-white/10 border-green-500/50 shadow-[0_0_25px_rgba(34,197,94,0.15)]"
                                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-xl"
                                        }`}
                                >
                                    {/* Discount Badge */}
                                    {plan.discount !== "0%" && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-green-600 text-black text-xs font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl shadow-md">
                                            {plan.discount} OFF
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-3">{plan.planName}</h3>
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-3xl font-bold text-green-400">₹{plan.finalPrice}</span>
                                                {plan.originalPrice && (
                                                    <span className="text-sm text-white/40 line-through">₹{plan.originalPrice}</span>
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
                                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span>Status</span>
                                                <span className={`font-medium ${isCurrent ? "text-green-400" : "text-white/50"}`}>
                                                    {isCurrent ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

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
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
