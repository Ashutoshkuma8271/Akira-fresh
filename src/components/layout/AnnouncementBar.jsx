import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Truck, HelpCircle, Check, ChevronDown, Leaf, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const AnnouncementBar = () => {
  const { applyCoupon } = useCart();
  const { addToast } = useToast();
  const { isAuthenticated, user, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('FRESH15');
    setCopied(true);
    applyCoupon('FRESH15');
    addToast('Coupon code FRESH15 applied! (15% OFF your fresh basket)', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-forest-950 text-ivory-100 text-[11px] sm:text-xs border-b border-forest-800/80 select-none py-2 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
        
        {/* Left: Animated Leaf + Brand Promise */}
        <div className="flex items-center gap-2 text-ivory-100/90 font-medium">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-leaf-500/20 text-leaf-400">
            <Leaf className="w-3 h-3 animate-leaf" />
          </span>
          <span>
            <strong className="text-leaf-400 font-semibold">Farm Fresh</strong> • Naturally Better • Delivered With Care
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-800 text-[10px] text-leaf-300 font-semibold border border-leaf-500/30">
            <Sparkles className="w-2.5 h-2.5 text-lime-400" />
            100% Quality Checked
          </span>
        </div>

        {/* Center: Offer & Coupon Code Copy */}
        <div className="flex items-center gap-1.5 text-ivory-100/90">
          <span>Get 15% OFF on first fresh order:</span>
          <button
            onClick={handleCopyCode}
            title="Click to copy & apply code"
            className="font-bold text-leaf-400 hover:text-lime-300 transition-colors cursor-pointer inline-flex items-center gap-1 tracking-wider bg-forest-900/90 px-2.5 py-0.5 rounded-full border border-leaf-500/40 hover:border-leaf-400 shadow-sm"
          >
            <span>FRESH15</span>
            {copied ? (
              <Check className="w-3 h-3 text-leaf-400 inline" />
            ) : (
              <span className="text-[9px] uppercase text-leaf-300/80 underline font-normal">Copy</span>
            )}
          </button>
        </div>

        {/* Right: Track Order | Store Locator / Delivery Zone | Auth */}
        <div className="flex items-center gap-4 text-ivory-100/90">
          <Link
            to="/track-order"
            className="flex items-center gap-1.5 hover:text-leaf-400 transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-leaf-400" />
            <span>Track Order</span>
          </Link>

          {/* Delivery Zone Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1 hover:text-leaf-400 transition-colors cursor-pointer font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-leaf-400" />
              <span>Delhi NCR</span>
              <ChevronDown className="w-3 h-3 text-leaf-400/80" />
            </button>
            {isLocationOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-forest-900 border border-leaf-500/30 rounded-2xl shadow-2xl z-50 py-2 text-xs text-ivory-100 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] text-leaf-400 font-bold uppercase tracking-wider border-b border-forest-800">
                  Select Delivery Zone
                </div>
                {['Delhi South & Central', 'Gurugram / DLF', 'Noida & Greater Noida', 'Faridabad / Ghaziabad'].map((zone) => (
                  <button
                    key={zone}
                    onClick={() => {
                      setIsLocationOpen(false);
                      addToast(`Delivery location set to: ${zone} (Express 2-Hr Available)`, 'success');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-forest-800 text-ivory-200 hover:text-leaf-300 flex items-center justify-between transition-colors"
                  >
                    <span>{zone}</span>
                    <Check className="w-3 h-3 text-leaf-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Utility Link */}
          {!isAuthenticated ? (
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="hover:text-leaf-400 transition-colors font-medium cursor-pointer"
            >
              Login / Signup
            </button>
          ) : (
            <Link
              to="/account"
              className="hover:text-leaf-400 transition-colors font-medium flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-leaf-400" />
              <span>Hi, {user.name ? user.name.split(' ')[0] : 'Member'}</span>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};
