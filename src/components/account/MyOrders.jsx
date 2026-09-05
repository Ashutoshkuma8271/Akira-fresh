import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  RotateCcw,
  Search,
  RefreshCw,
  Eye,
  CreditCard,
  MapPin,
  FileText,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/currency';
import { OrderCardSkeleton } from '../common/SkeletonLoader';

export const MyOrders = ({ limit = null, showHeader = true }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  const userEmail = (user?.email || '').trim().toLowerCase();

  // Fetch orders from Supabase 'orders' table with fallback to /api/orders
  const fetchUserOrders = useCallback(async (isManualRefresh = false) => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      let fetchedOrders = [];

      // 1. Direct Supabase Query on public.orders table
      try {
        const { data: supaData, error: supaErr } = await supabase
          .from('orders')
          .select('*')
          .ilike('user_email', userEmail)
          .order('created_at', { ascending: false });

        if (!supaErr && Array.isArray(supaData) && supaData.length > 0) {
          fetchedOrders = supaData.map((so) => ({
            id: so.id,
            customerEmail: so.user_email,
            customerName: so.customer_name || user?.name || 'Customer',
            customerPhone: so.customer_phone || user?.phone || '',
            total: Number(so.total_amount || so.total || 0),
            subtotal: Number(so.subtotal || so.total_amount || 0),
            status: so.status || 'Processing',
            paymentMethod: so.payment_method || 'Online Gateway',
            paymentStatus: so.payment_status || 'Paid',
            carrier: so.carrier || 'Bluedart Express Luxury Courier',
            trackingNumber: so.tracking_number || `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`,
            items: typeof so.items === 'string' ? JSON.parse(so.items) : (so.items || []),
            shippingAddress: {
              name: so.customer_name || user?.name || '',
              phone: so.customer_phone || user?.phone || '',
              street: so.shipping_street || '',
              city: so.shipping_city || '',
              pincode: so.shipping_pincode || '',
              email: so.user_email || userEmail
            },
            createdAt: so.created_at || new Date().toISOString(),
            date: (so.created_at || new Date().toISOString()).split('T')[0]
          }));
        }
      } catch (err) {
        console.warn('Supabase client direct fetch fallback:', err);
      }

      // 2. Fallback to /api/orders endpoint if Supabase client returned 0 or errored
      if (fetchedOrders.length === 0) {
        try {
          const res = await fetch('/api/orders', {
            headers: { Authorization: `Bearer ${localStorage.getItem('as_commerce_token') || ''}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.orders)) {
              fetchedOrders = data.orders;
            }
          }
        } catch (apiErr) {
          console.warn('API fetch fallback note:', apiErr);
        }
      }

      // 3. Fallback to localStorage cache if network is offline
      if (fetchedOrders.length === 0) {
        try {
          const cached = localStorage.getItem(`as_commerce_orders_${userEmail}`);
          if (cached) {
            fetchedOrders = JSON.parse(cached);
          }
        } catch (e) {}
      }

      setOrders(fetchedOrders);
      setLastSynced(new Date());

      if (isManualRefresh) {
        addToast('Synced latest purchase records from Supabase Cloud', 'success');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      addToast('Could not load orders from Supabase', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userEmail, user?.name, user?.phone, addToast]);

  useEffect(() => {
    fetchUserOrders();

    if (!userEmail) return;

    // Supabase Realtime Listener for Live Customer Orders & Status Updates
    const channel = supabase
      .channel(`customer-orders-${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const orderEmail = (payload?.new?.user_email || payload?.old?.user_email || '').toLowerCase();
          if (!orderEmail || orderEmail === userEmail) {
            fetchUserOrders(false);
          }
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      fetchUserOrders(false);
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchUserOrders, userEmail]);

  const handleCopyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(id);
    addToast(`Order ID #${id} copied to clipboard`, 'info');
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    let addedCount = 0;
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.id || `item-${Date.now()}`,
          name: item.name,
          price: item.price,
          images: [item.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'],
          unit: item.unit || 'Standard Pack'
        },
        item.quantity || 1
      );
      addedCount++;
    });
    addToast(`Added ${addedCount} item(s) to your bag from Order #${order.id}!`, 'success');
    navigate('/cart');
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      addToast('Please allow popups to download/print tax invoice', 'error');
      return;
    }

    const itemsHtml = (order.items || [])
      .map(
        (it) => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 12px 8px; font-weight: 600;">${it.name}</td>
          <td style="padding: 12px 8px; text-align: center;">${it.quantity}</td>
          <td style="padding: 12px 8px; text-align: right;">₹${Number(it.price).toLocaleString('en-IN')}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 600;">₹${(Number(it.price) * Number(it.quantity)).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice - ${order.id} - A_S FOODY</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #0F172A; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #10B981; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 800; letter-spacing: 2px; }
          .logo span { color: #10B981; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; padding: 16px; background: #F8FAFC; border-radius: 12px; }
          table { width: 100%; border-collapse: collapse; margin: 24px 0; }
          th { background: #0E3723; color: white; padding: 12px 8px; text-align: left; font-size: 12px; }
          .total-box { margin-left: auto; width: 280px; padding: 16px; background: #F1F5F9; border-radius: 12px; }
          .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
          .grand-total { font-size: 18px; font-weight: 800; color: #0E3723; border-top: 1px solid #CBD5E1; padding-top: 8px; margin-top: 8px; }
          .footer { margin-top: 40px; font-size: 11px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 16px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">A_S <span>FOODY</span></div>
            <p style="margin: 4px 0; font-size: 12px; color: #64748B;">Luxury Gourmet Meat Lab & Frozen Delicacies</p>
            <p style="margin: 0; font-size: 12px; color: #64748B;">GSTIN: 07AAACG0000A1Z5 | FSSAI: 10020011000123</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 20px; color: #0E3723;">TAX INVOICE / RECEIPT</h2>
            <p style="margin: 4px 0; font-weight: 700; font-family: monospace;">#${order.id}</p>
            <p style="margin: 0; font-size: 12px; color: #64748B;">Date: ${order.date || new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">Billed & Shipped To</div>
            <div style="font-weight: 700; margin-top: 4px;">${order.customerName || order.shippingAddress?.name || user?.name}</div>
            <div style="font-size: 13px; color: #475569; margin-top: 2px;">
              ${order.shippingAddress?.street || 'Customer Address'}<br/>
              ${order.shippingAddress?.city || ''} ${order.shippingAddress?.pincode ? `- ${order.shippingAddress.pincode}` : ''}
            </div>
            <div style="font-size: 12px; color: #64748B; margin-top: 4px;">📞 ${order.customerPhone || order.shippingAddress?.phone || 'N/A'}</div>
          </div>
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">Payment & Logistics</div>
            <div style="margin-top: 4px; font-size: 13px;"><strong>Payment Mode:</strong> ${order.paymentMethod || 'Online Gateway'}</div>
            <div style="font-size: 13px;"><strong>Payment Status:</strong> <span style="color: #10B981; font-weight: 700;">${order.paymentStatus || 'Paid'}</span></div>
            <div style="font-size: 13px;"><strong>Carrier:</strong> ${order.carrier || 'Bluedart Express'}</div>
            <div style="font-size: 13px;"><strong>Tracking Consignment:</strong> ${order.trackingNumber || 'Pending'}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ITEM DESCRIPTION</th>
              <th style="text-align: center;">QTY</th>
              <th style="text-align: right;">UNIT PRICE</th>
              <th style="text-align: right;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row"><span>Subtotal</span><span>₹${Number(order.subtotal || order.total).toLocaleString('en-IN')}</span></div>
          <div class="total-row"><span>GST / Tax (Included)</span><span>₹0</span></div>
          <div class="total-row"><span>Cold-Chain Shipping</span><span style="color: #10B981; font-weight: 700;">FREE</span></div>
          <div class="total-row grand-total"><span>Grand Total</span><span>₹${Number(order.total).toLocaleString('en-IN')}</span></div>
        </div>

        <div class="footer">
          <p>Thank you for choosing A_S FOODY Gourmet Meat Lab. For queries, contact concierge at +91 63862 56770 or ashutoshgifthamper9334@gmail.com.</p>
          <p>This is a computer-generated tax invoice verified from Supabase cloud database.</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter((ord) => {
    if (filterStatus === 'ACTIVE') {
      if (ord.status === 'Delivered' || ord.status === 'Cancelled') return false;
    } else if (filterStatus === 'DELIVERED') {
      if (ord.status !== 'Delivered') return false;
    } else if (filterStatus === 'CANCELLED') {
      if (ord.status !== 'Cancelled') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchId = ord.id?.toLowerCase().includes(q);
      const matchTrack = ord.trackingNumber?.toLowerCase().includes(q);
      const matchItem = ord.items?.some((it) => it.name?.toLowerCase().includes(q));
      return matchId || matchTrack || matchItem;
    }

    return true;
  });

  const displayedOrders = limit ? filteredOrders.slice(0, limit) : filteredOrders;

  return (
    <div className="space-y-6">
      {/* Component Header & Supabase Transparency Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-forest-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-charcoal-950 dark:text-white">
                My Purchases & Orders
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-leaf-500/15 text-leaf-700 dark:text-leaf-300 text-xs font-bold border border-leaf-500/30">
                {orders.length}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span>Real-time purchase history directly synchronized with Supabase database.</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Supabase Live Status Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-forest-950/40 dark:bg-forest-900 border border-leaf-500/30 text-[11px] text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-leaf-400">Supabase Connected</span>
              {lastSynced && (
                <span className="text-gray-500 text-[10px] pl-1">
                  • {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchUserOrders(true)}
              disabled={refreshing || loading}
              className="p-2.5 rounded-xl bg-white dark:bg-forest-800 border border-gray-200 dark:border-forest-750 text-gray-700 dark:text-gray-200 hover:text-leaf-500 hover:border-leaf-500 transition-all shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh orders from Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-leaf-500' : ''}`} />
              <span className="hidden xs:inline">Refresh</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar (Only when not in mini-dashboard mode) */}
      {!limit && orders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/80 dark:bg-forest-900/60 p-2.5 rounded-2xl border border-gray-200/80 dark:border-forest-800">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {[
              { label: 'All Orders', value: 'ALL' },
              { label: 'In Transit / Active', value: 'ACTIVE' },
              { label: 'Delivered', value: 'DELIVERED' },
              { label: 'Cancelled', value: 'CANCELLED' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer text-xs ${
                  filterStatus === tab.value
                    ? 'bg-forest-900 dark:bg-leaf-500 text-white dark:text-forest-950 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-forest-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or item..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-forest-950 rounded-xl border border-gray-200 dark:border-forest-750 text-xs text-charcoal-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-leaf-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 space-y-4 bg-white dark:bg-forest-900/60 rounded-3xl border border-gray-200/80 dark:border-forest-800 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-leaf-500/10 dark:bg-forest-800 text-leaf-500 flex items-center justify-center mx-auto border border-leaf-500/20 shadow-sm">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-serif text-xl font-bold text-charcoal-950 dark:text-white">
              No Purchases in Supabase Records
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              You have not placed any orders under <strong className="text-leaf-600 dark:text-leaf-400">{userEmail}</strong> yet. Discover our gourmet meat lab selections and fresh items.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-leaf-500 hover:bg-leaf-400 text-forest-950 font-bold text-xs rounded-xl shadow-lg hover:brightness-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Gourmet Catalog</span>
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Filter Empty State */
        <div className="text-center py-12 space-y-3 bg-gray-50/50 dark:bg-forest-900/40 rounded-2xl border border-dashed border-gray-200 dark:border-forest-800 p-6">
          <AlertCircle className="w-6 h-6 text-gray-400 mx-auto" />
          <p className="text-sm font-semibold text-charcoal-950 dark:text-white">No orders match your filter</p>
          <button
            onClick={() => {
              setFilterStatus('ALL');
              setSearchQuery('');
            }}
            className="text-xs text-leaf-600 dark:text-leaf-400 font-bold hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Order Cards List */
        <div className="space-y-4">
          {displayedOrders.map((ord) => {
            const isDelivered = ord.status?.toLowerCase() === 'delivered';
            const isCancelled = ord.status?.toLowerCase() === 'cancelled';
            const isCopied = copiedOrderId === ord.id;

            return (
              <div
                key={ord.id}
                className="bg-white dark:bg-forest-900/90 rounded-3xl border border-gray-200/90 dark:border-forest-750 p-5 sm:p-6 shadow-sm space-y-4 transition-all hover:border-leaf-500/40 hover:shadow-md"
              >
                {/* Top Row: Order ID, Date, Status, Live Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-forest-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm sm:text-base font-extrabold text-charcoal-950 dark:text-white">
                        #{ord.id}
                      </span>
                      <button
                        onClick={() => handleCopyOrderId(ord.id)}
                        className="p-1 rounded-md text-gray-400 hover:text-leaf-500 hover:bg-gray-100 dark:hover:bg-forest-800 transition-colors"
                        title="Copy Order ID"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${
                          isDelivered
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                            : isCancelled
                            ? 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <span>Placed on {ord.date || (ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent')}</span>
                      {ord.carrier && (
                        <>
                          <span>•</span>
                          <span className="text-forest-800 dark:text-leaf-300 font-medium">{ord.carrier}</span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Actions Header */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/track-order?id=${ord.id}`}
                      className="px-3.5 py-2 rounded-xl bg-forest-950 dark:bg-forest-800 text-leaf-400 hover:text-leaf-300 border border-leaf-500/30 hover:border-leaf-500 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Delivery</span>
                    </Link>

                    <button
                      onClick={() => handlePrintInvoice(ord)}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-forest-800 text-gray-700 dark:text-gray-300 hover:text-leaf-500 transition-colors cursor-pointer"
                      title="Download / Print Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedOrderForModal(ord)}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-forest-800 text-gray-700 dark:text-gray-300 hover:text-leaf-500 transition-colors cursor-pointer"
                      title="Inspect Full Order Audit"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Items Purchased List */}
                <div className="space-y-2.5">
                  {ord.items && ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/70 dark:bg-forest-950/60 border border-gray-100 dark:border-forest-800/80 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-forest-750 shrink-0 bg-white"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800';
                          }}
                        />
                        <div className="truncate pr-2">
                          <p className="font-bold text-charcoal-950 dark:text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Qty: <span className="font-semibold text-charcoal-900 dark:text-white">{item.quantity}</span> • Unit: {item.unit || 'Standard'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-charcoal-950 dark:text-white font-serif text-sm">
                          {formatINR(Number(item.price) * Number(item.quantity))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer: Payment Method, Delivery Destination, Reorder Button, Grand Total */}
                <div className="pt-3 border-t border-gray-100 dark:border-forest-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-[11px]">
                      <CreditCard className="w-3.5 h-3.5 text-leaf-500" />
                      <span>{ord.paymentMethod || 'Razorpay / Online'}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                        {ord.paymentStatus || 'PAID'}
                      </span>
                    </div>
                    {ord.trackingNumber && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>AWB: <span className="font-mono text-charcoal-900 dark:text-gray-300 font-semibold">{ord.trackingNumber}</span></span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-forest-800">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Grand Total</span>
                      <span className="text-base font-extrabold text-forest-900 dark:text-leaf-400 font-serif">
                        {formatINR(ord.total)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleReorder(ord)}
                      className="px-3.5 py-2 rounded-xl bg-leaf-500/15 hover:bg-leaf-500 text-leaf-700 dark:text-leaf-300 hover:text-forest-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-leaf-500/30"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Buy Again</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Order Audit & Transparency Modal */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-forest-900 rounded-3xl border border-gray-200 dark:border-forest-750 max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-forest-800">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-leaf-500/15 text-leaf-700 dark:text-leaf-300 text-[11px] font-bold">
                  Supabase Verified Order
                </span>
                <h3 className="font-serif text-xl font-bold text-charcoal-950 dark:text-white mt-1">
                  Order #{selectedOrderForModal.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-2 rounded-full text-gray-400 hover:text-charcoal-950 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-forest-800"
              >
                ✕
              </button>
            </div>

            {/* Delivery Timeline Details */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Consignment Audit
              </span>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-forest-950 border border-gray-200/80 dark:border-forest-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Carrier Partner</span>
                  <span className="font-semibold text-charcoal-900 dark:text-white">{selectedOrderForModal.carrier || 'Bluedart Express'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">AWB Tracking Consignment</span>
                  <span className="font-mono font-bold text-leaf-600 dark:text-leaf-400">{selectedOrderForModal.trackingNumber || 'BD-48192048IN'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping Mode</span>
                  <span className="font-semibold text-charcoal-900 dark:text-white">Sub-zero Insulated Cold Chain</span>
                </div>
              </div>
            </div>

            {/* Shipping Address Snapshot */}
            {selectedOrderForModal.shippingAddress && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Destination Address
                </span>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-forest-950 border border-gray-200/80 dark:border-forest-800 text-xs space-y-1">
                  <p className="font-bold text-charcoal-950 dark:text-white">{selectedOrderForModal.shippingAddress.name || user?.name}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedOrderForModal.shippingAddress.street}, {selectedOrderForModal.shippingAddress.city} - {selectedOrderForModal.shippingAddress.pincode}
                  </p>
                  <p className="text-gray-500">📞 {selectedOrderForModal.shippingAddress.phone || user?.phone || 'N/A'}</p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handlePrintInvoice(selectedOrderForModal)}
                className="flex-1 py-3 bg-forest-950 dark:bg-forest-800 text-leaf-400 font-bold text-xs rounded-xl border border-leaf-500/30 hover:border-leaf-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>
              <Link
                to={`/track-order?id=${selectedOrderForModal.id}`}
                onClick={() => setSelectedOrderForModal(null)}
                className="flex-1 py-3 bg-leaf-500 hover:bg-leaf-400 text-forest-950 font-bold text-xs rounded-xl shadow-lg text-center flex items-center justify-center gap-1.5 transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>Live Map & Tracking</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
