create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'learner' check (role in ('admin','mentor','learner')),
  access_status text not null default 'pending' check (access_status in ('pending','active','suspended','rejected')),
  approved_at timestamptz,
  approved_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_access_status_idx on public.profiles(access_status);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin' and access_status = 'active'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "Users can view their own profile"
on public.profiles for select to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "Admins can insert profiles"
on public.profiles for insert to authenticated
with check (public.is_admin());

create policy "Admins can update profiles"
on public.profiles for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, role, access_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    'learner',
    'pending'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.set_profiles_updated_at()
returns trigger language plpgsql set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_profiles_updated_at();
