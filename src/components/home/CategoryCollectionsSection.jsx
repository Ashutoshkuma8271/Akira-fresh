import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';
import { PRODUCTS } from '../../data/products';

export const CategoryCollectionsSection = () => {
  const [activeCategory, setActiveCategory] = useState('kebabs');

  const categories = [
    {
      id: 'kebabs',
      label: 'Awadhi Kebabs',
      desc: 'Galouti, Malai Tikka & Tandoori Spiced Skewers',
      filter: (p) => p.category === 'chicken-kebabs' || p.category === 'kebabs' || p.category === 'mutton-delights'
    },
    {
      id: 'snacks',
      label: 'Crispy & Fried',
      desc: 'Popcorn, Golden Nuggets, Crispy Strips & Cutlets',
      filter: (p) => p.category === 'chicken-snacks' || p.category === 'crispy-snacks'
    },
    {
      id: 'momos',
      label: 'Juicy Momos',
      desc: 'Steamed Himalayan Chicken & Mutton Momos with Dip',
      filter: (p) => p.category === 'momos' || p.name.toLowerCase().includes('momo')
    },
    {
      id: 'wings-drumsticks',
      label: 'Wings & Drumsticks',
      desc: 'Peri-Peri Wings, Smoky BBQ & Buffalo Glaze',
      filter: (p) => p.category === 'wings-drumsticks' || p.name.toLowerCase().includes('wing')
    },
    {
      id: 'sausages-salami',
      label: 'Sausages & Salami',
      desc: 'Smoked Frankfurters, Salami & Breakfast Links',
      filter: (p) => p.category === 'sausages-salami' || p.category === 'sausages-cold-cuts'
    },
  ];

  const currentCategoryData = categories.find((c) => c.id === activeCategory);
  const allCategoryProducts = PRODUCTS.filter(currentCategoryData ? currentCategoryData.filter : (p) => true);
  const products = allCategoryProducts.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 select-none">
      
      {/* Header with Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6 sm:mb-8">
        <div className="space-y-0.5 sm:space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-leaf-700 dark:text-leaf-400 uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-charcoal-950 dark:text-white tracking-tight">
            Explore Menu By Category
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-700 dark:text-gray-300 max-w-xl">
            {currentCategoryData ? currentCategoryData.desc : 'Browse our artisanal ready-to-cook delicacies.'}
          </p>
        </div>

        {/* Category Pills Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
      <div className="text-center mt-8 sm:mt-10">
        <Link
          to={`/shop?category=${activeCategory}`}
          className="inline-flex items-center gap-1.5 px-6 sm:px-8 py-3 bg-white dark:bg-forest-900 text-charcoal-950 dark:text-ivory-100 font-bold text-xs sm:text-sm rounded-full border border-gray-200 dark:border-leaf-500/40 hover:border-leaf-500 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
        >
          <span>View All {currentCategoryData?.label} ({allCategoryProducts.length})</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-leaf-600 dark:text-leaf-400" />
        </Link>
      </div>

    </section>
  );
};


