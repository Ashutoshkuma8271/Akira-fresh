import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Sparkles, ArrowRight, ShieldCheck, Truck, Flame } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AppDownloadSection = () => {
  const { addToast } = useToast();

  const handleDownloadClick = (platform) => {
    addToast(`A_S FOODY for ${platform} link generated!`, 'success');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 select-none">
      <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-gradient-to-br from-forest-900 via-forest-850 to-forest-950 border border-leaf-500/30 text-white shadow-2xl p-6 sm:p-10 lg:p-12">
        
        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* Left Column: App Promo Copy */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-950 border border-leaf-500/40 text-xs font-bold text-lime-300">
              <Smartphone className="w-3.5 h-3.5 text-lime-400" />
              <span>A_S FOODY MOBILE APP</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Gourmet Non-Veg Snacks Are Just A Tap Away.
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
              Order fresh chicken Galouti kebabs, Malai tikkas, Peri-Peri wings, and mutton Kakori skewers with live sub-zero delivery tracking in under 2 hours.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Apple App Store */}
              <button
                onClick={() => handleDownloadClick('iOS App Store')}
                className="px-5 py-2.5 rounded-2xl bg-forest-950 hover:bg-forest-800 border border-leaf-500/30 hover:border-leaf-400 flex items-center gap-3 transition-all cursor-pointer shadow-md"
              >
                <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.91-2.87-.93.04-2.01.63-2.65 1.38-.56.65-1.06 1.71-.92 2.74 1.03.08 2.05-.51 2.66-1.25z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400">Download on the</div>
                  <div className="text-xs font-bold text-white">App Store</div>
                </div>
              </button>

              {/* Google Play Store */}
              <button
                onClick={() => handleDownloadClick('Google Play Store')}
                className="px-5 py-2.5 rounded-2xl bg-forest-950 hover:bg-forest-800 border border-leaf-500/30 hover:border-leaf-400 flex items-center gap-3 transition-all cursor-pointer shadow-md"
              >
                <svg className="w-5 h-5 fill-current text-lime-400" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186c-.368-.344-.61-.83-.61-1.386V3.2c0-.556.242-1.042.609-1.386zm11.235 11.238l2.586 2.586-12.018 6.94 9.432-9.526zm2.586-2.052l-2.586 2.586-9.432-9.526 12.018 6.94zm1.53 1.15c.57.33.91.93.91 1.6s-.34 1.27-.91 1.6l-2.31 1.33-2.73-2.73 2.73-2.73 2.31 1.33z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400">GET IT ON</div>
                  <div className="text-xs font-bold text-white">Google Play</div>
                </div>
              </button>

              {/* Shop Web CTA */}
              <Link
                to="/shop"
                className="px-6 py-2.5 rounded-2xl bg-leaf-500 hover:bg-leaf-400 text-forest-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-leaf-sm hover:scale-105"
              >
                <span>Shop Web</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center gap-4 text-xs text-leaf-300 font-medium pt-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-lime-400" />
                2-Hour Cold Delivery
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
                Sub-Zero -18°C Insulated Pack
              </span>
            </div>
          </div>

          {/* Right Column: Smartphone UI Mockup */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-64 sm:w-72 rounded-[32px] overflow-hidden border-4 border-forest-800 bg-forest-950 shadow-2xl p-3">
              {/* Screen Content Preview */}
              <div className="rounded-[24px] overflow-hidden bg-forest-900 border border-leaf-500/20 p-3 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-400 pb-2 border-b border-forest-800">
                  <span className="font-bold text-white">Akira Fresh App</span>
                  <span className="text-leaf-400 font-bold">● -18°C Slot</span>
                </div>
                <div className="rounded-xl overflow-hidden h-32">
                  <img
                    src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80"
                    alt="App screen preview with Chicken Kebabs"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-forest-950/90 border border-leaf-500/30 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">Order #AK-8942</div>
                    <div className="text-[10px] text-leaf-400">Out for Cold Delivery</div>
                  </div>
                  <span className="text-[10px] bg-leaf-500 text-forest-950 font-black px-2 py-0.5 rounded-full">
                    Arriving 18m
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
