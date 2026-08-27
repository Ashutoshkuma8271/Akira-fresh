import React from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Sparkles, Flame } from 'lucide-react';

export const NewArrivalsPage = () => {
  const newProducts = PRODUCTS.filter((p) => p.isNew || p.isBestseller);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn text-charcoal-900 dark:text-ivory-100">
      
      {/* Banner */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#061e14] via-[#092b1d] to-[#0d3b27] text-white p-8 sm:p-12 mb-10 border border-leaf-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#072418] border border-leaf-500/40 text-lime-300 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>CHEF RESERVE NEW DROPS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Fresh Drops & Bestsellers
          </h1>
          <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed font-sans">
            Be the first to taste our newest slow-marinated Awadhi kebabs, smoky skewers, crispy non-veg bites, and spicy party wings.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-leaf-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

    </div>
  );
};

