import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Heart, Plus, Minus, Check, Truck } from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';

export const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth } = useAuth();
  const {
    cartItems,
    totalItemsCount,
    subtotal,
    originalSubtotal,
    couponDiscount,
    shippingFee,
    total,
    totalSavings,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const [couponCode, setCouponCode] = useState('');

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      requireAuth(() => navigate('/checkout'), 'Please sign in or register to complete your order checkout.');
      return;
    }
    navigate('/checkout');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const success = applyCoupon(couponCode);
    if (success) setCouponCode('');
  };

  const handleSaveForLater = (item) => {
    toggleWishlist({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      images: [item.image],
      discount: item.discount,
      categoryName: 'Saved Item',
      rating: 5,
    });
    removeFromCart(item.cartItemId);
  };

  if (cartItems.length === 0) {
    return (
      <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-charcoal-900 dark:text-ivory-100">
        <div className="max-w-md mx-auto bg-white dark:bg-forest-900 rounded-3xl p-10 border border-gray-200 dark:border-forest-800 shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-full bg-sage-50 dark:bg-forest-800 mx-auto flex items-center justify-center border border-leaf-500/20 text-[#1b4332] dark:text-lime-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-950 dark:text-white">Your Fresh Basket is Empty</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Explore our curated non-veg delicacies, farm-fresh mutton, Awadhi kebabs, and juicy momos.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-[#18392b] hover:bg-[#112a1f] text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            Start Exploring Delicacies
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-charcoal-900 dark:text-ivory-100">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-forest-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal-950 dark:text-white">
            Fresh Basket ({totalItemsCount})
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Review your selected cuts and enjoy -18°C temperature controlled delivery
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Basket
        </button>
      </div>

      {/* Grid: Cart Items (Col 8) + Summary (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white dark:bg-forest-900 rounded-3xl p-4 sm:p-6 border border-gray-200 dark:border-forest-800 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-all hover:border-leaf-500/40"
            >
              {/* Product Info */}
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-200 dark:border-forest-700 bg-gray-50 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-leaf-700 dark:text-lime-400 uppercase tracking-wider">
                    {item.brand || 'A_S FOODY Original'}
                  </span>
                  <Link
                    to={`/product/${item.id}`}
                    className="block font-bold text-sm sm:text-base text-charcoal-950 dark:text-white hover:text-leaf-700 dark:hover:text-lime-300 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {item.weight && (
                      <span className="bg-gray-100 dark:bg-forest-800 text-charcoal-800 dark:text-gray-200 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold">
                        Weight: {item.weight}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="bg-gray-100 dark:bg-forest-800 text-charcoal-800 dark:text-gray-200 px-2.5 py-0.5 rounded-lg text-[11px]">
                        Cut: {item.selectedSize}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Controls */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-forest-800">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 dark:border-forest-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-forest-850">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="px-3 py-1 text-base font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-forest-800 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-charcoal-950 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="px-3 py-1 text-base font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-forest-800 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="text-right min-w-[90px]">
                  <div className="text-base font-bold text-charcoal-950 dark:text-white font-serif">
                    {formatINR(item.price * item.quantity)}
                  </div>
                  {item.originalPrice && (
                    <div className="text-xs text-gray-400 line-through">
                      {formatINR(item.originalPrice * item.quantity)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveForLater(item)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-forest-800 transition-colors cursor-pointer"
                    title="Save to Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-forest-800 transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}

          {/* Free Shipping Alert */}
          <div className="p-4 bg-sage-50 dark:bg-forest-900 rounded-2xl border border-leaf-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-charcoal-900 dark:text-gray-200 font-medium">
              <Truck className="w-4 h-4 text-leaf-600 dark:text-lime-400" />
              <span>
                {subtotal >= 999
                  ? '🎉 Your basket qualifies for FREE Express Cold Delivery!'
                  : `Add ${formatINR(999 - subtotal)} more to qualify for Free Delivery.`}
              </span>
            </div>
            <Link to="/shop" className="text-leaf-700 dark:text-lime-400 font-bold hover:underline">
              Add More Items →
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Box (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 border border-gray-200 dark:border-forest-800 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-charcoal-950 dark:text-white pb-3 border-b border-gray-100 dark:border-forest-800">
              Basket Summary
            </h3>

            {/* Coupon Code Applicator */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                Have a Promo Code?
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-leaf-500/10 border border-leaf-500/30 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-leaf-600 dark:text-lime-400" />
                    <span className="font-bold text-charcoal-950 dark:text-white">{appliedCoupon.code} applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Try: FRESH15"
                    className="flex-1 pl-3 pr-2 py-2.5 bg-gray-50 dark:bg-forest-850 text-xs rounded-xl border border-gray-300 dark:border-forest-700 focus:outline-none focus:border-leaf-500 uppercase font-semibold text-charcoal-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#18392b] hover:bg-[#112a1f] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-forest-800">
              <div className="flex justify-between">
                <span>Original Price</span>
                <span className="text-gray-500 line-through">{formatINR(originalSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Basket Subtotal</span>
                <span className="font-semibold text-charcoal-950 dark:text-white">{formatINR(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-leaf-700 dark:text-lime-400 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-{formatINR(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Cold Delivery Fee</span>
                <span className="font-semibold text-charcoal-950 dark:text-white">
                  {shippingFee === 0 ? <span className="text-leaf-700 dark:text-lime-400 font-bold">FREE</span> : formatINR(shippingFee)}
                </span>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-4 border-t border-gray-200 dark:border-forest-800 text-base font-bold text-charcoal-950 dark:text-white">
                <span>Total Amount</span>
                <span className="text-2xl text-[#18392b] dark:text-lime-400 font-serif">{formatINR(total)}</span>
              </div>

              {totalSavings > 0 && (
                <p className="text-center text-xs font-bold text-leaf-800 dark:text-lime-300 bg-leaf-50 dark:bg-forest-800 py-2 rounded-xl border border-leaf-200 dark:border-forest-700 mt-2">
                  🎉 You are saving a total of {formatINR(totalSavings)} on this fresh order!
                </p>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-sm rounded-2xl shadow-md hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-leaf-600 dark:text-lime-400" />
              <span>-18°C Sealed & 100% Encrypted Checkout</span>
            </div>
          </div>
        </div>

      </div>

    </PageTransition>
  );
};
