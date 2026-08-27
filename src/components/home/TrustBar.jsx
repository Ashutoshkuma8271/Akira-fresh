import React from 'react';
import { ShieldCheck, Snowflake, Flame, Truck, RotateCcw } from 'lucide-react';

export const TrustBar = () => {
  const promises = [
    {
      icon: ShieldCheck,
      title: '100% Antibiotic-Free',
      desc: 'Certified safe poultry & pasture-raised lamb',
    },
    {
      icon: Snowflake,
      title: 'Blast Frozen at -18°C',
      desc: 'Locks in juiciness & natural flavors',
    },
    {
      icon: Flame,
      title: 'Chef Secret Marinade',
      desc: 'Steeped in authentic whole spices & ghee',
    },
    {
      icon: Truck,
      title: 'Sub-Zero Cold Chain',
      desc: 'Delivered chilled in 2 hours across Delhi NCR',
    },
    {
      icon: RotateCcw,
      title: '100% Taste Guarantee',
      desc: 'Instant no-questions-asked refund or replacement',
    },
  ];

  return (
    <section className="bg-white dark:bg-forest-900 border-y border-sage-200/80 dark:border-forest-800 py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {promises.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 group"
              >
                {/* Icon Circle */}
                <div className="w-11 h-11 rounded-2xl bg-sage-100 dark:bg-forest-800 border border-leaf-500/30 flex items-center justify-center text-leaf-600 dark:text-leaf-400 group-hover:scale-110 group-hover:bg-leaf-500 group-hover:text-forest-950 transition-all duration-300 shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Text Info */}
                <div className="space-y-0.5">
                  <h4 className="font-serif text-sm font-bold text-charcoal-900 dark:text-ivory-100 group-hover:text-leaf-600 dark:group-hover:text-leaf-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
