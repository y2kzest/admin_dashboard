-- Adds a `delivery_fee` column to seller_profiles so each vendor can set
-- their own delivery price. The buyer's checkout reads this and adds it
-- to the order total before placing the order.
-- Safe to re-run.

alter table public.seller_profiles
  add column if not exists delivery_fee numeric(10, 2) not null default 0;

-- Optional: ensure the value is never negative.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'seller_profiles_delivery_fee_nonneg'
  ) then
    alter table public.seller_profiles
      add constraint seller_profiles_delivery_fee_nonneg
      check (delivery_fee >= 0);
  end if;
end$$;

-- Snapshot the per-order delivery fee so the amount the buyer was
-- charged at checkout is preserved on the order even if the seller
-- later changes their fee.
alter table public.orders
  add column if not exists delivery_fee numeric(10, 2) not null default 0;
