-- Run this once in your Supabase SQL editor:
-- Dashboard → SQL Editor → New query → paste → Run
--
-- Allows admins to read, update seller_profiles and profiles tables.
-- Without these, RLS silently returns 0 rows even when records exist.

-- ── seller_profiles ──────────────────────────────────────────────────────────

drop policy if exists "Admins can view seller profiles" on public.seller_profiles;
create policy "Admins can view seller profiles"
on public.seller_profiles
for select
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

drop policy if exists "Admins can update seller profiles" on public.seller_profiles;
create policy "Admins can update seller profiles"
on public.seller_profiles
for update
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

drop policy if exists "Admins can insert seller profiles" on public.seller_profiles;
create policy "Admins can insert seller profiles"
on public.seller_profiles
for insert
to authenticated
with check (
  exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

-- ── profiles ──────────────────────────────────────────────────────────────────

drop policy if exists "Admins can view profiles" on public.profiles;
create policy "Admins can view profiles"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

-- ── profile (identity table) ──────────────────────────────────────────────────

drop policy if exists "Admins can view profile identity" on public.profile;
create policy "Admins can view profile identity"
on public.profile
for select
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);
