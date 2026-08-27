import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Leaf } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const CategorySection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 select-none">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf-600 dark:text-leaf-400 uppercase tracking-widest mb-1.5">
            <Leaf className="w-3.5 h-3.5" />
            <span>Curated Freshness</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 dark:text-white tracking-tight">
            Explore Categories
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            From morning-harvested vegetables to pure A2 dairy and wood-fired sourdough bakes.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-leaf-600 dark:text-leaf-400 hover:text-leaf-700 dark:hover:text-lime-300 transition-colors group"
        >
          <span>View All Produce</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 8 Organic / Circular Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3.5 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-3xl bg-white dark:bg-forest-900/80 border border-sage-200/80 dark:border-leaf-500/20 hover:border-leaf-500/50 shadow-sm hover:shadow-soft-float transition-all duration-300 transform hover:-translate-y-2 card-fresh"
          >
            {/* Circular Organic Image Container */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-sage-100 to-ivory-200 dark:from-forest-800 dark:to-forest-950 p-1.5 mb-3 transition-all overflow-hidden border border-sage-300/60 dark:border-leaf-500/30 group-hover:border-leaf-400 shadow-inner group-hover:shadow-leaf-sm">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-full group-hover:scale-115 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Category Name */}
            <h3 className="text-xs sm:text-sm font-bold text-charcoal-900 dark:text-ivory-100 group-hover:text-leaf-600 dark:group-hover:text-leaf-400 transition-colors line-clamp-1">
              {cat.name}
            </h3>

            {/* Item Count Tag */}
            <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
              {cat.itemCount}
            </span>
          </Link>
        ))}
      </div>

    </section>
  );
};
