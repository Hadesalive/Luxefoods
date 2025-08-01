-- Sample data for Amsolan West Kitchen Menu Management

-- Insert categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Pizza', 'pizza', 'Delicious pizzas with various toppings', 1),
('Mini Pizza', 'mini-pizza', 'Perfect bite-sized pizzas for sharing', 2),
('Kebbeh', 'kebbeh', 'Traditional Lebanese kebbeh', 3),
('Fataya', 'fataya', 'Crispy and delicious fataya', 4);

-- Insert menu items
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
  'Cheese Pizza',
  'Classic cheese pizza with premium mozzarella',
  150.00,
  'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&h=600&fit=crop',
  false
FROM categories c WHERE c.slug = 'pizza';

INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) 
SELECT 
  c.id,
  'Vegetable Pizza',
  'Fresh vegetables with herbs and cheese',
  180.00,
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=600&fit=crop',
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

-- Insert size variations for pizza items
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

-- Beef Pizza sizes
INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_default)
SELECT 
  mi.id,
  'S',
  130.00,
  false
FROM menu_items mi 
JOIN categories c ON mi.category_id = c.id 
WHERE c.slug = 'pizza' AND mi.name LIKE '%Beef%';

INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_default)
SELECT 
  mi.id,
  'M',
  230.00,
  true
FROM menu_items mi 
JOIN categories c ON mi.category_id = c.id 
WHERE c.slug = 'pizza' AND mi.name LIKE '%Beef%';

INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_default)
SELECT 
  mi.id,
  'L',
  260.00,
  false
FROM menu_items mi 
JOIN categories c ON mi.category_id = c.id 
WHERE c.slug = 'pizza' AND mi.name LIKE '%Beef%'; 