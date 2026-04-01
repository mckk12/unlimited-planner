# Unlimited Planner

Plan cinema outings with friends using real Cinema City data, shared availability, and collaborative movie voting.

## What This App Does

Unlimited Planner helps a group:
- create a shared planner
- pick a cinema and time window
- compare participant availability by day and hour
- add movies from the current Cinema City catalog
- ban/unban movies collaboratively to narrow down choices

The frontend is built with React + TypeScript and uses Supabase for authentication and planner data.

## Current Feature Set

- Authentication (register, login, logout) with Supabase Auth
- Account page for username and Cinema City card number updates
- Weekly availability editor (hours 08:00-23:00, states: not / maybe / canGo)
- Planner lobby with search and planner creation flow
- Planner details view with:
  - participants management
  - movie add/remove
  - collaborative movie ban toggle
  - planner sharing (copy link, Messenger share)
- Movies browser with attribute-based filtering
- Cinema data integration (cinemas, now playing, attributes, events)
- Basic screening rooms placeholder page (still under construction)

## Pages and Routes

Public routes:
- /
- /planners
- /moviesbrowser
- /screening-rooms
- /login
- /\* (not found)

Protected routes (requires authenticated user):
- /planner/:plannerId
- /account
- /availability

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- React Router 7
- Tailwind CSS 4
- TanStack React Query 5
- Supabase JS 2
- Axios

## Architecture Summary

Frontend structure inside website/src:
- components: reusable UI and feature components
- pages: route-level screens
- hooks: feature logic (availability, planner data, cinema queries, auth helpers)
- contexts: auth and snackbar state
- services:
  - supabaseClient.ts for planner, availability, and user table operations
  - ccApiClient.ts for Cinema City API calls
- router: route definitions and protected route wrapper
- utils: validation, date helpers, clipboard helper, env config, shared types

Database model documentation is available in [SUPABASE_SCHEMA.md](SUPABASE_SCHEMA.md).

## Cinema City API Notes

The app uses a proxy approach to avoid CORS and third-party cookie issues:
- local dev proxy in website/vite.config.ts via /api/cinema-city
- production rewrite in website/vercel.json for /api/cinema-city/:path*

Main Cinema City data used:
- active cinemas
- now playing movies
- movie attributes
- cinema events at date
- event details
- seat plan endpoint (partially wired; screening rooms UI is not complete)

## Quick Start

Prerequisites:
- Node.js 20+
- npm
- Supabase project with required tables and policies

1. Install dependencies

```bash
cd website
npm install
```

2. Create environment file

```bash
cp .env.example .env
```

3. Set required variables in website/.env

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CINEMACITY_API_BASE_URL=/api/cinema-city
```

4. Run dev server

```bash
npm run dev
```

## Environment Variables

Required:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Optional:
- VITE_CINEMACITY_API_BASE_URL (defaults to /api/cinema-city)

Important: the runtime config reads VITE_CINEMACITY_API_BASE_URL. If you use website/.env.example as a template, prefer this key name in your local .env.

## Scripts

From website/:
- npm run dev: start local Vite server
- npm run build: type-check and create production build
- npm run preview: preview production build locally
- npm run lint: run ESLint

## Deployment (Vercel)

This repo is set up for SPA deployment on Vercel:
- /api/cinema-city/* is rewritten to Cinema City API
- all other routes rewrite to /index.html for client-side routing

Deployment steps:
1. Import repository in Vercel
2. Set environment variables (same as local .env)
3. Deploy

## Known Limitations

- Screening rooms page is currently a placeholder and not a finished feature
- Seat-plan exploration exists in service layer, but no complete production UI flow yet
- No i18n layer yet (future enhancement)

## Repository Notes

- Do not commit secrets. Keep local credentials in website/.env.
- If you maintain schema changes, update [SUPABASE_SCHEMA.md](SUPABASE_SCHEMA.md) to keep docs in sync.

## Future Improvements

- richer movie attribute mapping and advanced filtering
- complete screening room visualization and seat ranking workflow
- multilingual UI support
