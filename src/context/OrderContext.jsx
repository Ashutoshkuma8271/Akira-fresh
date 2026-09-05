import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { addToast } = useToast();
  const { clearCart } = useCart();
  const { user, requireAuth, logout } = useAuth();

  const userEmail = (user?.email || '').trim().toLowerCase();
  const storageKey = userEmail ? `as_commerce_orders_${userEmail}` : 'as_commerce_orders_guest';

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load orders', e);
    }
    return [];
  });

  const [latestOrder, setLatestOrder] = useState(null);

  // Re-load and sync orders whenever the logged-in customer changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setOrders(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setOrders([]);
    }

    if (!userEmail) return;

    const fetchBackendOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('as_commerce_token') || ''}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            const sorted = data.orders.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
            setOrders(sorted);
            try {
              localStorage.setItem(storageKey, JSON.stringify(sorted));
            } catch (e) {}
          }
        }
      } catch (err) {}
    };

    fetchBackendOrders();

    // 1. Supabase Realtime Channel for automatic order status and history sync
    const channel = supabase
      .channel(`order-context-${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const changedEmail = (payload?.new?.user_email || payload?.old?.user_email || '').toLowerCase();
          if (!changedEmail || changedEmail === userEmail) {
            fetchBackendOrders();
          }
        }
      )
      .subscribe();

    // 2. High-reliability 5-second polling interval for instant status transitions
    const pollInterval = setInterval(() => {
      fetchBackendOrders();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [userEmail, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders, storageKey]);

  const createOrder = async ({
    items,
    subtotal,
    discount,
    shipping,
    total,
    shippingAddress,
    paymentMethod = 'Razorpay / Online',
    paymentStatus: _paymentStatus = 'Pending',
    deliveryMode = 'Standard Delivery',
  }) => {
    const orderId = `AS-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date();
    const estDate = new Date(today);
    estDate.setDate(estDate.getDate() + (deliveryMode.includes('Express') ? 2 : 4));

    const newOrder = {
      id: orderId,
      customerId: user?.id || null,
      customerEmail: userEmail || (shippingAddress?.email || '').trim().toLowerCase(),
      customerName: user?.name || shippingAddress?.name || 'Valued Customer',
      customerPhone: user?.phone || shippingAddress?.phone || '',
      date: today.toISOString().split('T')[0],
      status: 'Order Placed',
      statusCode: 2,
      estimatedDelivery: estDate.toISOString().split('T')[0],
      carrier: 'Bluedart Express Luxury Courier',
      trackingNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      items,
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod,
      paymentStatus: 'Pending',
      deliveryMode,
      shippingAddress,
      timeline: [
        { step: 'Order Placed', time: 'Just now', done: true, desc: 'Order confirmed in A_S FOODY system' },
        { step: 'Payment Pending', time: 'Just now', done: false, desc: `Payment of ₹${total.toLocaleString('en-IN')} is pending confirmation` },
        { step: 'Processing', time: 'Scheduled today', done: false, desc: 'Insulated sub-zero packaging & quality check' },
        { step: 'Shipped', time: 'Pending dispatch', done: false, desc: 'Handed over to carrier' },
        { step: 'Out for Delivery', time: 'Pending', done: false, desc: 'On final delivery vehicle' },
        { step: 'Delivered', time: `Estimated ${estDate.toDateString()}`, done: false, desc: 'Delivered to shipping address' }
      ]
    };

    // Persist order to Backend server & Supabase database
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('as_commerce_token') || ''}`
        },
        body: JSON.stringify(newOrder)
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          requireAuth(null, 'Please sign in again before placing your order.');
        } else {
          addToast('Order could not be placed. Please try again.', 'error');
        }
        return null;
      }

      const data = await response.json();
      const savedOrder = data.order || newOrder;
      setOrders((prev) => [savedOrder, ...prev]);
      setLatestOrder(savedOrder);
      clearCart();
      addToast(`Order #${savedOrder.id.slice(-6)} placed!`, 'success');
      return savedOrder;
    } catch (error) {
      addToast('Order could not be placed. Please try again.', 'error');
      return null;
    }
  };

  const getOrderById = (id) => {
    if (!id) return null;
    const clean = id.trim().toUpperCase();
    return orders.find((o) => o.id.toUpperCase() === clean || o.trackingNumber.toUpperCase() === clean);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        latestOrder,
        createOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
};
