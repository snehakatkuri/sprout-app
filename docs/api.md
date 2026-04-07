# Sprout — API Reference

---

## Internal API

### GET /api/activities

Fetches kid-friendly activities from multiple sources, unified and filtered.

**Query Parameters**

```
  ┌─────────────┬────────┬──────────┬────────────────────────────┐
  │  Parameter  │  Type  │  Default │  Description               │
  ├─────────────┼────────┼──────────┼────────────────────────────┤
  │  location   │ string │  ""      │  City, postcode, or address│
  │  distance   │ number │  10      │  Radius in miles           │
  │  travel     │ number │  30      │  Max travel time (minutes) │
  │  budget     │ string │  "any"   │  free | low | medium | any │
  │  interests  │ string │  ""      │  Comma-separated list      │
  └─────────────┴────────┴──────────┴────────────────────────────┘

  Example:
  GET /api/activities?location=San+Francisco&distance=10&budget=free&interests=Sports,Outdoors
```

**Response**

```json
{
  "activities": [
    {
      "id": "gp_ChIJp...",
      "name": "Golden Gate Park",
      "type": "Outdoors",
      "description": "...",
      "imageUrl": "https://...",
      "address": "San Francisco, CA",
      "distanceMiles": 2.1,
      "driveMinutes": 8,
      "ageMin": 0,
      "ageMax": null,
      "cost": null,
      "costLabel": "Free",
      "tags": ["Outdoors", "park", "family"],
      "lat": 37.769,
      "lng": -122.486
    }
  ],
  "source": "live",
  "location": "San Francisco, CA, USA"
}
```

**Source field**

```
  "live"  → data fetched from real APIs (keys present + geocoding succeeded)
  "mock"  → fallback to 6 hardcoded activities (no keys or geocode failed)
```

**Processing pipeline**

```
  location string
       │
       ▼
  geocodeLocation()
  ├── Google Geocoding API (if GOOGLE_PLACES_API_KEY set)
  └── OSM Nominatim        (free fallback, always available)
       │
       ▼
  { lat, lng, formattedAddress }
       │
       ├──────────────────────────────────────┐
       ▼                                      ▼                       ▼
  fetchGooglePlaces()            fetchYelpActivities()    fetchEventbriteEvents()
  radiusMeters                   radiusMeters              radiusKm
       │                                      │                       │
       └──────────────────────────────────────┘───────────────────────┘
                                              │
                                              ▼
                                    deduplicateByName()
                                              │
                                              ▼
                                    filterActivities()
                                    ├── distance ≤ distanceMi
                                    ├── cost matches budget
                                    └── tags match interests
                                              │
                                              ▼
                                    sort by distanceMiles ASC
                                              │
                                              ▼
                                    JSON response
```

---

## External APIs Used

### Google Places API (Nearby Search)

```
  Endpoint : GET https://maps.googleapis.com/maps/api/place/nearbysearch/json
  Auth     : ?key=GOOGLE_PLACES_API_KEY
  Used for : Parks, museums, zoos, amusement parks, aquariums

  Types searched:
  ┌──────────────────┬──────────────────────┐
  │  Google type     │  Sprout label         │
  ├──────────────────┼──────────────────────┤
  │  park            │  Outdoors             │
  │  museum          │  Science              │
  │  amusement_park  │  Amusement Park       │
  │  zoo             │  Animals              │
  │  aquarium        │  Animals              │
  └──────────────────┴──────────────────────┘

  Rate limit: Pay-per-use (free $200/month credit)
```

### Google Geocoding API

```
  Endpoint : GET https://maps.googleapis.com/maps/api/geocode/json
  Auth     : ?key=GOOGLE_PLACES_API_KEY  (same key)
  Used for : Convert location string → { lat, lng }
  Fallback : OSM Nominatim (if key absent)
```

### Yelp Fusion API

```
  Endpoint : GET https://api.yelp.com/v3/businesses/search
  Auth     : Authorization: Bearer YELP_API_KEY
  Used for : Kid activity centres, playgrounds, swim schools

  Categories searched:
  ┌──────────────────┬──────────────────────┐
  │  Yelp category   │  Sprout label         │
  ├──────────────────┼──────────────────────┤
  │  kidsactivities  │  Activity             │
  │  playgrounds     │  Outdoors             │
  │  swimmingpools   │  Swimming             │
  │  artsandcrafts   │  Arts & Crafts        │
  └──────────────────┴──────────────────────┘

  Rate limit: 500 requests/day (free tier)
```

### Eventbrite API

```
  Endpoint : GET https://www.eventbriteapi.com/v3/events/search/
  Auth     : Authorization: Bearer EVENTBRITE_API_KEY
  Used for : Local family & kid events

  Query    : q=kids family children
  Expand   : venue, ticket_availability, logo

  Rate limit: Free tier — check eventbrite.com/platform
```

---

## Auth Endpoints  *(via Supabase)*

```
  POST /auth/v1/signup           Sign up with email + password
  POST /auth/v1/token?grant_type=password   Sign in
  POST /auth/v1/logout           Sign out
  GET  /auth/v1/user             Get current user

  OAuth:
  GET  /auth/v1/authorize?provider=google   Redirect to Google
  GET  /auth/callback            Handle OAuth code exchange
```
