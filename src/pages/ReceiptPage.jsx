import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { Toast } from 'primereact/toast';
import '../styles/modal.css'; // Ensure styles are available

export default function ReceiptPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useRef(null);

    const {
        transactionId,
        paymentDate,
        planDetails,
        billingDetails,
        finalPayableAmount,
        couponDetails,
        paymentMethod,
        validTill,
        isNewSignup
    } = location.state || {};

    useEffect(() => {
        if (!transactionId) {
            // If accessed directly without state, redirect to home or history
            navigate('/home');
        }
    }, [transactionId, navigate]);

    if (!transactionId) return null;

    const downloadReceipt = () => {
        toast.current.show({ severity: 'info', summary: 'Download', detail: 'Receipt download started...', life: 2000 });
        // Logic to generate PDF would go here
    };

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
                            <span className="font-bold text-lg">Souljunction</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">PAID</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            <p>Transaction ID: {transactionId}</p>
                            <p>Date: {paymentDate || new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Plan</span>
                            <span className="font-medium">{planDetails?.planName}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-b border-dashed border-gray-200 pb-3">
                            <span className="text-gray-600 text-xs uppercase font-bold tracking-wider mb-1">Billed To</span>
                            <span className="font-bold text-gray-800">{billingDetails?.fullName}</span>
                            <span className="text-gray-600 text-xs">{billingDetails?.email}</span>
                            <span className="text-gray-600 text-xs">
                                {billingDetails?.addressLine1}
                                {billingDetails?.addressLine2 && `, ${billingDetails.addressLine2}`}
                            </span>
                            <span className="text-gray-600 text-xs">
                                {billingDetails?.city}, {billingDetails?.state} - {billingDetails?.zipCode}
                            </span>
                            <span className="text-gray-600 text-xs">{billingDetails?.country}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Method</span>
                            <span className="font-medium capitalize">{paymentMethod || 'RAZORPAY'}</span>
                        </div>
                        {validTill && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Valid Till</span>
                                <span className="font-medium capitalize">{validTill}</span>
                            </div>
                        )}

                        {/* Coupon Details in Receipt */}
                        {couponDetails && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Coupon Code</span>
                                    <span className="font-medium capitalize">{couponDetails.coupon_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount Added</span>
                                    <span className="font-medium capitalize">- ${couponDetails.discount_amount}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-center text-lg font-bold">
                        <span>Total Paid</span>
                        <span>${finalPayableAmount}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {/* <button
                        onClick={downloadReceipt}
                        className="w-full py-3 rounded-xl bg-white/90 hover:bg-white/100 text-black font-medium flex items-center justify-center gap-2 transition-all"
                    >
                        <DownloadRoundedIcon /> Download Receipt
                    </button> */}
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full py-3 bg-white/90 rounded-xl bg- hover:bg-white/100 text-black font-bold transition-all shadow-lg"
                    >
                        {isNewSignup ? 'Get Started' : 'Go to Dashboard'}
                    </button>
                </div>
            </div>
        </div>
    );
}
