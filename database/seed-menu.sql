-- ============================================================
-- LUXE FOODS — Menu Seed + Contact Info Update
-- Run in Supabase SQL Editor
-- ============================================================

-- ── 1. Categories ───────────────────────────────────────────

insert into categories (name, slug, description, sort_order, is_active) values
  ('Mains',  'mains',  'Our signature main dishes',           1, true),
  ('Snacks', 'snacks', 'Quick bites and handheld favourites', 2, true),
  ('Drinks', 'drinks', 'Refreshing homemade beverages',       3, true)
on conflict (slug) do update set
  name        = excluded.name,
  description = excluded.description,
  sort_order  = excluded.sort_order,
  is_active   = excluded.is_active;


-- ── 2. Menu items ────────────────────────────────────────────

do $$
declare
  mains_id  uuid;
  snacks_id uuid;
  drinks_id uuid;
begin
  select id into mains_id  from categories where slug = 'mains';
  select id into snacks_id from categories where slug = 'snacks';
  select id into drinks_id from categories where slug = 'drinks';

  -- ── MAINS (10 items) ──

  insert into menu_items
    (category_id, name, description, price, image_url, is_available, is_popular, sort_order)
  values

    -- From the menu
    (mains_id, 'Shawarma',
     'Tender, spiced beef or chicken wrapped in soft flatbread with fresh veggies and creamy garlic sauce.',
     65.00,
     'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=600&h=450&fit=crop&q=80',
     true, true, 1),

    (mains_id, 'Beef Burger',
     'Juicy, seasoned beef patty stacked in a soft bun with fresh veggies and creamy garlic sauce.',
     65.00,
     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop&q=80',
     true, true, 2),

    (mains_id, 'Archeke',
     'Tangy, steamed cassava "garrie" (West African classic) paired with spicy fried chicken or fish, fresh veggies, and peppery sauce — pure coastal vibes.',
     65.00,
     'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=450&fit=crop&q=80',
     true, true, 3),

    (mains_id, 'Fried Rice',
     'Flavour-packed vegetable fried rice stir-fried to perfection, topped with golden, juicy chicken cutlets for that irresistible crunch.',
     65.00,
     'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=450&fit=crop&q=80',
     true, true, 4),

    (mains_id, 'Potato Salad',
     'Creamy, herby potato salad loaded with flavour, served alongside succulent grilled or fried chicken or fish for a refreshing yet hearty combo.',
     65.00,
     'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=600&h=450&fit=crop&q=80',
     true, false, 5),

    (mains_id, 'Fried Chicken',
     'Extra-crispy, golden fried chicken with that perfect seasoned crunch — finger-licking goodness that''s impossible to resist.',
     30.00,
     'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=600&h=450&fit=crop&q=80',
     true, true, 6),

    -- Extras to fill the menu
    (mains_id, 'Jollof Rice',
     'Sierra Leone''s beloved one-pot classic — long-grain rice slow-cooked in a rich, smoky tomato base with aromatic spices. Served with your choice of chicken or fish.',
     65.00,
     'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=450&fit=crop&q=80',
     true, true, 7),

    (mains_id, 'Cassava Leaf Stew',
     'A true Sierra Leonean classic — tender cassava leaves slow-cooked with palm oil, smoked fish, and spices. Served over steamed rice.',
     65.00,
     'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=450&fit=crop&q=80',
     true, true, 8),

    (mains_id, 'Pepper Soup',
     'Bold, aromatic West African soup simmered with fresh herbs, scotch bonnet, and your choice of chicken or fish. Hot, light, and deeply satisfying.',
     50.00,
     'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=450&fit=crop&q=80',
     true, false, 9),

    (mains_id, 'Grilled Fish',
     'Whole fish marinated in a blend of local spices and grilled to smoky perfection. Served with fried plantain and a side of pepper sauce.',
     65.00,
     'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=450&fit=crop&q=80',
     true, false, 10)

  on conflict do nothing;

  -- ── SNACKS (4 items) ──

  insert into menu_items
    (category_id, name, description, price, image_url, is_available, is_popular, sort_order)
  values

    (snacks_id, 'Meat Pie',
     'Flaky, golden pastry stuffed with spiced minced meat filling — a classic handheld delight that''s warm, satisfying, and full of flavour.',
     30.00,
     'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=450&fit=crop&q=80',
     true, false, 1),

    (snacks_id, 'Puff Puff',
     'Light, airy West African doughnuts — golden-fried until perfectly crisp on the outside and fluffy inside. A crowd favourite at any hour.',
     15.00,
     'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=450&fit=crop&q=80',
     true, false, 2),

    (snacks_id, 'Sausage Roll',
     'Buttery, flaky pastry wrapped around a perfectly seasoned sausage filling — baked golden and best eaten fresh and hot.',
     20.00,
     'https://images.unsplash.com/photo-1509722747041-616f39b57169?w=600&h=450&fit=crop&q=80',
     true, false, 3),

    (snacks_id, 'Egg Roll',
     'A soft, lightly sweetened dough wrapped around a whole boiled egg and fried to a golden finish — a beloved West African street snack.',
     20.00,
     'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=600&h=450&fit=crop&q=80',
     true, false, 4)

  on conflict do nothing;

  -- ── DRINKS (1 item) ──

  insert into menu_items
    (category_id, name, description, price, image_url, is_available, is_popular, sort_order)
  values
    (drinks_id, 'Ginger / Bissap',
     'Refreshing homemade ginger beer with a spicy kick, or chilled ruby-red bissap (hibiscus/sorrel drink) — tart, sweet, and super thirst-quenching West African style.',
     12.00,
     'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=450&fit=crop&q=80',
     true, false, 1)
  on conflict do nothing;

end $$;


-- ── 3. Contact info ──────────────────────────────────────────

insert into content_blocks (key, label, type, "group", value) values
  ('contact_phone',      'Phone Number',           'text',     'Contact', '76 825 325'),
  ('contact_phone_intl', 'WhatsApp / Intl Number', 'text',     'Contact', '23276825325'),
  ('contact_email',      'Email Address',          'text',     'Contact', 'luxefoodsltd@gmail.com'),
  ('contact_address',    'Address',                'textarea', 'Contact', '14 Medta Drive, Aberdeen Ferry Rd., Freetown, Sierra Leone')
on conflict (key) do update set
  value = excluded.value;
