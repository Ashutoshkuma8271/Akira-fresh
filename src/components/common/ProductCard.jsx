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
        className="group relative bg-white dark:bg-forest-900/90 rounded-3xl border border-sage-200/80 dark:border-leaf-500/20 overflow-hidden shadow-sm hover:shadow-soft-float transition-all duration-300 flex flex-col justify-between card-fresh"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Badges (Discount, Freshness Tag, Wishlist) */}
        <div className="relative aspect-square w-full bg-gradient-to-b from-sage-50/60 to-ivory-100 dark:from-forest-950 dark:to-forest-900 overflow-hidden">
          
          {/* Discount Pill */}
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 z-20">
              <span className="px-2.5 py-1 bg-leaf-500 text-forest-950 font-extrabold text-[10px] sm:text-xs rounded-full shadow-leaf-sm tracking-wider uppercase">
                {product.discount}% OFF
              </span>
            </div>
          )}

          {/* Freshness Badge */}
          {product.freshnessBadge && (
            <div className="absolute bottom-3 left-3 z-20">
              <span className="px-2.5 py-0.5 bg-forest-900/90 dark:bg-forest-950/90 text-leaf-300 font-bold text-[10px] rounded-full border border-leaf-500/40 backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Leaf className="w-2.5 h-2.5 text-leaf-400" />
                <span>{product.freshnessBadge}</span>
              </span>
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label="Toggle Wishlist"
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-forest-950/80 backdrop-blur-md border border-gray-200 dark:border-leaf-500/30 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm hover:scale-110 active:scale-95 cursor-pointer"
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
            aria-label="Quick View"
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-3.5 py-1.5 bg-forest-950/90 hover:bg-forest-950 text-ivory-100 font-bold text-xs rounded-full border border-leaf-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg transition-all duration-300 cursor-pointer ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-leaf-400" />
            <span>Quick View</span>
          </button>

          {/* Product Image with Hover Zoom */}
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Product Details & Action Area */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-forest-900/90">
          
          <div className="space-y-1.5">
            {/* Origin & Weight Tag */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              <span className="truncate pr-2">{product.brand}</span>
              {product.weight && (
                <span className="font-semibold text-forest-800 dark:text-leaf-300 bg-sage-100 dark:bg-forest-800 px-2 py-0.5 rounded-full text-[10px] shrink-0">
                  {product.weight}
                </span>
              )}
            </div>

            {/* Product Title */}
            <Link
              to={`/product/${product.id}`}
              className="block font-serif text-sm sm:text-base font-bold text-charcoal-900 dark:text-ivory-100 group-hover:text-leaf-600 dark:group-hover:text-leaf-400 transition-colors line-clamp-2 leading-snug"
            >
              {product.name}
            </Link>

            {/* Rating Stars */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-xs font-bold text-charcoal-900 dark:text-ivory-200">
                {product.rating}
              </span>
              <span className="text-[11px] text-gray-400">
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Pricing and Cart Stepper Button */}
          <div className="pt-2 border-t border-gray-100 dark:border-forest-800 flex items-center justify-between gap-2">
            
            {/* Price */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-forest-900 dark:text-leaf-400">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.unit && (
                <span className="text-[10px] text-gray-400 -mt-0.5">{product.unit}</span>
              )}
            </div>

            {/* Cart Action: Quantity Stepper if in Cart, else Add Button */}
            {inCart ? (
              <div className="flex items-center bg-forest-900 dark:bg-forest-800 text-white rounded-full p-1 border border-leaf-500/40 shadow-sm">
                <button
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 rounded-full bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-leaf-400 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="w-7 text-center font-bold text-xs text-white">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  className="w-7 h-7 rounded-full bg-leaf-500 hover:bg-leaf-400 text-forest-950 flex items-center justify-center font-bold transition-colors cursor-pointer shadow-leaf-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                aria-label="Add to cart"
                className={`px-3.5 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                  justAdded
                    ? 'bg-leaf-600 text-white scale-95'
                    : 'bg-leaf-500 hover:bg-leaf-400 text-forest-950 shadow-leaf-sm hover:scale-105 active:scale-95'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
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
