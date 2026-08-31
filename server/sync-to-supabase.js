import { supabase } from './services/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, 'data', 'database.json');

export async function syncAllToSupabase() {
  console.log('🚀 Starting Complete Sync from local database to Supabase...');

  if (!fs.existsSync(dbFile)) {
    console.error('database.json not found!');
    return;
  }

  const raw = fs.readFileSync(dbFile, 'utf8');
  const data = JSON.parse(raw);

  // 1. Sync Users
  console.log(`\n--- Syncing ${data.users?.length || 0} Users to Supabase ---`);
  for (const user of data.users || []) {
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      password_hash: user.passwordHash || user.password_hash || '',
      is_verified: !!user.isVerified,
      verification_otp: user.verificationOtp || null,
      otp_expires_at: user.otpExpiresAt || null,
      addresses: user.addresses || [],
      wishlist: user.wishlist || [],
      created_at: user.createdAt || new Date().toISOString(),
      updated_at: user.updatedAt || new Date().toISOString()
    };

    const { error: uErr } = await supabase.from('users').upsert(userPayload);
    if (uErr) {
      console.error(`❌ Failed to sync user ${user.email}:`, uErr.message);
    } else {
      console.log(`✅ Synced user ${user.email} (${user.id})`);
    }

    // Also sync to Supabase Auth
    try {
      await supabase.auth.signUp({
        email: user.email,
        password: (user.passwordHash || 'TemporaryPass123!').slice(0, 30) + 'Aa1!',
        options: {
          data: {
            name: user.name,
            phone: user.phone,
            role: user.role || 'customer'
          }
        }
      });
    } catch (e) {}
  }

  // 2. Sync Admins
  console.log(`\n--- Syncing ${data.admins?.length || 0} Admins to Supabase ---`);
  for (const admin of data.admins || []) {
    const adminPayload = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      password_hash: admin.passwordHash || admin.password_hash || '',
      role: admin.role || 'admin',
      is_active: admin.isActive ? 1 : 0,
      is_verified: !!admin.isVerified,
      verification_otp: admin.verificationOtp || null,
      single_admin_lock: 1,
      last_login_at: admin.lastLoginAt || null,
      created_at: admin.createdAt || new Date().toISOString(),
      updated_at: admin.updatedAt || new Date().toISOString()
    };

    const { error: aErr } = await supabase.from('admins').upsert(adminPayload);
    if (aErr) {
      console.error(`❌ Failed to sync admin ${admin.email}:`, aErr.message);
    } else {
      console.log(`✅ Synced admin ${admin.email} (${admin.id})`);
    }
  }

  // 3. Sync Orders
  console.log(`\n--- Syncing ${data.orders?.length || 0} Orders to Supabase ---`);
  for (const order of data.orders || []) {
    const orderPayload = {
      id: order.id,
      user_email: order.customerEmail || order.shippingAddress?.email || null,
      customer_name: order.customerName || order.shippingAddress?.fullName || 'Customer',
      customer_phone: order.customerPhone || order.shippingAddress?.phone || null,
      shipping_street: order.shippingAddress?.street || null,
      shipping_city: order.shippingAddress?.city || null,
      shipping_pincode: order.shippingAddress?.pincode || null,
      items: order.items || [],
      subtotal: order.subtotal || 0,
      total_amount: order.total || order.totalAmount || 0,
      payment_method: order.paymentMethod || 'COD',
      payment_status: order.paymentStatus || 'Pending',
      status: order.status || 'Processing',
      carrier: order.carrier || null,
      tracking_number: order.trackingNumber || null,
      created_at: order.createdAt || (order.date ? new Date(order.date).toISOString() : new Date().toISOString()),
      updated_at: order.updatedAt || new Date().toISOString()
    };

    const { error: oErr } = await supabase.from('orders').upsert(orderPayload);
    if (oErr) {
      console.error(`❌ Failed to sync order ${order.id}:`, oErr.message);
    } else {
      console.log(`✅ Synced order ${order.id} for ${orderPayload.user_email} (₹${orderPayload.total_amount})`);
    }
  }

  // 4. Sync Products
  console.log(`\n--- Syncing ${data.products?.length || 0} Products to Supabase ---`);
  for (const prod of data.products || []) {
    const imagesArray = Array.isArray(prod.images)
      ? prod.images
      : (typeof prod.image === 'string' ? [prod.image] : ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80']);

    const prodPayload = {
      id: prod.id,
      name: prod.name,
      brand: prod.brand || 'A_S FOODY',
      category: prod.category || 'all',
      category_name: prod.categoryName || prod.category || 'General',
      price: Number(prod.price) || 0,
      original_price: Number(prod.originalPrice) || Number(prod.price) || 0,
      discount: Number(prod.discount) || 0,
      stock_count: Number(prod.stockCount) || 15,
      in_stock: prod.inStock !== false,
      badge: prod.badge || null,
      description: prod.description || '',
      images: imagesArray,
      rating: Number(prod.rating) || 5,
      review_count: Number(prod.reviewCount) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: pErr } = await supabase.from('products').upsert(prodPayload);
    if (pErr) {
      console.error(`❌ Failed to sync product ${prod.id}:`, pErr.message);
    } else {
      console.log(`✅ Synced product ${prod.name} (${prod.id})`);
    }
  }

  console.log('\n🎉 Complete Supabase Sync Finished!');
}

syncAllToSupabase().then(() => process.exit(0));
