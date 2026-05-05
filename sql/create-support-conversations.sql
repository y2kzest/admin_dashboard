-- ============================================================
-- Support Conversations & Messages
-- Run in Supabase SQL Editor
-- Project: mnnnmdlvjvwyxhadeinc
-- ============================================================

-- ── 1. CONVERSATIONS TABLE ───────────────────────────────────
-- Stores buyer ↔ admin help threads.
-- seller_id is reused to hold the admin's user_id (matches Flutter app convention).
create table if not exists public.conversations (
  id            uuid primary key default gen_random_uuid(),
  buyer_id      uuid references auth.users(id) on delete cascade,
  seller_id     uuid references auth.users(id) on delete set null,  -- admin user_id
  last_message  text,
  last_message_time timestamptz default timezone('utc', now()),
  unread_admin  integer not null default 0,   -- messages buyer sent not yet read by admin
  created_at    timestamptz not null default timezone('utc', now())
);

create index if not exists conversations_buyer_id_idx   on public.conversations (buyer_id);
create index if not exists conversations_seller_id_idx  on public.conversations (seller_id);
create index if not exists conversations_last_msg_idx   on public.conversations (last_message_time desc);

alter table public.conversations enable row level security;

-- Admin can read/write all conversations
drop policy if exists "Admins manage conversations" on public.conversations;
create policy "Admins manage conversations"
on public.conversations for all to authenticated
using (
  exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
)
with check (
  exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
);

-- Buyers can only see their own conversation
drop policy if exists "Buyers view own conversation" on public.conversations;
create policy "Buyers view own conversation"
on public.conversations for select to authenticated
using (buyer_id = auth.uid());

-- Buyers can insert their own conversation (Help button creates it)
drop policy if exists "Buyers create conversation" on public.conversations;
create policy "Buyers create conversation"
on public.conversations for insert to authenticated
with check (buyer_id = auth.uid());

-- Buyers can update their own conversation (to update last_message etc.)
drop policy if exists "Buyers update own conversation" on public.conversations;
create policy "Buyers update own conversation"
on public.conversations for update to authenticated
using (buyer_id = auth.uid())
with check (buyer_id = auth.uid());


-- ── 2. MESSAGES TABLE ────────────────────────────────────────
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid references auth.users(id) on delete set null,
  content         text not null,
  is_read         boolean not null default false,
  created_at      timestamptz not null default timezone('utc', now())
);

create index if not exists messages_conversation_id_idx on public.messages (conversation_id);
create index if not exists messages_sender_id_idx       on public.messages (sender_id);
create index if not exists messages_created_at_idx      on public.messages (created_at);

alter table public.messages enable row level security;

-- Admin can read/write all messages
drop policy if exists "Admins manage messages" on public.messages;
create policy "Admins manage messages"
on public.messages for all to authenticated
using (
  exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
)
with check (
  exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
);

-- Buyers can see messages in their own conversation
drop policy if exists "Buyers view own messages" on public.messages;
create policy "Buyers view own messages"
on public.messages for select to authenticated
using (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.buyer_id = auth.uid()
  )
);

-- Buyers can send messages in their own conversation
drop policy if exists "Buyers send messages" on public.messages;
create policy "Buyers send messages"
on public.messages for insert to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.buyer_id = auth.uid()
  )
);

-- ── 3. ENABLE REALTIME ───────────────────────────────────────
-- Run these in Supabase Dashboard → Database → Replication
-- or via SQL:
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;
