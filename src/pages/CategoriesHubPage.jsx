import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { ArrowRight, Sparkles, Layers, Flame, ChefHat } from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';
import { AnimatedSection } from '../components/common/AnimatedSection';

export const CategoriesHubPage = () => {
  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-charcoal-900 dark:text-ivory-100">
      
      {/* Category Hub Hero Header */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#061e14] via-[#092b1d] to-[#0d3b27] text-white p-8 sm:p-12 mb-12 border border-leaf-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#072418] border border-leaf-500/40 text-lime-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>ALL CURATED COLLECTIONS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Explore Menu By Category
          </h1>
          <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed font-sans max-w-xl">
            From melt-in-mouth Awadhi Galouti kebabs and juicy steamed momos to raw farm-fresh mutton cuts and party combo platters.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-leaf-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Grid of All 9 Categories */}
      <AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((cat) => {
            const categoryProducts = PRODUCTS.filter((p) => p.category === cat.slug);
            const count = categoryProducts.length || 6;

            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group bg-white dark:bg-forest-900 rounded-3xl p-6 border border-gray-200 dark:border-forest-800 shadow-sm hover:shadow-xl hover:border-leaf-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Plate Image with Floating Zoom */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-sage-50 dark:bg-forest-850 mb-5 border border-gray-100 dark:border-forest-750">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                      {count} Items
                    </div>
                  </div>

                  {/* Name & Description */}
                  <div className="space-y-1.5">
                    <h2 className="font-serif text-xl font-bold text-charcoal-950 dark:text-white group-hover:text-leaf-700 dark:group-hover:text-lime-300 transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-charcoal-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Subcategories tags */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {cat.subcategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub}
                          className="text-[10px] font-semibold bg-gray-100 dark:bg-forest-800 text-charcoal-700 dark:text-gray-300 px-2.5 py-0.5 rounded-full"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Link */}
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-forest-800 flex items-center justify-between text-xs font-bold text-leaf-800 dark:text-lime-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore {cat.name}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </Link>
            );
          })}
        </div>
      </AnimatedSection>

    </PageTransition>
  );
};
