-- ========================================================
-- PhoneLytics Supabase Database Schema
-- Run this script in your Supabase project's SQL Editor:
-- https://supabase.com/dashboard/project/igpkeqbbaluqhjleennx/sql
-- ========================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    storage TEXT,
    ram TEXT,
    color TEXT,
    colors JSONB DEFAULT '[]'::jsonb,
    sku TEXT,
    imei TEXT,
    purchase_price NUMERIC NOT NULL DEFAULT 0,
    selling_price NUMERIC NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock_threshold INTEGER DEFAULT 5,
    tag TEXT DEFAULT 'New Arrival',
    tag_type TEXT DEFAULT 'new-arrival',
    status TEXT DEFAULT 'in_stock',
    image TEXT,
    description TEXT,
    views TEXT DEFAULT '1.2k',
    rating NUMERIC DEFAULT 4.8,
    units_sold INTEGER DEFAULT 0,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Transactions Table (Sales)
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    brand TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    purchase_price NUMERIC NOT NULL DEFAULT 0,
    selling_price NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    revenue NUMERIC NOT NULL DEFAULT 0,
    cost NUMERIC NOT NULL DEFAULT 0,
    profit NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'Card',
    customer_name TEXT DEFAULT 'Walk-in Customer',
    customer_phone TEXT,
    imei TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Operating Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Daily Reports Table
CREATE TABLE IF NOT EXISTS daily_reports (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    phones_sold INTEGER DEFAULT 0,
    revenue NUMERIC DEFAULT 0,
    purchase_cost NUMERIC DEFAULT 0,
    discounts NUMERIC DEFAULT 0,
    gross_profit NUMERIC DEFAULT 0,
    operating_expenses NUMERIC DEFAULT 0,
    net_profit NUMERIC DEFAULT 0,
    remaining_inventory_count INTEGER DEFAULT 0,
    remaining_stock_value NUMERIC DEFAULT 0,
    best_selling_phone TEXT,
    best_performing_brand TEXT,
    payment_breakdown JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) & Public read/write policy for quick start
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;

-- Allow public read & write with anon key
DROP POLICY IF EXISTS "Allow all for products" ON products;
CREATE POLICY "Allow all for products" ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for transactions" ON transactions;
CREATE POLICY "Allow all for transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for expenses" ON expenses;
CREATE POLICY "Allow all for expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for daily_reports" ON daily_reports;
CREATE POLICY "Allow all for daily_reports" ON daily_reports FOR ALL USING (true) WITH CHECK (true);

