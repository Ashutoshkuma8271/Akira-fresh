import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatINR } from '../utils/currency';
import {
  CheckCircle2,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ArrowRight,
  Printer,
  Sparkles,
  ShoppingBag,
  Snowflake,
} from 'lucide-react';

export const OrderSuccessPage = () => {
  const { latestOrder, orders } = useOrder();
  const order = latestOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-charcoal-900 dark:text-ivory-100">
        <h2 className="text-xl font-bold text-charcoal-950 dark:text-white mb-2">No recent order found</h2>
        <Link to="/" className="text-leaf-600 dark:text-leaf-400 font-bold hover:underline">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn text-charcoal-900 dark:text-ivory-100">
      
      {/* Celebration Header Card */}
      <div className="bg-gradient-to-r from-[#061e14] via-[#092b1d] to-[#0d3b27] text-white rounded-3xl p-8 sm:p-12 text-center border border-leaf-500/30 shadow-2xl relative overflow-hidden mb-8">
        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#84CC16] rounded-full mx-auto flex items-center justify-center shadow-lg animate-pulse-subtle">
            <CheckCircle2 className="w-10 h-10 text-forest-950 stroke-[2.5]" />
          </div>

          <span className="inline-block px-3 py-1 bg-[#072418] border border-leaf-500/40 rounded-full text-xs font-bold text-lime-300 uppercase tracking-widest">
            Order Confirmed & Payment Verified
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Order Placed Successfully!
          </h1>

          <p className="text-xs sm:text-sm text-gray-200/90 max-w-md mx-auto leading-relaxed font-sans">
            Thank you for choosing A_S FOODY. We are packing your frozen non-veg cuts in specialized sub-zero thermal boxes with dry ice.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs text-gray-300">Order Reference:</span>
            <span className="text-sm font-mono font-bold text-lime-300 bg-black/60 px-3.5 py-1.5 rounded-xl border border-leaf-500/40">
              #{order.id}
            </span>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-leaf-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Order Summary & Logistics Details */}
      <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-forest-800 shadow-sm space-y-8 mb-8">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-gray-100 dark:border-forest-800 text-xs">
          <div className="p-4 bg-gray-50 dark:bg-forest-850 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-charcoal-600 dark:text-gray-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-leaf-600 dark:text-leaf-400" />
              <span>Estimated Delivery</span>
            </div>
            <p className="text-sm font-bold text-charcoal-950 dark:text-white">{order.estimatedDelivery}</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-forest-850 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-charcoal-600 dark:text-gray-400 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-leaf-600 dark:text-leaf-400" />
              <span>Payment Mode</span>
            </div>
            <p className="text-sm font-bold text-charcoal-950 dark:text-white truncate">{order.paymentMethod}</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-forest-850 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-charcoal-600 dark:text-gray-400 font-medium">
              <Package className="w-3.5 h-3.5 text-leaf-600 dark:text-leaf-400" />
              <span>Tracking Number</span>
            </div>
            <p className="text-sm font-mono font-bold text-leaf-700 dark:text-lime-300">{order.trackingNumber}</p>
          </div>
        </div>

        {/* Ordered Items */}
        <div>
          <h3 className="font-serif text-lg font-bold text-charcoal-950 dark:text-white mb-4">Items in Cold Box</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-forest-850 border border-gray-100 dark:border-forest-750 text-xs"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-forest-700 bg-white shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-charcoal-950 dark:text-white text-sm">{item.name}</h4>
                    <p className="text-charcoal-600 dark:text-gray-400 text-[11px]">
                      Quantity: {item.quantity} {item.selectedWeight ? `• ${item.selectedWeight}` : ''}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-charcoal-950 dark:text-white font-serif text-sm">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown & Shipping Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-forest-800 text-xs">
          
          {/* Shipping Address */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-950 dark:text-white uppercase tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-leaf-600 dark:text-leaf-400" />
              <span>Shipping Address</span>
            </div>
            <p className="font-bold text-charcoal-950 dark:text-white">{order.shippingAddress.name} ({order.shippingAddress.phone})</p>
            <p className="text-charcoal-600 dark:text-gray-400 leading-relaxed">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 dark:bg-forest-850 p-4 rounded-2xl border border-gray-100 dark:border-forest-750 space-y-2">
            <div className="flex justify-between text-charcoal-600 dark:text-gray-300">
              <span>Subtotal</span>
              <span className="font-bold text-charcoal-950 dark:text-white">{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-leaf-700 dark:text-lime-400 font-bold">
                <span>Discount Applied</span>
                <span>-{formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal-600 dark:text-gray-300">
              <span>Cold Delivery Fee</span>
              <span>{order.shipping === 0 ? 'FREE' : formatINR(order.shipping)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-forest-700 text-base font-bold text-charcoal-950 dark:text-white">
              <span>Total Paid</span>
              <span className="text-xl text-leaf-700 dark:text-lime-300 font-serif">{formatINR(order.total)}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-white dark:bg-forest-900 hover:bg-gray-50 dark:hover:bg-forest-800 border border-gray-300 dark:border-forest-700 text-charcoal-950 dark:text-white font-bold text-xs rounded-2xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
          <span>Print Receipt</span>
        </button>

        <div className="flex items-center gap-3">
          <Link
            to={`/track-order?id=${order.id}`}
            className="px-6 py-3.5 bg-white dark:bg-forest-900 text-charcoal-950 dark:text-white hover:bg-gray-50 dark:hover:bg-forest-800 font-bold text-xs sm:text-sm rounded-2xl border border-gray-300 dark:border-forest-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Package className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
            <span>Track Order Status</span>
          </Link>

          <Link
            to="/shop"
            className="px-6 py-3.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs sm:text-sm rounded-2xl shadow-sm hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

    </div>
  );
};

