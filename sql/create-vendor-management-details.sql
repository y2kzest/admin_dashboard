-- Run this in the Supabase SQL Editor to support the vendor management UI.
-- It adds a supplemental admin-managed table for stall numbers, contacts,
-- business types, operating hours, product counts, and permit counts.

create extension if not exists pgcrypto;

create table if not exists public.vendor_management_details (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stall_no text,
  business_type text,
  contact_number text,
  operating_hours text,
  product_listed integer not null default 0 check (product_listed >= 0),
  permit_count integer not null default 0 check (permit_count >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists vendor_management_details_user_id_idx
  on public.vendor_management_details (user_id);

create or replace function public.set_vendor_management_details_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists vendor_management_details_set_updated_at
on public.vendor_management_details;

create trigger vendor_management_details_set_updated_at
before update on public.vendor_management_details
for each row
execute function public.set_vendor_management_details_updated_at();

alter table public.vendor_management_details enable row level security;

drop policy if exists "Admins can view vendor management details" on public.vendor_management_details;
create policy "Admins can view vendor management details"
on public.vendor_management_details
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

drop policy if exists "Admins can insert vendor management details" on public.vendor_management_details;
create policy "Admins can insert vendor management details"
on public.vendor_management_details
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

drop policy if exists "Admins can update vendor management details" on public.vendor_management_details;
create policy "Admins can update vendor management details"
on public.vendor_management_details
for update
to authenticated
using (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

drop policy if exists "Admins can delete vendor management details" on public.vendor_management_details;
create policy "Admins can delete vendor management details"
on public.vendor_management_details
for delete
to authenticated
using (
  exists (
    select 1
    from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

insert into public.vendor_management_details (user_id)
select distinct coalesce(sp.user_id, p.id)
from public.profiles p
left join public.seller_profiles sp on sp.user_id = p.id
where p.role = 'seller'
  and coalesce(sp.user_id, p.id) is not null
on conflict (user_id) do nothing;