import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { Toast } from 'primereact/toast';
import '../styles/PaymentPage.css';
import '../styles/modal.css';

// Mock QR Code (keeping it simple with a placeholder or external service if allowed, using a div placeholder for "Static" request)
const MockQRCode = () => (
    <div className="w-48 h-48 bg-white p-2 rounded-xl mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=relaxrhythm@upi&pn=RelaxRhythm&mc=0000&tid=1234567890&tr=1234567890&tn=SubscriptionPayment&am=10.00&cu=INR')] bg-cover bg-center opacity-90"></div>
        {/* Fallback visual/Logo overlay */}
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center z-10 shadow-md">
            <span className="text-green-600 font-bold text-xs">UPI</span>
        </div>
    </div>
);

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
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [paymentDate, setPaymentDate] = useState(null);

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

    // Payment Method State
    const [activeTab, setActiveTab] = useState('upi'); // 'upi', 'card', 'vpa'

    // Card Details State
    const [cardDetails, setCardDetails] = useState({
        number: '',
        holder: '',
        expiry: '',
        cvv: ''
    });

    // VPA State
    const [vpaId, setVpaId] = useState('');

    useEffect(() => {
        // If no plan is passed, maybe redirect back? For now, we use default mock data for dev.
        // In real app: if (!location.state?.plan) navigate('/subscription');
    }, [location, navigate]);


    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        // Simple formatting logic could go here (e.g., spaces for card number)
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.current.show({ severity: 'info', summary: 'Copied', detail: 'UPI ID copied to clipboard', life: 2000 });
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateZip = (zip) => /^\d{6}$/.test(zip); // Assuming 6 digit PIN code
    const validateCardNumber = (num) => /^\d{16}$/.test(num.replace(/\s/g, ''));
    const validateCardExpiry = (exp) => {
        if (!/^\d{2}\/\d{2}$/.test(exp)) return false;
        const [month, year] = exp.split('/').map(Number);
        if (month < 1 || month > 12) return false;
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        return year > currentYear || (year === currentYear && month >= currentMonth);
    };
    const validateCVV = (cvv) => /^\d{3}$/.test(cvv);

    const processPayment = () => {
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

        // Card Validation
        if (activeTab === 'card') {
            const { number, expiry, cvv, holder } = cardDetails;
            if (!number || !expiry || !cvv || !holder) {
                toast.current.show({ severity: 'warn', summary: 'Missing Details', detail: 'Please fill in all card details.', life: 3000 });
                return;
            }
            if (!validateCardNumber(number)) {
                toast.current.show({ severity: 'warn', summary: 'Invalid Card', detail: 'Please enter a valid 16-digit card number.', life: 3000 });
                return;
            }
            if (!validateCardExpiry(expiry)) {
                toast.current.show({ severity: 'warn', summary: 'Invalid Expiry', detail: 'Please enter a valid expiry date (MM/YY) in the future.', life: 3000 });
                return;
            }
            if (!validateCVV(cvv)) {
                toast.current.show({ severity: 'warn', summary: 'Invalid CVV', detail: 'Please enter a valid 3 digit CVV.', life: 3000 });
                return;
            }
        }

        if (activeTab === 'vpa' && !vpaId) {
            toast.current.show({ severity: 'warn', summary: 'Missing Details', detail: 'Please enter your UPI ID.', life: 3000 });
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setTransactionId(`TXN-${Math.floor(Math.random() * 100000000)}`);
            setPaymentDate(new Date().toLocaleString());
            setPaymentSuccess(true);
            toast.current.show({ severity: 'success', summary: 'Payment Successful', detail: 'Your subscription is now active!', life: 3000 });
        }, 2000);
    };

    const downloadReceipt = () => {
        toast.current.show({ severity: 'info', summary: 'Download', detail: 'Receipt download started...', life: 2000 });
        // Logic to generate PDF would go here
    };

    if (paymentSuccess) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 animate-fadeIn bg-white/5 backdrop-blur-sm">
                <Toast ref={toast} className="custom-toast-message" position="top-right" />

                <div className="glass-card w-full max-w-lg rounded-3xl p-8 relative overflow-hidden">
                    {/* Success Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-checkmark">
                            <CheckCircleRoundedIcon sx={{ fontSize: "3.5rem" }} className="text-green-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                        <p className="text-white/60">Thank you for your purchase.</p>
                    </div>

                    {/* Receipt Card */}
                    <div className="bg-white text-gray-800 rounded-lg p-6 mb-8 shadow-lg relative receipt-paper transform transition-all hover:scale-[1.01]">
                        <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg">Soul Junction</span>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">PAID</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                <p>Transaction ID: {transactionId}</p>
                                <p>Date: {paymentDate}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Plan</span>
                                <span className="font-medium">{planDetails.planName}</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-dashed border-gray-200 pb-3">
                                <span className="text-gray-600 text-xs uppercase font-bold tracking-wider mb-1">Billed To</span>
                                <span className="font-bold text-gray-800">{billingDetails.fullName}</span>
                                <span className="text-gray-600 text-xs">{billingDetails.email}</span>
                                <span className="text-gray-600 text-xs">
                                    {billingDetails.addressLine1}
                                    {billingDetails.addressLine2 && `, ${billingDetails.addressLine2}`}
                                </span>
                                <span className="text-gray-600 text-xs">
                                    {billingDetails.city}, {billingDetails.state} - {billingDetails.zipCode}
                                </span>
                                <span className="text-gray-600 text-xs">{billingDetails.country}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium capitalize">{activeTab === 'card' ? `Card ending in ${cardDetails.number.slice(-4)}` : activeTab === 'mock' ? 'UPI' : activeTab.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-center text-lg font-bold">
                            <span>Total Paid</span>
                            <span>₹{planDetails.finalPrice}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={downloadReceipt}
                            className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/80 text-black font-medium flex items-center justify-center gap-2 transition-all"
                        >
                            <DownloadRoundedIcon /> Download Receipt
                        </button>
                        <button
                            onClick={() => navigate('/home')}
                            className="w-full py-3 bg-white/20 rounded-xl bg- hover:bg-white/80 text-black font-bold transition-all shadow-lg"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-4 md:p-8 animate-fadeIn overflow-y-auto relative no-scrollbar bg-white/5 backdrop-blur-sm">
            <Toast ref={toast} className="custom-toast-message" position="top-right" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 max-w-6xl mx-auto w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                    <ArrowBackRoundedIcon sx={{ fontSize: "1.5rem" }} />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Secure Checkout</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full">

                {/* Left Column: Billing & Payment Methods */}
                <div className="flex-1 flex flex-col gap-6">

                    {/* Billing Address Section */}
                    <div className="glass-card rounded-3xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">1</span>
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
                                <label className="block text-white/60 text-sm mb-2">Address Line 1 <span className="text-red-400">*</span></label>
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
                                <label className="block text-white/60 text-sm mb-2">Address Line 2 <span className="text-white/30 text-xs">(Optional)</span></label>
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

                    {/* Payment Methods Section */}
                    <div className="glass-card rounded-3xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">2</span>
                            Payment Method
                        </h2>

                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto pb-1">
                            <button
                                onClick={() => setActiveTab('upi')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-all whitespace-nowrap ${activeTab === 'upi' ? 'text-green-400 bg-white/5 border-b-2 border-green-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                            >
                                <QrCodeRoundedIcon fontSize="small" /> UPI QR
                            </button>
                            <button
                                onClick={() => setActiveTab('card')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-all whitespace-nowrap ${activeTab === 'card' ? 'text-green-400 bg-white/5 border-b-2 border-green-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                            >
                                <CreditCardRoundedIcon fontSize="small" /> Card
                            </button>
                            <button
                                onClick={() => setActiveTab('vpa')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-all whitespace-nowrap ${activeTab === 'vpa' ? 'text-green-400 bg-white/5 border-b-2 border-green-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                            >
                                <AccountBalanceWalletRoundedIcon fontSize="small" /> VPA
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="min-h-[300px]">
                            {activeTab === 'upi' && (
                                <div className="flex flex-col items-center justify-center animate-slideInRight">
                                    <h3 className="text-white font-medium mb-6">Scan QR Code to Pay</h3>
                                    <MockQRCode />
                                    <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl mt-4 max-w-xs w-full">
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs text-white/40 uppercase font-bold">UPI ID</p>
                                            <p className="text-sm text-white font-mono truncate">relaxrhythm@upi</p>
                                        </div>
                                        <button onClick={() => copyToClipboard('relaxrhythm@upi')} className="p-2 text-green-400 hover:bg-white/10 rounded-lg">
                                            <ContentCopyRoundedIcon fontSize="small" />
                                        </button>
                                    </div>
                                    <p className="text-white/40 text-sm mt-6 text-center">Timer: 04:59 <br /> Please complete payment within timer</p>
                                </div>
                            )}

                            {activeTab === 'card' && (
                                <div className="animate-slideInRight max-w-md mx-auto">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Card Number <span className="text-red-400">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="number"
                                                    value={cardDetails.number}
                                                    onChange={handleCardChange}
                                                    maxLength="19"
                                                    placeholder="0000 0000 0000 0000"
                                                    className="w-full pl-12 pr-4 py-3 rounded-xl glass-input font-mono tracking-widest"
                                                />
                                                <CreditCardRoundedIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-white/60 text-sm mb-2">Expiry Date <span className="text-red-400">*</span></label>
                                                <input
                                                    type="text"
                                                    name="expiry"
                                                    value={cardDetails.expiry}
                                                    onChange={handleCardChange}
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    className="w-full px-4 py-3 rounded-xl glass-input text-center"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-white/60 text-sm mb-2">CVV <span className="text-red-400">*</span></label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        name="cvv"
                                                        value={cardDetails.cvv}
                                                        onChange={handleCardChange}
                                                        maxLength="3"
                                                        placeholder="123"
                                                        className="w-full px-4 py-3 rounded-xl glass-input text-center"
                                                    />
                                                    <LockRoundedIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Cardholder Name <span className="text-red-400">*</span></label>
                                            <input
                                                type="text"
                                                name="holder"
                                                value={cardDetails.holder}
                                                onChange={handleCardChange}
                                                placeholder="Name as on card"
                                                className="w-full px-4 py-3 rounded-xl glass-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'vpa' && (
                                <div className="flex flex-col items-center justify-center animate-slideInRight py-10">
                                    <div className="w-full max-w-md">
                                        <label className="block text-white/60 text-sm mb-2">Enter UPI ID / VPA</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={vpaId}
                                                onChange={(e) => setVpaId(e.target.value)}
                                                placeholder="username@bank"
                                                className="w-full px-4 py-3 rounded-xl glass-input"
                                            />
                                            <button className="absolute right-2 top-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg hover:bg-green-500/30">
                                                VERIFY
                                            </button>
                                        </div>
                                        <p className="text-white/40 text-xs mt-3 ml-2">Securely verified by your bank</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pay Button */}
                        <div className="mt-8 border-t border-white/10 pt-6">
                            <button
                                onClick={processPayment}
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-white/20 hover:bg-white/80 text-black font-bold text-lg  transition-all transform active:scale-[0.99] flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay ₹{planDetails.finalPrice}
                                        <LockRoundedIcon fontSize="small" className="opacity-80" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-white/30 text-xs mt-4 flex items-center justify-center gap-1">
                                <LockRoundedIcon style={{ fontSize: 12 }} />
                                128-bit SSL Encrypted Payment
                            </p>
                        </div>

                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-96 flex flex-col gap-6">
                    <div className="glass-card rounded-3xl p-6 md:p-8">
                        <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white font-medium">{planDetails.planName}</p>
                                    <p className="text-white/50 text-xs">{planDetails.validityDays} Days Validity</p>
                                </div>
                                <span className="text-white font-medium">₹{planDetails.originalPrice}</span>
                            </div>
                            <div className="flex justify-between text-green-400 text-sm">
                                <span>Discount ({planDetails.discount})</span>
                                <span>- ₹{planDetails.originalPrice - planDetails.finalPrice}</span>
                            </div>
                            <div className="h-px bg-white/10 my-2"></div>
                            <div className="flex justify-between text-xl font-bold text-white">
                                <span>Total</span>
                                <span>₹{planDetails.finalPrice}</span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 text-xs text-white/60 leading-relaxed">
                            By proceeding, you agree to our <span className="text-green-400 underline cursor-pointer">Terms of Service</span> and <span className="text-green-400 underline cursor-pointer">Privacy Policy</span>.
                            Your subscription will auto-renew unless cancelled.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
