-- ============================================================
-- LUXE FOOD — Service Details Migration + Seed
-- Run AFTER seed-cms.sql (services table must exist)
-- ============================================================

-- ── 1. Extend services table ─────────────────────────────────

alter table services
  add column if not exists tagline          text,
  add column if not exists full_description text,
  add column if not exists form_title       text,
  add column if not exists hero_image_url   text,
  add column if not exists gallery_images   jsonb not null default '[]',
  add column if not exists includes         jsonb not null default '[]';


-- ── 2. Seed detail fields ────────────────────────────────────

update services set
  tagline          = 'Professional catering for corporate events, workshops, and conferences.',
  full_description = 'We deliver full-scale catering for professional events of all sizes — from intimate boardroom lunches to large-scale conference days. Our team handles everything: custom menu design, professional setup, and seamless service throughout your event so you can focus on what matters.',
  form_title       = 'Workshops & Events Catering',
  hero_image_url   = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop&q=85',
  gallery_images   = '["https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80"]',
  includes         = '["Custom menu planning to match your brief","Professional on-site setup and service","Dietary accommodations (vegetarian, vegan, halal)","Beverages and refreshments included","Full cleanup after service"]'
where slug = 'workshops-events';

update services set
  tagline          = 'Elegant menus crafted to make your special day unforgettable.',
  full_description = 'Your wedding deserves food as special as the occasion. We create bespoke menus that reflect your tastes and vision — from the cocktail hour to the final course. Our experienced team ensures impeccable service so you can focus entirely on celebrating.',
  form_title       = 'Wedding Receptions',
  hero_image_url   = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&h=1080&fit=crop&q=85',
  gallery_images   = '["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80"]',
  includes         = '["Bespoke menu tasting session","Full multi-course service","Wedding cake coordination","Dedicated service staff","Elegant presentation and table decor"]'
where slug = 'wedding-receptions';

update services set
  tagline          = 'Beautiful spreads for celebrating the bride-to-be in style.',
  full_description = 'From elegant finger food to beautifully styled dessert tables, we create the perfect atmosphere to celebrate the bride-to-be. We handle the food so you can focus on making memories with the people who matter most.',
  form_title       = 'Bridal Showers',
  hero_image_url   = 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&h=1080&fit=crop&q=85',
  gallery_images   = '["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop&q=80"]',
  includes         = '["Curated finger food and canapé selection","Dessert table and sweet treats","Themed presentation options","Drinks and mocktail service","Elegant styling and garnishes"]'
where slug = 'bridal-showers';

update services set
  tagline          = 'Party platters and custom menus for every age.',
  full_description = 'Whether it''s a milestone birthday or a casual gathering, we bring the food that makes the party. Custom menus, party platters, and crowd-pleasing dishes prepared fresh for your celebration.',
  form_title       = 'Birthdays',
  hero_image_url   = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&q=85',
  gallery_images   = '["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80"]',
  includes         = '["Custom party menu design","Shareable platters and individual servings","Cake and dessert coordination","Flexible guest count accommodation","Delivery or on-site service available"]'
where slug = 'birthdays';

update services set
  tagline          = 'Intimate, refined dining for milestone celebrations.',
  full_description = 'Mark your anniversary with a dining experience to remember. Whether at home or at a venue, we design intimate multi-course menus that reflect the elegance of the occasion — because some moments deserve something truly special.',
  form_title       = 'Anniversary Dinner Parties',
  hero_image_url   = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&q=85',
  gallery_images   = '["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80"]',
  includes         = '["Curated multi-course menu","Fine dining presentation","Personalised menu cards","Premium ingredient sourcing","Optional in-home service"]'
where slug = 'anniversary-dinners';

update services set
  tagline          = 'Fun, kid-friendly menus that little ones will love.',
  full_description = 'We create colourful, delicious, and kid-safe menus that little ones will love. From mini sliders to fruit skewers and birthday treats — we make party food that keeps the kids happy and parents stress-free.',
  form_title       = 'Kids Birthday Parties',
  hero_image_url   = 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?w=1920&h=1080&fit=crop&q=85',
  gallery_images   = '["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop&q=80"]',
  includes         = '["Kid-friendly menu options","Fun, colourful food presentation","Allergy-conscious preparation","Party snacks and sweets","Themed cake and dessert coordination"]'
where slug = 'kids-birthday-parties';

update services set
  tagline          = 'Thoughtful, comforting meals during difficult times.',
  full_description = 'We provide compassionate, respectful catering for funeral repasts. Our team understands the sensitivity of these occasions and works quietly behind the scenes to ensure guests are fed and comforted with warm, home-style meals.',
  form_title       = 'Funeral Repast',
  hero_image_url   = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&h=1080&fit=crop&q=85',
  gallery_images   = '["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop&q=80"]',
  includes         = '["Warm, comforting home-style dishes","Respectful and discreet service","Flexible quantity planning","Dietary accommodations","Full setup and cleanup included"]'
where slug = 'funeral-repast';

update services set
  tagline          = 'Hearty, homestyle soups for any gathering.',
  full_description = 'Our signature soup bowls are prepared fresh with premium ingredients and rich, slow-cooked flavours. Perfect for community gatherings, casual events, or a warm addition to any spread.',
  form_title       = 'Soup Bowls',
  hero_image_url   = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1920&h=1080&fit=crop&q=85',
  gallery_images   = '["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80"]',
  includes         = '["Multiple soup varieties available","Fresh bread and accompaniments","Individual bowl or buffet-style service","Hot-holding equipment provided","Customisable portion sizes"]'
where slug = 'soup-bowls';

update services set
  tagline          = 'Beautifully arranged trays to delight your guests.',
  full_description = 'Our surprise trays are curated platters of our best items — thoughtfully arranged and beautifully presented. Perfect for gifting, surprise celebrations, or adding a spectacular centrepiece to any gathering.',
  form_title       = 'Surprise Trays',
  hero_image_url   = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1920&h=1080&fit=crop&q=85',
  gallery_images   = '["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop&q=80","https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&q=80"]',
  includes         = '["Curated selection of premium items","Beautiful tray styling and garnish","Custom wrap and presentation","Delivery available throughout Freetown","Personalised message card option"]'
where slug = 'surprise-trays';
