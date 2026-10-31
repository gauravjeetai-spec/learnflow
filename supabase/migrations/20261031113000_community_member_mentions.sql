-- Community @mentions: expose only active member names to signed-in active members.
alter table public.community_comments add column if not exists mentioned_user_ids uuid[] not null default '{}'::uuid[];
create or replace function public.search_community_members(search_term text) returns table(user_id uuid, display_name text, role text) language sql stable security definer set search_path = '' as $$
  select p.user_id, coalesce(nullif(p.display_name,''),'LearnFlow member'), p.role from public.profiles p
  where auth.uid() is not null and exists(select 1 from public.profiles me where me.user_id=auth.uid() and me.access_status='active')
    and p.access_status='active' and p.user_id<>auth.uid() and length(trim(coalesce(search_term,'')))>=2
    and coalesce(p.display_name,'') ilike '%' || left(trim(search_term),40) || '%' order by p.display_name limit 8;
$$;
revoke all on function public.search_community_members(text) from public,anon;
grant execute on function public.search_community_members(text) to authenticated;
create or replace function private.valid_community_mentions(member_ids uuid[]) returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(cardinality(member_ids),0)<=10 and not exists(select 1 from unnest(coalesce(member_ids,'{}'::uuid[])) as mentioned(user_id)
    where not exists(select 1 from public.profiles p where p.user_id=mentioned.user_id and p.access_status='active'));
$$;
revoke all on function private.valid_community_mentions(uuid[]) from public,anon;
grant execute on function private.valid_community_mentions(uuid[]) to authenticated;
drop policy if exists "Active users can comment on shared resources" on public.community_comments;
create policy "Active users can comment on shared resources" on public.community_comments for insert to authenticated
with check(user_id=(select auth.uid()) and public.has_active_access()
  and author_role=(select p.role from public.profiles p where p.user_id=(select auth.uid()) and p.access_status='active')
  and exists(select 1 from public.community_publications p where p.id=community_comments.publication_id)
  and private.valid_community_mentions(mentioned_user_ids));