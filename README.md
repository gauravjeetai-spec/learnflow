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

## Known limitations

- The current demo uses localStorage so it can run in this environment without credentials or a database.
- Realtime collaboration, authentication-free share tokens, CSV export/import, server validation, and drag-and-drop persistence are the next production integration steps.
- The UI is designed to make those services replaceable without changing the product model.
