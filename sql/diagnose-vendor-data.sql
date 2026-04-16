-- Paste this entire block into Supabase Dashboard → SQL Editor → Run
-- It shows exactly what data exists and what approval_status values are stored.

-- 1. All seller_profiles rows and their approval_status
select
  id,
  user_id,
  store_name,
  full_name,
  approval_status,
  created_at
from public.seller_profiles
order by created_at desc;

-- 2. All profiles rows with role = 'seller' and their status
select
  id,
  email,
  role,
  status,
  created_at
from public.profiles
where role = 'seller'
order by created_at desc;

-- 3. All profiles rows regardless of role (in case role isn't 'seller')
select
  id,
  email,
  role,
  status,
  created_at
from public.profiles
order by created_at desc;

-- 4. RLS policies on seller_profiles and profiles
select
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
from pg_policies
where tablename in ('seller_profiles', 'profiles', 'profile')
order by tablename, policyname;
