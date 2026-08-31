-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR AS COMMERCE (E-COMMERCE PLATFORM)
-- Run this in your Supabase Dashboard -> SQL Editor -> Click 'Run'
-- ==============================================================================

-- 1. USERS TABLE (Customer accounts)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT,
  role TEXT DEFAULT 'customer',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_otp TEXT,
  otp_expires_at BIGINT,
  addresses JSONB DEFAULT '[]'::jsonb,
  wishlist JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADMINS TABLE (Store Master Admin)
CREATE TABLE IF NOT EXISTS public.admins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_otp TEXT,
  single_admin_lock INTEGER DEFAULT 1,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE (Catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT DEFAULT 'A_S FOODY',
  category TEXT NOT NULL,
  category_name TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount TEXT DEFAULT '0',
  stock_count INTEGER DEFAULT 15,
  in_stock BOOLEAN DEFAULT TRUE,
  badge TEXT,
  description TEXT,
  images TEXT,
  is_featured BOOLEAN DEFAULT TRUE,
  is_trending BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE (Live Customer Orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  shipping_street TEXT,
  shipping_city TEXT,
  shipping_pincode TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC,
  total_amount NUMERIC,
  payment_method TEXT DEFAULT 'Razorpay',
  payment_status TEXT DEFAULT 'Paid',
  status TEXT DEFAULT 'Processing',
  carrier TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SITE SETTINGS TABLE (Store banner, announcements, support info)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'config',
  announcement_text TEXT,
  free_shipping_threshold NUMERIC DEFAULT 999,
  hero_badge TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  hero_discount TEXT,
  support_phone TEXT,
  support_email TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) POLICIES FOR SECURE & SEAMLESS SYNC
-- ==============================================================================

-- Disable RLS on these tables or allow full access for authenticated and anon clients:
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

-- Grant permissions to public roles
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.admins TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.site_settings TO anon, authenticated, service_role;
