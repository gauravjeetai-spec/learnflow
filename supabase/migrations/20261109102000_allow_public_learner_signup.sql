drop trigger if exists learnflow_invitation_only_auth_users on auth.users;
drop function if exists private.enforce_invitation_only_auth_signup();
