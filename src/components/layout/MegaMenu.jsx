import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const MegaMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 w-[840px] bg-white/98 dark:bg-forest-900/98 backdrop-blur-2xl border border-sage-200 dark:border-leaf-500/30 rounded-3xl shadow-2xl p-6 z-50 animate-fadeIn select-none text-charcoal-900 dark:text-ivory-100">
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Categories list with subcategories */}
        <div className="col-span-8 grid grid-cols-2 gap-4 border-r border-gray-100 dark:border-forest-800 pr-6">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-1.5 group">
              <Link
                to={`/category/${cat.slug}`}
                onClick={onClose}
                className="flex items-center gap-2.5 font-bold text-charcoal-900 dark:text-white group-hover:text-leaf-600 dark:group-hover:text-leaf-400 text-sm transition-colors"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden bg-sage-100 dark:bg-forest-800 shrink-0 border border-sage-200 dark:border-leaf-500/20">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <span>{cat.name}</span>
              </Link>
              
              <div className="pl-10 space-y-1">
                {cat.subcategories.slice(0, 3).map((sub, idx) => (
                  <Link
                    key={idx}
                    to={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="block text-xs text-gray-500 dark:text-gray-300 hover:text-leaf-600 dark:hover:text-leaf-300 transition-colors truncate"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right 4 Cols: Featured Non-Veg Spotlight Card */}
        <div className="col-span-4 flex flex-col justify-between">
          <div className="relative rounded-2xl overflow-hidden p-4 bg-gradient-to-br from-forest-900 to-forest-950 border border-leaf-500/40 text-white group shadow-md">
            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-lime-300 bg-forest-900/90 px-2 py-0.5 rounded-full border border-lime-400/40">
                <Flame className="w-3 h-3 text-orange-400" />
                Chef's Special Kebab
              </span>
              <h4 className="font-serif text-base font-bold text-white">
                Awadhi Mutton Kakori Platter
              </h4>
              <p className="text-xs text-leaf-200/90 leading-relaxed">
                Slow-ground pasture lamb infused with saffron and Lucknow potli masala.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-xs font-bold text-leaf-300 hover:text-lime-300 group-hover:underline"
                >
                  <span>Explore Gourmet Packs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            {/* Background image preview */}
            <div className="mt-3 rounded-xl overflow-hidden h-28 border border-leaf-500/20">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80"
                alt="Mutton Kakori Kebab"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-forest-800 flex items-center justify-between text-xs text-leaf-700 dark:text-leaf-300 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-leaf-600 dark:text-leaf-400" />
              100% Antibiotic-Free
            </span>
            <Link
              to="/shop"
              onClick={onClose}
              className="text-leaf-600 dark:text-leaf-400 hover:underline font-bold"
            >
              View All Menu &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

