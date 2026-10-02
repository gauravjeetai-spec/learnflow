# LearnFlow

LearnFlow is a focused learning operating system for turning goals into skills, resources, sprints, activity, and measurable progress.

## Run locally

This MVP is a browser-first static application and has no build step:

```bash
cd learnflow
python3 -m http.server 4173
```

Open `http://localhost:4173` in a browser.

## Included in this MVP

- Overview dashboard with learning momentum, current sprint, activity chart, attention states, and daily focus
- Learning Board with Kanban workflow, filters, list view, searchable demo resources, and resource detail panels
- Goals, Skills, Sprints, Courses, Activity, and Analytics views
- Quick-add learning resource flow
- Progress updates, mark complete, and activity logging
- Persistent browser demo data via `localStorage`
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
- Current row count after schema creation: 0. Existing demo resources are still frontend/localStorage data and have **not** been migrated.
- The frontend now imports the shared Supabase client and loads `public.resources` for authenticated users.
- The existing Add Learning flow now inserts/upserts into `public.resources` for authenticated users; guest mode continues to use localStorage/demo data.
- Progress updates, completion, and logged learning activity now persist resource changes through the same Supabase resource service when authenticated.
- LearnFlow now exposes a simple email magic-link Log in / Log out control using Supabase Auth. The browser session is persisted by the Supabase client.
- The app JavaScript has been syntax-validated after the persistence integration.

### Next milestone

Complete the end-to-end browser verification with a real authenticated user: **Log in → Add Learning → confirm row in Supabase → refresh browser → resource remains available**. After that, implement dedicated activity persistence and edit/delete controls.

## Architecture direction

The UI is intentionally organized around the LearnFlow relationship:

`Goal → Skill → Resource → Sprint → Activity → Progress`

For a production deployment, replace the local persistence adapter in `app.js` with a Supabase data service using the schema below. UI entities already use stable IDs and many-to-many-friendly arrays for skills and sprint assignment.

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

For the current static MVP, deploy the `learnflow` directory to any static host. For the Supabase-backed production version, move the views into Next.js App Router, keep data access under `lib/` or `services/`, add migrations under `supabase/migrations/`, and deploy with Vercel.

## Multi-User & Authentication

This app now supports **multiple users** logging in with Supabase Authentication.

### 1. Enable Auth in Supabase
1. Go to https://supabase.com/dashboard/project/zltqnsylerhcbnslqcqm/Authentication
2. Under "Settings", enable **Email password** provider
3. Add your domain to "Allowed origins" (e.g., `localhost` and your deployed URL)
4. Set "Site URL" to your deployed URL

### 2. Run the SQL Tables
Go to https://supabase.com/dashboard/project/zltqnsylerhcbnslqcqm/SQL and run the commands in the "Supabase Tables" section above.

### 3. How It Works
- Users visit the URL and click **"Log in"** (top right button)
- They can sign up with email/password or continue as guest
- Each user's resources are filtered by their `auth.users.id`
- Data persists to Supabase and is visible only to the logged-in user
- Dark mode and preferences persist via localStorage

### 4. Login/Logout UI
- **Log in button**: Top right corner (☾ icon) - opens SupAuth flow
- **Log out**: Same button - signs out and shows demo data
- **Welcome message**: Shows user's first name on Overview page

### 5. Deployment for Multiple Users
```bash
# 1. Set up Supabase auth as above
# 2. Deploy to Vercel/Netlify
vercel deploy --dir learnflow
# OR
npx netlify-cli deploy --dir learnflow

# 3. Add environment variables in your host:
# - NEXT_PUBLIC_SUPABASE_URL=https://zltqnsylerhcbnslqcqm.supabase.co
# - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 4. Deploy - users can now sign up and use the app independently
```

### 5. Known Limitations (Updated)
- Authentication is email/password via Supabase (no Google/Apple SSO yet)
- Each user sees only their own resources (owner-filtered)
- Demo data available if user is not logged in
- Realtime collaboration coming in future updates
