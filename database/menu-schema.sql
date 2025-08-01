-- Amsolan West Kitchen - Menu Management Database Schema
-- Optimized for Supabase with proper relationships and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Item Sizes Table (for items with multiple sizes like pizza)
CREATE TABLE menu_item_sizes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  size_name VARCHAR(20) NOT NULL, -- 'S', 'M', 'L', '6 pieces', '12 pieces'
  price DECIMAL(10,2) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort ON categories(sort_order);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_sort ON menu_items(sort_order);
CREATE INDEX idx_menu_item_sizes_item ON menu_item_sizes(menu_item_id);

-- Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_sizes ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and menu items
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Menu items are viewable by everyone" ON menu_items
  FOR SELECT USING (is_available = true);

CREATE POLICY "Menu item sizes are viewable by everyone" ON menu_item_sizes
  FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Categories are editable by admin only" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Menu items are editable by admin only" ON menu_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Menu item sizes are editable by admin only" ON menu_item_sizes
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 