import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AlertCircle, HelpCircle, ArrowLeft, RefreshCw, Phone } from 'lucide-react';

export const PaymentFailedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const orderId = query.get('orderId') || 'N/A';
  const errorMessage = query.get('reason') || 'The transaction was declined by the bank or payment gateway.';

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fadeIn text-center text-charcoal-900 dark:text-ivory-100 min-h-[70vh] flex flex-col justify-center">
      <div className="bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 relative overflow-hidden">
        
        {/* Fail Indicator */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-500 shadow-md">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-charcoal-950 dark:text-white">
            Payment Failed
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            We could not process your transaction for Order #{orderId}.
          </p>
        </div>

        {/* Reason Alert */}
        <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/20 text-xs text-red-600 dark:text-red-400 text-left leading-relaxed">
          <p className="font-bold mb-1">Reason for failure:</p>
          <p className="font-mono">{errorMessage}</p>
        </div>

        {/* Action Panel */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-leaf-gradient hover:brightness-110 text-forest-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Checkout Payment</span>
          </button>

          <Link
            to="/contact"
            className="w-full py-3.5 bg-gray-50 dark:bg-forest-850 hover:bg-gray-100 dark:hover:bg-forest-800 text-charcoal-950 dark:text-white font-bold text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-forest-700 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-leaf-500" />
            <span>Talk to Support Concierge</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-forest-800">
          <Link
            to="/"
            className="text-xs text-gray-500 hover:text-leaf-500 dark:text-gray-400 dark:hover:text-leaf-400 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
