import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame, Users, Snowflake, Zap } from 'lucide-react';

export const FamilyPacksSection = () => {
  const benefits = [
    {
      title: 'Unbeatable Value',
      desc: 'Save up to 30% compared to individual packs, perfect for weekend gatherings & hosting.',
      icon: Zap,
    },
    {
      title: 'Zero Prep Hassle',
      desc: 'Straight from sub-zero box to pan or air-fryer. Sizzle in 5 mins without defrosting.',
      icon: Flame,
    },
    {
      title: 'Curated Chef Variety',
      desc: 'A mix of tender chicken galouti, spicy kakori mutton, peri-peri wings & artisanal dips.',
      icon: Users,
    },
    {
      title: 'Insulated Sub-Zero Packaging',
      desc: 'Delivered in food-grade thermal ice boxes maintaining -18°C integrity to your freezer.',
      icon: Snowflake,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 select-none">
      <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#061c13] via-[#092b1d] to-[#05150e] border border-leaf-500/30 text-white shadow-2xl p-6 sm:p-10 lg:p-14">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-forest-800/40 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Visual Platter Composition with Floating Badges (Col Span 5) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden border-2 border-leaf-500/40 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=85"
                alt="Akira Fresh Mega Family Gathering Feast"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-106 transition-transform duration-700"
              />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-leaf-400 text-xs font-black text-lime-300 shadow-lg flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-lime-400" />
                <span>SERVES 6 - 8 FOODIES</span>
              </div>

              {/* Bottom Pack Tag */}
              <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-black/90 backdrop-blur-md border border-leaf-500/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">Royal Awadhi Mega Combo</div>
                  <div className="text-[10px] text-leaf-300">16 Galouti + 12 Kakori + 15 Wings</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-lime-400">₹899</div>
                  <div className="line-through text-[10px] text-gray-400">₹1,299</div>
                </div>
              </div>
            </div>

            {/* Floating Mini Badge */}
            <div className="hidden sm:flex absolute -bottom-4 -left-4 z-20 px-3.5 py-2 rounded-2xl bg-black/95 backdrop-blur-md border border-leaf-500/40 text-white shadow-xl items-center gap-2 animate-float">
              <div className="w-7 h-7 rounded-xl bg-leaf-500/20 text-leaf-400 flex items-center justify-center">
                <Zap className="w-4 h-4 text-lime-400" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-white">Save ₹400 Today</div>
                <div className="text-[9px] text-lime-300">Free Cold Express Delivery</div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy & Value Benefits (Col Span 7) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a2c1d] border border-leaf-500/40 text-xs font-bold text-lime-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>STOCK UP & SAVE BIG</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Family & Party Packs. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-400 via-lime-300 to-leaf-500 italic font-serif">
                  Gourmet Feasts Made Effortless.
                </span>
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-200/90 max-w-xl leading-relaxed font-sans">
              Hosting family or friends? Stock your deep freezer with master-crafted non-veg packs. High protein, authentic Lucknow marinades, and zero cooking prep.
            </p>

            {/* 4 Value Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {benefits.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-black/40 border border-leaf-500/20 hover:border-leaf-500/40 transition-colors flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-forest-850 border border-leaf-500/30 flex items-center justify-center text-leaf-400 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-gray-300 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/offers"
                className="px-8 py-3.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs sm:text-sm rounded-full shadow-leaf-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Value Packs</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                to="/shop"
                className="px-7 py-3.5 bg-black/40 hover:bg-black/60 text-white font-semibold text-xs sm:text-sm rounded-full border border-leaf-500/40 transition-all hover:scale-102 cursor-pointer"
              >
                <span>View Full Menu</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

