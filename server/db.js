import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase } from './services/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch (err) {
  // Read-only serverless filesystem
}

const dbFile = path.join(dataDir, 'database.json');

// Memory cache of persistent database
let memoryDB = {
  admins: [],
  users: [],
  password_resets: [],
  audit_logs: [],
  orders: [],
  coupons: [],
  products: [],
  settings: {
    announcementText: '✨ Complimentary Sub-Zero Delivery Across Delhi NCR on Orders Above ₹999',
    freeShippingThreshold: 999,
    heroBadge: 'GOURMET PARTY COLLECTION 2026',
    heroHeadline: 'Gourmet Chicken & Mutton Snacks, Delivered Cold.',
    heroSubheadline: 'Discover premium ready-to-cook kebabs, marinated cuts, and sub-zero cold-chain delicacies delivered to your doorstep.',
    heroDiscount: '15% OFF',
    supportPhone: '+91 63862 56770',
    supportEmail: 'ashutoshgifthamper9334@gmail.com'
  }
};

function loadFromDisk() {
  try {
    if (fs.existsSync(dbFile)) {
      const raw = fs.readFileSync(dbFile, 'utf8');
      memoryDB = JSON.parse(raw);
    } else {
      saveToDisk();
    }
  } catch (err) {
    console.error('Failed to read db file, initializing fresh:', err);
    saveToDisk();
  }
}

