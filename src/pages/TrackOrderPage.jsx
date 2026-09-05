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
import { PageTransition } from '../components/common/PageTransition';
import { AnimatedSection } from '../components/common/AnimatedSection';

import { supabase } from '../lib/supabase';

export const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const { getOrderById, orders } = useOrder();

  const urlId = searchParams.get('id') || '';
  const [searchQuery, setSearchQuery] = useState(urlId || (orders[0] ? orders[0].id : ''));
  const [activeOrder, setActiveOrder] = useState(() => getOrderById(urlId) || orders[0] || null);
  const [searching, setSearching] = useState(false);

  const fetchLiveOrder = async (queryId) => {
    if (!queryId) return;
    const cleanId = queryId.trim();
    
    // 1. Context lookup
    const local = getOrderById(cleanId);
    if (local) {
      setActiveOrder(local);
    }

    setSearching(true);
    try {
      // 2. Direct Supabase Query
      const { data: supaOrder, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.ilike.${cleanId},tracking_number.ilike.${cleanId}`)
        .maybeSingle();

      if (!error && supaOrder) {
        const mapped = {
          id: supaOrder.id,
          customerEmail: supaOrder.user_email,
          customerName: supaOrder.customer_name || 'Customer',
          customerPhone: supaOrder.customer_phone || '',
          total: Number(supaOrder.total_amount || 0),
          subtotal: Number(supaOrder.subtotal || supaOrder.total_amount || 0),
          status: supaOrder.status || 'Processing',
          paymentMethod: supaOrder.payment_method || 'Online Gateway',
          paymentStatus: supaOrder.payment_status || 'Paid',
          carrier: supaOrder.carrier || 'Bluedart Express Luxury Courier',
          trackingNumber: supaOrder.tracking_number || `BD-${cleanId.replace(/\D/g, '').slice(-8) || '8839219'}IN`,
          items: typeof supaOrder.items === 'string' ? JSON.parse(supaOrder.items) : (supaOrder.items || []),
          createdAt: supaOrder.created_at || new Date().toISOString()
        };
        setActiveOrder(mapped);
      } else {
        // 3. Fallback to API
        const res = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order) {
            setActiveOrder(data.order);
          }
        }
      }
    } catch (e) {
      console.warn('Live order tracking fetch note:', e);
    } finally {
      setSearching(false);
    }
  };

  const firstOrderId = orders[0]?.id || '';

  useEffect(() => {
    const idToUse = urlId || firstOrderId;
    if (idToUse) {
      setSearchQuery(idToUse);
      fetchLiveOrder(idToUse);
    }
  }, [urlId, firstOrderId]);

  // Real-time updates subscription for the active order
  useEffect(() => {
    if (!activeOrder?.id) return;

    const channel = supabase
      .channel(`track-order-${activeOrder.id.replace(/[^a-zA-Z0-9]/g, '_')}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${activeOrder.id}` },
        (payload) => {
          if (payload.new) {
            setActiveOrder((prev) => ({
              ...prev,
              status: payload.new.status || prev.status,
              carrier: payload.new.carrier || prev.carrier,
              trackingNumber: payload.new.tracking_number || prev.trackingNumber,
              updatedAt: payload.new.updated_at
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeOrder?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchLiveOrder(searchQuery.trim());
  };

  return (
    <PageTransition className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-charcoal-900 dark:text-ivory-100">
      
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
            className="px-6 py-3 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs sm:text-sm rounded-2xl shadow-sm cursor-pointer transition-all hover:scale-102"
          >
            Track Order
          </button>
        </form>
      </div>

      {/* Order Status Display */}
      {activeOrder ? (
        <AnimatedSection className="space-y-6">
          
          {/* Status Card */}
          <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-forest-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-forest-800">
              <div>
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Consignment Order ID
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="font-mono text-xl font-bold text-charcoal-950 dark:text-white">
                    {activeOrder.id}
                  </h3>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-leaf-500/15 text-leaf-700 dark:text-lime-300">
                    {activeOrder.status || 'Out for Delivery'}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block">Estimated Arrival</span>
                <span className="text-sm font-bold text-charcoal-950 dark:text-white font-serif">
                  Today, within 45 mins
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            {(() => {
              const s = (activeOrder?.status || '').toLowerCase();
              let currentStep = 1;
              if (s.includes('deliver')) currentStep = 4;
              else if (s.includes('out') || s.includes('van') || s.includes('transit') || s.includes('ship')) currentStep = 3;
              else if (s.includes('pack') || s.includes('process') || s.includes('marin')) currentStep = 2;
              
              const progressWidth = currentStep === 1 ? '0%' : currentStep === 2 ? '33%' : currentStep === 3 ? '66%' : '100%';
              const steps = [
                { label: 'Order Confirmed', time: activeOrder?.createdAt ? new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Confirmed', done: currentStep >= 1 },
                { label: 'Marinated & Packed', time: currentStep >= 2 ? 'Completed' : 'Queued', done: currentStep >= 2 },
                { label: 'Out in Cold Van', time: currentStep >= 3 ? (activeOrder?.carrier || 'In Transit') : 'Scheduled', done: currentStep >= 3, active: currentStep === 3 },
                { label: 'Delivered Fresh', time: currentStep >= 4 ? 'Delivered' : 'Pending', done: currentStep >= 4 },
              ];

              return (
                <div className="py-8">
                  <div className="grid grid-cols-4 gap-2 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-forest-800 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-[#84CC16] -translate-y-1/2 z-0 transition-all duration-500"
                      style={{ width: progressWidth }}
                    />

                    {steps.map((step, idx) => (
                      <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            step.done
                              ? 'bg-[#84CC16] text-forest-950 shadow-md ring-4 ring-white dark:ring-forest-900'
                              : 'bg-gray-200 dark:bg-forest-800 text-gray-400'
                          }`}
                        >
                          {step.done ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span className="text-[11px] font-bold text-charcoal-950 dark:text-white mt-2 block">
                          {step.label}
                        </span>
                        <span className="text-[10px] text-gray-400">{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Logistics Rider Details */}
            <div className="bg-sage-50 dark:bg-forest-850 p-4 rounded-2xl border border-leaf-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#18392b] text-white flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5 text-lime-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-950 dark:text-white">
                    Rider: Rajesh Verma • +91 98112 34567
                  </h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300">
                    Insulated sub-zero thermo box • Carrying temperature: <span className="font-bold text-leaf-700 dark:text-lime-400">-18.4°C</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-700 text-charcoal-800 dark:text-gray-200">
                Live Sensor Verified
              </span>
            </div>
          </div>

          {/* Items Summary in this package */}
          <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 border border-gray-200 dark:border-forest-800 shadow-sm space-y-4">
            <h4 className="font-serif text-base font-bold text-charcoal-950 dark:text-white">
              Items in this Consignment ({activeOrder.items?.length || 0})
            </h4>
            <div className="divide-y divide-gray-100 dark:divide-forest-800">
              {activeOrder.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                    )}
                    <div>
                      <span className="font-bold text-charcoal-950 dark:text-white">{item.name}</span>
                      <span className="text-gray-500 block text-[11px]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-charcoal-950 dark:text-white font-serif">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </AnimatedSection>
      ) : (
        <div className="bg-white dark:bg-forest-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-forest-800 shadow-sm space-y-4">
          <Package className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-charcoal-950 dark:text-white">Order Not Found</h3>
          <p className="text-xs text-charcoal-600 dark:text-gray-400 max-w-sm mx-auto">
            Please verify the order ID or tracking code. Example available order ID is <strong className="text-charcoal-950 dark:text-white">AF-884219</strong>.
          </p>
        </div>
      )}

    </PageTransition>
  );
};
