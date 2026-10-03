# LearnFlow

LearnFlow is a focused learning operating system for turning goals into skills, resources, sprints, activity, and measurable progress.

## Production deployment

The production application is deployed from the GitHub `main` branch through Vercel. Supabase provides authentication and persistent application data.

## Included in this MVP

- Overview dashboard with learning momentum, current sprint, activity chart, attention states, and daily focus
- Learning Board with Kanban workflow, filters, list view, searchable demo resources, and resource detail panels
- Goals, Skills, Sprints, Courses, Activity, and Analytics views
- Quick-add learning resource flow
- Progress updates, mark complete, and activity logging
- In-memory demo resources for the unauthenticated preview; authenticated resources are persisted in Supabase
- Responsive mobile layout with bottom navigation
- In-memory dark mode toggle
- Demo board: 2026 Growth & Business Learning


## Build status / source of truth

This README is the canonical project record for LearnFlow's implemented architecture and verified progress. After each meaningful, working milestone, update this section and the relevant architecture notes before moving to the next feature.

### Verified milestone — 2026-10-02

**Resource persistence foundation is now created in Supabase.**

- Supabase project: `learnflow-mvp` (Mumbai / `ap-south-1`)
- Created `public.resources` with a UUID primary key and authenticated `user_id` ownership.
- Resource fields currently include title, type, provider, URL, goal, skills, status, progress, priority, due date, estimated hours, notes, owner label, and timestamps.
- Status values: `backlog`, `planned`, `in-progress`, `practice`, `completed`.
- Progress is constrained to 0–100; priority is constrained to Low / Medium / High.
- Row Level Security is enabled. Authenticated users can only read, insert, update, or delete their own resources.
- `updated_at` is maintained automatically by a database trigger.
- The applied schema is also committed to `supabase/migrations/20261002_create_resources_table.sql` so the repository remains the source-controlled record of the database change.
- Current row count after schema creation: 0. Demo resources remain preview data; authenticated resources are stored in Supabase.
- The frontend now imports the shared Supabase client and loads `public.resources` for authenticated users.
- The existing Add Learning flow now inserts/upserts into `public.resources` for authenticated users.
- Progress updates, completion, and logged learning activity now persist resource changes through the same Supabase resource service when authenticated.
- LearnFlow now exposes a simple email magic-link Log in / Log out control using Supabase Auth. The browser session is persisted by the Supabase client.
- The app JavaScript has been syntax-validated after the persistence integration.

### Verified milestone — 2026-10-02 (startup regression hardening)

- Supabase initialization is isolated behind an asynchronous startup boundary so a CDN/module loading problem cannot prevent the LearnFlow UI from rendering.
- The app renders the preview experience first, then attempts Supabase initialization.
- If Supabase initialization fails, LearnFlow reports the connection problem instead of showing a blank screen.
- The Supabase client is created at runtime with the existing browser-safe anon key; no service-role credential is used.
- `app.js` syntax was revalidated after this change.

### Verified milestone — 2026-10-03

**Role-based access control is now implemented with Admin, Mentor, and Learner roles.**

- Added `public.profiles` with role and access status fields.
- Roles are constrained to `admin`, `mentor`, and `learner`.
- Access states are `pending`, `active`, `suspended`, and `rejected`.
- New Supabase Auth users automatically receive a pending Learner profile.
- The existing owner account has been initialized as the active Admin account.
- Added an Admin-only **User access** screen to approve users and assign/change roles.
- Pending, rejected, and suspended users are blocked from the learning workspace until access is active.
- Supabase RLS now enforces active access for resource reads/writes; Admins can access resources across users.
- Role and access decisions are enforced in the database, not only hidden in the browser UI.
- Migration files: `supabase/migrations/20261003_add_user_roles_and_access.sql` and `supabase/migrations/20261003_enforce_resource_access_status.sql`.

### Auth callback hardening — 2026-10-03

Magic-link requests now always use the stable production LearnFlow domain (`https://learnflow-steel.vercel.app/`) as the callback. This prevents a login link from returning to a development or deployment-specific Vercel URL.

The previous callback used a deployment-specific Vercel URL (`learnflow-61x1m7mar-gauravjeetai.vercel.app`). The latest production deployment confirms `learnflow-steel.vercel.app` as the stable production domain, so new magic links will use that URL.

For the next login test, use one fresh magic link after the Supabase URL configuration has been corrected. Links already issued with an earlier callback continue to use the callback embedded when they were created.

### Production authentication configuration — 2026-10-03

- The application sends Supabase magic-link requests with `https://learnflow-steel.vercel.app/` as the explicit redirect target.
- Supabase Authentication must use `https://learnflow-steel.vercel.app/` as the Site URL and include the same exact URL in the Redirect URLs allow-list.
- The frontend no longer contains development-host references or browser resource persistence.
- Custom SMTP is not yet configured. Supabase's built-in email service is intentionally temporary because its project email limit is very low; configure a transactional SMTP provider before broader user testing.

### Verified milestone — 2026-10-03 (password login fallback)

**Password authentication is now available alongside magic links.**

- LearnFlow now supports Supabase email/password sign-in through `signInWithPassword`.
- The existing magic-link flow remains available when the password prompt is left blank.
- This provides a testable authentication path while the built-in email provider is rate-limited.
- The stale unauthenticated resource persistence call was removed; unauthenticated preview data remains in memory only.

### Current milestone — Learning Board CRUD implementation

The Learning Board now has the first complete CRUD controls wired to the existing Supabase resource service:

