import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../common/ProductCard';

export const BestsellersSection = () => {
  // Show top 4 bestsellers for optimal speed, layout cleanliness, and seamless UX
  const bestsellers = PRODUCTS.filter(p => p.isFeatured || p.isBestseller || p.rating >= 4.8).slice(0, 4);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none">
      
      {/* Section Header with Single-Line Mobile Responsive View All */}
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
        <div className="space-y-0.5 sm:space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-leaf-700 dark:text-leaf-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Customer Favorites</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-charcoal-950 dark:text-white">
            Bestselling Delicacies
          </h2>
          <p className="hidden sm:block text-xs sm:text-sm text-charcoal-700 dark:text-gray-300 max-w-xl">
            Our most ordered ready-to-cook kebabs, marinated cuts, and artisanal delicacies.
          </p>
        </div>

        <Link
          to="/bestsellers"
          className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-leaf-700 dark:text-lime-400 hover:text-leaf-800 transition-colors whitespace-nowrap shrink-0"
        >
          <span>View All ({PRODUCTS.length})</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* 4-Column Responsive Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {bestsellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>


      {/* Bottom CTA Button */}
      <div className="text-center mt-8 sm:mt-10">
        <Link
          to="/bestsellers"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-forest-900 text-charcoal-950 dark:text-ivory-100 font-bold text-xs sm:text-sm rounded-full border border-gray-200 dark:border-leaf-500/40 hover:border-leaf-500 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer"
        >
          <span>Explore All {PRODUCTS.length} Bestsellers</span>
          <ArrowRight className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
        </Link>
      </div>

    </section>
  );
};


