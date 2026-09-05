-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR AS FOODY / AS COMMERCE PLATFORM
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
  payment_status TEXT DEFAULT 'Pending',
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

-- 6. SECURITY AUDIT LOGS TABLE (Real-Time Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  admin_id TEXT,
  admin_email TEXT,
  ip_address TEXT,
  resource TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COUPONS & PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  discount_percent NUMERIC NOT NULL,
  min_order NUMERIC DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR FAST REAL-TIME LOOKUPS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) POLICIES FOR SECURE & SEAMLESS SYNC
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Grant Full Access to Anon, Authenticated and Service Role
GRANT ALL ON TABLE public.users, public.admins, public.products, public.orders, public.site_settings, public.audit_logs, public.coupons TO anon, authenticated, service_role;

-- Drop and recreate permissive RLS policies for instant synchronization
DROP POLICY IF EXISTS "Public can manage products" ON public.products;
CREATE POLICY "Public can manage products" ON public.products FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage site settings" ON public.site_settings;
CREATE POLICY "Public can manage site settings" ON public.site_settings FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage orders" ON public.orders;
CREATE POLICY "Public can manage orders" ON public.orders FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage users" ON public.users;
CREATE POLICY "Public can manage users" ON public.users FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage admins" ON public.admins;
CREATE POLICY "Public can manage admins" ON public.admins FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage coupons" ON public.coupons;
CREATE POLICY "Public can manage coupons" ON public.coupons FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage audit logs" ON public.audit_logs;
CREATE POLICY "Public can manage audit logs" ON public.audit_logs FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

ALTER TABLE public.orders ALTER COLUMN payment_status SET DEFAULT 'Pending';

-- Enable Realtime publication for all tables
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'users', 'admins', 'products', 'orders', 'site_settings', 'audit_logs', 'coupons'
  ] LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_rel publication_relation
      JOIN pg_class table_record ON table_record.oid = publication_relation.prrelid
      JOIN pg_namespace schema_record ON schema_record.oid = table_record.relnamespace
      JOIN pg_publication publication ON publication.oid = publication_relation.prpubid
      WHERE publication.pubname = 'supabase_realtime'
        AND schema_record.nspname = 'public'
        AND table_record.relname = table_name
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', table_name);
    END IF;
  END LOOP;
END
$$;
