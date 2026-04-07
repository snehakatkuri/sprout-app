# Sprout — Project Structure

---

## Directory Tree

```
  sprout-app/
  │
  ├── src/
  │   ├── app/                          # Next.js App Router pages
  │   │   ├── layout.tsx                # Root layout (fonts, metadata)
  │   │   ├── page.tsx                  # Landing page  /
  │   │   ├── globals.css               # Design tokens, global styles
  │   │   ├── error.tsx                 # Global error boundary
  │   │   ├── not-found.tsx             # Global 404 page
  │   │   │
  │   │   ├── search/
  │   │   │   ├── page.tsx              # Search & filter page  /search
  │   │   │   └── metadata.ts           # SEO metadata
  │   │   │
  │   │   ├── results/
  │   │   │   ├── page.tsx              # Results page  /results
  │   │   │   └── metadata.ts           # SEO metadata
  │   │   │
  │   │   ├── activity/
  │   │   │   └── [id]/
  │   │   │       └── page.tsx          # Activity detail  /activity/:id
  │   │   │
  │   │   ├── saved/
  │   │   │   ├── page.tsx              # Saved activities  /saved
  │   │   │   └── metadata.ts           # SEO metadata
  │   │   │
  │   │   ├── auth/
  │   │   │   ├── signin/
  │   │   │   │   ├── page.tsx          # Sign in page  /auth/signin
  │   │   │   │   └── metadata.ts
  │   │   │   ├── signup/
  │   │   │   │   ├── page.tsx          # Sign up page  /auth/signup
  │   │   │   │   └── metadata.ts
  │   │   │   └── callback/
  │   │   │       └── route.ts          # OAuth callback handler
  │   │   │
  │   │   └── api/
  │   │       └── activities/
  │   │           └── route.ts          # GET /api/activities
  │   │
  │   ├── components/
  │   │   └── layout/
  │   │       └── Navbar.tsx            # Sticky nav with auth state
  │   │
  │   ├── lib/
  │   │   ├── mockActivities.ts         # 6 hardcoded fallback activities
  │   │   ├── geocode.ts                # Location → lat/lng
  │   │   │
  │   │   ├── apis/
  │   │   │   ├── google-places.ts      # Google Places fetcher
  │   │   │   ├── yelp.ts              # Yelp Fusion fetcher
  │   │   │   └── eventbrite.ts         # Eventbrite fetcher
  │   │   │
  │   │   └── supabase/
  │   │       ├── client.ts             # Browser Supabase client
  │   │       └── server.ts             # Server Supabase client
  │   │
  │   ├── types/
  │   │   └── index.ts                  # Activity, SearchFilters, INTERESTS
  │   │
  │   └── proxy.ts                      # Session refresh middleware
  │
  ├── docs/                             # ← You are here
  │   ├── architecture.md
  │   ├── design.md
  │   ├── database.md
  │   ├── api.md
  │   └── project-structure.md
  │
  ├── public/                           # Static assets
  ├── .env.local                        # API keys (gitignored)
  ├── .env.local.example                # Key template (committed)
  ├── supabase-schema.sql               # DB setup script
  ├── next.config.ts
  ├── tailwind.config (inline)
  ├── tsconfig.json
  └── package.json
```

---

## Data Flow Summary

```
  ┌──────────────────────────────────────────────────────┐
  │                    PAGE FLOW                          │
  │                                                        │
  │  /  (Landing)                                         │
  │    │                                                   │
  │    ├── click category  ──▶  /search?interest=Sports   │
  │    └── click CTA       ──▶  /search                   │
  │                                                        │
  │  /search  (Filter form)                               │
  │    │                                                   │
  │    └── submit  ──▶  /results?location=...&budget=...  │
  │                                                        │
  │  /results  (Activity list + map)                      │
  │    │                                                   │
  │    ├── on mount  ──▶  fetch /api/activities            │
  │    └── click card  ──▶  /activity/:id                 │
  │                                                        │
  │  /activity/:id  (Detail)                              │
  │    ├── save  ──▶  Supabase INSERT saved_activities    │
  │    └── unsave  ──▶  Supabase DELETE saved_activities  │
  │                                                        │
  │  /saved  (Saved list)                                 │
  │    └── on mount  ──▶  Supabase SELECT saved_activities│
  │                                                        │
  │  /auth/signin  /auth/signup                           │
  │    └── success  ──▶  /  (home)                        │
  └──────────────────────────────────────────────────────┘
```

---

## Tech Stack Summary

```
  ┌─────────────────┬────────────────────────────────────┐
  │  Layer           │  Technology                        │
  ├─────────────────┼────────────────────────────────────┤
  │  Framework       │  Next.js 16 (App Router, Turbopack)│
  │  Language        │  TypeScript                        │
  │  Styling         │  Tailwind CSS v4                   │
  │  Fonts           │  Fraunces + DM Sans (Google Fonts) │
  │  Auth            │  Supabase Auth (email + Google)    │
  │  Database        │  Supabase PostgreSQL               │
  │  Activity data   │  Google Places + Yelp + Eventbrite │
  │  Geocoding       │  Google Geocoding + OSM Nominatim  │
  │  Hosting         │  Vercel (auto-deploy from GitHub)  │
  │  Version control │  GitHub                            │
  │  IDE             │  IntelliJ IDEA + Claude Code       │
  └─────────────────┴────────────────────────────────────┘
```
