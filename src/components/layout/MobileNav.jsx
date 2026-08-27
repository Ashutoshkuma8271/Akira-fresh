import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronRight, Sparkles, Percent, Heart, ShoppingBag, User, MapPin, Truck, Flame, ShieldCheck, HelpCircle, Phone } from 'lucide-react';
import { Logo } from '../common/Logo';
import { CATEGORIES } from '../../data/categories';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const MobileNav = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, user, setIsAuthModalOpen, setAuthMode, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-white dark:bg-[#072418] text-charcoal-900 dark:text-ivory-100 h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-r border-gray-200 dark:border-forest-800 animate-slideLeft z-10">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-forest-800 flex items-center justify-between">
            <Logo size="small" />
            <button
              onClick={onClose}
              className="p-2 text-charcoal-700 dark:text-gray-300 hover:text-charcoal-950 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-forest-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Section */}
          <div className="p-4 bg-gray-50 dark:bg-forest-950/80 border-b border-gray-100 dark:border-forest-800">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back,</p>
                  <p className="text-sm font-bold text-charcoal-950 dark:text-white truncate">{user.name}</p>
                </div>
                <Link
                  to="/account"
                  onClick={onClose}
                  className="px-3 py-1 bg-[#84CC16] text-forest-950 text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 text-xs font-black rounded-xl text-center cursor-pointer shadow-xs"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onClose();
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-white dark:bg-forest-800 text-charcoal-900 dark:text-leaf-300 text-xs font-bold rounded-xl border border-gray-200 dark:border-forest-700 text-center cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions (Wishlist & Cart & Track) */}
          <div className="grid grid-cols-3 gap-2 p-3 border-b border-gray-100 dark:border-forest-800 text-center text-xs">
            <Link
              to="/wishlist"
              onClick={onClose}
              className="p-2.5 bg-gray-100 dark:bg-forest-850 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-200 dark:hover:bg-forest-800 transition-colors"
            >
              <div className="relative">
                <Heart className="w-4 h-4 text-charcoal-800 dark:text-leaf-400" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-leaf-500 text-forest-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-charcoal-800 dark:text-gray-200">Wishlist</span>
            </Link>

            <Link
              to="/cart"
              onClick={onClose}
              className="p-2.5 bg-gray-100 dark:bg-forest-850 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-200 dark:hover:bg-forest-800 transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-charcoal-800 dark:text-leaf-400" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-leaf-500 text-forest-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-charcoal-800 dark:text-gray-200">Basket</span>
            </Link>

            <Link
              to="/track-order"
              onClick={onClose}
              className="p-2.5 bg-gray-100 dark:bg-forest-850 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-200 dark:hover:bg-forest-800 transition-colors"
            >
              <Truck className="w-4 h-4 text-charcoal-800 dark:text-leaf-400" />
              <span className="text-[11px] font-medium text-charcoal-800 dark:text-gray-200">Track Order</span>
            </Link>
          </div>

          {/* Primary Navigation Links matching header */}
          <div className="py-2">
            <div className="px-4 py-2 text-[10px] uppercase font-bold text-leaf-700 dark:text-leaf-400 tracking-wider">
              Navigation
            </div>
            
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-forest-800 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/shop"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-forest-800 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors"
            >
              <span>Shop All Products</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/categories"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-forest-800 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors"
            >
              <span>Shop by Category</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/bestsellers"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-forest-800 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-500 dark:text-lime-400" />
                Best Sellers
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/offers"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-forest-800 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-lime-500 dark:text-lime-400" />
                Combos & Party Bundles
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/help"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-forest-800 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors"
            >
              <span>About Akira Fresh</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/contact"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-forest-800 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors"
            >
              <span>Contact Us</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            {/* Categories Submenu */}
            <div className="px-4 pt-3 pb-1 text-[10px] uppercase font-bold text-leaf-700 dark:text-leaf-400 tracking-wider">
              Categories
            </div>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-2 text-xs text-charcoal-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-800 hover:text-leaf-700 dark:hover:text-white transition-colors"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-gray-400">{cat.itemCount}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer info in drawer */}
        <div className="p-4 border-t border-gray-100 dark:border-forest-800 text-xs text-charcoal-600 dark:text-gray-400 space-y-1.5 bg-gray-50 dark:bg-forest-950/60">
          <div className="flex items-center gap-1.5 text-leaf-700 dark:text-leaf-300 font-bold">
            <MapPin className="w-3.5 h-3.5 text-leaf-600 dark:text-leaf-400 shrink-0" />
            <span>Delivering across 500+ NCR Pin Codes</span>
          </div>
          <p className="text-[11px] text-gray-500">-18°C Cold Chain Protected • 100% Antibiotic-Free</p>
        </div>
      </div>
    </div>
  );
};


