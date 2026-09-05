import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Sparkles, Menu, MapPin, ShieldCheck, LogOut, Truck, ChevronRight } from 'lucide-react';
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
                    if (!isAuthenticated) {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    } else {
                      setIsAccountOpen(!isAccountOpen);
                    }
                  }}
                  className="relative cursor-pointer flex items-center gap-2 shrink-0 focus:outline-none py-1 px-1 rounded-full hover:bg-gray-100/70 dark:hover:bg-forest-800/50 transition-colors"
                  aria-label="Account Profile"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="relative shrink-0">
                        {user?.avatar ? (
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-[1.5px] border-[#1b4332] dark:border-lime-400 overflow-hidden shadow-xs bg-[#EAF5EE] dark:bg-forest-800 flex items-center justify-center">
                            <img
                              src={user.avatar}
                              alt={user.name || 'User'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-[1.5px] border-[#1b4332] dark:border-lime-400 bg-[#EAF5EE] dark:bg-forest-800 flex items-center justify-center shadow-xs transition-transform hover:scale-105">
                            <span className="font-serif font-bold text-sm sm:text-base text-[#1b4332] dark:text-lime-300 select-none leading-none">
                              {user?.name ? user.name.trim().charAt(0).toUpperCase() : 'A'}
                            </span>
                          </div>
                        )}

                        {/* Live Active Online Dot Indicator overlapping the border */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-lime-400 ring-2 ring-white dark:ring-[#072418] shadow-xs" />
                      </div>

                      {/* Clean First Name Display without trailing dots */}
                      <span className="hidden md:inline-block font-semibold text-xs text-charcoal-900 dark:text-gray-200 max-w-[85px] truncate">
                        {user?.name ? user.name.trim().split(' ')[0] : 'Account'}
                      </span>
                    </>
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 dark:border-forest-700/80 text-charcoal-800 dark:text-gray-200 hover:text-[#1b4332] dark:hover:text-lime-400 hover:bg-gray-100 dark:hover:bg-forest-800/80 transition-colors flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.9]" />
                    </div>
                  )}
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 sm:w-64 bg-white dark:bg-forest-900 border border-gray-200/90 dark:border-forest-750 text-charcoal-900 dark:text-ivory-100 rounded-2xl shadow-2xl z-50 animate-scaleUp overflow-hidden">
                    {isAuthenticated ? (
                      <>
                        {/* User Header Profile Card */}
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-forest-800 bg-white dark:bg-forest-900">
                          <p className="text-xs text-slate-500 dark:text-gray-400 font-normal">Signed in as</p>
                          <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                            {user?.name || 'Customer'}
                          </p>
                          <div className="mt-2.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7F0] dark:bg-forest-800/90 border border-[#BCE8CB] dark:border-forest-700 text-[#1E5A38] dark:text-lime-300 text-xs font-semibold">
                              <Sparkles className="w-3.5 h-3.5 text-[#1E5A38] dark:text-lime-400" />
                              <span>{user?.membershipTier || 'Fresh VIP Member'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="py-2">
                          <Link
                            to="/account"
                            onClick={() => setIsAccountOpen(false)}
                            className="block px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-forest-800 transition-colors"
                          >
                            My Dashboard
                          </Link>

                          <Link
                            to="/account/orders"
                            onClick={() => setIsAccountOpen(false)}
                            className="block px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-forest-800 transition-colors"
                          >
                            My Orders
                          </Link>

                          <Link
                            to="/track-order"
                            onClick={() => setIsAccountOpen(false)}
                            className="block px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-forest-800 transition-colors"
                          >
                            Track Live Order
                          </Link>
                        </div>

                        {/* Sign Out Action */}
                        <div className="border-t border-gray-100 dark:border-forest-800 py-2">
                          <button
                            onClick={() => {
                              logout();
                              setIsAccountOpen(false);
                              navigate('/');
                            }}
                            className="w-full text-left px-5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
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
                            Sign in to track orders, save addresses & claim deals.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setAuthMode('login');
                            setIsAuthModalOpen(true);
                            setIsAccountOpen(false);
                          }}
                          className="w-full py-2.5 bg-[#1b4332] dark:bg-lime-500 hover:bg-[#122c21] dark:hover:bg-lime-400 text-white dark:text-forest-950 font-bold rounded-xl text-xs shadow-sm cursor-pointer transition-all active:scale-98"
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





