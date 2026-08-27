import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Clock, Percent, Leaf, Check, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';

export const DealsBanner = () => {
  const { addToast } = useToast();
  const { applyCoupon } = useCart();
  const [copied, setCopied] = useState(false);

  // Countdown timer state
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 select-none">
      <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-gradient-to-r from-forest-950 via-forest-900 to-forest-850 border border-leaf-500/30 text-white shadow-2xl p-6 sm:p-10 lg:p-14">
        
        {/* Decorative background radial glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* Left Column: Offer Content (Col Span 7) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-900 border border-leaf-500/40 text-xs font-bold text-lime-300">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>LIMITED TIME HARVEST SPECIAL</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Fresh Picks. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-400 to-lime-300 italic font-serif">
                  Better Prices.
                </span>
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-300 max-w-lg leading-relaxed">
              Save more on your everyday kitchen essentials, exotic fruits, and cold-pressed staples. Handpicked this morning and delivered direct to you.
            </p>

            {/* Countdown Box */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-leaf-300 font-semibold">
                <Clock className="w-4 h-4 text-lime-400 animate-pulse" />
                <span>Offers Expire In:</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black">
                <span className="px-2.5 py-1 rounded-lg bg-forest-800 border border-leaf-500/30 text-white">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="text-leaf-400 font-bold">:</span>
                <span className="px-2.5 py-1 rounded-lg bg-forest-800 border border-leaf-500/30 text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="text-leaf-400 font-bold">:</span>
                <span className="px-2.5 py-1 rounded-lg bg-forest-800 border border-leaf-500/30 text-white">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Coupon and Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/offers"
                className="px-8 py-3.5 bg-leaf-gradient hover:brightness-110 text-forest-950 font-bold text-xs sm:text-sm rounded-full shadow-leaf-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Offers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Coupon Box */}
              <button
                onClick={handleCopyCoupon}
                className="px-4 py-2.5 rounded-full bg-forest-900/90 border border-dashed border-leaf-400/80 hover:bg-forest-800 text-xs font-bold text-leaf-300 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>Code: <strong className="text-white tracking-wider">FRESH15</strong></span>
                {copied ? <Check className="w-3.5 h-3.5 text-leaf-400" /> : <Copy className="w-3.5 h-3.5 text-leaf-400" />}
              </button>
            </div>

          </div>

          {/* Right Column: Visual Organic Produce Box (Col Span 5) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-leaf-500/40 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=700&auto=format&fit=crop&q=85"
                alt="Fresh Organic Box"
                className="w-full h-72 sm:h-80 object-cover group-hover:scale-108 transition-transform duration-700"
              />
              
              {/* Badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-forest-950/90 backdrop-blur-md border border-leaf-400 text-xs font-black text-lime-300 shadow-lg">
                SAVE UP TO 35%
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-forest-950/85 backdrop-blur-md border border-leaf-500/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Daily Farm Basket</div>
                  <div className="text-[10px] text-leaf-300">10 Essential Veggies + Free Herbs</div>
                </div>
                <span className="text-xs font-bold text-leaf-400 bg-forest-900 px-2 py-1 rounded-lg">
                  ₹299 <span className="line-through text-[10px] text-gray-400">₹450</span>
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
