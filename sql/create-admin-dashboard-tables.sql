-- ============================================================
-- Admin Dashboard SQL Migrations
-- Run each block in your Supabase SQL Editor
-- Project: mnnnmdlvjvwyxhadeinc
-- ============================================================

-- ── 1. ORDERS TABLE ─────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references auth.users(id) on delete set null,
  seller_id uuid references auth.users(id) on delete set null,
  total_amount numeric(12, 2) not null default 0 check (total_amount >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'ready_for_pickup', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_buyer_id_idx on public.orders (buyer_id);
create index if not exists orders_seller_id_idx on public.orders (seller_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Auto-update updated_at
create or replace function public.set_orders_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = timezone('utc', now()); return new; end;
$$;
drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_orders_updated_at();

alter table public.orders enable row level security;

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders"
on public.orders for all to authenticated
using (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'))
with check (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'));

drop policy if exists "Buyers can view their orders" on public.orders;
create policy "Buyers can view their orders"
on public.orders for select to authenticated
using (buyer_id = auth.uid());

drop policy if exists "Sellers can view their orders" on public.orders;
create policy "Sellers can view their orders"
on public.orders for select to authenticated
using (seller_id = auth.uid());

drop policy if exists "Buyers can create orders" on public.orders;
create policy "Buyers can create orders"
on public.orders for insert to authenticated
with check (buyer_id = auth.uid());


-- ── 2. ORDER ITEMS TABLE ────────────────────────────────────
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid,
  product_name text,
  quantity integer not null default 1 check (quantity > 0),
  price numeric(12, 2) not null default 0 check (price >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

drop policy if exists "Admins can manage order items" on public.order_items;
create policy "Admins can manage order items"
on public.order_items for all to authenticated
using (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'))
with check (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'));

drop policy if exists "Users can view their own order items" on public.order_items;
create policy "Users can view their own order items"
on public.order_items for select to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and (orders.buyer_id = auth.uid() or orders.seller_id = auth.uid())
  )
);


-- ── 3. PICKUP SCHEDULES TABLE ────────────────────────────────
create table if not exists public.pickup_schedules (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  buyer_id uuid references auth.users(id) on delete set null,
  seller_id uuid references auth.users(id) on delete set null,
  pickup_date date not null,
  time_slot text,                         -- e.g. '8:00 AM - 10:00 AM'
  location text,                          -- stall number / address
  status text not null default 'scheduled'
    check (status in ('scheduled', 'completed', 'missed', 'cancelled')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists pickup_schedules_order_id_idx on public.pickup_schedules (order_id);
create index if not exists pickup_schedules_pickup_date_idx on public.pickup_schedules (pickup_date);
create index if not exists pickup_schedules_status_idx on public.pickup_schedules (status);

create or replace function public.set_pickup_schedules_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = timezone('utc', now()); return new; end;
$$;
drop trigger if exists pickup_schedules_set_updated_at on public.pickup_schedules;
create trigger pickup_schedules_set_updated_at
  before update on public.pickup_schedules
  for each row execute function public.set_pickup_schedules_updated_at();

alter table public.pickup_schedules enable row level security;

drop policy if exists "Admins can manage pickup schedules" on public.pickup_schedules;
create policy "Admins can manage pickup schedules"
on public.pickup_schedules for all to authenticated
using (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'))
with check (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'));

drop policy if exists "Users can view their pickup schedules" on public.pickup_schedules;
create policy "Users can view their pickup schedules"
on public.pickup_schedules for select to authenticated
using (buyer_id = auth.uid() or seller_id = auth.uid());


-- ── 4. NOTIFICATIONS TABLE ───────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,     -- who sent / who receives
  title text,
  message text,
  type text not null default 'system'
    check (type in ('system', 'order', 'complaint', 'message', 'info')),
  is_read boolean not null default false,
  reference_id uuid,          -- e.g. order_id or user_id being referenced
  reference_type text,        -- 'order' | 'user' | 'product'
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_is_read_idx on public.notifications (is_read);
create index if not exists notifications_type_idx on public.notifications (type);
create index if not exists notifications_created_at_idx on public.notifications (created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "Admins can manage all notifications" on public.notifications;
create policy "Admins can manage all notifications"
on public.notifications for all to authenticated
using (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'))
with check (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'));

drop policy if exists "Users can view their own notifications" on public.notifications;
create policy "Users can view their own notifications"
on public.notifications for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can update their own notifications" on public.notifications;
create policy "Users can update their own notifications"
on public.notifications for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can create notifications" on public.notifications;
create policy "Users can create notifications"
on public.notifications for insert to authenticated
with check (user_id = auth.uid());


-- ── 5. CATEGORIES TABLE ─────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  icon text,
  color text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists categories_name_idx on public.categories (name);

create or replace function public.set_categories_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = timezone('utc', now()); return new; end;
$$;
drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_categories_updated_at();

alter table public.categories enable row level security;

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories for all to authenticated
using (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'))
with check (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'));

drop policy if exists "Anyone authenticated can view categories" on public.categories;
create policy "Anyone authenticated can view categories"
on public.categories for select to authenticated using (true);

-- Seed default categories
insert into public.categories (name, description, icon, color) values
  ('Meat', 'Fresh and processed meat products', '🥩', '#ef4444'),
  ('Fish & Seafood', 'Fresh fish and seafood', '🐟', '#3b82f6'),
  ('Vegetables', 'Fresh and organic vegetables', '🥦', '#22c55e'),
  ('Fruits', 'Fresh seasonal fruits', '🍎', '#f97316'),
  ('Dairy & Eggs', 'Milk, cheese, eggs and dairy products', '🥛', '#a855f7'),
  ('Grains & Rice', 'Rice, wheat, corn and grains', '🌾', '#eab308'),
  ('Spices & Condiments', 'Herbs, spices and sauces', '🌶️', '#f43f5e'),
  ('Beverages', 'Drinks and juices', '🧃', '#06b6d4')
on conflict (name) do nothing;


-- ── 6. TAGS TABLE ───────────────────────────────────────────
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.tags enable row level security;

drop policy if exists "Admins can manage tags" on public.tags;
create policy "Admins can manage tags"
on public.tags for all to authenticated
using (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'))
with check (exists (select 1 from public.user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'admin'));

drop policy if exists "Anyone authenticated can view tags" on public.tags;
create policy "Anyone authenticated can view tags"
on public.tags for select to authenticated using (true);

-- Seed default tags
insert into public.tags (name) values
  ('Fresh'), ('Organic'), ('Halal'), ('Frozen'), ('Locally Sourced'),
  ('Best Seller'), ('On Sale'), ('Seasonal'), ('Gluten-Free'), ('Vegan')
on conflict (name) do nothing;
