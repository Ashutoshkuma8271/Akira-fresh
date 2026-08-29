import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Flame, Star, Award, Sparkles, Filter } from 'lucide-react';

export const BestsellersPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Top bestsellers
  const bestsellers = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (activeFilter === 'protein') return p.protein || p.description.toLowerCase().includes('protein') || p.tags?.includes('High Protein');
      if (activeFilter === 'kebabs') return p.category === 'chicken-kebabs' || p.category === 'kebabs';
      if (activeFilter === 'momos') return p.category === 'momos' || p.name.toLowerCase().includes('momo');
      if (activeFilter === 'snacks') return p.category === 'crispy-snacks' || p.category === 'chicken-snacks';
      return p.isBestseller || p.rating >= 4.8;
    });
  }, [activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn text-charcoal-900 dark:text-ivory-100">
      
      {/* Bestseller Hero Header */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#061e14] via-[#092b1d] to-[#0d3b27] text-white p-8 sm:p-12 mb-10 border border-leaf-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#072418] border border-leaf-500/40 text-lime-300 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>TOP-RATED CUSTOMER FAVORITES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            A_S FOODY Bestsellers
          </h1>
          <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed font-sans max-w-xl">
            Our most ordered non-veg creations. Handcrafted with traditional marinades, high protein cuts, and blast-frozen freshness.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-leaf-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {[
          { id: 'all', label: 'All Bestsellers' },
          { id: 'protein', label: '💪 High Protein (13-19g)' },
          { id: 'kebabs', label: '🍢 Awadhi Kebabs' },
          { id: 'momos', label: '🥟 Juicy Momos' },
          { id: 'snacks', label: '🍗 Crispy Snacks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
              activeFilter === tab.id
                ? 'bg-[#0E3723] dark:bg-[#84CC16] text-white dark:text-forest-950 shadow-sm'
                : 'bg-white dark:bg-forest-900 text-charcoal-800 dark:text-gray-200 border border-gray-200 dark:border-forest-700 hover:border-leaf-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {bestsellers.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
};
