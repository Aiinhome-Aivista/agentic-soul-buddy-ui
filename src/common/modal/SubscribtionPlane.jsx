import React, { useEffect, useState } from "react";
import crown from "../../assets/icons/crown.svg";
import { apiService } from "../../service/apiService";
import { devUrl1 } from "../../env/env";
import { get_url1 } from "../../connection/connection";
import { useNavigate } from "react-router-dom";

const SubscriptionPlane = ({ OnClose, showAllPlans = true, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiService({
          url: get_url1.subscription_plan,
          method: 'GET'
        });
        if (response && response.status === "success" && response.data) {
          // Transform data - filter out trial plans only if showAllPlans is false
          const transformedPlans = response.data
            .filter(plan => showAllPlans || !plan.isTrial)
            .map(plan => ({
              id: plan.id,
              title: plan.isTrial ? "FREE TRIAL" : plan.title.toUpperCase() + " PLAN",
              planName: plan.planName,
              originalPrice: plan.originalPrice ? `₹${plan.originalPrice}` : "",
              finalPrice: plan.isTrial ? "FREE" : `₹${plan.finalPrice}`,
              discount: plan.discount,
              usage: plan.usage,
              validityDays: plan.validityDays,
              isTrial: plan.isTrial,
              highlighted: plan.title.toLowerCase() === "gold",
            }));
          setPlans(transformedPlans);
          // Select the free trial plan by default if showing all plans, otherwise gold plan
          if (showAllPlans) {
            const trialPlan = transformedPlans.find(p => p.isTrial);
            setSelectedPlan(trialPlan?.id || transformedPlans[0]?.id);
          } else {
            const goldPlan = transformedPlans.find(p => p.title.toLowerCase().includes("gold"));
            setSelectedPlan(goldPlan?.id || transformedPlans[0]?.id);
          }
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [showAllPlans]);

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
        plan_name: selectedPlanData?.planName || "Personalized Plan"
      };

      const response = await apiService({
        url: devUrl1 + "start_subscription",
        method: 'POST',
        data: payload
      });

      if (response && !response.error) {
        console.log('Subscription successful:', response);
        // Store the new plan in localStorage
        localStorage.setItem('currentPlan', selectedPlanData?.planName || "Personalized Plan");

        if (onSuccess) {
          onSuccess();
        } else {
          OnClose?.();
          navigate('/home');
        }
      } else {
        console.error('Subscription failed:', response?.message);
      }
    } catch (error) {
      console.error('Error during subscription:', error);
    }
  };

  const splitPrice = (p) => {
    // expects "₹50.94" or "₹133.27"
    const currency = p?.trim()?.startsWith("₹") ? "₹" : "";
    const raw = p?.replace("₹", "") ?? "";
    const [intPart, decPart] = raw.split(".");
    return { currency, intPart, decPart };
  };

  return (
    <div className="fixed p-4 inset-0 z-50 flex items-center h-full justify-center bg-black/30 backdrop-blur-md animate-fadeIn">
      <div className="w-full flex flex-col justify-between h-full max-w-md animate-slideUp">
        {/* Header (optional; keep if you want) */}
        <h2 className="text-center text-[15px] mt-3 font-medium text-white/80 mb-4">
          Choose your plan
        </h2>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-white/60">Loading plans...</div>
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const { currency, intPart, decPart } = splitPrice(plan.finalPrice);

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
                  <div className="flex items-center justify-between h-18 gap-3 p-3">
                    {/* Left: radio + text */}
                    <div className="flex items-center gap-3 min-w-0 h-full">
                      {/* radio */}
                      <div className="flex flex-col justify-between h-full ">
                        <div
                          className={[
                            "grid place-items-center w-[18px] h-[18px] rounded-full border",
                            isSelected ? "border-white/90" : "border-white/30",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "w-[9px] h-[9px] rounded-full transition-opacity",
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
                            "text-[12px] tracking-[0.22em] font-semibold",
                            isSelected ? "text-white/90" : "text-white/35",
                          ].join(" ")}
                        >
                          {plan.title}
                        </div>

                        {/* small crossed + final price line like reference */}
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
                        "shrink-0 flex gap-2 h-full rounded-xl px-2.5 py-4 text-center",
                        isSelected ? "bg-white/90" : "bg-white/10",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "leading-none font-bold",
                          isSelected ? "text-[#656265]" : "text-[#D9D9D9B2]",
                        ].join(" ")}
                      >
                        <span className="text-[22px]">
                          {currency}
                          {intPart}
                        </span>
                        {decPart && (
                          <span className="align-top text-[10px] font-semibold ml-[1px]">
                            {decPart}
                          </span>
                        )}
                      </div>
                      <div
                        className={[
                          "flex flex-col justify-center text-[10px]",
                          isSelected ? "text-black/60" : "text-[#D9D9D9B2]",
                        ].join(" ")}
                      >
                        <div>{plan.usage}</div>
                        <div>{plan.validityDays} days</div>
                      </div>
                    </div>
                  </div>

                  {/* Discount badge */}
                  {plan.discount && plan.discount !== "0%" && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {plan.discount} OFF
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Continue button (disabled look like screenshot can be done via opacity) */}
        <button
          onClick={handleContinue}
          disabled={loading || !selectedPlan}
          className={`mt-5 w-full mb-[20vh] rounded-xl py-2.5 text-[16px] font-semibold
                     border border-white/10 transition-all duration-300 ease-out
                     ${loading || !selectedPlan
              ? 'bg-[#D9D9D9]/50 text-black/50 cursor-not-allowed'
              : 'bg-[#D9D9D9] text-black/95 hover:bg-white hover:shadow-lg hover:shadow-white/20 active:scale-[0.97] transform hover:scale-[1.01]'
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlane;
