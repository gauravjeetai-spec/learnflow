-- Cover user_id foreign keys on community interaction and comment rows.
create index if not exists community_interactions_user_idx on public.community_interactions(user_id);
create index if not exists community_comments_user_idx on public.community_comments(user_id);
