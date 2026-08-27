import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Flame, Check, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';

export const DealsBanner = () => {
  const { addToast } = useToast();
  const { applyCoupon } = useCart();
  const [copied, setCopied] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('FRESH15');
    setCopied(true);
    applyCoupon('FRESH15');
    addToast('Coupon code FRESH15 applied! (15% OFF your fresh basket)', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A2618] border border-leaf-500/40 text-white shadow-xl p-5 sm:p-7">
        
        {/* Decorative background radial glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Left: Offer Details */}
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#071d12] border border-leaf-500/40 text-[11px] font-bold text-lime-300">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>SPECIAL WEEKEND DEAL</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Get 15% OFF on Gourmet Party Combos
            </h3>

            <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-sans">
              Save more on restaurant-grade Galouti kebabs, fiery Peri-Peri wings & mutton platters.
            </p>
          </div>

          {/* Center: Countdown Timer */}
          <div className="flex items-center gap-2 bg-[#06180E] px-4 py-2.5 rounded-2xl border border-leaf-500/30">
            <Clock className="w-4 h-4 text-lime-400 shrink-0" />
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-white">
              <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span className="text-lime-400">:</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span className="text-lime-400">:</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>

          {/* Right: Coupon & CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopyCoupon}
              className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-dashed border-leaf-400/80 hover:bg-black text-xs font-bold text-leaf-300 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Code: <strong className="text-white">FRESH15</strong></span>
              {copied ? <Check className="w-3.5 h-3.5 text-leaf-400" /> : <Copy className="w-3.5 h-3.5 text-leaf-400" />}
            </button>

            <Link
              to="/offers"
              className="px-5 py-2.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Claim Offer</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

