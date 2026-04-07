# Sprout — Database Schema

## Provider: Supabase (PostgreSQL)

---

## Tables

### auth.users  *(managed by Supabase)*

```
  ┌─────────────────────────────────────────────────┐
  │  auth.users                                      │
  ├─────────────────┬────────────┬──────────────────┤
  │  Column         │  Type      │  Notes           │
  ├─────────────────┼────────────┼──────────────────┤
  │  id             │  uuid PK   │  auto-generated  │
  │  email          │  text      │  unique          │
  │  user_metadata  │  jsonb     │  { full_name }   │
  │  created_at     │  timestamptz│                 │
  └─────────────────┴────────────┴──────────────────┘
```

### public.saved_activities

```
  ┌─────────────────────────────────────────────────┐
  │  public.saved_activities                         │
  ├─────────────────┬────────────┬──────────────────┤
  │  Column         │  Type      │  Notes           │
  ├─────────────────┼────────────┼──────────────────┤
  │  id             │  uuid PK   │  gen_random_uuid │
  │  user_id        │  uuid FK   │  → auth.users.id │
  │  activity_id    │  text      │  e.g. gp_ChIJ... │
  │  name           │  text      │  activity name   │
  │  type           │  text      │  Arts, Outdoors  │
  │  image_url      │  text      │                  │
  │  address        │  text      │                  │
  │  cost_label     │  text      │  Free / $18 etc  │
  │  distance       │  numeric   │  miles           │
  │  created_at     │  timestamptz│  default now()  │
  └─────────────────┴────────────┴──────────────────┘

  Unique index: (user_id, activity_id)  — one save per activity
  Cascade:      DELETE user → DELETE their saved activities
```

---

## Entity Relationship

```
  ┌──────────────┐          ┌─────────────────────┐
  │  auth.users  │          │  saved_activities    │
  │              │          │                      │
  │  id  ────────┼──────────▶  user_id             │
  │  email       │  1      N│  activity_id         │
  │  metadata    │          │  name                │
  └──────────────┘          │  type                │
                             │  image_url           │
                             │  address             │
                             │  cost_label          │
                             │  distance            │
                             │  created_at          │
                             └─────────────────────┘
```

---

## Row Level Security Policies

```
  Table: saved_activities
  RLS: ENABLED

  ┌──────────────────────────────────────────────────────┐
  │  Policy                  │ Operation │ Rule          │
  ├──────────────────────────┼───────────┼───────────────┤
  │  Users can view own      │  SELECT   │ auth.uid()    │
  │  saved activities        │           │ = user_id     │
  ├──────────────────────────┼───────────┼───────────────┤
  │  Users can insert own    │  INSERT   │ auth.uid()    │
  │  saved activities        │           │ = user_id     │
  ├──────────────────────────┼───────────┼───────────────┤
  │  Users can delete own    │  DELETE   │ auth.uid()    │
  │  saved activities        │           │ = user_id     │
  └──────────────────────────┴───────────┴───────────────┘

  Result: Users can ONLY read/write their own rows.
          No cross-user data leakage possible.
```

---

## Activity ID Prefixes

Activity IDs are sourced from external APIs and prefixed to avoid collisions:

```
  ┌──────────┬──────────────────────────────────────┐
  │  Prefix  │  Source                              │
  ├──────────┼──────────────────────────────────────┤
  │  gp_     │  Google Places (e.g. gp_ChIJp...)    │
  │  yelp_   │  Yelp Fusion   (e.g. yelp_abc123)    │
  │  eb_     │  Eventbrite    (e.g. eb_987654321)   │
  │  1–6     │  Mock data (development fallback)    │
  └──────────┴──────────────────────────────────────┘
```
