import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Sparkles, Flame, Tag, Percent, Leaf, ShieldCheck } from 'lucide-react';
import { MegaMenu } from './MegaMenu';

export const NavigationBar = () => {
  const location = useLocation();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-forest-950/90 text-ivory-100 border-b border-forest-800/80 hidden lg:block select-none relative z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11 text-xs">
          
          {/* Left Nav Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Home */}
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                isActive('/')
                  ? 'text-leaf-400 bg-forest-900 font-semibold'
                  : 'text-ivory-200 hover:text-leaf-400 hover:bg-forest-900/60'
              }`}
            >
              Home
            </Link>

            {/* Shop All */}
            <Link
              to="/shop"
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                isActive('/shop')
                  ? 'text-leaf-400 bg-forest-900 font-semibold'
                  : 'text-ivory-200 hover:text-leaf-400 hover:bg-forest-900/60'
              }`}
            >
              All Produce
            </Link>

            {/* Categories with Mega Menu Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                className={`px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  isMegaMenuOpen || location.pathname.startsWith('/category')
                    ? 'text-leaf-400 bg-forest-900 font-semibold'
                    : 'text-ivory-200 hover:text-leaf-400 hover:bg-forest-900/60'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-leaf-400' : 'text-gray-400'}`} />
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
              className={`px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1.5 transition-all ${
                isActive('/new-arrivals')
                  ? 'text-leaf-400 bg-forest-900 font-semibold'
                  : 'text-ivory-200 hover:text-leaf-400 hover:bg-forest-900/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Fresh Picks</span>
            </Link>

            {/* Offers */}
            <Link
              to="/offers"
              className={`px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1.5 transition-all ${
                isActive('/offers')
                  ? 'text-leaf-400 bg-forest-900 font-semibold'
                  : 'text-ivory-200 hover:text-leaf-400 hover:bg-forest-900/60'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-lime-400" />
              <span>Seasonal Offers</span>
            </Link>

            {/* Farm Story / Help */}
            <Link
              to="/help"
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                isActive('/help')
                  ? 'text-leaf-400 bg-forest-900 font-semibold'
                  : 'text-ivory-200 hover:text-leaf-400 hover:bg-forest-900/60'
              }`}
            >
              Our Story & Promise
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                isActive('/contact')
                  ? 'text-leaf-400 bg-forest-900 font-semibold'
                  : 'text-ivory-200 hover:text-leaf-400 hover:bg-forest-900/60'
              }`}
            >
              Contact
            </Link>

          </nav>

          {/* Right Highlight Badge: 2-Hour Express Delivery */}
          <div className="flex items-center gap-3 text-leaf-300 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/80 border border-leaf-500/30">
              <span className="w-2 h-2 rounded-full bg-leaf-400 animate-ping" />
              <span>2-Hour Express Cold Delivery Active</span>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
