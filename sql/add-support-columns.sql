-- Run this once in Supabase SQL Editor before deploying the admin dashboard.
--
-- The Flutter app created the `conversations` table first (migration
-- 20260429000002_create_messaging_tables.sql) without the columns the admin
-- dashboard needs.  This script adds them safely (IF NOT EXISTS).

-- unread_admin: how many buyer messages the admin hasn't read yet
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS unread_admin integer NOT NULL DEFAULT 0;

-- last_message_time: alias kept for legacy compatibility; Flutter already uses
-- last_message_at, so the admin API now sorts on that column instead.
-- Only add this if you want both columns; it is NOT required for the admin
-- dashboard to work after the code fixes in this PR.
-- ALTER TABLE public.conversations
--   ADD COLUMN IF NOT EXISTS last_message_time timestamptz;

-- Admin RLS policy: allow the admin user to read and update ALL conversations
-- (needed so the support page can see every buyer's thread).
-- Replace <YOUR_ADMIN_USER_ID> with the UUID of your admin account, OR keep
-- the user_roles approach if that table is already set up.
DROP POLICY IF EXISTS "Admins manage conversations" ON public.conversations;
CREATE POLICY "Admins manage conversations"
ON public.conversations FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Same for messages
DROP POLICY IF EXISTS "Admins manage messages" ON public.messages;
CREATE POLICY "Admins manage messages"
ON public.messages FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
