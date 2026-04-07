# Sprout — System Architecture

## Overview

Sprout is a Next.js 16 web application that aggregates kid-friendly activities
from multiple third-party APIs, geocodes user locations, and serves personalised
results through a unified interface. Authentication and data persistence are
handled by Supabase. The app is deployed on Vercel.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                        │
│                                                                   │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│   │ Landing  │   │  Search  │   │ Results  │   │  Detail  │   │
│   │  Page    │──▶│  Page    │──▶│  Page    │──▶│  Page    │   │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘   │
│                                       │                           │
│                          fetch /api/activities                    │
└───────────────────────────────────────┼─────────────────────────┘
                                        │
                        ┌───────────────▼───────────────┐
                        │         VERCEL EDGE            │
                        │   Next.js App Router + Proxy   │
                        └───────────────┬───────────────┘
                                        │
              ┌─────────────────────────┼──────────────────────┐
              │                         │                        │
    ┌─────────▼──────┐      ┌──────────▼────────┐   ┌─────────▼──────┐
    │  Google Places │      │   Yelp Fusion API  │   │  Eventbrite    │
    │  + Geocoding   │      │                    │   │  API           │
    │  API           │      │  Kid activities,   │   │  Local family  │
    │  Parks, museums│      │  playgrounds, swim │   │  events        │
    └────────────────┘      └───────────────────┘   └────────────────┘
              │                         │                        │
              └─────────────────────────┼──────────────────────┘
                                        │
                        ┌───────────────▼───────────────┐
                        │     Unified Results Layer      │
                        │  Deduplicate · Filter · Sort   │
                        └───────────────────────────────┘

                        ┌───────────────────────────────┐
                        │          SUPABASE              │
                        │  Auth (email + Google OAuth)   │
                        │  PostgreSQL (saved_activities) │
                        │  Row Level Security            │
                        └───────────────────────────────┘
```

---

## Request Flow — Activity Search

```
User enters location + filters
          │
          ▼
  /search page (client)
  builds query string
          │
          ▼
  GET /api/activities?location=...&distance=...
          │
          ▼
  ┌───────────────────────────────────────────┐
  │           API Route (server)              │
  │                                           │
  │  1. geocodeLocation(location)             │
  │     ├── Google Geocoding API  (if key)    │
  │     └── OSM Nominatim         (fallback)  │
  │                                           │
  │  2. Parallel fetch                        │
  │     ├── fetchGooglePlaces(lat, lng, r)    │
  │     ├── fetchYelpActivities(lat, lng, r)  │
  │     └── fetchEventbriteEvents(lat, lng, r)│
  │                                           │
  │  3. Merge + deduplicateByName()           │
  │  4. filterActivities(budget, interests)   │
  │  5. sort by distance                      │
  │                                           │
  │  6. Return { activities[], source, loc }  │
  └───────────────────────────────────────────┘
          │
          ▼
  /results page renders
  activity cards + map pins
```

---

## Deployment Architecture

```
  Developer
     │
     │  git push origin main
     ▼
  ┌──────────────┐
  │   GitHub     │  snehakatkuri/sprout-app
  │   Repository │
  └──────┬───────┘
         │  webhook trigger
         ▼
  ┌──────────────┐        ┌───────────────────────┐
  │    Vercel    │        │  Environment Variables │
  │  Build + CDN │◀───────│  (encrypted at rest)   │
  │              │        │  GOOGLE_PLACES_API_KEY │
  │  next build  │        │  YELP_API_KEY          │
  │  next start  │        │  EVENTBRITE_API_KEY    │
  └──────┬───────┘        │  NEXT_PUBLIC_SUPABASE_ │
         │                │  URL + ANON_KEY        │
         │                └───────────────────────┘
         ▼
  sprout-app-opal.vercel.app
```

---

## Authentication Flow

```
  ┌─────────┐     ┌─────────────┐     ┌──────────────┐
  │  User   │     │  Next.js    │     │   Supabase   │
  └────┬────┘     └──────┬──────┘     └──────┬───────┘
       │                 │                    │
       │  Sign up        │                    │
       │────────────────▶│                    │
       │                 │  createUser()      │
       │                 │───────────────────▶│
       │                 │                    │ stores user
       │  confirm email  │◀───────────────────│
       │◀────────────────│                    │
       │                 │                    │
       │  Sign in        │                    │
       │────────────────▶│                    │
       │                 │  signInWithPassword│
       │                 │───────────────────▶│
       │                 │  JWT session token │
       │                 │◀───────────────────│
       │  session cookie │                    │
       │◀────────────────│                    │
       │                 │                    │
       │  Save activity  │                    │
       │────────────────▶│                    │
       │                 │  INSERT w/ RLS     │
       │                 │───────────────────▶│
       │                 │  200 OK            │
       │◀────────────────│◀───────────────────│
```

---

## Proxy (Middleware) Flow

```
  Incoming Request
        │
        ▼
  ┌─────────────┐
  │  proxy.ts   │  Runs on every request (except static assets)
  │             │
  │  1. Read session cookie
  │  2. Refresh Supabase token if expired
  │  3. Pass request to route handler
  └─────────────┘
        │
        ▼
  Route Handler / Page
```
