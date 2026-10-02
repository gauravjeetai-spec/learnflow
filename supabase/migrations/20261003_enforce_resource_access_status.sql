create or replace function public.has_active_access()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and access_status = 'active'
  );
$$;

revoke all on function public.has_active_access() from public;
grant execute on function public.has_active_access() to authenticated;

drop policy if exists "Users can view their own resources" on public.resources;
drop policy if exists "Users can create their own resources" on public.resources;
drop policy if exists "Users can update their own resources" on public.resources;
drop policy if exists "Users can delete their own resources" on public.resources;

create policy "Users can view their own resources"
on public.resources for select to authenticated
using ((user_id = auth.uid() and public.has_active_access()) or public.is_admin());

create policy "Users can create their own resources"
on public.resources for insert to authenticated
with check ((user_id = auth.uid() and public.has_active_access()) or public.is_admin());

create policy "Users can update their own resources"
on public.resources for update to authenticated
using ((user_id = auth.uid() and public.has_active_access()) or public.is_admin())
with check ((user_id = auth.uid() and public.has_active_access()) or public.is_admin());

create policy "Users can delete their own resources"
on public.resources for delete to authenticated
using ((user_id = auth.uid() and public.has_active_access()) or public.is_admin());
