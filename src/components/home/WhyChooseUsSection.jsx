import React from 'react';
import { ShieldCheck, Sparkles, Snowflake, Truck, HeartHandshake, Award } from 'lucide-react';

export const WhyChooseUsSection = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Antibiotic-Free',
      subtitle: 'Ethical & Safe Sourcing',
      desc: 'Government verified poultry and pasture-raised mutton with zero chemical preservatives or synthetic hormones.',
      tag: 'Certified Clean',
    },
    {
      icon: Sparkles,
      title: 'Master Chef Recipes',
      subtitle: 'Slow Steeping in Pure Ghee',
      desc: 'Authentic royal Awadhi and tandoori recipes steeped for 12 hours with stone-ground spices and fresh herbs.',
      tag: 'Authentic Flavors',
    },
    {
      icon: Snowflake,
      title: '-18°C Blast Frozen',
      subtitle: 'Locks in Juiciness',
      desc: 'Instant blast freezing seals in cell structure and natural juices without artificial additives. Pan-sear in 5 mins.',
      tag: 'Peak Freshness',
    },
    {
      icon: Truck,
      title: 'Express 2-Hr Cold Transit',
      subtitle: 'Sub-Zero to Doorstep',
      desc: 'Delivered in food-grade thermal ice boxes maintaining sub-zero chill across 500+ pin codes in Delhi NCR.',
      tag: 'Guaranteed Cold',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18 select-none">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 dark:bg-forest-900 border border-leaf-500/30 text-xs font-bold text-leaf-600 dark:text-leaf-400 uppercase tracking-widest mb-2.5">
          <Award className="w-3.5 h-3.5 text-lime-500" />
          <span>The Akira Fresh Distinction</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 dark:text-white tracking-tight">
          Why Discerning Foodies Choose Us
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          From verified pasture farms to your sizzling pan, we uphold the highest cold-chain and culinary standards in India.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-forest-900/90 border border-sage-200/80 dark:border-leaf-500/25 shadow-sm hover:shadow-soft-float transition-all duration-300 flex flex-col justify-between group card-fresh"
            >
              <div>
                {/* Icon Container with Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-sage-100 dark:bg-forest-800 border border-leaf-500/30 flex items-center justify-center text-leaf-600 dark:text-leaf-400 group-hover:scale-110 group-hover:bg-leaf-500 group-hover:text-forest-950 transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-lime-600 dark:text-lime-300 bg-sage-50 dark:bg-forest-950 px-2.5 py-1 rounded-full border border-sage-200 dark:border-leaf-500/30">
                    {pillar.tag}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal-900 dark:text-white group-hover:text-leaf-600 dark:group-hover:text-leaf-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs font-semibold text-leaf-600 dark:text-leaf-400 mt-0.5 mb-2">
                  {pillar.subtitle}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              {/* Bottom Subtle Bar */}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-forest-800">
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 group-hover:text-leaf-500 transition-colors flex items-center gap-1">
                  <span>Standard 0{idx + 1}</span>
                  <span>&bull;</span>
                  <span>100% Guaranteed</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
