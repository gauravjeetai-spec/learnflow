create or replace function public.admin_purge_user_data(p_actor_id uuid, p_target_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_target_role text;
  v_target_name text;
  v_admin_count integer;
begin
  if p_actor_id is null or p_target_id is null or p_actor_id = p_target_id then
    raise exception 'Invalid user deletion request';
  end if;

  if not exists (
    select 1 from public.profiles
    where user_id = p_actor_id and role = 'admin' and access_status = 'active'
  ) then
    raise exception 'Active administrator access required';
  end if;

  select role, display_name into v_target_role, v_target_name
  from public.profiles where user_id = p_target_id;
  if not found then
    raise exception 'Target user profile not found';
  end if;

  if v_target_role = 'admin' then
    select count(*) into v_admin_count
    from public.profiles where role = 'admin' and access_status = 'active';
    if v_admin_count <= 1 then
      raise exception 'The last active administrator cannot be deleted';
    end if;
  end if;

  -- Remove the user's own content and references before the Auth identity is deleted.
  delete from public.community_comments where user_id = p_target_id;
  update public.community_comments
    set mentioned_user_ids = array_remove(mentioned_user_ids, p_target_id)
    where p_target_id = any(mentioned_user_ids);
  delete from public.community_interactions where user_id = p_target_id;
  delete from public.community_publications where owner_id = p_target_id;

  delete from public.activities
    where user_id = p_target_id
       or resource_id in (select id from public.resources where user_id = p_target_id);
  delete from public.audit_events where user_id = p_target_id;
  delete from public.account_deletion_requests where user_id = p_target_id;
  update public.account_deletion_requests set reviewed_by = null where reviewed_by = p_target_id;
  delete from public.user_preferences where user_id = p_target_id;
  delete from public.mentor_relationships where mentor_id = p_target_id or learner_id = p_target_id;
  delete from public.goals where user_id = p_target_id;
  delete from public.skills where user_id = p_target_id;
  delete from public.sprints where user_id = p_target_id;
  delete from public.resources where user_id = p_target_id;
  delete from public.invitations where auth_user_id = p_target_id or invited_by = p_target_id;
  update public.profiles set approved_by = null where approved_by = p_target_id;

  -- Keep the profile as a suspended tombstone until Auth deletion succeeds.
  update public.profiles set access_status = 'suspended', approved_at = null, approved_by = null
  where user_id = p_target_id;

  return jsonb_build_object('success', true, 'deleted_role', v_target_role, 'deleted_display_name', v_target_name);
end;
$$;
revoke all on function public.admin_purge_user_data(uuid,uuid) from public, anon, authenticated;
grant execute on function public.admin_purge_user_data(uuid,uuid) to service_role;
