-- LearnFlow workspace data
-- Goals, skills, sprints and learning activity are user-owned and protected by RLS.

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'Medium' check (priority in ('High','Medium','Low')),
  status text not null default 'active' check (status in ('active','completed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sprints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  start_date date,
  end_date date,
  status text not null default 'active' check (status in ('planned','active','completed','archived')),
  retrospective text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete set null,
  activity_type text not null default 'Study',
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  notes text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.resources add column if not exists sprint_id uuid references public.sprints(id) on delete set null;

create index if not exists goals_user_id_idx on public.goals(user_id);
create index if not exists skills_user_id_idx on public.skills(user_id);
create index if not exists sprints_user_id_idx on public.sprints(user_id);
create index if not exists activities_user_id_occurred_idx on public.activities(user_id, occurred_at desc);
create index if not exists resources_sprint_id_idx on public.resources(sprint_id);

alter table public.goals enable row level security;
drop policy if exists "Users can view their own goals" on public.goals;
drop policy if exists "Users can create their own goals" on public.goals;
drop policy if exists "Users can update their own goals" on public.goals;
drop policy if exists "Users can delete their own goals" on public.goals;
alter table public.skills enable row level security;
drop policy if exists "Users can view their own skills" on public.skills;
drop policy if exists "Users can create their own skills" on public.skills;
drop policy if exists "Users can update their own skills" on public.skills;
drop policy if exists "Users can delete their own skills" on public.skills;
alter table public.sprints enable row level security;
drop policy if exists "Users can view their own sprints" on public.sprints;
drop policy if exists "Users can create their own sprints" on public.sprints;
drop policy if exists "Users can update their own sprints" on public.sprints;
drop policy if exists "Users can delete their own sprints" on public.sprints;
alter table public.activities enable row level security;
drop policy if exists "Users can view their own activities" on public.activities;
drop policy if exists "Users can create their own activities" on public.activities;
drop policy if exists "Users can update their own activities" on public.activities;
drop policy if exists "Users can delete their own activities" on public.activities;

create policy "Users can view their own goals" on public.goals for select using ((user_id=auth.uid() and has_active_access()) or is_admin());
create policy "Users can create their own goals" on public.goals for insert with check ((user_id=auth.uid() and has_active_access()) or is_admin());
create policy "Users can update their own goals" on public.goals for update using ((user_id=auth.uid() and has_active_access()) or is_admin()) with check ((user_id=auth.uid() and has_active_access()) or is_admin());
create policy "Users can delete their own goals" on public.goals for delete using ((user_id=auth.uid() and has_active_access()) or is_admin());

create policy "Users can view their own skills" on public.skills for select using ((user_id=auth.uid() and has_active_access()) or is_admin());
create policy "Users can create their own skills" on public.skills for insert with check ((user_id=auth.uid() and has_active_access()) or is_admin());
create policy "Users can update their own skills" on public.skills for update using ((user_id=auth.uid() and has_active_access()) or is_admin()) with check ((user_id=auth.uid() and has_active_access()) or is_admin());
create policy "Users can delete their own skills" on public.skills for delete using ((user_id=auth.uid() and has_active_access()) or is_admin());

create policy "Users can view their own sprints" on public.sprints for select using ((user_id=auth.uid() and has_active_access()) or is_admin());
create policy "Users can create their own sprints" on public.sprints for insert with check ((user_id=auth.uid() and has_active_access()) or is_admin());
create policy "Users can update their own sprints" on public.sprints for update using ((user_id=auth.uid() and has_active_access()) or is_admin()) with check ((user_id=auth.uid() and has_active_access()) or is_admin());
create policy "Users can delete their own sprints" on public.sprints for delete using ((user_id=auth.uid() and has_active_access()) or is_admin());

create policy "Users can view their own activities" on public.activities for select using ((user_id=auth.uid() and has_active_access()) or is_admin());
create policy "Users can create their own activities" on public.activities for insert with check (
  ((user_id=auth.uid() and has_active_access()) or is_admin())
  and (is_admin() or resource_id is null or exists (select 1 from public.resources r where r.id=activities.resource_id and r.user_id=auth.uid()))
);
create policy "Users can update their own activities" on public.activities for update using ((user_id=auth.uid() and has_active_access()) or is_admin()) with check (
  ((user_id=auth.uid() and has_active_access()) or is_admin())
  and (is_admin() or resource_id is null or exists (select 1 from public.resources r where r.id=activities.resource_id and r.user_id=auth.uid()))
);
create policy "Users can delete their own activities" on public.activities for delete using ((user_id=auth.uid() and has_active_access()) or is_admin());

grant select, insert, update, delete on table public.goals, public.skills, public.sprints, public.activities to authenticated;

create or replace function public.set_workspace_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists goals_set_updated_at on public.goals;
create trigger goals_set_updated_at before update on public.goals for each row execute function public.set_workspace_updated_at();

drop trigger if exists skills_set_updated_at on public.skills;
create trigger skills_set_updated_at before update on public.skills for each row execute function public.set_workspace_updated_at();

drop trigger if exists sprints_set_updated_at on public.sprints;
create trigger sprints_set_updated_at before update on public.sprints for each row execute function public.set_workspace_updated_at();
