create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  weekly_learning_minutes integer not null default 420 check (weekly_learning_minutes between 60 and 1800),
  daily_learning_minutes integer not null default 45 check (daily_learning_minutes between 15 and 180),
  session_length_minutes integer not null default 45 check (session_length_minutes between 15 and 180),
  default_priority text not null default 'Medium' check (default_priority in ('Low','Medium','High')),
  learning_reminders_enabled boolean not null default true,
  sprint_deadline_reminders_enabled boolean not null default true,
  overdue_reminders_enabled boolean not null default true,
  weekly_summary_enabled boolean not null default true,
  mentor_feedback_enabled boolean not null default true,
  notification_frequency text not null default 'daily' check (notification_frequency in ('immediate','hourly','daily','weekly','off')),
  notification_time time not null default '09:00',
  theme text not null default 'system' check (theme in ('system','light','dark')),
  reduce_motion boolean not null default false,
  browser_notifications_enabled boolean not null default false,
  last_notification_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;
grant select, insert, update on public.user_preferences to authenticated;
create policy "Users can view own preferences" on public.user_preferences for select to authenticated using (user_id = auth.uid() or is_admin());
create policy "Users can insert own preferences" on public.user_preferences for insert to authenticated with check (user_id = auth.uid());
create policy "Users can update own preferences" on public.user_preferences for update to authenticated using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid() or is_admin());

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index if not exists audit_events_user_occurred_idx on public.audit_events(user_id, occurred_at desc);
alter table public.audit_events enable row level security;
grant select, insert on public.audit_events to authenticated;
create policy "Users can view own audit events" on public.audit_events for select to authenticated using (user_id = auth.uid() or is_admin());
create policy "Users can insert own audit events" on public.audit_events for insert to authenticated with check (user_id = auth.uid());
revoke update, delete on public.audit_events from authenticated;

create or replace function public.set_user_preferences_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists user_preferences_set_updated_at on public.user_preferences;
create trigger user_preferences_set_updated_at before update on public.user_preferences for each row execute function public.set_user_preferences_updated_at();
