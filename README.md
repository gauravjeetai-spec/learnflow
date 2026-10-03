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
- Dark mode preference persistence
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

- Supabase initialization was moved behind an asynchronous startup boundary so a CDN/module loading problem cannot prevent the LearnFlow UI from rendering.
- The app now renders the demo/guest experience first, then attempts Supabase initialization.
- If Supabase initialization fails, LearnFlow remains usable in offline demo mode and reports the fallback instead of showing a blank screen.
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

### Next milestone

Complete the end-to-end browser verification with the Admin account: **Log in → open User access → confirm Admin role → create a second test user → approve it as Learner or Mentor → verify the pending/approved access flow**. Then return to authenticated resource persistence testing. with a real authenticated user: **Log in → Add Learning → confirm row in Supabase → refresh browser → resource remains available**. After that, implement dedicated activity persistence and edit/delete controls.

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
2. LearnFlow currently uses **email magic-link authentication**.
3. Add the production LearnFlow URL to the allowed redirect URL settings in Supabase.
4. Set the Site URL to the deployed LearnFlow URL.

### 2. Run the SQL Tables
Go to https://supabase.com/dashboard/project/zltqnsylerhcbnslqcqm/SQL and run the commands in the "Supabase Tables" section above.

### 3. How It Works
- Users visit the URL and click **"Log in"** (top right button).
- Supabase sends a magic link to the user's email.
- New users are created as **pending Learners** and cannot use the workspace until an Admin approves them.
- Admins can approve/reject/suspend users and assign **Admin, Mentor, or Learner** roles from the User access screen.
- Each user's resources are filtered by their `auth.users.id`; Admins can access resources across users.
- Database Row Level Security enforces the access rules.

### 4. Login/Logout UI
- **Log in button**: Top right corner (☾ icon) - opens SupAuth flow
- **Log out**: Same button - signs out and shows demo data
- **Welcome message**: Shows user's first name on Overview page

### 5. Production deployment

Push changes to the GitHub `main` branch. Vercel deploys the production application automatically. Supabase remains the authentication and persistent data service.

### 5. Known Limitations (Updated)
- Authentication is email magic-link via Supabase (no Google/Apple SSO yet).
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

