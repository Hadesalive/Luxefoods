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

-- Table for custom options (like grilled vs fried chicken)
CREATE TABLE menu_item_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  option_name VARCHAR(100) NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
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
ALTER TABLE menu_item_options ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and menu items
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Menu items are viewable by everyone" ON menu_items
  FOR SELECT USING (is_available = true);

CREATE POLICY "Menu item sizes are viewable by everyone" ON menu_item_sizes
  FOR SELECT USING (true);

CREATE POLICY "Menu item options are viewable by everyone" ON menu_item_options
  FOR SELECT USING (is_available = true);

-- Admin-only write access (any authenticated user can perform admin operations)
CREATE POLICY "Categories are editable by authenticated users" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Menu items are editable by authenticated users" ON menu_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Menu item sizes are editable by authenticated users" ON menu_item_sizes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Menu item options are editable by authenticated users" ON menu_item_options
  FOR ALL USING (auth.role() = 'authenticated');

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

-- Sample data for testing
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Pizza', 'pizza', 'Delicious pizzas with various toppings', 1),
('Mini Pizza', 'mini-pizza', 'Perfect bite-sized pizzas for sharing', 2),
('Kebbeh', 'kebbeh', 'Traditional Lebanese kebbeh', 3),
('Fataya', 'fataya', 'Crispy and delicious fataya', 4);

-- Sample menu items
INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) 
SELECT 
  c.id,
  'Chicken Pizza',
  'Delicious chicken pizza with fresh vegetables and cheese',
  200.00,
  'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&h=600&fit=crop',
  true
FROM categories c WHERE c.slug = 'pizza';

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) 
SELECT 
  c.id,
  'Beef Pizza',
  'Savory beef pizza with premium toppings',
  230.00,
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop',
  true
FROM categories c WHERE c.slug = 'pizza';

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) 
SELECT 
  c.id,
  'Mini Pizza (6 pieces)',
  'Perfect bite-sized pizzas for sharing',
  120.00,
  'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&h=600&fit=crop',
  false
FROM categories c WHERE c.slug = 'mini-pizza';

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) 
SELECT 
  c.id,
  'Mini Pizza (12 pieces)',
  'Perfect for sharing - 12 mini pizzas with assorted toppings',
  220.00,
  'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&h=600&fit=crop',
  true
FROM categories c WHERE c.slug = 'mini-pizza';

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) 
SELECT 
  c.id,
  'Kebbeh (6 pieces)',
  'Traditional Lebanese kebbeh, crispy and delicious',
  150.00,
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop',
  true
FROM categories c WHERE c.slug = 'kebbeh';

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) 
SELECT 
  c.id,
  'Kebbeh (12 pieces)',
  'Perfect for family gatherings',
  250.00,
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop',
  true
FROM categories c WHERE c.slug = 'kebbeh';

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) 
SELECT 
  c.id,
  'Fataya (6 pieces)',
  'Spinach-filled pastries, fresh and flavorful',
  120.00,
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=600&fit=crop',
  false
FROM categories c WHERE c.slug = 'fataya';

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) 
SELECT 
  c.id,
  'Fataya (12 pieces)',
  'Great for sharing with friends',
  220.00,
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=600&fit=crop',
  true
FROM categories c WHERE c.slug = 'fataya';

-- Sample size variations for pizza items
INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_default)
SELECT 
  mi.id,
  'S',
  120.00,
  false
FROM menu_items mi 
JOIN categories c ON mi.category_id = c.id 
WHERE c.slug = 'pizza' AND mi.name LIKE '%Chicken%';

INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_default)
SELECT 
  mi.id,
  'M',
  200.00,
  true
FROM menu_items mi 
JOIN categories c ON mi.category_id = c.id 
WHERE c.slug = 'pizza' AND mi.name LIKE '%Chicken%';

INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_default)
SELECT 
  mi.id,
  'L',
  250.00,
  false
FROM menu_items mi 
JOIN categories c ON mi.category_id = c.id 
WHERE c.slug = 'pizza' AND mi.name LIKE '%Chicken%';
