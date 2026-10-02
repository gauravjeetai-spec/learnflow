create table public.resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  type text not null default 'Course' check (type in ('Course','Book','Video','Article','Project','Workshop','Podcast','Other')),
  provider text not null default 'Independent',
  url text,
  goal text,
  skills text[] not null default '{}',
  status text not null default 'backlog' check (status in ('backlog','planned','in-progress','practice','completed')),
  progress integer not null default 0 check (progress between 0 and 100),
  priority text not null default 'Medium' check (priority in ('Low','Medium','High')),
  due_date date,
  estimated_hours numeric(8,2),
  notes text,
  owner_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index resources_user_id_idx on public.resources using btree (user_id);
create index resources_user_status_idx on public.resources using btree (user_id, status);

alter table public.resources enable row level security;

revoke all on table public.resources from anon;
grant select, insert, update, delete on table public.resources to authenticated;

create policy "Users can view their own resources"
  on public.resources for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own resources"
  on public.resources for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own resources"
  on public.resources for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own resources"
  on public.resources for delete to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.set_resources_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger resources_set_updated_at
before update on public.resources
for each row
execute function public.set_resources_updated_at();
