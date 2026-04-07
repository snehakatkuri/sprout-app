import { NextRequest, NextResponse } from "next/server";
import { geocodeLocation } from "@/lib/geocode";
import { fetchGooglePlaces } from "@/lib/apis/google-places";
import { fetchYelpActivities } from "@/lib/apis/yelp";
import { fetchEventbriteEvents } from "@/lib/apis/eventbrite";
import { mockActivities } from "@/lib/mockActivities";
import { Activity } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const location     = searchParams.get("location") ?? "";
  const distanceMi   = Number(searchParams.get("distance") ?? 10);
  const budget       = searchParams.get("budget") ?? "any";
  const interests    = (searchParams.get("interests") ?? "").split(",").filter(Boolean);

  // 1. Geocode the location
  const coords = location ? await geocodeLocation(location) : null;

  // 2. If no API keys or geocoding failed, fall back to mock data
  const hasKeys =
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.YELP_API_KEY ||
    process.env.EVENTBRITE_API_KEY;

  if (!coords || !hasKeys) {
    const filtered = filterActivities(mockActivities, { distanceMi, budget, interests });
    return NextResponse.json({ activities: filtered, source: "mock", location: "San Francisco, CA" });
  }

  // 3. Fetch from all APIs in parallel
  const radiusMeters = distanceMi * 1609.34;
  const radiusKm     = distanceMi * 1.60934;

  const [googleResults, yelpResults, eventbriteResults] = await Promise.allSettled([
    fetchGooglePlaces(coords.lat, coords.lng, radiusMeters),
    fetchYelpActivities(coords.lat, coords.lng, radiusMeters),
    fetchEventbriteEvents(coords.lat, coords.lng, radiusKm),
  ]);

  const all: Activity[] = [
    ...(googleResults.status    === "fulfilled" ? googleResults.value    : []),
    ...(yelpResults.status      === "fulfilled" ? yelpResults.value      : []),
    ...(eventbriteResults.status === "fulfilled" ? eventbriteResults.value : []),
  ];

  // 4. Deduplicate by name similarity
  const deduped = deduplicateByName(all);

  // 5. Filter by budget and interests
  const filtered = filterActivities(deduped, { distanceMi, budget, interests });

  // 6. Sort by distance
  const sorted = filtered.sort((a, b) => a.distanceMiles - b.distanceMiles);

  return NextResponse.json({
    activities: sorted,
    source:     "live",
    location:   coords.formattedAddress,
  });
}

/* ── Helpers ── */

function filterActivities(
  activities: Activity[],
  opts: { distanceMi: number; budget: string; interests: string[] }
): Activity[] {
  return activities.filter(a => {
    // Distance filter
    if (a.distanceMiles > opts.distanceMi) return false;

    // Budget filter
    if (opts.budget === "free"   && a.cost !== null) return false;
    if (opts.budget === "low"    && a.cost !== null && a.cost > 20) return false;
    if (opts.budget === "medium" && a.cost !== null && a.cost > 50) return false;

    // Interests filter — if any interests selected, at least one must match
    if (opts.interests.length > 0) {
      const activityText = `${a.type} ${a.tags.join(" ")}`.toLowerCase();
      const match = opts.interests.some(i => activityText.includes(i.toLowerCase()));
      if (!match) return false;
    }

    return true;
  });
}

function deduplicateByName(activities: Activity[]): Activity[] {
  const seen = new Map<string, Activity>();
  for (const a of activities) {
    const key = a.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
    if (!seen.has(key)) seen.set(key, a);
  }
  return Array.from(seen.values());
}
