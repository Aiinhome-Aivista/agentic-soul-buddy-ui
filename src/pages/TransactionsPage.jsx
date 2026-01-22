import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { apiService } from '../service/apiService';
import { get_url1 } from '../connection/connection';

export default function TransactionsPage() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // show 5 items per page

    useEffect(() => {
        const fetchTransactions = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                // Construct URL: POST_url1.transections + '/' + userId
                // Assuming devUrl1 ends with slash or handled, usually better to check
                let url = get_url1.transections;
                if (!url.endsWith('/')) url += '/';
                url += userId;

                // User said "use this api with user id", implying GET request likely, or POST with ID in body?
                // The example url "http://.../transactions/8fdc..." implies RESTful GET.
                // But apiService defaults might be different. Let's try GET.

                const response = await apiService({
                    url: url,
                    method: 'GET'
                });

                if (response && response.status === 'success') {
                    setTransactions(response.transactions || []);
                } else {
                    // Fallback or error handling
                    console.error("Failed to fetch transactions:", response);
                    setError("Failed to load transactions.");
                }
            } catch (err) {
                console.error("Transaction Fetch Error:", err);
                setError("An error occurred while fetching transactions.");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Format Amount
    const formatAmount = (amount) => {
        if (!amount) return '$0.00';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    // Format Date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Status Color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'success':
            case 'paid':
                return 'bg-green-500/20 text-green-400';
            case 'cancelled':
            case 'failed':
                return 'bg-red-500/20 text-red-400';
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400';
            default:
                return 'bg-white/10 text-white/60';
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-4 md:p-8 animate-fadeIn overflow-y-auto no-scrollbar bg-white/5 backdrop-blur-sm">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 max-w-6xl mx-auto w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                    <ArrowBackRoundedIcon sx={{ fontSize: "1.5rem" }} />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Transaction History</h1>
            </div>

            {/* Content */}
            <div className="glass-card rounded-3xl p-6 md:p-8 max-w-6xl mx-auto w-full overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-400">
                        {error}
                        <button onClick={() => window.location.reload()} className="block mx-auto mt-4 text-white underline">Retry</button>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-20 text-white/50">
                        No transactions found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-white/60 text-lg uppercase tracking-wider">
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Transaction ID</th>
                                    <th className="p-4 font-medium">Plan</th>
                                    <th className="p-4 font-medium">Method</th>
                                    <th className="p-4 font-medium">Amount</th>
                                    <th className="p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-white text-sm">
                                {transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((txn, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 whitespace-nowrap">{formatDate(txn.start_date)}</td>
                                        <td className="p-4 font-mono text-sm opacity-80">{txn.transaction_id || '-'}</td>
                                        <td className="p-4">{txn.plan_name}</td>
                                        <td className="p-4 capitalize">{txn.payment_method}</td>
                                        <td className="p-4 font-mono">{formatAmount(txn.amount)}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(txn.status)}`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && !error && transactions.length > itemsPerPage && (
                    <div className="flex justify-center mt-6">
                        <div className="flex gap-2 bg-white/5 p-2 rounded-full backdrop-blur-md border border-white/10">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                &lt;
                            </button>

                            {Array.from({ length: Math.ceil(transactions.length / itemsPerPage) }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all ${currentPage === i + 1
                                        ? 'bg-white text-black shadow-lg scale-110'
                                        : 'text-white/70 hover:bg-white/10'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactions.length / itemsPerPage)))}
                                disabled={currentPage === Math.ceil(transactions.length / itemsPerPage)}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
