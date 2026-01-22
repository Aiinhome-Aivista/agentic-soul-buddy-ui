import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { Toast } from 'primereact/toast';
import { apiService } from '../service/apiService';
import { POST_url1 } from '../connection/connection';
import '../styles/PaymentPage.css';

import '../styles/modal.css';
import Confetti from '../common/components/Confetti';



const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useRef(null);

    // Get plan details from navigation state or local storage/fallback
    const [planDetails, setPlanDetails] = useState(location.state?.plan || {
        planName: "Premium Plan",
        finalPrice: 999,
        originalPrice: 1999,
        discount: "50%",
        validityDays: 30
    });

    const [loading, setLoading] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [paymentDate, setPaymentDate] = useState(null);
    const [validTill, setValidTill] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);

    // Check if this is a fresh signup flow
    const isNewSignup = location.state?.isNewSignup || false;

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponDetails, setCouponDetails] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [verifyingCoupon, setVerifyingCoupon] = useState(false);

    // Billing Address State
    const [billingDetails, setBillingDetails] = useState({
        fullName: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });



    useEffect(() => {
        // If no plan is passed, maybe redirect back? For now, we use default mock data for dev.
        // In real app: if (!location.state?.plan) navigate('/subscription');
    }, [location, navigate]);


    const handleBillingChange = (e) => {
        const { name, value } = e.target;

        // For zipCode, only allow numbers
        if (name === 'zipCode') {
            const numericValue = value.replace(/\D/g, '');
            setBillingDetails(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        // Country - only letters and spaces
        if (name === 'country') {
            const textValue = value.replace(/[^a-zA-Z\s]/g, '');
            setBillingDetails(prev => ({ ...prev, [name]: textValue }));
            return;
        }

        setBillingDetails(prev => ({ ...prev, [name]: value }));
    };



    // Coupon Functions
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.current.show({ severity: 'warn', summary: 'Empty Code', detail: 'Please enter a coupon code.', life: 2000 });
            return;
        }

        setVerifyingCoupon(true);
        try {
            // Using POST_url1.cupon_validate (note the typo 'cupon' in connection.js if strictly following user provided update, 
            // but assuming user meant 'cupon_validate' based on diff)
            const response = await apiService({
                url: POST_url1.cupon_validate,
                method: 'POST',
                data: {
                    coupon_code: couponCode,
                    amount: parseInt(planDetails.finalPrice) // Applying on the already potentially discounted price
                }
            });

            if (response && response.valid) {
                setCouponDetails(response);
                setShowConfetti(true);
                toast.current.show({ severity: 'success', summary: 'Coupon Applied', detail: `You saved $${response.discount_amount}!`, life: 3000 });
                setTimeout(() => setShowConfetti(false), 5000);
            } else {
                setCouponDetails(null);
                toast.current.show({ severity: 'error', summary: 'Invalid Coupon', detail: response?.message || 'Coupon code is not valid.', life: 3000 });
            }
        } catch (error) {
            console.error("Coupon Error:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to apply coupon.', life: 3000 });
        } finally {
            setVerifyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponDetails(null);
        setCouponCode('');
        toast.current.show({ severity: 'info', summary: 'Removed', detail: 'Coupon removed.', life: 2000 });
    };

    // Calculate Final Payable Amount
    const finalPayableAmount = couponDetails
        ? planDetails.finalPrice - couponDetails.discount_amount
        : planDetails.finalPrice;



    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateZip = (zip) => /^\d{6}$/.test(zip); // Assuming 6 digit PIN code

    const processPayment = async () => {
        // Billing Validation
        const { fullName, email, addressLine1, city, state, zipCode } = billingDetails;

        if (!fullName || !email || !addressLine1 || !city || !state || !zipCode || !billingDetails.country) {
            toast.current.show({ severity: 'warn', summary: 'Missing Details', detail: 'Please fill in all mandatory billing fields including Country.', life: 3000 });
            return;
        }

        if (!validateEmail(email)) {
            toast.current.show({ severity: 'warn', summary: 'Invalid Email', detail: 'Please enter a valid email address.', life: 3000 });
            return;
        }

        if (!validateZip(zipCode)) {
            toast.current.show({ severity: 'warn', summary: 'Invalid Zip Code', detail: 'Please enter a valid 6-digit Zip Code.', life: 3000 });
            return;
        }



        setLoading(true);

        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Razorpay SDK failed to load. Are you online?', life: 3000 });
            setLoading(false);
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            const userName = localStorage.getItem('name');

            if (!userId) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'User session not found. Please login again.', life: 3000 });
                setLoading(false);
                return;
            }

            // Always use RAZORPAY for now based on user request
            let paymentMethodStr = 'RAZORPAY';

            const payload = {
                user_id: userId,
                plan_name: planDetails.planName,
                email: billingDetails.email,
                full_name: billingDetails.fullName || userName,
                billing: {
                    address_line1: billingDetails.addressLine1,
                    address_line2: billingDetails.addressLine2 || '',
                    city: billingDetails.city,
                    state: billingDetails.state,
                    zip_code: billingDetails.zipCode,
                    country: billingDetails.country
                },
                payment: {
                    method: paymentMethodStr,
                    amount: finalPayableAmount || 0,
                    currency: 'USD',
                    coupon_code: couponDetails ? couponDetails.coupon_code : null,
                    discount_amount: couponDetails ? couponDetails.discount_amount : 0
                }
            };

            const response = await apiService({
                url: POST_url1.start_subscription,
                method: 'POST',
                data: payload
            });

            if (response && (response.status === 'PENDING' || response.razorpay_key)) {
                // Initialize Razorpay
                const options = {
                    key: response.razorpay_key,
                    amount: response.gateway_order.amount, // Amount is in subunits (paise/cents)
                    currency: response.gateway_order.currency,
                    name: "Soul Junction",
                    description: `Subscription for ${planDetails.planName}`,
                    image: "/src/assets/icon/sblogo.svg", // Replace with your logo URL
                    order_id: response.gateway_order.id, // This is a sample Order ID
                    handler: async function (razorpayResponse) {
                        // alert(razorpayResponse.razorpay_payment_id);
                        // alert(razorpayResponse.razorpay_order_id);
                        // alert(razorpayResponse.razorpay_signature);

                        // Call verify API
                        try {
                            const verifyPayload = {
                                transaction_id: response.transaction_id,
                                razorpay_order_id: razorpayResponse.razorpay_order_id,
                                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                                razorpay_signature: razorpayResponse.razorpay_signature
                            };

                            const verifyRes = await apiService({
                                url: POST_url1.razorpay_verify,
                                method: 'POST',
                                data: verifyPayload
                            });

                            if (verifyRes && verifyRes.success) {
                                // Store the current plan and update state
                                localStorage.setItem('currentPlan', planDetails.planName);

                                // Navigate to Receipt Page
                                navigate('/receipt', {
                                    state: {
                                        transactionId: response.transaction_id,
                                        paymentDate: new Date().toLocaleDateString(),
                                        validTill: response.valid_till,
                                        paymentMethod: "RAZORPAY",
                                        planDetails,
                                        billingDetails,
                                        finalPayableAmount,
                                        couponDetails,
                                        isNewSignup
                                    }
                                });
                            } else {
                                toast.current.show({ severity: 'error', summary: 'Verification Failed', detail: 'Payment verification failed.', life: 3000 });
                            }

                        } catch (err) {
                            console.error("Verification Error", err);
                            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Verification failed.', life: 3000 });
                        }
                    },
                    prefill: {
                        name: billingDetails.fullName || userName,
                        email: billingDetails.email,
                        contact: "" // Can add phone if collected
                    },
                    notes: {
                        address: billingDetails.addressLine1
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    toast.current.show({ severity: 'error', summary: 'Payment Failed', detail: response.error.description, life: 3000 });
                });
                rzp1.open();

            } else if (response && response.status === 'PAID') {
                // Direct success (if logic allows)
                localStorage.setItem('currentPlan', planDetails.planName);

                navigate('/receipt', {
                    state: {
                        transactionId: response.transaction_id,
                        paymentDate: response.date,
                        validTill: response.valid_till,
                        paymentMethod: response.payment_method,
                        planDetails,
                        billingDetails,
                        finalPayableAmount,
                        couponDetails,
                        isNewSignup
                    }
                });
            } else {
                toast.current.show({ severity: 'error', summary: 'Payment Failed', detail: response?.message || 'Payment initiation failed.', life: 3000 });
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.current.show({ severity: 'error', summary: 'Payment Error', detail: 'An unexpected error occurred. Please try again.', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-4 md:p-8 animate-fadeIn overflow-y-auto relative no-scrollbar bg-white/5 backdrop-blur-sm">
            <Toast ref={toast} className="custom-toast-message" position="top-right" />
            {showConfetti && <Confetti />}

            {/* Header */}
            <div className="flex items-center gap-4 mb-4 max-w-6xl mx-auto w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                    <ArrowBackRoundedIcon sx={{ fontSize: "1.5rem" }} />
                </button>
                <h1 className="text-2xl md:text-2xl font-bold text-white tracking-wide">Secure Checkout</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full">

                {/* Left Column: Billing & Payment Methods */}
                <div className="flex-1 flex flex-col gap-6">

                    {/* Billing Address Section */}
                    <div className="grid lg:grid-cols-5 grid-cols-1 gap-5 w-full">
                        <div className="glass-card rounded-3xl p-6 md:p-8 w-full lg:col-span-3">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                Billing Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-1">
                                    <label className="block text-white/60 text-sm mb-2">Full Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={billingDetails.fullName}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 rounded-xl glass-input"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-white/60 text-sm mb-2">Email Address <span className="text-red-400">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={billingDetails.email}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 rounded-xl glass-input"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-white/60 text-sm mb-2">Billing Address Line 1 <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={billingDetails.addressLine1}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 rounded-xl glass-input"
                                        placeholder="Street address, P.O. box"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-white/60 text-sm mb-2"> Billing Address Line 2 <span className="text-white/30 text-xs">(Optional)</span></label>
                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={billingDetails.addressLine2}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 rounded-xl glass-input"
                                        placeholder="Apartment, suite, unit, etc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">City <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={billingDetails.city}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 rounded-xl glass-input"
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">State <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={billingDetails.state}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 rounded-xl glass-input"
                                        placeholder="State"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Zip Code <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        name="zipCode"
                                        value={billingDetails.zipCode}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 rounded-xl glass-input"
                                        placeholder="123456"
                                        maxLength="6"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Country <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={billingDetails.country}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 rounded-xl glass-input"
                                        placeholder="Country"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Right Column: Order Summary */}
                        <div className="w-full flex flex-col gap-6 lg:col-span-2 h-full">
                            <div className="glass-card rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between gap-4 ">


                                <div className="flex flex-col gap-4 ">
                                    <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-white font-medium">{planDetails.planName}</p>
                                            <p className="text-white/50 text-xs">{planDetails.validityDays} Days Validity</p>
                                        </div>
                                        <span className="text-white font-medium">${planDetails.originalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-green-400 text-sm">
                                        <span>Discount ({planDetails.discount})</span>

                                        <span>- ${planDetails.originalPrice - planDetails.finalPrice}</span>
                                    </div>

                                    {/* Coupon Input Section */}
                                    {!couponDetails ? (
                                        <div className="flex gap-2 my-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="Enter Coupon Code"
                                                className="w-full px-4 py-2 rounded-xl glass-input text-sm uppercase"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={verifyingCoupon || !couponCode}
                                                className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {verifyingCoupon ? '...' : 'APPLY'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="glass-card p-3 rounded-xl flex justify-between items-center border border-green-500/30 bg-green-500/10">
                                            <div>
                                                <p className="text-green-400 text-xs font-bold flex items-center gap-1">
                                                    {/* <CheckCircleRoundedIcon fontSize="inherit" /> */}
                                                    {couponDetails.coupon_code} APPLIED
                                                </p>
                                                <p className="text-white/60 text-xs">You saved ${couponDetails.discount_amount}</p>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-white/40 hover:text-white transition-colors"
                                            >
                                                <CloseRoundedIcon fontSize="small" />
                                            </button>
                                        </div>
                                    )}

                                    {couponDetails && (
                                        <div className="flex justify-between text-green-400 text-sm animate-fadeIn">
                                            <span>Coupon Discount</span>
                                            <span>- ${couponDetails.discount_amount}</span>
                                        </div>
                                    )}

                                    <div className="h-px bg-white/10 my-2"></div>

                                    <div className="flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span>${finalPayableAmount}</span>
                                    </div>
                                </div>

                                {/* Pay Button */}

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={processPayment}
                                        disabled={loading}
                                        className="w-full py-4 rounded-xl bg-white/90 hover:bg-white/100 text-black font-bold text-lg  transition-all transform active:scale-[0.99] flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/80 border-t-white rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Pay ${finalPayableAmount}
                                                <LockRoundedIcon fontSize="small" className="opacity-80" />
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>





                </div>
            </div>



        </div>
    );
}
