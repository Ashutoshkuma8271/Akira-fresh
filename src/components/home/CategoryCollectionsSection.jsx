import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';
import { PRODUCTS } from '../../data/products';

export const CategoryCollectionsSection = () => {
  const [activeCategory, setActiveCategory] = useState('chicken-kebabs');

  const categories = [
    { id: 'chicken-kebabs', label: 'Chicken Kebabs', desc: 'Galouti, Malai Tikka & Tandoori Spiced Skewers' },
    { id: 'mutton-delights', label: 'Mutton Specialties', desc: 'Awadhi Kakori, Shami Kebabs & Spiced Keema' },
    { id: 'crispy-snacks', label: 'Crispy & Fried', desc: 'Popcorn, Golden Nuggets, Crispy Strips & Cutlets' },
    { id: 'wings-drumsticks', label: 'Wings & Drumsticks', desc: 'Peri-Peri Wings, Smoky BBQ & Buffalo Glaze' },
    { id: 'sausages-salami', label: 'Sausages & Cold Cuts', desc: 'Smoked Frankfurters, Salami & Breakfast Links' },
  ];

  const currentCategoryData = categories.find((c) => c.id === activeCategory);
  const products = PRODUCTS.filter((p) => p.category === activeCategory).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 select-none">
      
      {/* Header with Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf-700 dark:text-leaf-400 uppercase tracking-widest mb-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-950 dark:text-white tracking-tight">
            Explore Menu By Category
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-700 dark:text-gray-300 mt-1 max-w-xl">
            {currentCategoryData ? currentCategoryData.desc : 'Browse our artisanal ready-to-cook delicacies.'}
          </p>
        </div>

        {/* Category Pills Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                activeCategory === cat.id
                  ? 'bg-[#0E3723] dark:bg-[#84CC16] text-white dark:text-forest-950 shadow-sm'
                  : 'bg-white dark:bg-forest-900 text-charcoal-800 dark:text-gray-200 border border-gray-200 dark:border-forest-700 hover:border-leaf-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Column Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom View All Link */}
      <div className="text-center mt-10">
        <Link
          to={`/category/${activeCategory}`}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-forest-900 text-charcoal-950 dark:text-ivory-100 font-bold text-xs sm:text-sm rounded-full border border-gray-200 dark:border-leaf-500/40 hover:border-leaf-500 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer"
        >
          <span>View All {currentCategoryData?.label} ({PRODUCTS.filter(p => p.category === activeCategory).length} Items)</span>
          <ArrowRight className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
        </Link>
      </div>

    </section>
  );
};

