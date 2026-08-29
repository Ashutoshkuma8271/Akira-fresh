import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatINR } from '../utils/currency';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const { getOrderById, orders } = useOrder();

  const urlId = searchParams.get('id') || '';
  const [searchQuery, setSearchQuery] = useState(urlId || (orders[0] ? orders[0].id : 'AF-884219'));
  const [activeOrder, setActiveOrder] = useState(() => getOrderById(urlId) || orders[0] || null);

  useEffect(() => {
    if (urlId) {
      const found = getOrderById(urlId);
      if (found) {
        setActiveOrder(found);
        setSearchQuery(urlId);
      }
    }
  }, [urlId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = getOrderById(searchQuery.trim());
    setActiveOrder(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn text-charcoal-900 dark:text-ivory-100">
      
      {/* Header Banner */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-leaf-700 dark:text-lime-400 font-sans">
          Real-Time Cold Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950 dark:text-white mt-1">
          Track Your Fresh Delivery
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 dark:text-gray-400 max-w-md mx-auto mt-2">
          Enter your A_S FOODY Order ID to check live rider dispatch and -18°C sub-zero cold-chain transit.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white dark:bg-forest-900 rounded-3xl p-4 sm:p-6 border border-gray-200 dark:border-forest-800 shadow-sm mb-10 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-leaf-600 dark:text-leaf-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. AF-884219"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-forest-850 text-charcoal-950 dark:text-white text-xs sm:text-sm rounded-2xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-leaf-500 font-mono font-bold uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs sm:text-sm rounded-2xl shadow-sm hover:scale-105 transition-all cursor-pointer"
          >
            Track Status
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        {orders.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-forest-800 text-xs text-charcoal-600 dark:text-gray-400">
            <span>Recent orders:</span>
            {orders.slice(0, 3).map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => {
                  setSearchQuery(ord.id);
                  setActiveOrder(ord);
                }}
                className="font-mono text-leaf-700 dark:text-lime-300 hover:underline font-bold bg-leaf-500/10 px-2 py-0.5 rounded-md cursor-pointer"
              >
                #{ord.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Details & Timeline */}
      {activeOrder ? (
        <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-forest-800 shadow-sm space-y-8 animate-fadeIn">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-forest-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base sm:text-lg font-bold text-charcoal-950 dark:text-white">
                  Order #{activeOrder.id}
                </span>
                <span className="px-3 py-0.5 bg-leaf-500/15 text-leaf-800 dark:text-lime-300 border border-leaf-500/30 text-[11px] font-bold rounded-full">
                  {activeOrder.status}
                </span>
              </div>
              <p className="text-xs text-charcoal-600 dark:text-gray-400 mt-1">
                Placed on {activeOrder.date} via {activeOrder.carrier || 'A_S FOODY Cold Express'}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-charcoal-500 dark:text-gray-400 block">Estimated Delivery</span>
              <span className="text-base font-bold text-charcoal-950 dark:text-white font-serif">
                {activeOrder.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal-950 dark:text-white mb-6">
              Cold Transit Timeline
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200 dark:before:bg-forest-800">
              {activeOrder.timeline.map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      item.done
                        ? 'bg-[#0E3723] dark:bg-[#84CC16] border-[#84CC16] text-white dark:text-forest-950 shadow-sm'
                        : 'bg-white dark:bg-forest-900 border-gray-300 dark:border-forest-700 text-gray-300'
                    }`}
                  >
                    {item.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 fill-current text-white dark:text-forest-950" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>

                  {/* Milestone Info */}
                  <div className="flex-1 bg-gray-50 dark:bg-forest-850 p-4 rounded-2xl border border-gray-100 dark:border-forest-750">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className={`text-xs sm:text-sm font-bold ${item.done ? 'text-charcoal-950 dark:text-white' : 'text-gray-400'}`}>
                        {item.step}
                      </h4>
                      <span className={`text-[11px] font-mono ${item.done ? 'text-leaf-700 dark:text-lime-300 font-bold' : 'text-gray-400'}`}>
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 dark:text-gray-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Items Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-forest-800 text-xs">
            <div className="p-4 bg-sage-50 dark:bg-forest-850 rounded-2xl border border-gray-200 dark:border-forest-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-charcoal-950 dark:text-white">
                <MapPin className="w-3.5 h-3.5 text-leaf-600 dark:text-leaf-400" />
                <span>Delivery Address</span>
              </div>
              <p className="text-charcoal-800 dark:text-gray-200 font-medium">{activeOrder.shippingAddress.name} ({activeOrder.shippingAddress.phone})</p>
              <p className="text-charcoal-600 dark:text-gray-400">
                {activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-forest-850 rounded-2xl border border-gray-200 dark:border-forest-700 space-y-2">
              <div className="flex justify-between font-bold text-charcoal-950 dark:text-white">
                <span>Items in Cold Box</span>
                <span>{activeOrder.items.length} packs</span>
              </div>
              <p className="text-charcoal-600 dark:text-gray-400">
                {activeOrder.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
              </p>
              <p className="text-leaf-700 dark:text-lime-300 font-bold">
                Total Value: {formatINR(activeOrder.total)}
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-forest-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-forest-800 shadow-sm space-y-4">
          <Package className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-charcoal-950 dark:text-white">Order Not Found</h3>
          <p className="text-xs text-charcoal-600 dark:text-gray-400 max-w-sm mx-auto">
            Please verify the order ID or tracking code. Example available order ID is <strong className="text-charcoal-950 dark:text-white">AF-884219</strong>.
          </p>
        </div>
      )}

    </div>
  );
};

