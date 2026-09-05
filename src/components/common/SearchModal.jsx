import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, Clock, ArrowRight, Tag, Flame, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { CATEGORIES } from '../../data/categories';
import { formatINR } from '../../utils/currency';
import { SearchItemSkeleton } from './SkeletonLoader';

export const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Chicken Galouti Kebabs',
    'Afghani Malai Tikka',
    'Awadhi Mutton Kakori',
    'Peri-Peri Wings'
  ]);
  const inputRef = useRef(null);

  // Debounce search term to show shimmer skeleton effect like YouTube/Shopify
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 140);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResults = searchTerm.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.weight && p.weight.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 6)
    : [];

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;

    if (!recentSearches.includes(searchTerm.trim())) {
      setRecentSearches((prev) => [searchTerm.trim(), ...prev.slice(0, 3)]);
    }

    onClose();
    navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSelectTag = (term) => {
    setSearchTerm(term);
    onClose();
    navigate(`/shop?search=${encodeURIComponent(term)}`);
  };

  const handleSelectCategory = (slug) => {
    onClose();
    navigate(`/category/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-forest-950/85 backdrop-blur-md transition-opacity"
      />

      <div className="min-h-screen px-4 py-8 sm:py-16 flex items-start justify-center relative z-10">
        <div className="w-full max-w-3xl bg-forest-900 border border-leaf-500/30 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp">
          
          {/* Top Search Input Bar */}
          <div className="p-4 sm:p-6 bg-forest-950 border-b border-forest-800 relative flex items-center gap-3">
            <Search className="w-6 h-6 text-leaf-400 shrink-0 stroke-[2.5]" />
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search delicious kebabs, mutton specialties, wings, combos..."
                className="w-full bg-transparent text-white placeholder-gray-400 text-base sm:text-lg font-medium focus:outline-none"
              />
            </form>
            
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-gray-400 hover:text-white border border-forest-800 transition-colors cursor-pointer text-xs font-mono"
            >
              ESC
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">
            {searchTerm.trim() ? (
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-forest-800 text-xs text-leaf-300 font-medium">
                  <span>Found {searchResults.length} matching delicacies for "{searchTerm}"</span>
                  <button
                    onClick={handleSearchSubmit}
                    className="hover:underline text-leaf-400 font-bold cursor-pointer"
                  >
                    View all in shop &rarr;
                  </button>
                </div>

                {isSearching ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <SearchItemSkeleton key={i} />
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          onClose();
                          navigate(`/product/${product.id}`);
                        }}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-forest-850 hover:bg-forest-800 border border-forest-750 hover:border-leaf-500/40 cursor-pointer group transition-all duration-200"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 rounded-xl object-cover border border-forest-700 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-lime-300 bg-forest-950 px-2 py-0.5 rounded-full border border-leaf-500/30">
                              {product.badge || product.categoryName}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-[10px] font-bold text-emerald-400">
                                {product.discount}% OFF
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-white group-hover:text-leaf-300 truncate mt-1 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {product.weight} • <span className="text-leaf-400 font-bold">{formatINR(product.price)}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-gray-500 line-through text-[10px] ml-1.5">
                                {formatINR(product.originalPrice)}
                              </span>
                            )}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-leaf-400 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-sm text-gray-300">
                      No gourmet items found for "<strong className="text-white">{searchTerm}</strong>"
                    </p>
                    <p className="text-xs text-gray-500">
                      Try searching for Galouti, Kakori, Tikka, Wings, or Sausages.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-leaf-400" />
                      <span>Recent Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSelectTag(term)}
                          className="px-3.5 py-1.5 bg-forest-800 hover:bg-forest-750 text-gray-200 hover:text-leaf-300 rounded-full border border-forest-700 text-xs transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Categories */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>Popular Categories</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CATEGORIES.slice(0, 4).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.slug)}
                        className="p-2.5 rounded-2xl bg-forest-850 hover:bg-forest-800 border border-forest-750 hover:border-leaf-500/30 text-left transition-all flex items-center gap-2.5 cursor-pointer group"
                      >
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-leaf-300 truncate">
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-gray-400">{cat.itemCount}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Gourmet Drops */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                    <span>Trending Now</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Chicken Galouti (Pack of 8)',
                      'Afghani Malai Tikka',
                      'Awadhi Mutton Kakori',
                      'Crispy Chicken Popcorn',
                      'Peri-Peri Flame Wings',
                      'Smoked German Sausages'
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleSelectTag(tag)}
                        className="px-3.5 py-1.5 bg-forest-950 hover:bg-forest-800 text-leaf-300 hover:text-white rounded-full border border-leaf-500/25 text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Tag className="w-3 h-3 text-leaf-400" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Trust Guarantee */}
                <div className="pt-4 border-t border-forest-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-leaf-400" />
                    100% Antibiotic-Free Meats • -18°C Sub-Zero Delivery
                  </span>
                  <span className="text-leaf-400 font-semibold">Express 2-Hr Delivery</span>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
