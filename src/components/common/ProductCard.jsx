import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Plus, Minus, Check, Leaf } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/currency';
import { QuickViewModal } from './QuickViewModal';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const inCart = !!cartItem;
  const inWish = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = addToCart(product, 1);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      addToCart(product, 1);
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && cartItem.quantity > 0) {
      updateQuantity(product.id, cartItem.quantity - 1);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <>
      <div
        className="group relative bg-white dark:bg-forest-900 rounded-3xl border border-[#E6E9E6] dark:border-forest-800 overflow-hidden shadow-xs hover:shadow-soft-float transition-all duration-300 flex flex-col justify-between card-fresh tilt-3d"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Badges (Discount, Freshness Tag, Wishlist) */}
        <div className="relative aspect-square w-full bg-gradient-to-b from-[#FBFBF9] to-[#F4F4F0] dark:from-forest-950 dark:to-forest-900 overflow-hidden">
          
          {/* Discount Pill (Rich Ruby Crimson) */}
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 z-20">
              <span className="px-2.5 py-1 bg-[#B91C1C] text-white font-black text-[10px] sm:text-xs rounded-full shadow-sm tracking-wider uppercase">
                {product.discount}% OFF
              </span>
            </div>
          )}

          {/* Freshness Badge */}
          {product.freshnessBadge && (
            <div className="absolute bottom-3 left-3 z-20">
              <span className="px-2.5 py-0.5 bg-forest-900/90 dark:bg-forest-950/90 text-emerald-300 font-bold text-[10px] rounded-full border border-emerald-500/30 backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Leaf className="w-2.5 h-2.5 text-emerald-400" />
                <span>{product.freshnessBadge}</span>
              </span>
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label="Toggle Wishlist"
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-forest-950/80 backdrop-blur-md border border-gray-200 dark:border-forest-700 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                inWish ? 'fill-red-500 text-red-500 scale-110' : 'hover:text-red-500'
              }`}
            />
          </button>

          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            aria-label="Quick View Product"
            className={`absolute inset-x-4 bottom-3 z-20 py-2.5 bg-white/95 dark:bg-forest-950/95 text-charcoal-900 dark:text-white text-xs font-bold rounded-2xl shadow-lg border border-gray-200 dark:border-forest-700 backdrop-blur-md flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          {/* Product Image */}
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img
              src={product.image || product.images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            />
          </Link>
        </div>

        {/* Content Details */}
        <div className="p-3 sm:p-4.5 flex-1 flex flex-col justify-between space-y-2">
          
          <div className="space-y-1">
            {/* Category Subtitle */}
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {product.category}
            </p>

            {/* Product Title */}
            <Link to={`/product/${product.id}`}>
              <h3 className="font-serif font-bold text-xs sm:text-[14.5px] text-charcoal-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5">
              <div className="flex items-center text-amber-500">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[10.5px] sm:text-xs font-bold text-charcoal-900 dark:text-ivory-200">
                {product.rating}
              </span>
              <span className="text-[9.5px] sm:text-[11px] text-gray-400">
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Pricing and Cart Stepper Button */}
          <div className="pt-1.5 sm:pt-2 border-t border-gray-100 dark:border-forest-800 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2">
            
            {/* Price */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-[13.5px] sm:text-lg font-black text-forest-900 dark:text-emerald-400 leading-none">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through leading-none">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Cart Action: Quantity Stepper if in Cart, else Add Button */}
            {inCart ? (
              <div className="flex items-center bg-forest-900 dark:bg-forest-800 text-white rounded-full p-0.5 sm:p-1 border border-emerald-500/30 shadow-sm w-fit self-end xs:self-auto">
                <button
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-emerald-400 transition-colors cursor-pointer"
                >
                  <Minus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </button>
                <span className="w-5 sm:w-7 text-center font-bold text-[10.5px] sm:text-xs text-white">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white flex items-center justify-center font-bold transition-colors cursor-pointer shadow-gold-sm"
                >
                  <Plus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                aria-label="Add to cart"
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-[10.5px] sm:text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer w-fit self-end xs:self-auto ${
                  justAdded
                    ? 'bg-emerald-700 text-white scale-95'
                    : 'bg-[#D97706] hover:bg-[#B45309] text-white shadow-gold-sm hover:scale-105 active:scale-95'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
};
