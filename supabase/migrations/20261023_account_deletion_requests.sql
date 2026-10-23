create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
  reason text,
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

alter table public.account_deletion_requests enable row level security;

grant select, insert, update on public.account_deletion_requests to authenticated;

create policy "Users can create own deletion request"
on public.account_deletion_requests
for insert to authenticated
with check (user_id = auth.uid());

create policy "Users can view own deletion requests"
on public.account_deletion_requests
for select to authenticated
using (user_id = auth.uid() or is_admin());

create policy "Admins can review deletion requests"
on public.account_deletion_requests
for update to authenticated
using (is_admin())
with check (is_admin());
