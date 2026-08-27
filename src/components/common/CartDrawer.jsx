import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Plus, Minus, Check, Leaf } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    totalItemsCount,
    subtotal,
    couponDiscount,
    shippingFee,
    total,
    appliedCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { user, isAuthenticated, requireAuth } = useAuth();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 499;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShip = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput('');
  };

  const handleGoToCheckout = () => {
    if (!isAuthenticated) {
      setIsCartDrawerOpen(false);
      requireAuth(() => navigate('/checkout'), 'Please sign in or register to complete your fresh checkout.');
      return;
    }
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleGoToCart = () => {
    setIsCartDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="fixed inset-0 bg-forest-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-forest-900 text-charcoal-900 dark:text-ivory-100 shadow-2xl flex flex-col z-10 border-l border-leaf-500/30 animate-slideLeft">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-forest-950 text-white flex items-center justify-between border-b border-forest-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-forest-900 border border-leaf-500/30 text-leaf-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Your Fresh Basket</h3>
                <p className="text-xs text-leaf-400 font-medium">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-forest-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-sage-50 dark:bg-forest-950 p-3.5 border-b border-sage-200 dark:border-forest-800 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium text-charcoal-900 dark:text-ivory-100">
              {amountNeededForFreeShip > 0 ? (
                <span>Add <strong className="text-leaf-600 dark:text-leaf-400 font-bold">{formatINR(amountNeededForFreeShip)}</strong> more for <strong>FREE Cold Delivery!</strong></span>
              ) : (
                <span className="text-leaf-600 dark:text-leaf-400 font-bold flex items-center gap-1">
                  🎉 You unlocked FREE 2-Hour Express Cold Delivery!
                </span>
              )}
              <span className="text-gray-500 dark:text-gray-400 font-semibold">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-sage-200 dark:bg-forest-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-leaf-gradient h-full transition-all duration-500 rounded-full shadow-leaf-sm"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-3.5 p-3 rounded-2xl bg-sage-50/70 dark:bg-forest-850/80 border border-sage-200/80 dark:border-forest-800 hover:border-leaf-500/40 transition-all"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-sage-200 dark:border-forest-700 shrink-0 bg-white"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.id}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="text-xs sm:text-sm font-bold text-charcoal-900 dark:text-ivory-100 hover:text-leaf-600 dark:hover:text-leaf-400 line-clamp-1 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                        {item.weight && (
                          <span className="bg-white dark:bg-forest-900 px-2 py-0.5 rounded-md border border-sage-200 dark:border-forest-700 font-semibold text-leaf-700 dark:text-leaf-300">
                            {item.weight}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-white dark:bg-forest-900 px-2 py-0.5 rounded-md border border-sage-200 dark:border-forest-700">
                            {item.selectedSize}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-sage-200/60 dark:border-forest-800">
                      <div className="flex items-center border border-sage-300 dark:border-forest-700 rounded-lg overflow-hidden bg-white dark:bg-forest-900">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 px-2 text-gray-600 dark:text-gray-300 hover:bg-sage-100 dark:hover:bg-forest-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-charcoal-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 px-2 text-gray-600 dark:text-gray-300 hover:bg-sage-100 dark:hover:bg-forest-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-forest-900 dark:text-leaf-400">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sage-100 dark:bg-forest-800 flex items-center justify-center border border-leaf-500/30 text-leaf-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-charcoal-900 dark:text-white mb-1">Your fresh basket is empty</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                    Explore our morning harvest, organic vegetables, A2 dairy and ready-to-cook specialties.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-leaf-gradient text-forest-950 font-bold text-xs rounded-xl shadow-leaf-sm hover:brightness-105"
                >
                  Explore Fresh Produce
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-sage-50/80 dark:bg-forest-950 border-t border-sage-200 dark:border-forest-800 space-y-3.5">
              {/* Coupon Row */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-leaf-500/10 border border-leaf-500/30 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
                    <span className="font-semibold text-charcoal-900 dark:text-ivory-100">
                      Code <strong>{appliedCoupon.code}</strong> applied (-{appliedCoupon.discountPercent ? `${appliedCoupon.discountPercent}%` : formatINR(appliedCoupon.discountAmount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-500 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon: FRESH15"
                      className="w-full pl-3 pr-2 py-2 bg-white dark:bg-forest-900 text-xs rounded-xl border border-sage-300 dark:border-forest-700 focus:outline-none focus:border-leaf-400 uppercase font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-forest-900 dark:bg-leaf-500 text-white dark:text-forest-950 hover:bg-forest-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Subtotal & Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Produce Subtotal</span>
                  <span className="font-semibold text-charcoal-900 dark:text-white">{formatINR(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-leaf-600 dark:text-leaf-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatINR(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Cold Delivery Fee</span>
                  <span className="font-semibold text-charcoal-900 dark:text-white">
                    {shippingFee === 0 ? <span className="text-leaf-600 dark:text-leaf-400 font-bold">FREE</span> : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-charcoal-900 dark:text-white pt-2 border-t border-sage-200 dark:border-forest-800">
                  <span>Total Amount</span>
                  <span className="text-lg text-forest-900 dark:text-leaf-400 font-serif">{formatINR(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleGoToCart}
                  className="py-2.5 px-4 bg-white dark:bg-forest-900 hover:bg-sage-100 dark:hover:bg-forest-800 text-charcoal-900 dark:text-white font-bold text-xs rounded-xl border border-sage-300 dark:border-forest-700 text-center transition-colors shadow-sm"
                >
                  View Basket
                </button>
                <button
                  onClick={handleGoToCheckout}
                  className="py-2.5 px-4 bg-leaf-gradient text-forest-950 font-bold text-xs rounded-xl shadow-leaf-sm hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-leaf-500" />
                <span>Cold-Chain Delivery & 100% Secure Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
