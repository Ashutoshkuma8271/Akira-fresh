import React from 'react';
import { ShieldCheck, Sparkles, Truck, Flame, Snowflake, ArrowRight, CheckCircle2 } from 'lucide-react';

export const FarmStorySection = () => {
  const steps = [
    {
      step: '01',
      title: 'Antibiotic-Free Sourcing',
      desc: '100% certified bio-secure poultry and government-verified pasture-raised lamb with zero hormone additives.',
      icon: ShieldCheck,
      badge: 'Certified Safe',
    },
    {
      step: '02',
      title: 'Chef Secret Marinade',
      desc: 'Steeped for 12 hours in small batches with cold-ground whole spices, hung curd, and pure desi ghee.',
      icon: Sparkles,
      badge: 'Authentic Taste',
    },
    {
      step: '03',
      title: 'Blast Freezing at -18°C',
      desc: 'Rapid IQF blast freezing locks in cellular moisture, natural meat juices, and tenderness without preservatives.',
      icon: Snowflake,
      badge: 'Juice Retention',
    },
    {
      step: '04',
      title: 'Sub-Zero Cold Transit',
      desc: 'Dispatched in specialized insulated thermal boxes maintaining sub-zero cold chain across Delhi NCR.',
      icon: Truck,
      badge: '-18°C Guarded',
    },
    {
      step: '05',
      title: 'Pan-Sear & Savor (5m)',
      desc: 'Straight from freezer to pan or air-fryer. No defrosting needed for royal melt-in-mouth kebabs.',
      icon: Flame,
      badge: 'Zero Prep Hassle',
    },
  ];

  return (
    <section className="bg-forest-950 text-ivory-100 py-16 sm:py-20 relative overflow-hidden select-none border-y border-forest-800/80">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-leaf-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 border border-leaf-500/30 text-xs font-bold text-leaf-300 uppercase tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>The Akira Fresh Cold-Chain Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            From Master Chef Kitchens <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-400 to-lime-300 italic font-serif">
              To Your Sizzling Pan.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
            We revolutionized ready-to-cook non-veg snacks with artisanal recipes, 100% antibiotic-free meats, and sub-zero blast-freeze cold chains.
          </p>
        </div>

        {/* 5-Step Connected Progress Journey */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          
          {/* Subtle Horizontal Connector Line for desktop */}
          <div className="hidden lg:block absolute top-12 left-12 right-12 h-0.5 bg-gradient-to-r from-leaf-500/20 via-leaf-400/50 to-leaf-500/20 z-0" />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center p-5 rounded-3xl bg-forest-900/80 border border-leaf-500/25 backdrop-blur-md hover:border-leaf-400 shadow-xl transition-all duration-300 group hover:-translate-y-2"
              >
                {/* Step Circle with Icon */}
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-forest-800 border-2 border-leaf-500/40 group-hover:border-leaf-400 flex items-center justify-center text-leaf-400 group-hover:scale-110 transition-all duration-300 shadow-leaf-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  {/* Step Number Tag */}
                  <span className="absolute -bottom-2 -right-2 bg-leaf-500 text-forest-950 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                    {item.step}
                  </span>
                </div>

                {/* Badge */}
                <span className="text-[10px] font-bold text-lime-300 bg-forest-950 px-2 py-0.5 rounded-full border border-leaf-500/30 mb-2">
                  {item.badge}
                </span>

                {/* Title */}
                <h3 className="font-serif text-base font-bold text-white group-hover:text-leaf-300 transition-colors mb-1.5">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
