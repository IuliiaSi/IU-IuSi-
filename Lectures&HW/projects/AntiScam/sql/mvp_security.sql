-- MVP security baseline for paid access and role source of truth.

create table if not exists public.user_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  paid boolean not null default false,
  role text not null default 'user' check (role in ('user', 'admin')),
  updated_at timestamptz not null default now()
);

alter table public.user_access enable row level security;

drop policy if exists "user_access_select_own" on public.user_access;
create policy "user_access_select_own"
on public.user_access
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "user_access_insert_own" on public.user_access;
drop policy if exists "user_access_update_own" on public.user_access;
drop policy if exists "user_access_delete_own" on public.user_access;

revoke insert, update, delete on table public.user_access from authenticated;
revoke insert, update, delete on table public.user_access from anon;
