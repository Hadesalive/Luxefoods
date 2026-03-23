-- ============================================================
-- LUXE FOOD — Seed two auth users (admin + cashier)
-- Run in Supabase SQL Editor
-- Change the passwords before running!
-- ============================================================

do $$
declare
  admin_id   uuid := gen_random_uuid();
  cashier_id uuid := gen_random_uuid();
begin

  -- ── ADMIN USER ──────────────────────────────────────────
  insert into auth.users (
    instance_id, id, aud, role,
    email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    admin_id, 'authenticated', 'authenticated',
    'admin@luxefood.com',
    crypt('ChangeMe123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin"}',
    '{}',
    now(), now(), '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), admin_id, 'admin@luxefood.com',
    json_build_object('sub', admin_id::text, 'email', 'admin@luxefood.com'),
    'email', now(), now(), now()
  );

  -- ── CASHIER USER ─────────────────────────────────────────
  insert into auth.users (
    instance_id, id, aud, role,
    email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    cashier_id, 'authenticated', 'authenticated',
    'cashier@luxefood.com',
    crypt('ChangeMe456!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"cashier"}',
    '{}',
    now(), now(), '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), cashier_id, 'cashier@luxefood.com',
    json_build_object('sub', cashier_id::text, 'email', 'cashier@luxefood.com'),
    'email', now(), now(), now()
  );

end $$;

-- ── Verify ───────────────────────────────────────────────────
select email, raw_app_meta_data->>'role' as role, email_confirmed_at
from auth.users
where email in ('admin@luxefood.com', 'cashier@luxefood.com');
