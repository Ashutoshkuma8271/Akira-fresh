import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';

export const CategorySection = () => {
  return (
    <section className="w-full bg-white dark:bg-forest-950 py-10 sm:py-14 border-b border-gray-100 dark:border-forest-850 select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-6 sm:mb-8 text-left">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827] dark:text-white font-sans">
            Shop by Category
          </h2>
        </div>

        {/* 9 Circular Plate Categories Row (Smooth horizontal scroll on mobile/tablet, full 9-item row on large screens) */}
        <div className="flex items-start justify-start lg:justify-between gap-4 sm:gap-6 lg:gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="snap-start shrink-0 w-24 sm:w-28 lg:w-28 group flex flex-col items-center text-center cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Circular Ceramic Dish / Plate Container */}
              <div className="relative w-22 h-22 sm:w-26 sm:h-26 lg:w-28 lg:h-28 rounded-full p-1 bg-gradient-to-b from-[#fbf9f4] to-[#ede7db] dark:from-forest-800 dark:to-forest-900 border border-gray-200/90 dark:border-forest-700 shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden border border-white/60 dark:border-white/10 shadow-inner">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center rounded-full group-hover:scale-112 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Category Label */}
              <h3 className="mt-3 text-xs sm:text-[13px] font-bold text-[#111827] dark:text-gray-100 group-hover:text-leaf-600 dark:group-hover:text-lime-400 transition-colors leading-snug px-1 line-clamp-2">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};


