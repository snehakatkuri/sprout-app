import { Activity } from "@/types";

const KID_CATEGORIES = [
  "kidsactivities",
  "playgrounds",
  "swimmingpools",
  "artsandcrafts",
  "dancestudios",
  "gymnastics",
  "martialarts",
  "kidscooking",
];

interface YelpBusiness {
  id: string;
  name: string;
  location: { display_address: string[] };
  coordinates: { latitude: number; longitude: number };
  categories: { alias: string; title: string }[];
  image_url: string;
  distance: number; // metres
  price?: string;
  is_closed: boolean;
}

function metresToMiles(m: number) {
  return Math.round((m / 1609.34) * 10) / 10;
}

function yelpToActivity(b: YelpBusiness): Activity {
  const dist = metresToMiles(b.distance);
  const type = b.categories[0]?.title ?? "Activity";

  // rough cost from price string ($, $$, $$$)
  const priceMap: Record<string, { cost: number; label: string }> = {
    "$":   { cost: 10,  label: "Under $10" },
    "$$":  { cost: 25,  label: "~$25" },
    "$$$": { cost: 50,  label: "~$50" },
  };
  const pricing = b.price ? priceMap[b.price] : null;

  return {
    id:            `yelp_${b.id}`,
    name:          b.name,
    type,
    description:   `${b.name} — a kid-friendly ${type.toLowerCase()} in ${b.location.display_address[1] ?? b.location.display_address[0]}.`,
    imageUrl:      b.image_url || `https://picsum.photos/seed/${b.id}/800/500`,
    address:       b.location.display_address.join(", "),
    distanceMiles: dist,
    driveMinutes:  Math.round(dist * 3.5),
    ageMin:        0,
    ageMax:        null,
    cost:          pricing?.cost ?? null,
    costLabel:     pricing?.label ?? "Free",
    tags:          b.categories.map(c => c.title),
    lat:           b.coordinates.latitude,
    lng:           b.coordinates.longitude,
  };
}

export async function fetchYelpActivities(
  lat: number,
  lng: number,
  radiusMeters: number
): Promise<Activity[]> {
  const key = process.env.YELP_API_KEY;
  if (!key) return [];

  const results: Activity[] = [];
  const seen = new Set<string>();

  await Promise.allSettled(
    KID_CATEGORIES.slice(0, 4).map(cat =>
      fetch(
        `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lng}&radius=${Math.min(radiusMeters, 40000)}&categories=${cat}&limit=5&sort_by=best_match`,
        { headers: { Authorization: `Bearer ${key}` } }
      )
        .then(r => r.json())
        .then(data => {
          for (const b of data.businesses ?? []) {
            if (!seen.has(b.id) && !b.is_closed) {
              seen.add(b.id);
              results.push(yelpToActivity(b));
            }
          }
        })
    )
  );

  return results;
}
