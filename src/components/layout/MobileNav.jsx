import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronRight, Sparkles, Percent, Heart, ShoppingBag, User, MapPin, Truck, Leaf, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-forest-900 text-ivory-100 h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-r border-leaf-500/30">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-forest-800 flex items-center justify-between">
            <Logo size="small" />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-forest-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Section */}
          <div className="p-4 bg-forest-950/60 border-b border-forest-800">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Welcome back,</p>
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                </div>
                <Link
                  to="/account"
                  onClick={onClose}
                  className="px-3 py-1 bg-leaf-gradient text-forest-950 text-xs font-bold rounded-lg"
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
                  className="flex-1 py-2 bg-leaf-gradient text-forest-950 text-xs font-bold rounded-xl text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onClose();
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 py-2 bg-forest-800 text-leaf-400 text-xs font-bold rounded-xl border border-forest-700 text-center"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions (Wishlist & Cart & Track) */}
          <div className="grid grid-cols-3 gap-2 p-4 border-b border-forest-800 text-center text-xs">
            <Link
              to="/wishlist"
              onClick={onClose}
              className="p-2.5 bg-forest-850 rounded-xl flex flex-col items-center gap-1 hover:bg-forest-800"
            >
              <div className="relative">
                <Heart className="w-4 h-4 text-leaf-400" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-leaf-500 text-forest-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium">Wishlist</span>
            </Link>

            <Link
              to="/cart"
              onClick={onClose}
              className="p-2.5 bg-forest-850 rounded-xl flex flex-col items-center gap-1 hover:bg-forest-800"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-leaf-400" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-leaf-500 text-forest-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium">Basket</span>
            </Link>

            <Link
              to="/track-order"
              onClick={onClose}
              className="p-2.5 bg-forest-850 rounded-xl flex flex-col items-center gap-1 hover:bg-forest-800"
            >
              <Truck className="w-4 h-4 text-leaf-400" />
              <span className="text-[11px] font-medium">Track Order</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="py-2">
            <div className="px-4 py-2 text-[10px] uppercase font-bold text-leaf-400 tracking-wider">
              Browse Akira Fresh
            </div>
            
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-forest-800 text-sm font-medium text-ivory-100"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </Link>

            <Link
              to="/shop"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-forest-800 text-sm font-medium text-ivory-100"
            >
              <span>All Fresh Produce</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </Link>

            <Link
              to="/new-arrivals"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-forest-800 text-sm font-medium text-ivory-100"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-400" />
                Fresh Picks Today
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </Link>

            <Link
              to="/offers"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-forest-800 text-sm font-medium text-ivory-100"
            >
              <span className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-lime-400" />
                Seasonal Deals & Bundles
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </Link>

            {/* Categories Submenu */}
            <div className="px-4 pt-3 pb-1 text-[10px] uppercase font-bold text-leaf-400 tracking-wider">
              Categories
            </div>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-2 text-xs text-gray-300 hover:bg-forest-800 hover:text-white"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-gray-500">{cat.itemCount}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer info in drawer */}
        <div className="p-4 border-t border-forest-800 text-xs text-gray-400 space-y-2 bg-forest-950/40">
          <div className="flex items-center gap-1.5 text-leaf-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-leaf-400" />
            <span>Delivering across Delhi NCR</span>
          </div>
          <p className="text-[11px]">Cold-Chain Protected • 100% Hygienic</p>
        </div>
      </div>
    </div>
  );
};
