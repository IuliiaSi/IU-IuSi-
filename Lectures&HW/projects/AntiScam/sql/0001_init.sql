-- AntiScam: единая начальная схема для Supabase (Postgres + RLS).
-- Применение: SQL Editor в Supabase или CLI (`supabase db` / `psql`), если настроено.
-- Повторный запуск: безопасен (IF NOT EXISTS, drop policy if exists).

-- UUID для public.cars.id
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- entries: история запросов пользователя (см. backend EntriesService)
-- ---------------------------------------------------------------------------
create table if not exists public.entries (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  user_input text not null,
  ai_response text not null,
  created_at timestamptz not null default now()
);

create index if not exists entries_user_id_created_at_idx
  on public.entries (user_id, created_at desc);

alter table public.entries enable row level security;

drop policy if exists "entries_insert_own" on public.entries;
create policy "entries_insert_own"
  on public.entries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "entries_select_own" on public.entries;
create policy "entries_select_own"
  on public.entries
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- cars: профиль авто (см. backend CarsService)
-- ---------------------------------------------------------------------------
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  brand text not null,
  model text not null,
  year int not null,
  mileage int not null,
  created_at timestamptz not null default now()
);

create index if not exists cars_user_id_idx on public.cars (user_id);

alter table public.cars enable row level security;

drop policy if exists "cars_insert_own" on public.cars;
create policy "cars_insert_own"
  on public.cars
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "cars_select_own" on public.cars;
create policy "cars_select_own"
  on public.cars
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- user_access: paid / role (источник правды для AccessService; клиент не пишет)
-- ---------------------------------------------------------------------------
create table if not exists public.user_access (
  user_id uuid primary key references auth.users (id) on delete cascade,
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
