import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame, Tag, Leaf, ShieldCheck, Heart } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';
import { PRODUCTS } from '../../data/products';

export const FeaturedSection = () => {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Non-Veg' },
    { id: 'chicken-kebabs', label: 'Chicken Kebabs' },
    { id: 'mutton-delights', label: 'Mutton Specialties' },
    { id: 'crispy-snacks', label: 'Crispy & Fried' },
    { id: 'wings-drumsticks', label: 'Wings & Drumsticks' },
    { id: 'seafood-fish', label: 'Fish & Prawns' },
  ];

  const filteredProducts = activeTab === 'all'
    ? PRODUCTS.slice(0, 8)
    : PRODUCTS.filter((p) => p.category === activeTab).slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 select-none">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf-600 dark:text-leaf-400 uppercase tracking-widest mb-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Ready-to-Cook Delicacies</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 dark:text-white tracking-tight">
            Sizzle & Savor Today
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Pre-marinated by master chefs. Blast frozen at -18°C to lock in tenderness and flavor. Ready to cook in 5 minutes.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-forest-900 dark:bg-leaf-500 text-white dark:text-forest-950 shadow-sm'
                  : 'bg-sage-100 dark:bg-forest-850 text-gray-600 dark:text-gray-300 hover:bg-sage-200 dark:hover:bg-forest-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-forest-900 text-charcoal-900 dark:text-ivory-100 font-bold text-xs sm:text-sm rounded-full border border-sage-300 dark:border-leaf-500/40 hover:border-leaf-500 shadow-sm hover:shadow-md transition-all hover:scale-105"
        >
          <span>Explore All Non-Veg Gourmet Packs</span>
          <ArrowRight className="w-4 h-4 text-leaf-500" />
        </Link>
      </div>

    </section>
  );
};
