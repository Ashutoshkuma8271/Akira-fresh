import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const BottomNav = ({ onOpenSearch }) => {
  const location = useLocation();
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { isAuthenticated, user, setIsAuthModalOpen, setAuthMode } = useAuth();

  const isActive = (path) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));

  const isHomeActive = location.pathname === '/';
  const isCategoriesActive =
    location.pathname === '/categories' ||
    location.pathname.startsWith('/category') ||
    location.pathname === '/collections' ||
    location.pathname === '/shop';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#072418]/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-forest-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pb-[env(safe-area-inset-bottom)] transition-all duration-300">
      <div className="grid grid-cols-5 h-15 max-w-lg mx-auto items-center px-1">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-all relative ${
            isHomeActive
              ? 'text-forest-900 dark:text-lime-400 font-bold scale-105'
              : 'text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.9]" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home</span>
          {isHomeActive && (
            <span className="w-1 h-1 bg-forest-900 dark:bg-lime-400 rounded-full mt-0.5" />
          )}
        </Link>

        {/* 2. Categories */}
        <Link
          to="/categories"
          className={`flex flex-col items-center justify-center py-1 transition-all relative ${
            isCategoriesActive
              ? 'text-forest-900 dark:text-lime-400 font-bold scale-105'
              : 'text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-gray-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5 stroke-[1.9]" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Categories</span>
          {isCategoriesActive && (
            <span className="w-1 h-1 bg-forest-900 dark:bg-lime-400 rounded-full mt-0.5" />
          )}
        </Link>

        {/* 3. Search Trigger (Central Quick Action) */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-gray-200 transition-all cursor-pointer"
          aria-label="Search Catalog"
        >
          <div className="w-9 h-9 rounded-2xl bg-forest-900/5 dark:bg-forest-800/60 flex items-center justify-center text-charcoal-800 dark:text-gray-200 hover:bg-forest-900/10 dark:hover:bg-forest-800 transition-colors">
            <Search className="w-4.5 h-4.5 stroke-[2]" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Search</span>
        </button>

        {/* 4. Cart / Bag Trigger */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 relative transition-all cursor-pointer ${
            totalItemsCount > 0 ? 'text-forest-900 dark:text-lime-400 font-bold' : 'text-charcoal-600 dark:text-gray-400'
          }`}
          aria-label="Open Cart Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.9]" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#F59E0B] text-slate-950 font-black text-[9px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-xs border border-white dark:border-forest-900 leading-none animate-scaleUp">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Bag</span>
        </button>

        {/* 5. Account / Profile */}
        {isAuthenticated ? (
          <Link
            to="/account"
            className={`flex flex-col items-center justify-center py-1 transition-all relative ${
              isActive('/account')
                ? 'text-forest-900 dark:text-lime-400 font-bold scale-105'
                : 'text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="relative">
              {user?.avatar ? (
                <div className="w-5.5 h-5.5 rounded-full border border-[#1b4332] dark:border-lime-400 overflow-hidden bg-[#EAF5EE] dark:bg-forest-800 flex items-center justify-center">
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-5.5 h-5.5 rounded-full border border-[#1b4332] dark:border-lime-400 bg-[#EAF5EE] dark:bg-forest-800 text-[#1b4332] dark:text-lime-300 font-serif font-bold text-[10px] flex items-center justify-center leading-none">
                  {user?.name ? user.name.trim().charAt(0).toUpperCase() : 'A'}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 dark:bg-lime-400 ring-1.5 ring-white dark:ring-[#072418]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[56px] font-medium">
              {user?.name?.split(' ')[0] || 'Account'}
            </span>
            {isActive('/account') && (
              <span className="w-1 h-1 bg-forest-900 dark:bg-lime-400 rounded-full mt-0.5" />
            )}
          </Link>
        ) : (
          <button
            onClick={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            className="flex flex-col items-center justify-center py-1 text-charcoal-600 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-gray-200 transition-all cursor-pointer"
          >
            <User className="w-5 h-5 stroke-[1.9]" />
            <span className="text-[10px] mt-0.5 tracking-tight">Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
};
