import React, { useMemo, useState } from "react";
import crown from "../../assets/icons/crown.svg";
import { apiService } from "../../service/apiService";
import { devUrl1 } from "../../env/env";

const SubscriptionPlane = ({ OnClose }) => {
  const [selectedPlan, setSelectedPlan] = useState("1-month");

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
        OnClose?.();
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
    <div className="fixed p-4 inset-0 z-50 flex items-center h-full justify-center bg-black/30 backdrop-blur-md">
      <div className="w-full flex flex-col justify-between h-full max-w-md ">
        {/* Header (optional; keep if you want) */}
        <h2 className="text-center text-[15px] mt-3 font-medium text-white/80 mb-4">
          Your personalised plan is ready!
        </h2>

        <div className="space-y-3">
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
                  "border transition-colors",
                  isSelected ? "border-white/90" : "border-white/10",
                  "bg-white/[0.05]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3 p-3">
                  {/* Left: radio + text */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* radio */}
                    <div className="flex flex-col justify-between h-16">
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

                    <div className="min-w-0">
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
                      "shrink-0 flex gap-2 rounded-xl px-2.5 py-4 text-center",
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
                        "mt-1 text-[10px]",
                        isSelected ? "text-black/60" : "text-[#D9D9D9B2]",
                      ].join(" ")}
                    >
                      {plan.period}
                    </div>
                  </div>
                </div>

                {/* Crown at bottom-left for highlighted + selected (like reference) */}
              </button>
            );
          })}
        </div>

        {/* Continue button (disabled look like screenshot can be done via opacity) */}
        <button
          onClick={handleContinue}
          className="mt-5 w-full mb-[20vh] rounded-2xl py-4 text-[16px] font-semibold
                     bg-[#D9D9D9] text-black/95 border border-white/10
                     active:scale-[0.99] transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlane;
