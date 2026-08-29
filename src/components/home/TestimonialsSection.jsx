import React from 'react';
import { Star, ShieldCheck, Quote, Sparkles, Leaf } from 'lucide-react';

export const TestimonialsSection = () => {
  const reviews = [
    {
      id: 1,
      name: 'Pooja Sharma',
      location: 'Vasant Vihar, South Delhi',
      rating: 5,
      title: 'Remarkable Freshness & Odorless Packing',
      comment: 'The vegetables arrived incredibly fresh and were packed beautifully in breathable boxes. You can smell the earthy farm soil on the coriander and mint!',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      purchased: 'Organic Vine Tomatoes & A2 Milk',
      time: '2 days ago',
    },
    {
      id: 2,
      name: 'Vikram Malhotra',
      location: 'DLF Phase 5, Gurugram',
      rating: 5,
      title: 'A2 Milk & Galouti Kebabs are Elite',
      comment: 'The A_S FOODY signature chicken galouti kebabs and morning-harvested A2 milk are weekly staples for our family. Cold-chain delivery arrived in 90 minutes.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      purchased: 'Signature Chicken Kebabs',
      time: 'Yesterday',
    },
    {
      id: 3,
      name: 'Ananya Sen',
      location: 'Sector 62, Noida',
      rating: 5,
      title: 'Best Sourdough & Crisp Greens in Town',
      comment: 'The slow-ferment wild sourdough loaf was still warm-crusted, and the hydroponic baby spinach stayed crisp in my fridge for a full week. Exceptional service.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      purchased: 'Wild Sourdough & Baby Kale Mix',
      time: '3 days ago',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 select-none">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 dark:bg-forest-900 border border-leaf-500/30 text-xs font-bold text-leaf-600 dark:text-leaf-400 uppercase tracking-widest mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-lime-500" />
          <span>Real Community Feedback</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 dark:text-white tracking-tight">
          Loved by 50,000+ Fresh Households
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          Discover why discerning families across Delhi NCR trust A_S FOODY every morning.
        </p>
      </div>

      {/* 3 Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-forest-900/90 border border-sage-200/80 dark:border-leaf-500/25 shadow-sm hover:shadow-soft-float transition-all duration-300 flex flex-col justify-between relative card-fresh group"
          >
            {/* Top Quote Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-amber-400 gap-0.5">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-gray-400 font-medium">{rev.time}</span>
            </div>

            {/* Title & Comment */}
            <div className="space-y-2 mb-6">
              <h4 className="font-serif text-base font-bold text-charcoal-900 dark:text-ivory-100 group-hover:text-leaf-600 dark:group-hover:text-leaf-400 transition-colors">
                "{rev.title}"
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {rev.comment}
              </p>
            </div>

            {/* Bottom User Profile */}
            <div className="pt-4 border-t border-gray-100 dark:border-forest-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-leaf-500/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-xs sm:text-sm text-charcoal-900 dark:text-white">
                      {rev.name}
                    </h5>
                    <ShieldCheck className="w-3.5 h-3.5 text-leaf-500" title="Verified Customer" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-gray-400 block">
                    {rev.location}
                  </span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