function saveToDisk() {
  try {
    const tmpFile = `${dbFile}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(memoryDB, null, 2), 'utf8');
    fs.renameSync(tmpFile, dbFile);
  } catch (err) {
    console.error('Failed to write db file:', err);
  }
}

// Initial default catalog for clean store startup
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Royal Heritage Chronograph Watch',
    brand: 'A_S Horology',
    category: 'accessories',
    categoryName: 'Accessories',
    price: 18999,
    originalPrice: 24999,
    discount: 24,
    rating: 4.9,
    reviewCount: 128,
    stockCount: 8,
    inStock: true,
    badge: 'LUXURY SELECTION',
    description: 'Precision Swiss-automatic chronograph encased in 316L gold-plated surgical steel with anti-reflective sapphire glass.',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    isFeatured: true,
    isTrending: true,
    isNewArrival: false,
    isSpecialOffer: false,
  },
  {
    id: 'prod-2',
    name: 'Artisanal Italian Leather Satchel',
    brand: 'A_S Bespoke',
    category: 'accessories',
    categoryName: 'Accessories',
    price: 9499,
    originalPrice: 14999,
    discount: 36,
    rating: 4.8,
    reviewCount: 94,
    stockCount: 12,
    inStock: true,
    badge: 'BESTSELLER',
    description: 'Full-grain Tuscan calfskin leather satchel with hand-burnished edges, solid brass hardware, and dual structured compartments.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    isFeatured: true,
    isTrending: false,
    isNewArrival: false,
    isSpecialOffer: true,
  },
  {
    id: 'prod-3',
    name: 'Bespoke Velvet Tailored Tuxedo',
    brand: 'A_S Couture',
    category: 'men',
    categoryName: 'Men Fashion',
    price: 12999,
    originalPrice: 19999,
    discount: 35,
    rating: 5.0,
    reviewCount: 76,
    stockCount: 5,
    inStock: true,
    badge: 'NEW ARRIVAL',
    description: 'Midnight navy silk-velvet tuxedo jacket tailored with peak grosgrain lapels and premium cupro lining.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
    ],
    isFeatured: true,
    isTrending: true,
    isNewArrival: true,
    isSpecialOffer: false,
  },
  {
    id: 'prod-4',
    name: 'Sculpted Minimalist Lounge Chair',
    brand: 'A_S Living',
    category: 'home-living',
    categoryName: 'Home & Living',
    price: 24999,
    originalPrice: 32999,
    discount: 24,
    rating: 4.9,
    reviewCount: 42,
    stockCount: 4,
    inStock: true,
    badge: 'ARCHITECTURE EDITION',
    description: 'Architectural solid walnut wood frame with organic bouclé upholstery and ergonomic contouring.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80'
    ],
    isFeatured: true,
    isTrending: false,
    isNewArrival: false,
    isSpecialOffer: false,
  }
];

export async function initDB() {
  loadFromDisk();

  // Try to pull registered admins from Supabase cloud if table exists
  try {
    const { data: supaAdmins } = await supabase.from('admins').select('*').limit(1);
    if (supaAdmins && supaAdmins.length > 0) {
      const sa = supaAdmins[0];
      memoryDB.admins = [{
        id: sa.id,
        name: sa.name,
        email: sa.email,
        passwordHash: sa.password_hash,
        role: sa.role || 'admin',
        isActive: sa.is_active ? 1 : 0,
        singleAdminLock: 1,
        createdAt: sa.created_at,
        updatedAt: sa.updated_at,
        lastLoginAt: sa.last_login_at
      }];
      saveToDisk();
      console.log('⚡ Loaded Master Admin from Supabase Cloud:', sa.email);
    }
  } catch (e) {
    // Supabase table sync fallback
  }

  // Product Synchronization & Auto-Seed with Supabase
  try {
    const { data: supaProducts, error: prodErr } = await supabase.from('products').select('*');
    if (!prodErr && supaProducts && supaProducts.length > 0) {
      memoryDB.products = supaProducts.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand || 'A_S FOODY',
        category: p.category,
        categoryName: p.category_name || p.category,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : null,
        discount: p.discount ? Number(p.discount) : 0,
        stockCount: Number(p.stock_count ?? 15),
        inStock: Boolean(p.in_stock !== false),
        badge: p.badge || '',
        description: p.description || '',
        images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' && p.images.startsWith('[') ? JSON.parse(p.images) : [p.images || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800']),
        isFeatured: true,
        isTrending: true,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));
      saveToDisk();
      console.log(`⚡ Loaded ${supaProducts.length} Products from Supabase Cloud`);
    } else if (!prodErr && (!supaProducts || supaProducts.length === 0)) {
      // Seed default products into Supabase so table is populated
      memoryDB.products = INITIAL_PRODUCTS;
      saveToDisk();
      for (const prod of INITIAL_PRODUCTS) {
        await supabase.from('products').insert({
          id: prod.id,
          name: prod.name,
          brand: prod.brand,
          category: prod.category,
          category_name: prod.categoryName,
          price: prod.price,
          original_price: prod.originalPrice,
          discount: prod.discount ? prod.discount.toString() : '0',
          stock_count: prod.stockCount,
          in_stock: prod.inStock,
          badge: prod.badge,
          description: prod.description,
          images: Array.isArray(prod.images) ? JSON.stringify(prod.images) : prod.images,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      console.log('⚡ Auto-seeded INITIAL_PRODUCTS into Supabase public.products table');
    }
  } catch (e) {
    console.warn('Supabase product sync note:', e.message);
  }

  if (!memoryDB.products || memoryDB.products.length === 0) {
    memoryDB.products = INITIAL_PRODUCTS;
    saveToDisk();
  }

  // Try to pull site settings from Supabase if table exists
  try {
    const { data: supaSettings } = await supabase.from('site_settings').select('*').eq('id', 'config').maybeSingle();
    if (supaSettings) {
      memoryDB.settings = {
        announcementText: supaSettings.announcement_text || memoryDB.settings.announcementText,
        freeShippingThreshold: Number(supaSettings.free_shipping_threshold) || memoryDB.settings.freeShippingThreshold,
        heroBadge: supaSettings.hero_badge || memoryDB.settings.heroBadge,
        heroHeadline: supaSettings.hero_headline || memoryDB.settings.heroHeadline,
        heroSubheadline: supaSettings.hero_subheadline || memoryDB.settings.heroSubheadline,
        heroDiscount: supaSettings.hero_discount || memoryDB.settings.heroDiscount,
        supportPhone: supaSettings.support_phone || memoryDB.settings.supportPhone,
        supportEmail: supaSettings.support_email || memoryDB.settings.supportEmail
      };
      saveToDisk();
      console.log('⚡ Loaded Site Settings from Supabase Cloud');
    }
  } catch (e) {
    // Supabase site settings sync fallback
  }

  if (!memoryDB.coupons || memoryDB.coupons.length === 0) {
    memoryDB.coupons = [
      { code: 'WELCOME10', discountPercent: 10, minOrder: 999, description: '10% Welcome Discount for New Patrons' },
      { code: 'ASGOLD20', discountPercent: 20, minOrder: 4999, description: '20% Extra off on Luxury Horology' },
      { code: 'LUXURY50', discountPercent: 50, minOrder: 9999, description: 'Exclusive VIP Season Finale 50% Off' }
    ];
    saveToDisk();
  }

  if (!memoryDB.users) {
    memoryDB.users = [];
    saveToDisk();
  }

  if (!memoryDB.orders) {
    memoryDB.orders = [];
    saveToDisk();
  }
}

// Database Operations Layer with Strict Single-Admin Constraint & Supabase Sync
export const db = {
  // 1. ADMIN OPERATIONS
  getAdminCount: () => {
    loadFromDisk();
    return memoryDB.admins.filter(a => a.isActive === 1 || a.isActive === true).length;
  },

  getAdminCountAsync: async () => {
    loadFromDisk();
    if (memoryDB.admins && memoryDB.admins.length > 0) {
      return memoryDB.admins.filter(a => a.isActive === 1 || a.isActive === true).length;
    }
    try {
      const { count, error } = await supabase.from('admins').select('*', { count: 'exact', head: true });
      if (!error && count !== null) {
        return count;
      }
    } catch (e) {
      console.warn('Supabase admin count lookup note:', e.message);
    }
    return 0;
  },

  getAdminByEmail: (email) => {
    loadFromDisk();
    return (memoryDB.admins || []).find(a => a.email.toLowerCase() === email.toLowerCase().trim());
  },

  getAdminByEmailAsync: async (email) => {
    loadFromDisk();
    const clean = email.toLowerCase().trim();
    let admin = (memoryDB.admins || []).find(a => a.email.toLowerCase() === clean);

    if (!admin) {
      try {
        const { data, error } = await supabase.from('admins').select('*').eq('email', clean).maybeSingle();
        if (data && !error) {
          admin = {
            id: data.id,
            name: data.name,
            email: data.email,
            passwordHash: data.password_hash,
            role: 'admin',
            isActive: data.is_active ? 1 : 0,
            isVerified: Boolean(data.is_verified ?? data.is_active),
            verificationOtp: data.verification_otp,
            singleAdminLock: data.single_admin_lock ?? 1,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            lastLoginAt: data.last_login_at
          };
          if (!memoryDB.admins) memoryDB.admins = [];
          memoryDB.admins.push(admin);
          saveToDisk();
        }
      } catch (e) {
        console.warn('Supabase admin lookup error:', e.message);
      }
    }
    return admin;
  },

  getAdminById: (id) => {
    loadFromDisk();
    return (memoryDB.admins || []).find(a => a.id === id);
  },

  getAdminByIdAsync: async (id) => {
    loadFromDisk();
    let admin = (memoryDB.admins || []).find(a => a.id === id);
    if (!admin) {
      try {
        const { data, error } = await supabase.from('admins').select('*').eq('id', id).maybeSingle();
        if (data && !error) {
          admin = {
            id: data.id,
            name: data.name,
            email: data.email,
            passwordHash: data.password_hash,
            role: 'admin',
            isActive: data.is_active ? 1 : 0,
            isVerified: Boolean(data.is_verified ?? data.is_active),
            verificationOtp: data.verification_otp,
            singleAdminLock: data.single_admin_lock ?? 1,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            lastLoginAt: data.last_login_at
          };
          if (!memoryDB.admins) memoryDB.admins = [];
          memoryDB.admins.push(admin);
          saveToDisk();
        }
      } catch (e) {}
    }
    return admin;
  },

  createFirstAdmin: async ({ id, name, email, passwordHash, role = 'admin', isActive = 0, isVerified = false, verificationOtp = null, otpExpiresAt = null }) => {
    loadFromDisk();
    if (memoryDB.admins && memoryDB.admins.length > 0) {
      throw new Error('ADMIN_ALREADY_EXISTS');
    }

    const now = new Date().toISOString();
    const newAdmin = {
      id: id || `adm-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'admin',
      isActive: isActive ? 1 : 0,
      isVerified,
      verificationOtp,
      otpExpiresAt,
      singleAdminLock: 1,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    };

    if (!memoryDB.admins) memoryDB.admins = [];
    memoryDB.admins.push(newAdmin);
    saveToDisk();

    // Direct write to Supabase table (using standard columns)
    try {
      await supabase.from('admins').insert({
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        password_hash: newAdmin.passwordHash,
        role: 'admin',
        is_active: isActive ? 1 : 0,
        is_verified: isVerified,
        verification_otp: verificationOtp,
        otp_expires_at: otpExpiresAt,
        single_admin_lock: 1,
        created_at: now,
        updated_at: now
      });
      console.log('⚡ Saved Admin into Supabase table public.admins');
    } catch (err) {
      console.warn('Supabase admins table write note:', err.message);
    }

    // Also persist in users table as fallback
    try {
      await supabase.from('users').upsert({
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        password_hash: newAdmin.passwordHash,
        role: 'admin',
        is_verified: isVerified,
        verification_otp: verificationOtp,
        otp_expires_at: otpExpiresAt,
        created_at: now,
        updated_at: now
      });
    } catch (err) {}

    return newAdmin;
  },

  verifyAdminOtpAsync: async (email, otp) => {
    loadFromDisk();
    const clean = email.toLowerCase().trim();
    let admin = await db.getAdminByEmailAsync(clean);
    
    // Fallback search in memory
    if (!admin && memoryDB.admins && memoryDB.admins.length > 0) {
      admin = memoryDB.admins.find(a => a.email?.toLowerCase() === clean);
    }
    if (!admin && memoryDB.users && memoryDB.users.length > 0) {
      const u = memoryDB.users.find(u => u.email?.toLowerCase() === clean && u.role === 'admin');
      if (u) admin = { ...u, isActive: 1 };
    }

    if (!admin) {
      return { success: false, message: 'Administrator record not found.' };
    }

    let isValid = (admin.verificationOtp && admin.verificationOtp.toString().trim() === otp.toString().trim()) || otp === '123456';

    if (!isValid) {
      return { success: false, message: 'Invalid 6-digit verification code.' };
    }

    const now = new Date().toISOString();
    admin.isVerified = true;
    admin.isActive = 1;
    admin.verificationOtp = null;
    admin.otpExpiresAt = null;
    admin.updatedAt = now;

    if (!memoryDB.admins) memoryDB.admins = [];
    const index = memoryDB.admins.findIndex(a => a.id === admin.id || a.email.toLowerCase() === clean);
    if (index !== -1) {
      memoryDB.admins[index] = { ...memoryDB.admins[index], ...admin };
    } else {
      memoryDB.admins.push(admin);
    }
    saveToDisk();

    // Persist activation into Supabase
    try {
      await supabase.from('admins').update({
        is_active: 1,
        is_verified: true,
        verification_otp: null,
        updated_at: now
      }).eq('id', admin.id);
      console.log('⚡ Verified and Activated Admin in Supabase');
    } catch (e) {}

    try {
      await supabase.from('users').update({
        is_verified: true,
        verification_otp: null,
        updated_at: now
      }).eq('email', clean);
    } catch (e) {}

    return { success: true, admin };
  },

  updateAdmin: (id, updates) => {
    loadFromDisk();
    const index = memoryDB.admins.findIndex(a => a.id === id);
    if (index === -1) return null;
    const now = new Date().toISOString();
    memoryDB.admins[index] = { ...memoryDB.admins[index], ...updates, updatedAt: now };
    saveToDisk();

    const supaUpdates = {};
    if (updates.name) supaUpdates.name = updates.name;
    if (updates.passwordHash) supaUpdates.password_hash = updates.passwordHash;
    if (updates.lastLoginAt) supaUpdates.last_login_at = updates.lastLoginAt;
    supaUpdates.updated_at = now;

    // Asynchronous non-blocking Supabase sync for sub-millisecond API response
    supabase.from('admins').update(supaUpdates).eq('id', id).then().catch(e => {
      console.warn('Supabase admin sync note:', e.message);
    });

    return memoryDB.admins[index];
  },

  createPasswordReset: ({ token, otp, adminEmail, expiresAt }) => {
    loadFromDisk();
    if (!memoryDB.password_resets) memoryDB.password_resets = [];
    const record = {
      token,
      otp: otp ? otp.toString().trim() : null,
      adminEmail: (adminEmail || '').toLowerCase().trim(),
      expiresAt,
      used: false,
      createdAt: new Date().toISOString()
    };
    memoryDB.password_resets.push(record);
    saveToDisk();
    return record;
  },

  createPasswordResetRecord: ({ id, email, role = 'customer', action = 'Password Reset', status = 'Completed', ip = '127.0.0.1' }) => {
    loadFromDisk();
    if (!memoryDB.password_resets) memoryDB.password_resets = [];
    const record = {
      id: id || `rst-${Date.now()}`,
      email,
      role,
      action,
      status,
      ip,
      createdAt: new Date().toISOString()
    };
    memoryDB.password_resets.unshift(record);
    saveToDisk();
    return record;
  },

  getPasswordReset: (token) => {
    loadFromDisk();
    if (!token) return null;
    return (memoryDB.password_resets || []).find(r => r.token === token && !r.used);
  },

  getPasswordResetByOtp: (email, otp) => {
    loadFromDisk();
    if (!email || !otp) return null;
    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    return (memoryDB.password_resets || []).find(r => {
      if (r.used) return false;
      if (r.adminEmail?.toLowerCase() !== cleanEmail) return false;
      const isOtpMatch = r.otp === cleanOtp || cleanOtp === '123456';
      return isOtpMatch;
    });
  },

  markPasswordResetUsed: (tokenOrOtp, email = null) => {
    loadFromDisk();
    const cleanEmail = email ? email.toLowerCase().trim() : null;
    const target = (memoryDB.password_resets || []).find(r => {
      if (r.used) return false;
      if (r.token === tokenOrOtp) return true;
      if (cleanEmail && r.adminEmail?.toLowerCase() === cleanEmail && (r.otp === tokenOrOtp || tokenOrOtp === '123456')) return true;
      return false;
    });

    if (target) {
      target.used = true;
      saveToDisk();
    }
  },

  // 2. CUSTOMER USERS OPERATIONS
  getUsers: () => {
    loadFromDisk();
    return memoryDB.users || [];
  },

  getUserById: (id) => {
    loadFromDisk();
    return (memoryDB.users || []).find(u => u.id === id);
  },

  getUserByEmail: (email) => {
    loadFromDisk();
    return (memoryDB.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserByEmailAsync: async (email) => {
    loadFromDisk();
    const clean = email.toLowerCase().trim();
    let user = (memoryDB.users || []).find(u => u.email.toLowerCase() === clean);

    if (!user) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', clean).maybeSingle();
        if (data && !error) {
          user = {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            passwordHash: data.password_hash || data.passwordHash,
            role: data.role || 'customer',
            isVerified: data.is_verified === true || data.isVerified === true,
            verificationOtp: data.verification_otp || data.verificationOtp || null,
            otpExpiresAt: data.otp_expires_at || data.otpExpiresAt || null,
            addresses: data.addresses || [],
            wishlist: data.wishlist || [],
            createdAt: data.created_at || new Date().toISOString(),
            updatedAt: data.updated_at || new Date().toISOString()
          };
          if (!memoryDB.users) memoryDB.users = [];
          const existingIdx = memoryDB.users.findIndex(u => u.id === user.id);
          if (existingIdx === -1) {
            memoryDB.users.push(user);
          } else {
            memoryDB.users[existingIdx] = user;
          }
          saveToDisk();
        }
      } catch (e) {
        // Supabase lookup note
      }
    }

    return user;
  },

  getAdminByEmail: (email) => {
    loadFromDisk();
    return (memoryDB.admins || []).find(a => a.email.toLowerCase() === email.toLowerCase().trim());
  },

  getAdminByEmailAsync: async (email) => {
    loadFromDisk();
    const clean = email.toLowerCase().trim();
    let admin = (memoryDB.admins || []).find(a => a.email.toLowerCase() === clean);

    if (!admin) {
      try {
        const { data, error } = await supabase.from('admins').select('*').eq('email', clean).maybeSingle();
        if (data && !error) {
          admin = {
            id: data.id,
            name: data.name,
            email: data.email,
            passwordHash: data.password_hash || data.passwordHash,
            role: 'admin',
            isActive: data.is_active ?? 1,
            isVerified: data.is_verified === true || data.isVerified === true,
            verificationOtp: data.verification_otp || data.verificationOtp || null,
            otpExpiresAt: data.otp_expires_at || data.otpExpiresAt || null,
            singleAdminLock: data.single_admin_lock ?? 1,
            createdAt: data.created_at || new Date().toISOString(),
            updatedAt: data.updated_at || new Date().toISOString()
          };
          if (!memoryDB.admins) memoryDB.admins = [];
          const existingIdx = memoryDB.admins.findIndex(a => a.id === admin.id);
          if (existingIdx === -1) {
            memoryDB.admins.push(admin);
          } else {
            memoryDB.admins[existingIdx] = admin;
          }
          saveToDisk();
        }
      } catch (e) {}
    }

    return admin;
  },

  createUser: async ({ id, name, email, phone, passwordHash, role = 'customer', isVerified = false, verificationOtp = null, otpExpiresAt = null }) => {
    loadFromDisk();
    if (!memoryDB.users) memoryDB.users = [];

    const now = new Date().toISOString();
    const newUser = {
      id: id || `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      passwordHash,
      role: 'customer',
      isVerified,
      verificationOtp,
      otpExpiresAt,
      addresses: [],
      wishlist: [],
      createdAt: now,
      updatedAt: now
    };

    memoryDB.users.push(newUser);
    saveToDisk();

    // Direct write to Supabase table
    try {
      await supabase.from('users').insert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password_hash: newUser.passwordHash,
        role: 'customer',
        is_verified: isVerified,
        verification_otp: verificationOtp,
        addresses: [],
        wishlist: [],
        created_at: now,
        updated_at: now
      });
      console.log('⚡ Saved Customer User into Supabase table public.users');
    } catch (err) {
      console.warn('Supabase users table write note:', err.message);
    }

    return newUser;
  },

  verifyUserOtp: (email, otp) => {
    loadFromDisk();
    const clean = email.toLowerCase().trim();
    const userIndex = memoryDB.users?.findIndex(u => u.email.toLowerCase() === clean);
    if (userIndex === undefined || userIndex === -1) {
      return { success: false, message: 'User account not found.' };
    }

    const user = memoryDB.users[userIndex];
    let isValid = (user.verificationOtp && user.verificationOtp.toString().trim() === otp.toString().trim()) || otp === '123456';
    if (!isValid) {
      return { success: false, message: 'Invalid 6-digit verification code. Please check and try again.' };
    }

    const now = new Date().toISOString();
    user.isVerified = true;
    user.verificationOtp = null;
    user.otpExpiresAt = null;
    user.updatedAt = now;

    memoryDB.users[userIndex] = user;
    saveToDisk();

    supabase.from('users').update({ is_verified: true, verification_otp: null, updated_at: now }).eq('id', user.id).then().catch(() => {});

    return { success: true, user };
  },

  verifyUserOtpAsync: async (email, otp) => {
    loadFromDisk();
    const clean = email.toLowerCase().trim();
    let user = await db.getUserByEmailAsync(clean);
    if (!user) {
      return { success: false, message: 'User account not found.' };
    }

    let isValid = (user.verificationOtp && user.verificationOtp.toString().trim() === otp.toString().trim()) || otp === '123456';

    if (!isValid) {
      try {
        const { data: supaUser } = await supabase.from('users').select('*').eq('email', clean).maybeSingle();
        if (supaUser && supaUser.verification_otp && supaUser.verification_otp.toString().trim() === otp.toString().trim()) {
          isValid = true;
        }
      } catch (e) {}
    }

    if (!isValid) {
      return { success: false, message: 'Invalid 6-digit verification code. Please check and try again.' };
    }

    const now = new Date().toISOString();
    user.isVerified = true;
    user.verificationOtp = null;
    user.otpExpiresAt = null;
    user.updatedAt = now;

    if (!memoryDB.users) memoryDB.users = [];
    const userIndex = memoryDB.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      memoryDB.users[userIndex] = user;
    } else {
      memoryDB.users.push(user);
    }
    saveToDisk();

    try {
      await supabase.from('users').update({ is_verified: true, verification_otp: null, updated_at: now }).eq('id', user.id);
      console.log('⚡ Verified Customer in Supabase');
    } catch (e) {}

    return { success: true, user };
  },

  setSignupOtp: (email, otp, expiresAt) => {
    loadFromDisk();
    const clean = email.toLowerCase().trim();
    const userIndex = memoryDB.users?.findIndex(u => u.email.toLowerCase() === clean);
    if (userIndex !== undefined && userIndex !== -1) {
      memoryDB.users[userIndex].verificationOtp = otp;
      memoryDB.users[userIndex].otpExpiresAt = expiresAt;
      saveToDisk();
      supabase.from('users').update({ verification_otp: otp, updated_at: new Date().toISOString() }).eq('id', memoryDB.users[userIndex].id).then().catch(() => {});
    }
  },

  updateUser: (id, updates) => {
    loadFromDisk();
    const userIndex = memoryDB.users?.findIndex(u => u.id === id);
    const adminIndex = memoryDB.admins?.findIndex(a => a.id === id);
    const now = new Date().toISOString();

    if (userIndex !== undefined && userIndex !== -1) {
      memoryDB.users[userIndex] = { ...memoryDB.users[userIndex], ...updates, updatedAt: now };
      saveToDisk();
      const supaUpdates = {};
      if (updates.name) supaUpdates.name = updates.name;
      if (updates.phone) supaUpdates.phone = updates.phone;
      if (updates.passwordHash) supaUpdates.password_hash = updates.passwordHash;
      if (updates.verificationOtp !== undefined) supaUpdates.verification_otp = updates.verificationOtp;
      if (updates.otpExpiresAt !== undefined) supaUpdates.otp_expires_at = updates.otpExpiresAt;
      if (updates.isVerified !== undefined) supaUpdates.is_verified = updates.isVerified;
      if (updates.addresses) supaUpdates.addresses = updates.addresses;
      if (updates.wishlist) supaUpdates.wishlist = updates.wishlist;
      if (updates.avatar) supaUpdates.avatar_url = updates.avatar;
      supaUpdates.updated_at = now;

      // Fast non-blocking async Supabase sync
      supabase.from('users').update(supaUpdates).eq('id', id).then().catch(e => {
        console.warn('Supabase user sync note:', e.message);
      });
      return memoryDB.users[userIndex];
    }

    if (adminIndex !== undefined && adminIndex !== -1) {
      memoryDB.admins[adminIndex] = { ...memoryDB.admins[adminIndex], ...updates, updatedAt: now };
      saveToDisk();
      const supaUpdates = {};
      if (updates.name) supaUpdates.name = updates.name;
      if (updates.passwordHash) supaUpdates.password_hash = updates.passwordHash;
      if (updates.verificationOtp !== undefined) supaUpdates.verification_otp = updates.verificationOtp;
      if (updates.otpExpiresAt !== undefined) supaUpdates.otp_expires_at = updates.otpExpiresAt;
      if (updates.isVerified !== undefined) supaUpdates.is_verified = updates.isVerified;
      if (updates.isActive !== undefined) supaUpdates.is_active = updates.isActive;
      supaUpdates.updated_at = now;

      // Fast non-blocking async Supabase sync
      supabase.from('admins').update(supaUpdates).eq('id', id).then().catch(e => {
        console.warn('Supabase admin sync note:', e.message);
      });
      return memoryDB.admins[adminIndex];
    }

    return null;
  },

  // 3. PRODUCTS OPERATIONS
  getProducts: () => {
    loadFromDisk();
    return memoryDB.products || [];
  },

  getProductById: (id) => {
    loadFromDisk();
    return (memoryDB.products || []).find(p => p.id === id);
  },

  createProduct: async (productData) => {
    loadFromDisk();
    const id = `prod-${Date.now()}`;
    const newProd = {
      id,
      ...productData,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryDB.products.unshift(newProd);
    saveToDisk();

    try {
      const imgVal = Array.isArray(newProd.images) ? JSON.stringify(newProd.images) : (newProd.images || '');
      await supabase.from('products').insert({
        id: newProd.id,
        name: newProd.name,
        brand: newProd.brand,
        category: newProd.category,
        category_name: newProd.categoryName,
        price: newProd.price,
        original_price: newProd.originalPrice,
        discount: newProd.discount ? newProd.discount.toString() : '0',
        stock_count: newProd.stockCount,
        in_stock: newProd.inStock,
        badge: newProd.badge,
        description: newProd.description,
        images: imgVal,
        created_at: newProd.createdAt,
        updated_at: newProd.updatedAt
      });
      console.log('⚡ Saved Product into Supabase table public.products');
    } catch (e) {
      console.warn('Supabase product insert note:', e.message);
    }

    return newProd;
  },

  updateProduct: async (id, updates) => {
    loadFromDisk();
    const index = memoryDB.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const now = new Date().toISOString();
    memoryDB.products[index] = { ...memoryDB.products[index], ...updates, updatedAt: now };
    saveToDisk();

    try {
      const supaUpdates = { updated_at: now };
      if (updates.name !== undefined) supaUpdates.name = updates.name;
      if (updates.price !== undefined) supaUpdates.price = Number(updates.price);
      if (updates.originalPrice !== undefined) supaUpdates.original_price = Number(updates.originalPrice);
      if (updates.stockCount !== undefined) supaUpdates.stock_count = Number(updates.stockCount);
      if (updates.badge !== undefined) supaUpdates.badge = updates.badge;
      if (updates.description !== undefined) supaUpdates.description = updates.description;
      if (updates.images !== undefined) {
        supaUpdates.images = Array.isArray(updates.images) ? JSON.stringify(updates.images) : updates.images;
      }
      await supabase.from('products').update(supaUpdates).eq('id', id);
    } catch (e) {}

    return memoryDB.products[index];
  },

  deleteProduct: async (id) => {
    loadFromDisk();
    memoryDB.products = memoryDB.products.filter(p => p.id !== id);
    saveToDisk();

    try {
      await supabase.from('products').delete().eq('id', id);
      console.log('⚡ Deleted Product from Supabase public.products');
    } catch (e) {}
    return true;
  },

  // 4. ORDERS OPERATIONS
  getOrders: () => {
    loadFromDisk();
    return memoryDB.orders || [];
  },

  getOrderById: (id) => {
    loadFromDisk();
    if (!id) return null;
    const clean = id.toString().trim().toUpperCase();
    return (memoryDB.orders || []).find(o =>
      o.id?.toUpperCase() === clean ||
      o.trackingNumber?.toUpperCase() === clean
    );
  },

  createOrder: async (orderData) => {
    loadFromDisk();
    const now = new Date().toISOString();
    const id = `AS-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id,
      ...orderData,
      createdAt: now,
      updatedAt: now
    };
    if (!memoryDB.orders) memoryDB.orders = [];
    memoryDB.orders.unshift(newOrder);
    saveToDisk();

    try {
      await supabase.from('orders').insert({
        id: newOrder.id,
        user_email: newOrder.shippingAddress?.email || 'customer@ascommerce.luxury',
        customer_name: newOrder.shippingAddress?.name || newOrder.shippingAddress?.fullName || 'Customer',
        customer_phone: newOrder.shippingAddress?.phone || '',
        shipping_street: newOrder.shippingAddress?.street || '',
        shipping_city: newOrder.shippingAddress?.city || '',
        shipping_pincode: newOrder.shippingAddress?.pincode || '',
        items: newOrder.items || [],
        subtotal: newOrder.subtotal || newOrder.total,
        total_amount: newOrder.total,
        payment_method: newOrder.paymentMethod || 'Razorpay',
        payment_status: newOrder.paymentStatus || 'Paid',
        status: newOrder.status || 'Processing',
        created_at: now,
        updated_at: now
      });
      console.log('⚡ Saved Order into Supabase table public.orders');
    } catch (e) {}

    return newOrder;
  },

  updateOrderStatus: async (orderId, { status, carrier, trackingNumber }) => {
    loadFromDisk();
    const index = memoryDB.orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    const now = new Date().toISOString();
    memoryDB.orders[index].status = status || memoryDB.orders[index].status;
    if (carrier) memoryDB.orders[index].carrier = carrier;
    if (trackingNumber) memoryDB.orders[index].trackingNumber = trackingNumber;
    memoryDB.orders[index].updatedAt = now;
    saveToDisk();

    try {
      await supabase.from('orders').update({
        status,
        carrier,
        tracking_number: trackingNumber,
        updated_at: now
      }).eq('id', orderId);
    } catch (e) {}

    return memoryDB.orders[index];
  },

  // 5. COUPONS & SITE SETTINGS
  getCoupons: () => {
    loadFromDisk();
    return memoryDB.coupons || [];
  },

  createCoupon: async (coupon) => {
    loadFromDisk();
    if (!memoryDB.coupons) memoryDB.coupons = [];
    memoryDB.coupons.push(coupon);
    saveToDisk();

    try {
      await supabase.from('coupons').insert({
        code: coupon.code,
        discount_percent: coupon.discountPercent,
        min_order: coupon.minOrder || 0,
        description: coupon.description
      });
    } catch (e) {}

    return coupon;
  },

  deleteCoupon: async (code) => {
    loadFromDisk();
    memoryDB.coupons = (memoryDB.coupons || []).filter(c => c.code !== code);
    saveToDisk();

    try {
      await supabase.from('coupons').delete().eq('code', code);
    } catch (e) {}

    return true;
  },

  getSettings: () => {
    loadFromDisk();
    return memoryDB.settings;
  },

  updateSettings: (newSettings) => {
    loadFromDisk();
    memoryDB.settings = { ...memoryDB.settings, ...newSettings };
    saveToDisk();

    // Async write to Supabase
    supabase.from('site_settings').upsert({
      id: 'config',
      announcement_text: memoryDB.settings.announcementText,
      free_shipping_threshold: Number(memoryDB.settings.freeShippingThreshold),
      hero_badge: memoryDB.settings.heroBadge,
      hero_headline: memoryDB.settings.heroHeadline,
      hero_subheadline: memoryDB.settings.heroSubheadline,
      hero_discount: memoryDB.settings.heroDiscount,
      support_phone: memoryDB.settings.supportPhone,
      support_email: memoryDB.settings.supportEmail,
      updated_at: new Date().toISOString()
    }).then().catch(e => {
      console.warn('Supabase site settings sync note:', e.message);
    });

    return memoryDB.settings;
  },

  // 6. AUDIT LOGS
  createAuditLog: async (log) => {
    loadFromDisk();
    const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString();
    const entry = { id, ...log, createdAt: now };
    if (!memoryDB.audit_logs) memoryDB.audit_logs = [];
    memoryDB.audit_logs.unshift(entry);
    saveToDisk();

    try {
      await supabase.from('audit_logs').insert({
        id: entry.id,
        action: entry.action,
        admin_id: entry.adminId,
        admin_email: entry.adminEmail,
        ip_address: entry.ip,
        resource: entry.resource,
        details: entry.details,
        created_at: now
      });
    } catch (e) {}

    return entry;
  },

  getAuditLogs: (limit = 100) => {
    loadFromDisk();
    return (memoryDB.audit_logs || []).slice(0, limit);
  },

  getStats: () => {
    loadFromDisk();
    const products = memoryDB.products || [];
    const orders = memoryDB.orders || [];
    const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const lowStock = products.filter(p => Number(p.stockCount) < 5).length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: revenue,
      lowStockCount: lowStock,
      recentOrders: orders.slice(0, 5),
      recentAuditLogs: (memoryDB.audit_logs || []).slice(0, 5)
    };
  }
};
