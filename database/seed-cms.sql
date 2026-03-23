-- ============================================================
-- LUXE FOOD — CMS Seed
-- Run this in Supabase SQL Editor after creating the tables
-- from the migration below.
-- ============================================================

-- ── 1. Create tables (idempotent) ───────────────────────────

create table if not exists content_blocks (
  key     text primary key,
  label   text not null,
  value   text,
  type    text not null default 'text', -- text | textarea | url | color
  "group" text not null default 'General'
);

create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique not null,
  description text,
  image_url   text,
  icon        text,
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists gallery_items (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  image_url   text not null,
  category    text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);


-- ── 2. Content blocks ───────────────────────────────────────

insert into content_blocks (key, label, type, "group", value) values

  -- Branding
  ('brand_name',              'Business Name',              'text',     'Branding',  'LUXE FOOD'),
  ('brand_tagline',           'Tagline',                    'text',     'Branding',  'The Bites Of Delight'),
  ('brand_location',          'Location Tag',               'text',     'Branding',  'Freetown · Sierra Leone'),

  -- Hero
  ('hero_headline',           'Hero Headline',              'text',     'Hero',      'LUXE FOOD'),
  ('hero_tagline_mobile',     'Hero Tagline (Mobile)',      'textarea', 'Hero',      'Homestyle Sierra Leone cooking — made fresh, delivered fast.'),
  ('hero_tagline_desktop',    'Hero Tagline (Desktop)',     'textarea', 'Hero',      'Homestyle Sierra Leone cooking — jollof rice, grilled chicken, and more. Made fresh, delivered fast.'),
  ('hero_cta_primary',        'Hero CTA — Primary Button',  'text',     'Hero',      'Order Now'),
  ('hero_cta_secondary',      'Hero CTA — Secondary Button','text',     'Hero',      'Our Services'),

  -- About
  ('about_heading',           'About Page Heading',         'text',     'About',     'About LUXE FOOD'),
  ('about_subheading',        'About Page Subheading',      'text',     'About',     'Your trusted source for quality meals and catering in Freetown'),
  ('about_mission',           'Our Mission',                'textarea', 'About',     'To provide our community with quality meals, local dishes, and international cuisine, delivered with care to your doorstep. We believe everyone deserves exceptional food made with the finest ingredients.'),
  ('about_story',             'Our Story',                  'textarea', 'About',     'LUXE FOOD started with a simple dream: to bring the best of local and international cuisine to the people of Freetown. We''ve become a beloved part of the community, serving quality meals, delicious local dishes, and offering professional catering services for events of all sizes. Our commitment to quality and customer satisfaction has made us a trusted name in food delivery and catering across Freetown, Sierra Leone.'),

  -- Contact
  ('contact_phone',           'Phone Number',               'text',     'Contact',   '074 762 243'),
  ('contact_phone_intl',      'WhatsApp / Intl Number',     'text',     'Contact',   '23274762243'),
  ('contact_email',           'Email Address',              'text',     'Contact',   'info@luxefood.com'),
  ('contact_address',         'Address',                    'textarea', 'Contact',   'Freetown, Sierra Leone'),

  -- Hours
  ('hours_weekday_label',     'Weekday Label',              'text',     'Hours',     'Monday – Friday'),
  ('hours_weekday_times',     'Weekday Hours',              'text',     'Hours',     '10:00 AM – 10:00 PM'),
  ('hours_weekend_label',     'Weekend Label',              'text',     'Hours',     'Saturday – Sunday'),
  ('hours_weekend_times',     'Weekend Hours',              'text',     'Hours',     '11:00 AM – 11:00 PM'),

  -- Delivery Section
  ('delivery_heading',        'Delivery Section Heading',   'text',     'Delivery',  'We bring it straight to you.'),
  ('delivery_description',    'Delivery Section Body',      'textarea', 'Delivery',  'Homestyle cooking delivered across Freetown. Call us or order online — we''ll handle the rest.'),
  ('delivery_cta_heading',    'Delivery CTA Heading',       'text',     'Delivery',  'Order Online for Faster Service'),
  ('delivery_cta_body',       'Delivery CTA Body',          'textarea', 'Delivery',  'Skip the wait and get exclusive deals when you order through our website!'),

  -- Services Section
  ('services_heading',        'Services Section Heading',   'text',     'Services',  'Catering for every occasion.'),
  ('services_description',    'Services Section Body',      'textarea', 'Services',  'From weddings to birthdays, we bring exceptional food and service to your most important moments.'),
  ('services_page_heading',   'Services Page Heading',      'text',     'Services',  'Our Services'),
  ('services_page_body',      'Services Page Description',  'textarea', 'Services',  'From intimate dinners to grand celebrations, we bring exceptional food and impeccable service to every occasion.'),

  -- Footer
  ('footer_description',      'Footer Brand Description',   'textarea', 'Footer',    'Bringing you delicious meals with quality ingredients and exceptional taste.'),
  ('footer_copyright',        'Footer Copyright',           'text',     'Footer',    '© 2025 LUXE FOOD. All rights reserved.'),

  -- Social
  ('social_facebook',         'Facebook URL',               'url',      'Social',    'https://www.facebook.com/luxefood'),
  ('social_instagram',        'Instagram URL',              'url',      'Social',    'https://www.instagram.com/luxefood'),

  -- SEO
  ('seo_site_name',           'Site Name (SEO)',             'text',     'SEO',       'LUXE FOOD'),
  ('seo_description',         'Meta Description',            'textarea', 'SEO',       'LUXE FOOD — The Bites Of Delight. Homestyle Sierra Leone cooking, made fresh and delivered fast across Freetown.')

on conflict (key) do update set
  value = excluded.value,
  label = excluded.label,
  type  = excluded.type,
  "group" = excluded."group";


-- ── 3. Services ─────────────────────────────────────────────

insert into services (title, slug, description, icon, image_url, is_active, sort_order) values

  ('Workshops & Events',    'workshops-events',       'Professional catering for corporate events, workshops, and conferences.',  'Buildings',    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=1000&fit=crop&q=80', true, 1),
  ('Wedding Receptions',    'wedding-receptions',     'Elegant menus crafted to make your special day unforgettable.',           'Heart',        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&fit=crop&q=80', true, 2),
  ('Bridal Showers',        'bridal-showers',         'Beautiful spreads for celebrating the bride-to-be in style.',            'Gift',         'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=1000&fit=crop&q=80', true, 3),
  ('Birthdays',             'birthdays',              'Party platters and custom menus for every age.',                         'Cake',         null,                                                                                    true, 4),
  ('Anniversary Dinners',   'anniversary-dinners',    'Intimate, refined dining for milestone celebrations.',                   'Trophy',       null,                                                                                    true, 5),
  ('Kids Birthday Parties', 'kids-birthday-parties',  'Fun, kid-friendly menus that little ones will love.',                   'Smiley',       null,                                                                                    true, 6),
  ('Funeral Repast',        'funeral-repast',         'Thoughtful, comforting meals during difficult times.',                   'HandWaving',   null,                                                                                    true, 7),
  ('Soup Bowls',            'soup-bowls',             'Hearty, homestyle soups for any gathering.',                            'Fire',         null,                                                                                    true, 8),
  ('Surprise Trays',        'surprise-trays',         'Beautifully arranged trays to delight your guests.',                    'SquaresFour',  null,                                                                                    true, 9)

on conflict (slug) do update set
  title       = excluded.title,
  description = excluded.description,
  icon        = excluded.icon,
  image_url   = excluded.image_url,
  sort_order  = excluded.sort_order;
