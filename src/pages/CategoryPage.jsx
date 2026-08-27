import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { ChevronRight, Sparkles, Layers, Flame, Truck } from 'lucide-react';

export const CategoryPage = () => {
  const { slug } = useParams();
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const category = CATEGORIES.find((c) => c.slug === slug) || {
    name: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Collection',
    description: 'Explore the finest artisanal ready-to-cook non-veg delicacies.',
    itemCount: '50+ Items',
    subcategories: ['All', 'Galouti Special', 'Tikka & Skewers', 'Party Combos'],
  };

  const categoryProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== slug) return false;
      if (selectedSubcategory && selectedSubcategory !== 'All') {
        const matchesName = p.name.toLowerCase().includes(selectedSubcategory.toLowerCase());
        const matchesDesc = p.description.toLowerCase().includes(selectedSubcategory.toLowerCase());
        const matchesBrand = p.brand?.toLowerCase().includes(selectedSubcategory.toLowerCase());
        return matchesName || matchesDesc || matchesBrand || true;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [slug, selectedSubcategory, sortBy]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(categoryProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return categoryProducts.slice(start, start + itemsPerPage);
  }, [categoryProducts, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn text-charcoal-900 dark:text-ivory-100">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-charcoal-600 dark:text-gray-400 mb-6 flex-wrap font-medium">
        <Link to="/" className="hover:text-leaf-600 dark:hover:text-leaf-400">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-leaf-600 dark:hover:text-leaf-400">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal-950 dark:text-white font-bold">{category.name}</span>
        {selectedSubcategory && selectedSubcategory !== 'All' && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-leaf-700 dark:text-lime-300 font-semibold">{selectedSubcategory}</span>
          </>
        )}
      </div>

      {/* Category Hero Banner with Deep Forest Gradient */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#061e14] via-[#092b1d] to-[#0d3b27] text-white p-8 sm:p-12 mb-8 border border-leaf-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#072418] border border-leaf-500/40 text-lime-300 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>-18°C BLAST FROZEN • ZERO PRESERVATIVES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed font-sans">
            {category.description}
          </p>
        </div>

        {category.image && (
          <div className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-2 border-leaf-500/40 shadow-2xl shrink-0">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="absolute top-0 right-0 w-80 h-80 bg-leaf-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Subcategory Drill-down Chips Bar */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="mb-8 bg-white dark:bg-forest-900 p-4 rounded-2xl border border-gray-200 dark:border-forest-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-950 dark:text-white">
              Filter By Cut & Style:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubcategory('')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !selectedSubcategory || selectedSubcategory === 'All'
                  ? 'bg-[#0E3723] dark:bg-[#84CC16] text-white dark:text-forest-950 shadow-md'
                  : 'bg-gray-100 dark:bg-forest-850 text-charcoal-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-forest-800'
              }`}
            >
              All {category.name}
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub === selectedSubcategory ? '' : sub)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedSubcategory === sub
                    ? 'bg-[#0E3723] dark:bg-[#84CC16] text-white dark:text-forest-950 border-[#0E3723] dark:border-[#84CC16] shadow-md font-bold'
                    : 'bg-gray-50 dark:bg-forest-900 border-gray-200 dark:border-forest-700 text-charcoal-700 dark:text-gray-300 hover:border-leaf-500'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white dark:bg-forest-900 p-4 rounded-2xl border border-gray-200 dark:border-forest-800 shadow-sm flex items-center justify-between mb-8">
        <span className="text-xs text-charcoal-600 dark:text-gray-300 font-medium">
          Showing <strong className="text-charcoal-950 dark:text-white">{categoryProducts.length}</strong> delicious items
        </span>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal-600 dark:text-gray-400 font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-forest-850 text-charcoal-950 dark:text-ivory-100 rounded-xl border border-gray-200 dark:border-forest-700 text-xs font-semibold focus:outline-none focus:border-leaf-500 cursor-pointer"
          >
            <option value="popular">Best Sellers First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6 border-t border-gray-200 dark:border-forest-800">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-forest-700 text-charcoal-950 dark:text-white hover:border-leaf-500 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#84CC16] text-forest-950 shadow-sm font-black'
                      : 'border border-gray-200 dark:border-forest-700 text-charcoal-800 dark:text-gray-200 hover:border-leaf-500'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-forest-700 text-charcoal-950 dark:text-white hover:border-leaf-500 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-forest-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-forest-800 shadow-sm space-y-3">
          <h3 className="font-serif text-xl font-bold text-charcoal-950 dark:text-white">Fresh cuts arriving shortly</h3>
          <p className="text-xs text-charcoal-600 dark:text-gray-400">Our chefs are marinating fresh batches for this collection.</p>
          <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs rounded-xl shadow-md">
            Browse All Delicacies
          </Link>
        </div>
      )}

      {/* Quick View */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
};

