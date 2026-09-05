import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Sparkles, Menu } from 'lucide-react';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { SearchModal } from '../common/SearchModal';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const MainHeader = ({ onOpenMobileMenu, onOpenSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, setIsAuthModalOpen, setAuthMode, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [internalSearchModalOpen, setInternalSearchModalOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const accountRef = useRef(null);

  const openSearch = onOpenSearch || (() => setInternalSearchModalOpen(true));

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    } else {
      openSearch();
    }
  };

  return (
    <>
      {/* Master Main Header (Matching Exact Reference Mockup) */}
      <div
        className={`w-full bg-white/95 dark:bg-[#072418]/95 backdrop-blur-md border-b border-gray-200/80 dark:border-forest-800 transition-all duration-300 select-none shadow-xs ${
          isScrolled ? 'py-2.5 sm:py-3' : 'py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
            
            {/* Left: Mobile Menu Button + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={onOpenMobileMenu}
                aria-label="Open mobile menu"
                className="lg:hidden p-1.5 text-charcoal-800 dark:text-gray-200 hover:text-[#1b4332] rounded-xl hover:bg-gray-100 dark:hover:bg-forest-800 transition-colors cursor-pointer"
              >
                <Menu className="w-6 h-6 stroke-[2]" />
              </button>
              <Logo />
            </div>

            {/* Center Navigation Links (Home, Shop, Categories, Best Sellers, About, Contact) */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-charcoal-800 dark:text-gray-200">
              <Link
                to="/"
                className={`relative py-1 transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/') ? 'text-[#1b4332] dark:text-lime-400 font-bold' : ''
                }`}
              >
                <span>Home</span>
                {isActive('/') && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/shop"
                className={`relative py-1 transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/shop') || isActive('/collections/all')
                    ? 'text-[#1b4332] dark:text-lime-400 font-bold'
                    : ''
                }`}
              >
                <span>Shop</span>
                {(isActive('/shop') || isActive('/collections/all')) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/categories"
                className={`relative py-1 transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/categories') || isActive('/collections') || location.pathname.startsWith('/category')
                    ? 'text-[#1b4332] dark:text-lime-400 font-bold'
                    : ''
                }`}
              >
                <span>Categories</span>
                {(isActive('/categories') || isActive('/collections') || location.pathname.startsWith('/category')) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/bestsellers"
                className={`relative py-1 transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/bestsellers') || isActive('/collections/bestsellers')
                    ? 'text-[#1b4332] dark:text-lime-400 font-bold'
                    : ''
                }`}
              >
                <span>Best Sellers</span>
                {(isActive('/bestsellers') || isActive('/collections/bestsellers')) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/help"
                className={`relative py-1 transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/help') || isActive('/about') || isActive('/pages/about-as-foody')
                    ? 'text-[#1b4332] dark:text-lime-400 font-bold'
                    : ''
                }`}
              >
                <span>About</span>
                {(isActive('/help') || isActive('/about') || isActive('/pages/about-as-foody')) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/contact"
                className={`relative py-1 transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/contact') || isActive('/pages/contact') ? 'text-[#1b4332] dark:text-lime-400 font-bold' : ''
                }`}
              >
                <span>Contact</span>
                {(isActive('/contact') || isActive('/pages/contact')) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>
            </nav>

            {/* Right Controls: Desktop Search Capsule + 1. Theme, 2. Wishlist, 3. Cart, 4. Profile */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-2.5 shrink-0">
              
              {/* Search Capsule Input (Desktop & Tablet) */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden lg:flex items-center bg-[#F3F1EC] dark:bg-forest-900 text-charcoal-900 dark:text-white rounded-full px-3.5 py-1.5 w-44 xl:w-64 border border-gray-200/80 dark:border-forest-700 shadow-2xs mr-1"
              >
                <Search className="w-4 h-4 text-gray-500 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent border-none text-xs text-charcoal-900 dark:text-white placeholder-gray-500 focus:outline-none w-full font-medium"
                />
              </form>

              {/* 1. Theme Toggle (Sun/Moon) */}
              <div className="flex items-center">
                <ThemeToggle />
              </div>

              {/* 2. Wishlist Link (Heart with live badge) */}
              <Link
                to="/wishlist"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 dark:border-forest-700/80 text-charcoal-800 dark:text-gray-200 hover:text-[#1b4332] dark:hover:text-lime-400 hover:bg-gray-100 dark:hover:bg-forest-800/80 transition-colors relative flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.9]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#22C55E] text-forest-950 font-black text-[9px] sm:text-[10px] min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center shadow-xs border border-white dark:border-forest-900 leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* 3. Cart Button (Bag with counter badge) */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 dark:border-forest-700/80 text-charcoal-800 dark:text-gray-200 hover:text-[#1b4332] dark:hover:text-lime-400 hover:bg-gray-100 dark:hover:bg-forest-800/80 transition-colors relative cursor-pointer flex items-center justify-center shrink-0"
                aria-label="Cart Bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.9]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-slate-950 font-black text-[9px] sm:text-[10px] min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center shadow-xs border border-white dark:border-forest-900 leading-none">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* 4. User Profile Account Popover */}
              <div ref={accountRef} className="relative flex items-center">
                <button
                  onClick={() => {
                    if (window.innerWidth < 640 && !isAuthenticated) {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    } else {
                      setIsAccountOpen(!isAccountOpen);
                    }
                  }}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all cursor-pointer flex items-center justify-center shrink-0 overflow-hidden relative ${
                    isAuthenticated
                      ? 'border-leaf-500 dark:border-lime-400 bg-leaf-500/10 dark:bg-forest-800 text-[#1b4332] dark:text-lime-300 font-bold text-xs shadow-xs'
                      : 'border-gray-300 dark:border-forest-700/80 text-charcoal-800 dark:text-gray-200 hover:text-[#1b4332] dark:hover:text-lime-400 hover:bg-gray-100 dark:hover:bg-forest-800/80'
                  }`}
                  aria-label="Account Profile"
                >
                  {isAuthenticated ? (
                    user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="font-serif font-black text-xs uppercase">
                        {user?.name ? user.name.charAt(0) : 'U'}
                      </span>
                    )
                  ) : (
                    <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.9]" />
                  )}

                  {/* Live Active Signed-In Dot Indicator */}
                  {isAuthenticated && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-lime-500 border border-white dark:border-forest-900 ring-1 ring-forest-950/20" />
                  )}
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 sm:w-60 bg-white dark:bg-forest-900 border border-gray-100 dark:border-leaf-500/30 text-charcoal-900 dark:text-ivory-100 rounded-2xl shadow-2xl py-2 z-50 animate-scaleUp">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-forest-800">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                          <p className="text-sm font-bold text-charcoal-900 dark:text-white truncate">{user.name}</p>
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-leaf-700 dark:text-lime-300 bg-leaf-500/15 dark:bg-leaf-500/20 px-2 py-0.5 rounded-full border border-leaf-500/30">
                            <Sparkles className="w-2.5 h-2.5 text-leaf-600 dark:text-lime-400" />
                            {user.membershipTier || 'Fresh VIP Member'}
                          </span>
                        </div>
                        <div className="py-1 text-xs">
                          <Link
                            to="/account"
                            onClick={() => setIsAccountOpen(false)}
                            className="block px-4 py-2 text-charcoal-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-forest-800 hover:text-[#1b4332] dark:hover:text-lime-400 transition-colors"
                          >
                            My Dashboard
                          </Link>
                          <Link
                            to="/account/orders"
                            onClick={() => setIsAccountOpen(false)}
                            className="block px-4 py-2 text-charcoal-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-forest-800 hover:text-[#1b4332] dark:hover:text-lime-400 transition-colors"
                          >
                            My Orders
                          </Link>
                          <Link
                            to="/track-order"
                            onClick={() => setIsAccountOpen(false)}
                            className="block px-4 py-2 text-charcoal-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-forest-800 hover:text-[#1b4332] dark:hover:text-lime-400 transition-colors"
                          >
                            Track Live Order
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 dark:border-forest-800 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsAccountOpen(false);
                              navigate('/');
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-forest-800 cursor-pointer transition-colors"
                          >
                            Log Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 text-center space-y-3">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-charcoal-900 dark:text-white">Fresh Gourmet Privileges</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-300 leading-tight">
                            Sign in to track orders & claim deals.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setAuthMode('login');
                            setIsAuthModalOpen(true);
                            setIsAccountOpen(false);
                          }}
                          className="w-full py-2 bg-[#1b4332] hover:bg-[#122c21] text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
                        >
                          Sign In
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Global Search Modal fallback if standalone */}
      {!onOpenSearch && (
        <SearchModal
          isOpen={internalSearchModalOpen}
          onClose={() => setInternalSearchModalOpen(false)}
        />
      )}
    </>
  );
};





