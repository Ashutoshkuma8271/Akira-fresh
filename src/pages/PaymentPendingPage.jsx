import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Clock, RefreshCw, CheckCircle2, Phone, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const PaymentPendingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const query = new URLSearchParams(location.search);
  const orderId = query.get('orderId') || 'N/A';
  const paymentId = query.get('paymentId') || 'N/A';

  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    setChecking(true);
    // Simulate check query
    setTimeout(() => {
      setChecking(false);
      addToast('We are still waiting for the gateway to confirm the payment receipt. Please check back in a few minutes.', 'info');
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fadeIn text-center text-charcoal-900 dark:text-ivory-100 min-h-[70vh] flex flex-col justify-center">
      <div className="bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 relative overflow-hidden">
        
        {/* Pending Indicator */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow-md">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-charcoal-950 dark:text-white">
            Payment Processing
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            We are waiting for validation response for Order #{orderId}.
          </p>
        </div>

        {/* Details Card */}
        <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 text-xs text-left space-y-2 font-medium">
          <p className="text-charcoal-600 dark:text-gray-400">
            Transactions can occasionally take up to 5-10 minutes to verify during network loads. Do not place another order yet.
          </p>
          <div className="pt-2 border-t border-gray-200 dark:border-forest-800 text-[11px] font-mono space-y-1">
            <p>Order ID: {orderId}</p>
            <p>Payment ID: {paymentId}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full py-3.5 bg-leaf-gradient hover:brightness-110 text-forest-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking Ledger...' : 'Check Payment Status'}</span>
          </button>

          <Link
            to="/account/orders"
            className="w-full py-3.5 bg-gray-50 dark:bg-forest-850 hover:bg-gray-100 dark:hover:bg-forest-800 text-charcoal-950 dark:text-white font-bold text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-forest-700 transition-all flex items-center justify-center gap-2"
          >
            <span>View Order Ledger</span>
            <ArrowRight className="w-4 h-4 text-leaf-500" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPendingPage;
