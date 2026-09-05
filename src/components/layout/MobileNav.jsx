import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  ChevronRight,
  Sparkles,
  Percent,
  Heart,
  Package,
  User,
  MapPin,
  Truck,
  HelpCircle,
  Phone,
  Sun,
  Moon,
  LogOut,
  Compass,
  Layers,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { CATEGORIES } from '../../data/categories';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const MobileNav = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, user, setIsAuthModalOpen, setAuthMode, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-white dark:bg-[#072418] text-charcoal-900 dark:text-ivory-100 h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-r border-gray-200 dark:border-forest-800 animate-slideLeft z-10">
        <div>
          {/* Header with Logo and Close */}
          <div className="p-4 border-b border-gray-100 dark:border-forest-800 flex items-center justify-between bg-white dark:bg-[#072418] sticky top-0 z-20">
            <Logo size="small" />
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-charcoal-700 dark:text-gray-300 hover:text-charcoal-950 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-forest-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account Section */}
          <div className="p-4 bg-gray-50/90 dark:bg-forest-950/80 border-b border-gray-100 dark:border-forest-800">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      {user?.avatar ? (
                        <div className="w-10 h-10 rounded-full border-[1.5px] border-[#1b4332] dark:border-lime-400 overflow-hidden shadow-xs bg-[#EAF5EE] dark:bg-forest-800 flex items-center justify-center">
                          <img
                            src={user.avatar}
                            alt={user.name || 'User'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full border-[1.5px] border-[#1b4332] dark:border-lime-400 bg-[#EAF5EE] dark:bg-forest-800 text-[#1b4332] dark:text-lime-300 font-serif font-bold text-base flex items-center justify-center shadow-xs">
                          {user.name ? user.name.trim().charAt(0).toUpperCase() : 'A'}
                        </div>
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 dark:bg-lime-400 ring-2 ring-white dark:ring-[#072418]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-charcoal-950 dark:text-white truncate">{user.name}</p>
                    </div>
                  </div>
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="px-3 py-1.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 text-xs font-bold rounded-xl cursor-pointer shadow-xs shrink-0 transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-[#1b4332] dark:bg-lime-500 hover:bg-[#122c21] dark:hover:bg-lime-400 text-white dark:text-forest-950 text-xs font-black rounded-xl text-center cursor-pointer shadow-xs transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onClose();
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-white dark:bg-forest-800 text-charcoal-900 dark:text-leaf-300 text-xs font-bold rounded-xl border border-gray-200 dark:border-forest-700 hover:bg-gray-50 dark:hover:bg-forest-700 text-center cursor-pointer transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions (Direct links to Orders, Wishlist & Customer Care) */}
          <div className="grid grid-cols-3 gap-2 p-3 border-b border-gray-100 dark:border-forest-800 text-center text-xs">
            <Link
              to={isAuthenticated ? '/account/orders' : '/track-order'}
              onClick={onClose}
              className="p-2.5 bg-gray-100/90 dark:bg-forest-850 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-200/90 dark:hover:bg-forest-800 transition-colors"
            >
              <Package className="w-4.5 h-4.5 text-[#1b4332] dark:text-lime-400" />
              <span className="text-[11px] font-semibold text-charcoal-800 dark:text-gray-200">My Orders</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={onClose}
              className="p-2.5 bg-gray-100/90 dark:bg-forest-850 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-200/90 dark:hover:bg-forest-800 transition-colors"
            >
              <div className="relative">
                <Heart className="w-4.5 h-4.5 text-[#1b4332] dark:text-lime-400" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#22C55E] text-forest-950 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-charcoal-800 dark:text-gray-200">Wishlist</span>
            </Link>

            <Link
              to="/help"
              onClick={onClose}
              className="p-2.5 bg-gray-100/90 dark:bg-forest-850 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-200/90 dark:hover:bg-forest-800 transition-colors"
            >
              <HelpCircle className="w-4.5 h-4.5 text-[#1b4332] dark:text-lime-400" />
              <span className="text-[11px] font-semibold text-charcoal-800 dark:text-gray-200">Help & FAQs</span>
            </Link>
          </div>

          {/* Primary Navigation Links */}
          <div className="py-2">
            <div className="px-4 py-2 text-[10px] uppercase font-bold text-gray-500 dark:text-leaf-400 tracking-wider">
              Explore Store
            </div>
            
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-forest-850 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors border-b border-gray-100/60 dark:border-forest-800/40"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/shop"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-forest-850 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors border-b border-gray-100/60 dark:border-forest-800/40"
            >
              <span>Shop All Products</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/categories"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-forest-850 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors border-b border-gray-100/60 dark:border-forest-800/40"
            >
              <span>Shop by Category</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/bestsellers"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-forest-850 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors border-b border-gray-100/60 dark:border-forest-800/40"
            >
              <span className="flex items-center gap-2 text-[#1b4332] dark:text-lime-400 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-lime-400" />
                Best Sellers
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/offers"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-forest-850 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors border-b border-gray-100/60 dark:border-forest-800/40"
            >
              <span className="flex items-center gap-2 text-emerald-700 dark:text-lime-300 font-bold">
                <Percent className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
                Combos & Party Bundles
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/track-order"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-forest-850 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors border-b border-gray-100/60 dark:border-forest-800/40"
            >
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                Track Live Order
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/help"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-forest-850 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors border-b border-gray-100/60 dark:border-forest-800/40"
            >
              <span>About A_S FOODY</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/contact"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-forest-850 text-sm font-semibold text-charcoal-900 dark:text-ivory-100 transition-colors border-b border-gray-100/60 dark:border-forest-800/40"
            >
              <span>Contact Us</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            {/* Categories Submenu */}
            <div className="px-4 pt-4 pb-1 text-[10px] uppercase font-bold text-gray-500 dark:text-leaf-400 tracking-wider">
              Popular Categories
            </div>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-2 text-xs text-charcoal-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-800 hover:text-[#1b4332] dark:hover:text-white transition-colors"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-gray-400">{cat.itemCount}</span>
              </Link>
            ))}

            {/* Logout button if authenticated */}
            {isAuthenticated && (
              <div className="px-4 pt-3 pb-1 border-t border-gray-100 dark:border-forest-800 mt-2">
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 py-1.5 cursor-pointer w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Account</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer with Dark/Light Mode Switch & Delivery Badge */}
        <div className="p-4 border-t border-gray-100 dark:border-forest-800 text-xs bg-gray-50 dark:bg-[#051c13] space-y-3 sticky bottom-0 z-20">
          
          {/* Real-World Light/Dark Mode Switcher */}
          <div className="flex items-center justify-between bg-white dark:bg-forest-900/90 p-2.5 rounded-xl border border-gray-200 dark:border-forest-700 shadow-2xs">
            <div className="flex items-center gap-2">
              {isDark ? (
                <Moon className="w-4 h-4 text-amber-300" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="text-xs font-semibold text-charcoal-800 dark:text-gray-200">
                {isDark ? 'Dark Mode' : 'Bright Mode'}
              </span>
            </div>
            
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                isDark ? 'bg-lime-500' : 'bg-gray-300'
              }`}
              aria-label="Toggle Theme"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-1 text-charcoal-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5 text-leaf-700 dark:text-leaf-300 font-bold text-xs">
              <MapPin className="w-3.5 h-3.5 text-leaf-600 dark:text-lime-400 shrink-0" />
              <span>Delivering across 500+ NCR Pin Codes</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              -18°C Cold Chain Protected • 100% Antibiotic-Free
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


