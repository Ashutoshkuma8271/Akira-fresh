import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, MapPin, ShieldCheck, Flame, Truck, CheckCircle2, Zap } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="w-full bg-forest-950 relative overflow-hidden select-none border-b border-forest-800/80">
      {/* Ambient Lighting & Organic Gradient Glows */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-forest-800/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-forest-900/60 rounded-full blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative z-10 min-h-[580px] lg:min-h-[640px] flex items-center">
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Headline, Actions & Trust Proof (Col Span 6) */}
          <div className="lg:col-span-6 space-y-6 text-ivory-100 text-left animate-fadeIn">
            
            {/* Eyebrow Badge with Pulse */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-forest-900/90 border border-leaf-500/30 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-leaf-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-leaf-300 font-sans">
                HIGH PROTEIN IN EVERY BITE
              </span>
              <span className="text-[10px] bg-leaf-500/20 text-lime-300 px-2 py-0.5 rounded-full font-semibold border border-leaf-500/40">
                Ready in 5 Mins
              </span>
            </div>

            {/* Large Asymmetric Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white font-serif leading-[1.12]">
                Gourmet Chicken & Mutton Snacks,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-400 via-lime-400 to-leaf-500 font-serif italic">
                  Delivered Cold.
                </span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-ivory-200/90 max-w-lg leading-relaxed font-sans">
              Akira Fresh delivers premium frozen ready-to-cook chicken and mutton snacks, artisanal kebabs, and zesty marinated cuts across Delhi NCR through sub-zero cold-chain delivery.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary Green Pill CTA */}
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-leaf-gradient hover:brightness-110 text-forest-950 font-bold text-xs sm:text-sm rounded-full shadow-leaf-glow hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Shop Kebabs & Snacks</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              {/* Secondary Outline CTA */}
              <Link
                to="/category/chicken-kebabs"
                className="px-8 py-3.5 bg-forest-900/80 hover:bg-forest-850 text-white hover:text-leaf-300 font-semibold text-xs sm:text-sm rounded-full border border-leaf-500/40 backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Explore Menu</span>
              </Link>
            </div>

            {/* Compact Trust Area Under CTA */}
            <div className="pt-4 border-t border-forest-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-ivory-200/90">
              
              {/* Trust 1: 50,000+ Rating */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-forest-900 border border-leaf-500/30 flex items-center justify-center shrink-0 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>4.9 / 5</span>
                    <span className="text-[10px] text-amber-400">★★★★★</span>
                  </div>
                  <span className="text-[11px] text-gray-400">50k+ Happy Foodies</span>
                </div>
              </div>

              {/* Trust 2: 100% Quality Checked */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-forest-900 border border-leaf-500/30 flex items-center justify-center shrink-0 text-leaf-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Antibiotic-Free</div>
                  <span className="text-[11px] text-gray-400">100% Certified Safe</span>
                </div>
              </div>

              {/* Trust 3: Sub-Zero Cold-Chain */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-forest-900 border border-leaf-500/30 flex items-center justify-center shrink-0 text-leaf-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">-18°C Cold Chain</div>
                  <span className="text-[11px] text-gray-400">Delivered in 2 Hours</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Premium 3D Non-Veg Produce Composition & Layered Cards (Col Span 6) */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] lg:min-h-[500px]">
            
            {/* Background Organic Radial Circle with soft border */}
            <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-br from-forest-800/80 via-forest-900/60 to-forest-950 border border-leaf-500/25 shadow-2xl pointer-events-none" />

            {/* Floating Info Card 1 (Top-Left): "Blast Frozen -18°C" */}
            <div className="absolute top-2 left-0 sm:-left-4 z-30 px-3.5 py-2 rounded-2xl bg-forest-900/95 backdrop-blur-xl border border-leaf-500/40 text-white shadow-xl animate-float flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-leaf-500/20 text-leaf-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-lime-400" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Blast Frozen at -18°C</div>
                <div className="text-[9px] text-leaf-300">Locks in Juiciness & Flavor</div>
              </div>
            </div>

            {/* Floating Info Card 2 (Top-Right): "Ready in 5 Mins" */}
            <div className="absolute top-6 right-0 sm:-right-4 z-30 px-3.5 py-2 rounded-2xl bg-forest-900/95 backdrop-blur-xl border border-leaf-500/40 text-white shadow-xl animate-float-reverse flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Pan-Sear in 5 Mins</div>
                <div className="text-[9px] text-lime-300">No defrosting needed</div>
              </div>
            </div>

            {/* Center Main Composition: High-Res Non-Veg Sizzling Platter */}
            <div className="relative z-20 w-full max-w-md h-[320px] sm:h-[380px] flex items-center justify-center">
              
              {/* Center Main Piece: Sizzling Chicken Kebabs & Tikkas */}
              <div className="relative w-72 sm:w-88 rounded-3xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.85)] border border-leaf-500/30 group">
                <img
                  src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=85"
                  alt="Sizzling Chicken Galouti & Tandoori Kebabs"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Badge on image: Akira Fresh Signature Box */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-forest-950/85 backdrop-blur-md border border-leaf-500/30 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-leaf-400 animate-ping" />
                    <span className="font-bold text-leaf-300">Akira Cold Box</span>
                  </div>
                  <span className="text-[10px] text-gray-300 bg-forest-900 px-2 py-0.5 rounded-full">
                    -18°C Insulated Pack
                  </span>
                </div>
              </div>

              {/* Floating Small Accent Piece 1 (Juicy Chicken Wings Bottom-Left) */}
              <div className="absolute -bottom-4 -left-4 sm:-left-8 z-30 w-28 sm:w-32 rounded-2xl overflow-hidden border border-leaf-500/40 shadow-2xl animate-float">
                <img
                  src="https://images.unsplash.com/photo-1527477321055-43615b65171d?w=300&auto=format&fit=crop&q=80"
                  alt="Peri-Peri Wings"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating Small Accent Piece 2 (Mutton Seekh / Meatballs Bottom-Right) */}
              <div className="absolute -bottom-2 -right-4 sm:-right-8 z-30 w-28 sm:w-32 rounded-2xl overflow-hidden border border-leaf-500/40 shadow-2xl animate-float-reverse">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80"
                  alt="Mutton Seekh Kebabs"
                  className="w-full h-auto object-cover"
                />
              </div>

            </div>

            {/* Floating Live Delivery Location Card (Bottom Centered) */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4 py-2.5 rounded-2xl bg-forest-900/98 backdrop-blur-2xl border border-leaf-500/40 text-ivory-100 shadow-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-leaf-500/20 text-leaf-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-leaf-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Delivering to 500+ Pin Codes</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-leaf-400" />
                  </div>
                  <span className="text-[10px] text-leaf-300">Delhi NCR • Express 2-Hr Cold Delivery</span>
                </div>
              </div>
              <div className="text-[10px] font-bold text-lime-400 bg-forest-950 px-2.5 py-1 rounded-full border border-leaf-500/30">
                LIVE
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
