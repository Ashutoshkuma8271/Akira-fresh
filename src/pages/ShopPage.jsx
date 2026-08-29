import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check, Star, RefreshCw, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { formatINR } from '../utils/currency';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSub, setSelectedSub] = useState(searchParams.get('sub') || '');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState(30000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minDiscount, setMinDiscount] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Perfect 3x3 Grid Symmetry with 0 trailing gaps

  // Sync params on URL change
  useEffect(() => {
    const urlCat = searchParams.get('category') || '';
    const urlSearch = searchParams.get('search') || '';
    const urlSub = searchParams.get('sub') || '';
    setSelectedCategory(urlCat);
    setSearchQuery(urlSearch);
    setSelectedSub(urlSub);
  }, [searchParams]);

  // Extract unique brands
  const brandsList = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map((p) => p.brand).filter(Boolean)));
  }, []);

  const handleCategorySelect = (slug) => {
    const nextSlug = selectedCategory === slug ? '' : slug;
    setSelectedCategory(nextSlug);
    setSelectedSub('');
    setCurrentPage(1);
    if (nextSlug) {
      searchParams.set('category', nextSlug);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSub('');
    setSearchQuery('');
    setPriceRange(1500);
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    setMinDiscount(0);
    setSortBy('popular');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) return false;
      if (selectedSub) {
        const matchesName = product.name.toLowerCase().includes(selectedSub.toLowerCase());
        const matchesCategory = product.categoryName?.toLowerCase().includes(selectedSub.toLowerCase());
        const matchesDesc = product.description.toLowerCase().includes(selectedSub.toLowerCase());
        if (!matchesName && !matchesCategory && !matchesDesc) {
          // allow general matches
        }
      }
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (product.price > priceRange) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (minRating > 0 && product.rating < minRating) return false;
      if (inStockOnly && !product.inStock) return false;
      if (minDiscount > 0 && product.discountPercent < minDiscount) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, selectedBrands, priceRange, minRating, minDiscount, sortBy]);

  // Paginated
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn text-charcoal-900 dark:text-ivory-100">
      
      {/* Page Header with High-Contrast Dark Emerald Background */}
      <div className="bg-gradient-to-r from-[#061e14] via-[#092b1d] to-[#0d3b27] text-white rounded-3xl p-6 sm:p-10 mb-8 border border-leaf-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#072418] border border-leaf-500/40 text-[11px] font-bold uppercase tracking-widest text-lime-300 font-sans mb-2">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>100% READY-TO-COOK • -18°C COLD CHAIN</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white mt-1">
            {selectedCategory
              ? CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'Curated Delicacies'
              : searchQuery
              ? `Search Results for "${searchQuery}"`
              : 'All Gourmet Delicacies'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-200/90 mt-2 max-w-xl font-sans">
            Handcrafted Lucknow Galouti kebabs, fiery wings, mutton specialties, and crispy snacks. Delivered sub-zero across NCR.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-leaf-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6 bg-white dark:bg-forest-900 p-6 rounded-3xl border border-gray-200 dark:border-forest-800 shadow-sm h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-forest-800">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-charcoal-950 dark:text-white">
              <SlidersHorizontal className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-leaf-700 dark:text-leaf-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="text-xs font-bold text-charcoal-950 dark:text-white uppercase tracking-wider mb-3">Categories</h4>
            <div className="space-y-1.5">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  selectedCategory === ''
                    ? 'bg-[#0E3723] dark:bg-[#84CC16] text-white dark:text-forest-950 font-bold shadow-xs'
                    : 'text-charcoal-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-800'
                }`}
              >
                <span>All Delicacies</span>
                <span>{PRODUCTS.length}</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#0E3723] dark:bg-[#84CC16] text-white dark:text-forest-950 font-bold shadow-xs'
                      : 'text-charcoal-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-800'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-gray-400 text-[10px]">
                    {PRODUCTS.filter((p) => p.category === cat.slug).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-gray-100 dark:border-forest-800">
            <div className="flex items-center justify-between text-xs font-bold text-charcoal-950 dark:text-white mb-2">
              <span className="uppercase tracking-wider">Max Price</span>
              <span className="text-leaf-700 dark:text-lime-300 font-serif font-bold text-sm">{formatINR(priceRange)}</span>
            </div>
            <input
              type="range"
              min="99"
              max="1500"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-leaf-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              <span>₹99</span>
              <span>₹1,500</span>
            </div>
          </div>

          {/* Brands */}
          <div className="pt-4 border-t border-gray-100 dark:border-forest-800">
            <h4 className="text-xs font-bold text-charcoal-950 dark:text-white uppercase tracking-wider mb-3">Kitchen Cuts</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {brandsList.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 text-xs text-charcoal-700 dark:text-gray-300 cursor-pointer hover:text-charcoal-950 dark:hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded text-leaf-600 focus:ring-leaf-500 accent-leaf-600"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="pt-4 border-t border-gray-100 dark:border-forest-800">
            <h4 className="text-xs font-bold text-charcoal-950 dark:text-white uppercase tracking-wider mb-3">Minimum Rating</h4>
            <div className="space-y-1.5">
              {[4.8, 4.5, 4.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setMinRating(minRating === rate ? 0 : rate)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                    minRating === rate
                      ? 'bg-leaf-500/15 text-leaf-800 dark:text-lime-300 font-bold border border-leaf-500/40'
                      : 'text-charcoal-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-800'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rate}+ Stars</span>
                  </span>
                  {minRating === rate && <Check className="w-3.5 h-3.5 text-leaf-600 dark:text-lime-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Discounts */}
          <div className="pt-4 border-t border-gray-100 dark:border-forest-800">
            <h4 className="text-xs font-bold text-charcoal-950 dark:text-white uppercase tracking-wider mb-3">Special Deals</h4>
            <div className="flex flex-wrap gap-2">
              {[15, 20, 25, 30].map((disc) => (
                <button
                  key={disc}
                  onClick={() => setMinDiscount(minDiscount === disc ? 0 : disc)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    minDiscount === disc
                      ? 'bg-[#0E3723] dark:bg-[#84CC16] text-white dark:text-forest-950 border-[#0E3723] dark:border-[#84CC16] shadow-sm'
                      : 'border-gray-200 dark:border-forest-700 text-charcoal-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {disc}% & Above
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort & Count Bar */}
          <div className="bg-white dark:bg-forest-900 p-4 rounded-2xl border border-gray-200 dark:border-forest-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-charcoal-600 dark:text-gray-300 font-medium">
              Showing <strong className="text-charcoal-950 dark:text-white font-bold">{filteredProducts.length}</strong> delicious items
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-[#0E3723] dark:bg-[#84CC16] text-white dark:text-forest-950 rounded-xl text-xs font-bold cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-charcoal-600 dark:text-gray-400 font-medium hidden sm:inline">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-forest-850 text-charcoal-950 dark:text-ivory-100 rounded-xl border border-gray-200 dark:border-forest-700 text-xs font-semibold focus:outline-none focus:border-leaf-500 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory || selectedBrands.length > 0 || minRating > 0 || minDiscount > 0 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-leaf-500/15 text-leaf-800 dark:text-leaf-300 text-xs px-2.5 py-1 rounded-full border border-leaf-500/30">
                  Search: "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 bg-leaf-500/15 text-leaf-800 dark:text-leaf-300 text-xs px-2.5 py-1 rounded-full border border-leaf-500/30">
                  Category: {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                </span>
              )}
              {selectedBrands.map((b) => (
                <span key={b} className="inline-flex items-center gap-1 bg-leaf-500/15 text-leaf-800 dark:text-leaf-300 text-xs px-2.5 py-1 rounded-full border border-leaf-500/30">
                  Cut: {b}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleBrandToggle(b)} />
                </span>
              ))}
              <button onClick={resetFilters} className="text-xs text-red-500 font-bold hover:underline ml-2 cursor-pointer">
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-forest-800 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-sage-100 dark:bg-forest-800 mx-auto flex items-center justify-center border border-leaf-500/20">
                <SlidersHorizontal className="w-8 h-8 text-leaf-600 dark:text-leaf-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-950 dark:text-white">No matching items found</h3>
              <p className="text-xs text-charcoal-600 dark:text-gray-400 max-w-sm mx-auto">
                We couldn't find snacks matching your selected criteria. Try adjusting your filters or price range.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#0E3723] dark:bg-[#84CC16] text-white dark:text-forest-950 font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === idx + 1
                      ? 'bg-[#84CC16] text-forest-950 shadow-sm font-black'
                      : 'bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 text-charcoal-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-forest-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
};
