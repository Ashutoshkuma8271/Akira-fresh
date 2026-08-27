import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw, Leaf } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { RatingStars } from './RatingStars';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    (product.sizes && product.sizes[0]) || product.weight || 'Standard Pack'
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    const success = addToCart(product, quantity, '', selectedSize, true);
    if (success) {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClose();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-forest-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-forest-900 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row border border-leaf-500/30">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-forest-950/10 dark:bg-forest-950/40 hover:bg-forest-950/20 text-gray-700 dark:text-gray-200 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Produce Images */}
        <div className="w-full md:w-1/2 p-6 bg-sage-50/60 dark:bg-forest-950/60 flex flex-col justify-between">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-sage-200 dark:border-forest-700 bg-white mb-4">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discount > 0 && (
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-extrabold uppercase bg-leaf-gradient text-forest-950 rounded-lg shadow-leaf-sm">
                {product.discount}% OFF
              </span>
            )}
            {product.freshnessBadge && (
              <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-forest-950/90 text-leaf-300 font-bold text-[10px] rounded-full border border-leaf-500/40 backdrop-blur-md flex items-center gap-1">
                <Leaf className="w-2.5 h-2.5 text-leaf-400" />
                <span>{product.freshnessBadge}</span>
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-leaf-500 shadow-md scale-105'
                      : 'border-sage-200 dark:border-forest-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Produce Details */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Category & Brand */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-semibold text-leaf-600 dark:text-leaf-400 uppercase tracking-wider text-xs">
                {product.brand}
              </span>
              <span>{product.categoryName}</span>
            </div>

            {/* Product Title */}
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-white mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="mb-4">
              <RatingStars rating={product.rating} count={product.reviewsCount} />
            </div>

            {/* Price Box */}
            <div className="p-3.5 bg-sage-50 dark:bg-forest-950 rounded-2xl border border-sage-200 dark:border-forest-800 mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-forest-900 dark:text-leaf-400 font-serif">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-leaf-600 dark:text-leaf-300">
                  {product.weight ? `${product.weight} • ` : ''}Harvested & Quality Checked • In Stock ({product.stockCount} units)
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
              {product.description}
            </p>

            {/* Sizes / Pack Options */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <span className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                  Pack Size: <span className="text-leaf-600 dark:text-leaf-400 font-normal">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        selectedSize === sz
                          ? 'border-leaf-500 bg-forest-900 text-leaf-400 font-bold'
                          : 'border-sage-200 dark:border-forest-700 text-charcoal-900 dark:text-gray-300 hover:border-leaf-400 bg-white dark:bg-forest-800'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Controls */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Quantity:
              </span>
              <div className="flex items-center border border-sage-300 dark:border-forest-700 rounded-xl overflow-hidden bg-sage-50 dark:bg-forest-950">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-base font-bold text-gray-600 dark:text-gray-300 hover:bg-sage-200 dark:hover:bg-forest-800"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-bold text-charcoal-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-base font-bold text-gray-600 dark:text-gray-300 hover:bg-sage-200 dark:hover:bg-forest-800"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-forest-800">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className="flex-1 py-3.5 bg-leaf-gradient text-forest-950 font-bold text-sm rounded-2xl shadow-leaf-sm hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                <span>{isAdded ? 'Added to Basket' : `Add to Basket • ${formatINR(product.price * quantity)}`}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : 'bg-sage-50 dark:bg-forest-950 text-gray-700 dark:text-gray-300 border-sage-200 dark:border-forest-800 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="block text-center text-xs font-semibold text-leaf-600 dark:text-leaf-400 hover:underline py-1"
            >
              View Full Farm Origin & Nutritional Specs →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
