
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('learner','mentor')),
  status text not null default 'pending' check (status in ('pending','sent','accepted','revoked','failed')),
  invited_by uuid not null,
  auth_user_id uuid,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);
alter table public.invitations enable row level security;
revoke all on public.invitations from anon, authenticated;
grant all on public.invitations to service_role;

create table if not exists public.mentor_relationships (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null,
  learner_id uuid not null,
  initiated_by uuid not null,
  status text not null default 'requested' check (status in ('requested','offered','accepted','active','declined','revoked')),
  learner_consent_at timestamptz,
  accepted_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mentor_relationships_distinct_users check (mentor_id <> learner_id),
  constraint mentor_relationships_pair_unique unique (mentor_id, learner_id)
);
create index if not exists mentor_relationships_mentor_status_idx on public.mentor_relationships(mentor_id,status);
create index if not exists mentor_relationships_learner_status_idx on public.mentor_relationships(learner_id,status);
alter table public.mentor_relationships enable row level security;
revoke all on public.mentor_relationships from anon;
grant select on public.mentor_relationships to authenticated;
grant all on public.mentor_relationships to service_role;
create policy "Participants can view their mentor relationships"
on public.mentor_relationships for select to authenticated
using (mentor_id = (select auth.uid()) or learner_id = (select auth.uid()) or (select public.is_admin()));

create table if not exists public.mentor_relationship_permissions (
  relationship_id uuid not null references public.mentor_relationships(id) on delete cascade,
  permission_key text not null check (permission_key in ('resources','goals','skills','sprints','activities','analytics')),
  granted_at timestamptz not null default now(),
  primary key (relationship_id, permission_key)
);
alter table public.mentor_relationship_permissions enable row level security;
revoke all on public.mentor_relationship_permissions from anon;
grant select on public.mentor_relationship_permissions to authenticated;
grant all on public.mentor_relationship_permissions to service_role;
create policy "Participants can view mentor permissions"
on public.mentor_relationship_permissions for select to authenticated
using (exists (
  select 1 from public.mentor_relationships mr
  where mr.id = relationship_id
    and (mr.mentor_id = (select auth.uid()) or mr.learner_id = (select auth.uid()) or (select public.is_admin()))
));

create table if not exists public.mentor_feedback (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references public.mentor_relationships(id) on delete cascade,
  author_id uuid not null,
  body text not null check (length(trim(body)) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index if not exists mentor_feedback_relationship_created_idx on public.mentor_feedback(relationship_id,created_at desc);
alter table public.mentor_feedback enable row level security;
revoke all on public.mentor_feedback from anon;
grant select, insert on public.mentor_feedback to authenticated;
grant all on public.mentor_feedback to service_role;
create policy "Relationship participants can read feedback"
on public.mentor_feedback for select to authenticated
using (exists (
  select 1 from public.mentor_relationships mr
  where mr.id = relationship_id and mr.status = 'active'
    and (mr.mentor_id = (select auth.uid()) or mr.learner_id = (select auth.uid()))
));
create policy "Relationship participants can write feedback"
on public.mentor_feedback for insert to authenticated
with check (
  author_id = (select auth.uid()) and exists (
    select 1 from public.mentor_relationships mr
    where mr.id = relationship_id and mr.status = 'active'
      and (mr.mentor_id = (select auth.uid()) or mr.learner_id = (select auth.uid()))
  )
);

create or replace function private.can_mentor_view(p_learner_id uuid, p_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.mentor_relationships mr
    join public.mentor_relationship_permissions mp on mp.relationship_id = mr.id
    where mr.mentor_id = (select auth.uid())
      and mr.learner_id = p_learner_id
      and mr.status = 'active'
      and mr.learner_consent_at is not null
      and mp.permission_key = p_permission
  );
$$;
revoke all on function private.can_mentor_view(uuid,text) from public, anon;
grant execute on function private.can_mentor_view(uuid,text) to authenticated;

create policy "Consented mentors can view learner resources"
on public.resources for select to authenticated
using (private.can_mentor_view(user_id,'resources'));
create policy "Consented mentors can view learner goals"
on public.goals for select to authenticated
using (private.can_mentor_view(user_id,'goals'));
create policy "Consented mentors can view learner skills"
on public.skills for select to authenticated
using (private.can_mentor_view(user_id,'skills'));
create policy "Consented mentors can view learner sprints"
on public.sprints for select to authenticated
using (private.can_mentor_view(user_id,'sprints'));
create policy "Consented mentors can view learner activities"
on public.activities for select to authenticated
using (private.can_mentor_view(user_id,'activities'));

-- Restrict self-service profile edits to safe identity fields. Admin role/access changes
-- are performed by the authenticated server-side admin function.
revoke update on table public.profiles from anon, authenticated;
grant update (display_name, name_setup_completed) on table public.profiles to authenticated;
revoke insert on table public.profiles from anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.has_active_access() from public, anon;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.has_active_access() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- Server-side invitation gate: only an email with an outstanding admin-created
-- invitation may be inserted into auth.users.
create or replace function private.enforce_invitation_only_auth_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.invitations i
    where lower(i.email) = lower(new.email)
      and i.status = 'pending'
      and i.auth_user_id is null
  ) then
    raise exception 'LearnFlow is invite-only. Ask an administrator for an invitation.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function private.enforce_invitation_only_auth_signup() from public, anon, authenticated;
drop trigger if exists learnflow_invitation_only_auth_users on auth.users;
create trigger learnflow_invitation_only_auth_users
before insert on auth.users
for each row execute function private.enforce_invitation_only_auth_signup();
