import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Sparkles, Percent } from 'lucide-react';
import { MegaMenu } from './MegaMenu';

export const NavigationBar = () => {
  const location = useLocation();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-sage-50/95 dark:bg-forest-950/90 text-charcoal-800 dark:text-ivory-100 border-b border-sage-200/80 dark:border-forest-800/80 hidden lg:block select-none relative z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11 text-xs">
          
          {/* Left Nav Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Home */}
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                isActive('/')
                  ? 'text-leaf-700 dark:text-leaf-400 bg-white dark:bg-forest-900 shadow-sm border border-sage-200 dark:border-forest-700'
                  : 'text-charcoal-700 dark:text-ivory-200 hover:text-leaf-600 dark:hover:text-leaf-400 hover:bg-white/60 dark:hover:bg-forest-900/60'
              }`}
            >
              Home
            </Link>

            {/* Shop All */}
            <Link
              to="/shop"
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                isActive('/shop')
                  ? 'text-leaf-700 dark:text-leaf-400 bg-white dark:bg-forest-900 shadow-sm border border-sage-200 dark:border-forest-700'
                  : 'text-charcoal-700 dark:text-ivory-200 hover:text-leaf-600 dark:hover:text-leaf-400 hover:bg-white/60 dark:hover:bg-forest-900/60'
              }`}
            >
              All Delicacies
            </Link>

            {/* Categories with Mega Menu Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                className={`px-3 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  isMegaMenuOpen || location.pathname.startsWith('/category')
                    ? 'text-leaf-700 dark:text-leaf-400 bg-white dark:bg-forest-900 shadow-sm border border-sage-200 dark:border-forest-700'
                    : 'text-charcoal-700 dark:text-ivory-200 hover:text-leaf-600 dark:hover:text-leaf-400 hover:bg-white/60 dark:hover:bg-forest-900/60'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-leaf-600 dark:text-leaf-400' : 'text-gray-400'}`} />
              </button>

              {/* Mega Menu Dropdown */}
              <MegaMenu
                isOpen={isMegaMenuOpen}
                onClose={() => setIsMegaMenuOpen(false)}
              />
            </div>

            {/* Fresh Picks */}
            <Link
              to="/new-arrivals"
              className={`px-3 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1.5 transition-all ${
                isActive('/new-arrivals')
                  ? 'text-leaf-700 dark:text-leaf-400 bg-white dark:bg-forest-900 shadow-sm border border-sage-200 dark:border-forest-700'
                  : 'text-charcoal-700 dark:text-ivory-200 hover:text-leaf-600 dark:hover:text-leaf-400 hover:bg-white/60 dark:hover:bg-forest-900/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>Fresh Drops</span>
            </Link>

            {/* Offers */}
            <Link
              to="/offers"
              className={`px-3 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1.5 transition-all ${
                isActive('/offers')
                  ? 'text-leaf-700 dark:text-leaf-400 bg-white dark:bg-forest-900 shadow-sm border border-sage-200 dark:border-forest-700'
                  : 'text-charcoal-700 dark:text-ivory-200 hover:text-leaf-600 dark:hover:text-leaf-400 hover:bg-white/60 dark:hover:bg-forest-900/60'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>Party Combos</span>
            </Link>

            {/* Farm Story / Help */}
            <Link
              to="/help"
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                isActive('/help')
                  ? 'text-leaf-700 dark:text-leaf-400 bg-white dark:bg-forest-900 shadow-sm border border-sage-200 dark:border-forest-700'
                  : 'text-charcoal-700 dark:text-ivory-200 hover:text-leaf-600 dark:hover:text-leaf-400 hover:bg-white/60 dark:hover:bg-forest-900/60'
              }`}
            >
              Cold-Chain Story
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                isActive('/contact')
                  ? 'text-leaf-700 dark:text-leaf-400 bg-white dark:bg-forest-900 shadow-sm border border-sage-200 dark:border-forest-700'
                  : 'text-charcoal-700 dark:text-ivory-200 hover:text-leaf-600 dark:hover:text-leaf-400 hover:bg-white/60 dark:hover:bg-forest-900/60'
              }`}
            >
              Contact
            </Link>

          </nav>

          {/* Right Highlight Badge: 2-Hour Express Delivery */}
          <div className="flex items-center gap-3 text-leaf-700 dark:text-leaf-300 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-forest-900/80 border border-sage-300 dark:border-leaf-500/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-leaf-500 dark:bg-leaf-400 animate-ping" />
              <span>2-Hour Express Cold Delivery Active</span>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

