-- Run this once in your Supabase SQL editor:
-- Dashboard → SQL Editor → New query → paste → Run
--
-- This adds a DELETE (and full CRUD) policy on the product table
-- that permits only users who have role = 'admin' in the user_roles table.
-- Without this, Supabase RLS silently blocks the delete (no error, 0 rows affected).

-- Allow admins to DELETE products
create policy "Admins can delete products"
on public.product
for delete
to authenticated
using (
  exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

-- Allow admins to INSERT products (add this if not already present)
create policy "Admins can insert products"
on public.product
for insert
to authenticated
with check (
  exists (
    select 1 from public.user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
  )
);

-- Allow admins to UPDATE products (add this if not already present)
create policy "Admins can update products"
on public.product
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
