-- Multi-select athlete roles: migrate single `role` text → `roles` text[].

alter table public.paddlers
  add column if not exists roles text[];

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'paddlers'
      and column_name = 'role'
  ) then
    update public.paddlers
    set roles = array[coalesce(nullif(trim(role), ''), 'Paddler')]
    where roles is null;
  else
    update public.paddlers
    set roles = array['Paddler']::text[]
    where roles is null;
  end if;
end $$;

alter table public.paddlers
  alter column roles set default array['Paddler']::text[];

alter table public.paddlers
  alter column roles set not null;

alter table public.paddlers drop column if exists role;
