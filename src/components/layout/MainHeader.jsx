import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, ChevronDown, X, Clock, Sparkles, ArrowRight, Menu, MapPin, Leaf } from 'lucide-react';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { PRODUCTS } from '../../data/products';
import { formatINR } from '../../utils/currency';

export const MainHeader = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const { totalItemsCount, totalPrice, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, setIsAuthModalOpen, setAuthMode, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Organic Tomatoes', 'A2 Milk', 'Avocado', 'Sourdough']);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const searchRef = useRef(null);
  const accountRef = useRef(null);

  // Filter matching products for live preview
  const searchResults = searchTerm.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.weight && p.weight.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    
    if (!recentSearches.includes(searchTerm.trim())) {
      setRecentSearches((prev) => [searchTerm.trim(), ...prev.slice(0, 4)]);
    }
    
    setIsSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSelectSearchTag = (term) => {
    setSearchTerm(term);
    setIsSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="bg-forest-900/95 backdrop-blur-xl text-ivory-100 border-b border-forest-800/90 relative z-40 transition-all duration-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* Left: Mobile menu toggle + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              aria-label="Open mobile menu"
              className="lg:hidden p-2 text-leaf-400 hover:text-white rounded-xl hover:bg-forest-800/80 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo />
          </div>

          {/* Center: Search Box with live fresh produce autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-xl hidden md:block relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search farm fresh fruits, veggies, A2 dairy, artisanal bakery..."
                className="w-full pl-5 pr-14 py-2.5 bg-forest-950/80 text-ivory-100 placeholder-forest-600 text-xs sm:text-sm rounded-full border border-forest-700/80 focus:outline-none focus:border-leaf-400 focus:ring-2 focus:ring-leaf-500/20 transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-14 text-gray-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {/* Vibrant Green Search Button */}
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-1.5 w-8 h-8 bg-leaf-500 hover:bg-leaf-400 text-forest-950 rounded-full flex items-center justify-center transition-all shadow-leaf-sm hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Search className="w-4 h-4 text-forest-950 stroke-[2.5]" />
              </button>
            </form>

            {/* Live Autocomplete / Search Popover */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-forest-900/98 backdrop-blur-2xl border border-leaf-500/30 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
                {searchTerm.trim() ? (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-forest-800 text-xs text-leaf-300">
                      <span>Produce matching "{searchTerm}"</span>
                      <span>{searchResults.length} found</span>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              setIsSearchOpen(false);
                              navigate(`/product/${product.id}`);
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-forest-800/80 cursor-pointer group transition-colors"
                          >
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border border-forest-700"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-white group-hover:text-leaf-400 truncate transition-colors">
                                  {product.name}
                                </p>
                                {product.freshnessBadge && (
                                  <span className="text-[9px] bg-leaf-500/20 text-leaf-300 px-1.5 py-0.5 rounded-full border border-leaf-500/30">
                                    {product.freshnessBadge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400">
                                {product.weight || product.categoryName} • <span className="text-leaf-400 font-semibold">{formatINR(product.price)}</span>
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-leaf-400 -translate-x-1 group-hover:translate-x-0 transition-all" />
                          </div>
                        ))}

                        <button
                          onClick={handleSearchSubmit}
                          className="w-full text-center py-2 text-xs font-semibold text-leaf-400 hover:text-lime-300 hover:underline pt-2 border-t border-forest-800"
                        >
                          View all fresh results for "{searchTerm}" →
                        </button>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-sm text-gray-400">
                        No fresh produce found matching "<span className="text-white">{searchTerm}</span>". Try searching for <span className="text-leaf-400">Tomatoes, Milk, Sourdough, Apple</span>.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-400 mb-2 font-medium">
                          <Clock className="w-3.5 h-3.5 text-leaf-400" />
                          <span>Recent Searches</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => handleSelectSearchTag(term)}
                              className="px-3 py-1.5 bg-forest-800 hover:bg-forest-750 text-gray-200 hover:text-leaf-400 rounded-full border border-forest-700 text-xs transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1.5 text-gray-400 mb-2 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                        <span>Fresh Picks Today</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Organic Tomatoes', 'Hass Avocados', 'Pure A2 Milk', 'Wild Sourdough', 'Chicken Galouti Kebab', 'Cold-Pressed Mustard Oil', 'Valencia Orange Juice'].map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => handleSelectSearchTag(term)}
                            className="px-3 py-1.5 bg-forest-800/60 hover:bg-leaf-500/20 text-ivory-200 hover:text-leaf-300 rounded-full border border-leaf-500/20 text-xs transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Wishlist, Cart with total preview, Account, Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Search Toggle */}
            <button
              onClick={() => navigate('/shop')}
              className="md:hidden p-2 text-gray-300 hover:text-leaf-400"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="flex items-center gap-1.5 text-ivory-100 hover:text-leaf-400 transition-colors group relative"
            >
              <div className="relative">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-leaf-500 text-forest-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-leaf-sm">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs sm:text-sm font-medium">Wishlist</span>
            </Link>

            {/* Cart Button with Count & Live Total */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 text-ivory-100 hover:text-leaf-300 transition-colors group relative cursor-pointer bg-forest-800/70 hover:bg-forest-800 px-3 py-1.5 rounded-full border border-leaf-500/30 shadow-sm"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-leaf-400 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1.5 -right-2 bg-leaf-500 text-forest-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-leaf-sm">
                  {totalItemsCount}
                </span>
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-leaf-400 font-bold uppercase tracking-wider">Basket</span>
                <span className="text-xs font-bold text-white">{formatINR(totalPrice)}</span>
              </div>
            </button>

            {/* Account Dropdown */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-1 text-ivory-100 hover:text-leaf-400 transition-colors py-1 px-1.5 rounded-xl hover:bg-forest-800/70 cursor-pointer"
              >
                <User className="w-5 h-5 text-ivory-100" />
                <span className="hidden sm:inline text-xs sm:text-sm font-medium">
                  {isAuthenticated ? (user.name ? user.name.split(' ')[0] : 'Account') : 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Account Dropdown Menu */}
              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-forest-900 border border-leaf-500/30 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-forest-800">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-leaf-400 bg-leaf-500/15 px-2 py-0.5 rounded-full border border-leaf-500/30">
                          {user.membershipTier || 'Fresh VIP Member'}
                        </span>
                      </div>
                      <div className="py-1 text-sm">
                        <Link
                          to="/account"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 text-gray-200 hover:bg-forest-800 hover:text-leaf-400"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          to="/account/orders"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 text-gray-200 hover:bg-forest-800 hover:text-leaf-400"
                        >
                          My Fresh Orders
                        </Link>
                        <Link
                          to="/account/addresses"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 text-gray-200 hover:bg-forest-800 hover:text-leaf-400"
                        >
                          Delivery Addresses
                        </Link>
                        <Link
                          to="/track-order"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 text-gray-200 hover:bg-forest-800 hover:text-leaf-400"
                        >
                          Live Tracking
                        </Link>
                      </div>
                      <div className="border-t border-forest-800 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsAccountOpen(false);
                            navigate('/');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-forest-800 cursor-pointer"
                        >
                          Log Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-center">
                      <p className="text-xs text-gray-300 mb-3">Sign in for exclusive member privileges & order tracking</p>
                      <button
                        onClick={() => {
                          setAuthMode('login');
                          setIsAuthModalOpen(true);
                          setIsAccountOpen(false);
                        }}
                        className="w-full py-2 bg-leaf-gradient text-forest-950 font-bold rounded-xl text-xs shadow-leaf-sm hover:brightness-110 mb-2 cursor-pointer"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode('register');
                          setIsAuthModalOpen(true);
                          setIsAccountOpen(false);
                        }}
                        className="w-full py-2 bg-forest-800 text-leaf-400 hover:text-white rounded-xl text-xs border border-forest-700 cursor-pointer"
                      >
                        Create Account
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
  );
};
