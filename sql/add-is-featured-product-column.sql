-- Adds is_featured to the product table so admins can hand-pick which
-- products appear in the "Today's Picks" section of the buyer home page.
-- Safe to re-run.

alter table public.product
  add column if not exists is_featured boolean not null default false;

create index if not exists product_featured_idx
  on public.product (is_featured)
  where is_featured = true;
