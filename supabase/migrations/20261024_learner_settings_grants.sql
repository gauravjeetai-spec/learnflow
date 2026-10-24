revoke all on public.audit_events from authenticated;
grant select, insert on public.audit_events to authenticated;
revoke all on public.user_preferences from authenticated;
grant select, insert, update on public.user_preferences to authenticated;
