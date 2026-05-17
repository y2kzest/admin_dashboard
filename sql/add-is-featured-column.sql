-- Adds an `is_featured` flag to seller_profiles so admins can pick which
-- stores show up in the "Featured Stores" carousel on the buyer home page.
-- Safe to re-run.

alter table public.seller_profiles
  add column if not exists is_featured boolean not null default false;

-- Speed up the home-page query that filters by is_featured + approval_status.
create index if not exists seller_profiles_featured_idx
  on public.seller_profiles (is_featured, approval_status)
  where is_featured = true;
