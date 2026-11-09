revoke insert, update, delete on table public.profiles from public, anon, authenticated;
grant update (display_name, name_setup_completed) on table public.profiles to authenticated;
