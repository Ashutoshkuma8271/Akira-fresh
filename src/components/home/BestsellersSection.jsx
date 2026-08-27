import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const BestsellersSection = () => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [addedId, setAddedId] = React.useState(null);

  // Top 5 bestsellers from screenshot
  const bestsellers = PRODUCTS.slice(0, 5);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const success = addToCart(product, 1);
    if (success) {
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none">
      
      {/* Section Header */}
      <div className="mb-6 text-left">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827] dark:text-white font-sans">
          Bestsellers
        </h2>
      </div>

      {/* 5-Column Responsive Card Grid (Horizontal scroll on mobile, 5-col on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {bestsellers.map((product) => {
          const isAdded = addedId === product.id;
          return (
            <div
              key={product.id}
              className="group bg-white dark:bg-[#072418] rounded-2xl border border-gray-200/90 dark:border-forest-750 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Image Area */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-forest-900">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                </Link>

                {/* Top-Left Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="px-2 py-0.5 bg-[#15803D] text-white font-black text-[10px] sm:text-[11px] rounded-full uppercase tracking-wider shadow-sm">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}

                {/* Bottom-Right Floating White Add-to-Cart Circle Button */}
                <button
                  onClick={(e) => handleQuickAdd(e, product)}
                  aria-label={`Add ${product.name} to cart`}
                  className={`absolute bottom-2.5 right-2.5 z-10 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isAdded
                      ? 'bg-[#15803D] text-white scale-110'
                      : 'bg-white hover:bg-gray-50 text-charcoal-900 hover:scale-110 active:scale-95 border border-gray-200/60'
                  }`}
                >
                  {isAdded ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-[#15803D] stroke-[2.2]" />
                      <span className="absolute -top-1 -right-1 text-[9px] font-black text-[#15803D] leading-none">+</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Product Info & Pricing */}
              <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2 bg-white dark:bg-[#072418]">
                <div>
                  {/* Product Title */}
                  <Link
                    to={`/product/${product.id}`}
                    className="block font-bold text-sm sm:text-[15px] text-[#111827] dark:text-white hover:text-leaf-600 dark:hover:text-lime-400 transition-colors line-clamp-1 leading-snug"
                  >
                    {product.name}
                  </Link>

                  {/* Weight */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    {product.weight || '250 g'}
                  </p>

                  {/* Protein Feature Tag */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#15803D] dark:text-[#84CC16] mt-1.5">
                    <span className="text-sm leading-none">💪</span>
                    <span>{product.protein || '18 g protein'}</span>
                  </div>
                </div>

                {/* Pricing & Discount Badge Row */}
                <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-forest-800/80">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-black text-[#111827] dark:text-white">
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through font-normal">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {product.discount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-green-50 dark:bg-forest-900 border border-green-200/60 dark:border-forest-700 text-[#15803D] dark:text-[#84CC16] font-bold text-[11px]">
                      {product.discount}% off
                    </span>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