- Existing resources can be opened and edited from the board.
- Edit supports title, type, status, progress, priority, goal, skill, provider, target date, estimated hours, and notes.
- Progress can be incremented from the resource detail panel and saved to Supabase.
- Resources can be marked complete, moving them to the Completed column and saving the change.
- Resources can be deleted through the resource detail panel.
- Existing Supabase RLS policies enforce that active learners can only update/delete their own resources; Admins retain cross-user access.
- Production verification completed so far: edit, progress change, status change, refresh persistence, and deletion have been verified with a production learner account.

### Current milestone — Workspace data connected

The remaining workspace areas are now backed by Supabase instead of fixed demo data:

- **Goals** load per user, derive progress from that user's resources, and support creating goals.
- **Skills** load per user, derive progress/invested time from that user's resources, and support creating skills.
- **Sprints** load per user, support creating sprints, and can be linked to learning resources through `sprint_id`.
- **Activity** is persisted in a dedicated `activities` table and logging an activity also updates resource progress.
- **Analytics** calculates live metrics from the authenticated user's resources and logged activities.
- New `goals`, `skills`, `sprints`, and `activities` tables use RLS with the same active-user/admin access model as resources.
- A reproducible Supabase migration is stored at `supabase/migrations/20261003_workspace_data.sql`.
- Existing users with no workspace data receive an initial set of goals, skills, and a starter sprint on first authenticated load.

**Production verification completed for Goals, Skills, Sprints, and Activity:** after signing in to the production LearnFlow application, all four seeded goals appeared successfully: Build Business Acumen, Become Better at AI, Improve Leadership, and Master Marketing. The six seeded skills also appeared successfully: Financial Modeling, AI Engineering, Business Strategy, Leadership, Marketing, and Sales. The seeded sprint **Build the foundation** appeared successfully, and a new sprint named **Test Sprint** was created and remained visible after a full browser refresh, confirming persistence for the signed-in user. A 30-minute **Study** activity named **Test learning session** was logged against **TEST-Isolation** and remained visible after a full browser refresh, confirming activity persistence.

The remaining workspace area requiring production UI verification is Analytics.

### Next milestone

Verify production behavior for **Analytics**, including confirming that the authenticated user's live resource and activity data are reflected in the metrics after refresh.

## Architecture direction

The UI is intentionally organized around the LearnFlow relationship:

`Goal → Skill → Resource → Sprint → Activity → Progress`

For a production deployment, use the Supabase data service in `app.js` using the schema below. UI entities already use stable IDs and many-to-many-friendly arrays for skills and sprint assignment.

## Supabase production setup

Create a Next.js/TypeScript host or serve this UI from a static route, then create these PostgreSQL tables with foreign keys and RLS:

- boards
- participants
- columns
- goals
- skills
- goal_skills
- resources
- resource_skills
- sprints
- resource_sprints
- learning_activities
- resource_dependencies
- activity_log
- tags
- resource_tags

Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` only in browser code. Keep service-role credentials server-side. Authorize board reads and writes through a cryptographically random share token, not a predictable ID. Enable Realtime for resources, columns, goals, skills, sprints, and learning_activities.

## Deployment

The current application is a static frontend deployed through Vercel. Supabase-backed data access remains in the browser-safe application layer, with database migrations under `supabase/migrations/`.

## Multi-User & Authentication

This app now supports **multiple users** logging in with Supabase Authentication.

### 1. Enable Auth in Supabase
1. Open the Supabase Authentication settings.
2. LearnFlow supports **email/password authentication** and **email magic-link authentication**.
3. Add the production LearnFlow URL to the allowed redirect URL settings in Supabase.
4. Set the Site URL to the deployed LearnFlow URL.

### 2. Run the SQL Tables
Go to https://supabase.com/dashboard/project/zltqnsylerhcbnslqcqm/SQL and run the commands in the "Supabase Tables" section above.

### 3. How It Works
- Users visit the URL and click **"Log in"** (top right button).
- Entering a password signs in directly with Supabase Auth.
- Leaving the password blank requests a magic link; this remains available for passwordless users.
- New users are created as **pending Learners** and cannot use the workspace until an Admin approves them.
- Admins can approve/reject/suspend users and assign **Admin, Mentor, or Learner** roles from the User access screen.
- Each user's resources are filtered by their `auth.users.id`; Admins can access resources across users.
- Database Row Level Security enforces the access rules.

### 4. Login/Logout UI
- **Log in button**: Top right corner - opens the email/password flow with magic-link fallback
- **Log out**: Same button - signs out and shows demo data
- **Welcome message**: Shows user's first name on Overview page

### 5. Production deployment

Push changes to the GitHub `main` branch. Vercel deploys the production application automatically. Supabase remains the authentication and persistent data service.

### 5. Known Limitations (Updated)
- Authentication supports Supabase email/password and magic-link sign-in (no Google/Apple SSO yet).
- Mentor permissions are currently the same as an active learner; mentor-specific learner assignment/management is a later milestone.
- Admins have cross-user resource access; finer-grained workspace permissions are a later milestone.
- Demo resources are available as an unauthenticated preview; authenticated users use Supabase data.
- Realtime collaboration is a future milestone.

## Latest verification: authentication key fix (October 2026)

- Browser testing reached Supabase Auth successfully, but the login request was rejected with **401 UNAUTHORIZED_INVALID_API_KEY**.
- The app was using the legacy anon key for the Supabase client.
- LearnFlow now uses the project's current **publishable key** in both `app.js` and `supabase-client.js`.
- Next verification step: deploy this commit, click **Log in**, enter the email address, and confirm that Supabase accepts the request and sends the magic-link email.
- If the request is accepted but no email arrives, the next check is Supabase Auth email delivery/SMTP configuration.

