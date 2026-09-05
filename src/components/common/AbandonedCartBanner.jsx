import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, X, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';

export const AbandonedCartBanner = () => {
  const { cart, totalItemsCount, subtotal, setIsCartDrawerOpen } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only show if there are items in the cart and not previously dismissed in this session
    const isDismissed = sessionStorage.getItem('as_abandoned_cart_dismissed');
    if (totalItemsCount > 0 && !isDismissed && !dismissed) {
      // Gentle delay after page load (3 seconds) to not overwhelm the user
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [totalItemsCount, dismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    sessionStorage.setItem('as_abandoned_cart_dismissed', 'true');
  };

  const handleOpenCart = () => {
    setIsVisible(false);
    setIsCartDrawerOpen(true);
  };

  if (!isVisible || totalItemsCount === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-full animate-slideUp">
      <div className="bg-white/95 dark:bg-[#072418]/95 backdrop-blur-xl border border-gray-200/90 dark:border-forest-700 rounded-3xl p-4 shadow-2xl space-y-3 relative">
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-forest-800 transition-colors cursor-pointer"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3 pr-6">
          <div className="w-10 h-10 rounded-2xl bg-forest-900/10 dark:bg-forest-800 text-[#1b4332] dark:text-lime-400 flex items-center justify-center shrink-0 border border-leaf-500/30">
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-leaf-700 dark:text-lime-400">
                Items Waiting
              </span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <p className="text-xs font-bold text-charcoal-950 dark:text-white">
              You left {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in your basket!
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Basket Total: <strong className="text-charcoal-900 dark:text-lime-300">{formatINR(subtotal)}</strong>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleOpenCart}
            className="flex-1 py-2 px-3 bg-[#1b4332] dark:bg-lime-500 hover:bg-[#122c21] dark:hover:bg-lime-400 text-white dark:text-forest-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-98 cursor-pointer"
          >
            <span>Review & Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 bg-gray-100 dark:bg-forest-800 hover:bg-gray-200 dark:hover:bg-forest-750 text-charcoal-700 dark:text-gray-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
