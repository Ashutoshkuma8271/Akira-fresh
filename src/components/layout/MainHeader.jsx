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
          <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-5 xl:gap-8">
            
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
            <nav className="hidden lg:flex items-center flex-nowrap space-x-3.5 xl:space-x-6 text-xs xl:text-sm font-semibold text-charcoal-800 dark:text-gray-200 shrink-0 whitespace-nowrap">
              <Link
                to="/"
                className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/') ? 'text-[#1b4332] dark:text-lime-400 font-bold' : ''
                }`}
              >
                <span className="whitespace-nowrap">Home</span>
                {isActive('/') && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/shop"
                className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/shop') || isActive('/collections/all')
                    ? 'text-[#1b4332] dark:text-lime-400 font-bold'
                    : ''
                }`}
              >
                <span className="whitespace-nowrap">Shop</span>
                {(isActive('/shop') || isActive('/collections/all')) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/categories"
                className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/categories') || isActive('/collections') || location.pathname.startsWith('/category')
                    ? 'text-[#1b4332] dark:text-lime-400 font-bold'
                    : ''
                }`}
              >
                <span className="whitespace-nowrap">Categories</span>
                {(isActive('/categories') || isActive('/collections') || location.pathname.startsWith('/category')) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/bestsellers"
                className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/bestsellers') || isActive('/collections/bestsellers')
                    ? 'text-[#1b4332] dark:text-lime-400 font-bold'
                    : ''
                }`}
              >
                <span className="whitespace-nowrap inline-block">Best Sellers</span>
                {(isActive('/bestsellers') || isActive('/collections/bestsellers')) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/help"
                className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/help') || isActive('/about') || isActive('/pages/about-as-foody')
                    ? 'text-[#1b4332] dark:text-lime-400 font-bold'
                    : ''
                }`}
              >
                <span className="whitespace-nowrap">About</span>
                {(isActive('/help') || isActive('/about') || isActive('/pages/about-as-foody')) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-[#1b4332] dark:bg-lime-400 rounded-full" />
                )}
              </Link>

              <Link
                to="/contact"
                className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#1b4332] dark:hover:text-lime-400 ${
                  isActive('/contact') || isActive('/pages/contact') ? 'text-[#1b4332] dark:text-lime-400 font-bold' : ''
                }`}
              >
                <span className="whitespace-nowrap">Contact</span>
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
                className="hidden lg:flex items-center bg-[#F3F1EC] dark:bg-forest-900 text-charcoal-900 dark:text-white rounded-full px-3 py-1.5 w-32 xl:w-48 border border-gray-200/80 dark:border-forest-700 shadow-2xs mr-1 shrink-0"
              >
                <Search className="w-3.5 h-3.5 text-gray-500 shrink-0 mr-1.5" />
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
                  <div className="absolute right-0 top-full mt-2 w-52 sm:w-56 max-w-[calc(100vw-24px)] bg-white dark:bg-[#0c2e20] border border-gray-200 dark:border-[#1e583c] text-charcoal-900 dark:text-ivory-100 rounded-2xl shadow-2xl ring-1 ring-black/10 dark:ring-white/10 z-50 animate-scaleUp p-2 select-none">
                    {isAuthenticated ? (
                      <>
                        {/* High-Contrast User Header Profile Card */}
                        <div className="px-3 py-2.5 bg-gray-50/90 dark:bg-[#082016] rounded-xl border border-gray-100 dark:border-[#164430] mb-1.5">
                          <p className="text-[11px] text-gray-500 dark:text-emerald-400 font-medium leading-tight">
                            Signed in as
                          </p>
                          <p className="text-sm font-bold text-gray-950 dark:text-white truncate mt-0.5 leading-snug">
                            {user?.name || 'Customer'}
                          </p>
                          <div className="mt-1.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-600/80 text-emerald-800 dark:text-lime-300 text-[10.5px] font-bold shadow-2xs">
                              <Sparkles className="w-3 h-3 text-emerald-700 dark:text-lime-400 shrink-0" />
                              <span>{user?.membershipTier || 'Fresh VIP Member'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Navigation Links with High Contrast and Subtle Icons */}
                        <div className="py-1 space-y-1">
                          <Link
                            to="/account"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-100 rounded-xl hover:bg-emerald-50 dark:hover:bg-[#164430] hover:text-[#1b4332] dark:hover:text-lime-300 transition-colors"
                          >
                            <span>My Dashboard</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-emerald-400/80" />
                          </Link>

                          <Link
                            to="/account/orders"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-100 rounded-xl hover:bg-emerald-50 dark:hover:bg-[#164430] hover:text-[#1b4332] dark:hover:text-lime-300 transition-colors"
                          >
                            <span>My Orders</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-emerald-400/80" />
                          </Link>

                          <Link
                            to="/track-order"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-100 rounded-xl hover:bg-emerald-50 dark:hover:bg-[#164430] hover:text-[#1b4332] dark:hover:text-lime-300 transition-colors"
                          >
                            <span>Track Live Order</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-emerald-400/80" />
                          </Link>
                        </div>

                        {/* High-Contrast Sign Out Action */}
                        <div className="border-t border-gray-100 dark:border-[#164430] pt-1.5 mt-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsAccountOpen(false);
                              navigate('/');
                            }}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-3.5 text-center space-y-3">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-950 dark:text-white">Fresh Gourmet Privileges</p>
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-tight">
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





