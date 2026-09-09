-- Paddltir schema (Supabase Auth + Postgres + Storage)
-- Apply in Supabase SQL editor or via supabase CLI.

-- Extensions
create extension if not exists "pgcrypto";

-- ─── paddlers ───────────────────────────────────────────────────────────────
create table if not exists public.paddlers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default '',
  weight double precision not null default 0,
  erg_score double precision not null default 0,
  preferred_side text not null default 'Left',
  gender text not null default 'Male',
  seat_preference text not null default 'Stroke',
  role text not null default 'Paddler',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists paddlers_user_id_created_at_idx
  on public.paddlers (user_id, created_at desc);

alter table public.paddlers enable row level security;

create policy "paddlers_select_own"
  on public.paddlers for select
  using (auth.uid() = user_id);

create policy "paddlers_insert_own"
  on public.paddlers for insert
  with check (auth.uid() = user_id);

create policy "paddlers_update_own"
  on public.paddlers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "paddlers_delete_own"
  on public.paddlers for delete
  using (auth.uid() = user_id);

-- ─── crewlists ──────────────────────────────────────────────────────────────
create table if not exists public.crewlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default '',
  age_division text not null default '',
  size text not null default 'standard',
  category text not null default 'open',
  member_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crewlists_user_id_created_at_idx
  on public.crewlists (user_id, created_at desc);

alter table public.crewlists enable row level security;

create policy "crewlists_select_own"
  on public.crewlists for select
  using (auth.uid() = user_id);

create policy "crewlists_insert_own"
  on public.crewlists for insert
  with check (auth.uid() = user_id);

create policy "crewlists_update_own"
  on public.crewlists for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "crewlists_delete_own"
  on public.crewlists for delete
  using (auth.uid() = user_id);

-- ─── configs ────────────────────────────────────────────────────────────────
create table if not exists public.configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  crewlist_id uuid references public.crewlists (id) on delete set null,
  name text not null default '',
  age_division text not null default '',
  size text not null default 'standard',
  category text not null default 'open',
  reserved_heat1_ids text[] not null default '{}',
  reserved_heat2_ids text[] not null default '{}',
  reserved_final_ids text[] not null default '{}',
  lineup jsonb,
  lineup_heat1 jsonb,
  lineup_heat2 jsonb,
  lineup_final jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists configs_user_id_created_at_idx
  on public.configs (user_id, created_at desc);

create index if not exists configs_user_id_crewlist_id_idx
  on public.configs (user_id, crewlist_id);

alter table public.configs enable row level security;

create policy "configs_select_own"
  on public.configs for select
  using (auth.uid() = user_id);

create policy "configs_insert_own"
  on public.configs for insert
  with check (auth.uid() = user_id);

create policy "configs_update_own"
  on public.configs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "configs_delete_own"
  on public.configs for delete
  using (auth.uid() = user_id);

-- ─── realtime ───────────────────────────────────────────────────────────────
-- Enable replication for live UI updates (Supabase Dashboard → Database → Replication
-- can also toggle these). Safe to run if already added.
do $$
begin
  begin
    alter publication supabase_realtime add table public.paddlers;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.crewlists;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.configs;
  exception when duplicate_object then null;
  end;
end $$;

-- ─── storage: avatars ───────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_insert_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_update_own_folder"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_delete_own_folder"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
