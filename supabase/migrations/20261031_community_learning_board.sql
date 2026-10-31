-- Community Learning Board: safe shared snapshots, interactions, follows and comments.
create table if not exists public.community_publications (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null unique references public.resources(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null,
  provider text not null default 'Independent',
  url text,
  goal text,
  skills text[] not null default '{}',
  description text,
  owner_name text not null,
  owner_role text not null check (owner_role in ('learner','mentor','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists community_publications_created_idx on public.community_publications(created_at desc);
create index if not exists community_publications_owner_idx on public.community_publications(owner_id);

create table if not exists public.community_interactions (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid not null references public.community_publications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  interaction_type text not null check (interaction_type in ('like','bookmark','follow')),
  created_at timestamptz not null default now(),
  unique(publication_id,user_id,interaction_type)
);
create index if not exists community_interactions_publication_idx on public.community_interactions(publication_id,interaction_type);
create index if not exists community_interactions_user_idx on public.community_interactions(user_id);
create index if not exists community_comments_user_idx on public.community_comments(user_id);


create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid not null references public.community_publications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  author_role text not null check (author_role in ('learner','mentor','admin')),
  content text not null check (char_length(trim(content)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists community_comments_publication_idx on public.community_comments(publication_id,created_at);

alter table public.community_publications enable row level security;
alter table public.community_interactions enable row level security;
alter table public.community_comments enable row level security;
revoke all on public.community_publications,public.community_interactions,public.community_comments from anon;
grant select,insert,update,delete on public.community_publications to authenticated;
grant select,insert,delete on public.community_interactions to authenticated;
grant select,insert,delete on public.community_comments to authenticated;

create schema if not exists private;
revoke all on schema private from public,anon;
grant usage on schema private to authenticated;
create or replace function private.can_follow_community_resources()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = (select auth.uid())
      and p.access_status = 'active'
      and p.role in ('mentor','admin')
  );
$$;
revoke all on function private.can_follow_community_resources() from public,anon;
grant execute on function private.can_follow_community_resources() to authenticated;

create policy "Active users can discover community publications"
on public.community_publications for select to authenticated
using (public.has_active_access());
create policy "Owners can publish their own resources"
on public.community_publications for insert to authenticated
with check (owner_id = (select auth.uid()) and public.has_active_access()
  and owner_role=(select p.role from public.profiles p where p.user_id=(select auth.uid()) and p.access_status='active')
  and exists(select 1 from public.resources r where r.id=community_publications.resource_id and r.user_id=(select auth.uid())));
create policy "Owners can update their own publications"
on public.community_publications for update to authenticated
using (owner_id = (select auth.uid()) and public.has_active_access())
with check (owner_id = (select auth.uid()) and public.has_active_access()
  and owner_role=(select p.role from public.profiles p where p.user_id=(select auth.uid()) and p.access_status='active')
  and exists(select 1 from public.resources r where r.id=community_publications.resource_id and r.user_id=(select auth.uid())));
create policy "Owners can unpublish their own resources"
on public.community_publications for delete to authenticated
using (owner_id = (select auth.uid()) and public.has_active_access());

create policy "Active users can view community interactions"
on public.community_interactions for select to authenticated
using (public.has_active_access() and exists(select 1 from public.community_publications p where p.id=publication_id));
create policy "Active users can interact with shared resources"
on public.community_interactions for insert to authenticated
with check (
  user_id=(select auth.uid()) and public.has_active_access()
  and exists(select 1 from public.community_publications p where p.id=publication_id)
  and (interaction_type <> 'follow' or private.can_follow_community_resources())
);
create policy "Users can remove their own community interactions"
on public.community_interactions for delete to authenticated
using (user_id=(select auth.uid()) and public.has_active_access());

create policy "Active users can read shared-resource comments"
on public.community_comments for select to authenticated
using (public.has_active_access() and exists(select 1 from public.community_publications p where p.id=publication_id));
create policy "Active users can comment on shared resources"
on public.community_comments for insert to authenticated
with check (user_id=(select auth.uid()) and public.has_active_access()
  and author_role=(select p.role from public.profiles p where p.user_id=(select auth.uid()) and p.access_status='active')
  and exists(select 1 from public.community_publications p where p.id=publication_id));
create policy "Users can delete their own community comments"
on public.community_comments for delete to authenticated
using (user_id=(select auth.uid()) and public.has_active_access());


-- Attribution is sourced from the signed-in member's own profile, never from client-supplied labels.
create or replace function private.set_community_actor_metadata()
returns trigger language plpgsql security definer set search_path = ''
as $community_actor$
declare
  v_name text;
  v_role text;
begin
  select coalesce(nullif(p.display_name,''),'LearnFlow member'),p.role
    into v_name,v_role
  from public.profiles p
  where p.user_id=(select auth.uid()) and p.access_status='active';
  if v_role is null then
    raise exception 'An active LearnFlow profile is required';
  end if;
  if tg_table_name='community_publications' then
    new.owner_id := (select auth.uid());
    new.owner_name := v_name;
    new.owner_role := v_role;
    if tg_op='UPDATE' then new.updated_at := now(); end if;
  else
    new.user_id := (select auth.uid());
    new.author_name := v_name;
    new.author_role := v_role;
  end if;
  return new;
end;
$community_actor$;
revoke all on function private.set_community_actor_metadata() from public,anon;
grant execute on function private.set_community_actor_metadata() to authenticated;
create trigger community_publications_set_actor
before insert or update on public.community_publications
for each row execute function private.set_community_actor_metadata();
create trigger community_comments_set_actor
before insert on public.community_comments
for each row execute function private.set_community_actor_metadata();

-- Keep the published learning details current while leaving the separate community description untouched.
create or replace function public.sync_community_publication_from_resource()
returns trigger language plpgsql set search_path = ''
as $$
begin
  update public.community_publications
  set title=new.title,type=new.type,provider=new.provider,url=new.url,goal=new.goal,skills=new.skills,updated_at=now()
  where resource_id=new.id and owner_id=new.user_id;
  return new;
end;
$$;
drop trigger if exists resources_sync_community_publication on public.resources;
create trigger resources_sync_community_publication
after update of title,type,provider,url,goal,skills on public.resources
for each row execute function public.sync_community_publication_from_resource();

