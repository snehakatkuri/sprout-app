import { Activity } from "@/types";

// Kid-friendly place types to search
const KID_PLACE_TYPES = [
  "amusement_park",
  "aquarium",
  "art_gallery",
  "bowling_alley",
  "campground",
  "library",
  "movie_theater",
  "museum",
  "park",
  "stadium",
  "zoo",
];

// Map Google place types → our activity type labels
const TYPE_LABEL: Record<string, string> = {
  amusement_park: "Amusement Park",
  aquarium:       "Animals",
  art_gallery:    "Arts & Crafts",
  bowling_alley:  "Sports",
  campground:     "Outdoors",
  library:        "Reading",
  movie_theater:  "Entertainment",
  museum:         "Science",
  park:           "Outdoors",
  stadium:        "Sports",
  zoo:            "Animals",
};

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  types: string[];
  rating?: number;
  photos?: { photo_reference: string }[];
  geometry: { location: { lat: number; lng: number } };
  opening_hours?: { open_now: boolean };
}

function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function placeToActivity(place: GooglePlace, originLat: number, originLng: number): Activity {
  const key = process.env.GOOGLE_PLACES_API_KEY ?? "";
  const mainType = place.types.find(t => KID_PLACE_TYPES.includes(t)) ?? place.types[0];
  const dist = distanceMiles(originLat, originLng, place.geometry.location.lat, place.geometry.location.lng);
  const driveMin = Math.round(dist * 3.5); // rough estimate

  const photoRef = place.photos?.[0]?.photo_reference;
  const imageUrl = photoRef
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${key}`
    : `https://picsum.photos/seed/${place.place_id}/800/500`;

  return {
    id: `gp_${place.place_id}`,
    name: place.name,
    type: TYPE_LABEL[mainType] ?? "Activity",
    description: `${place.name} is a kid-friendly ${TYPE_LABEL[mainType]?.toLowerCase() ?? "venue"} located at ${place.vicinity}.`,
    imageUrl,
    address: place.vicinity,
    distanceMiles: Math.round(dist * 10) / 10,
    driveMinutes: driveMin,
    ageMin: 0,
    ageMax: null,
    cost: null,
    costLabel: "See venue",
    tags: place.types.slice(0, 4).map(t => t.replace(/_/g, " ")),
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
  };
}

export async function fetchGooglePlaces(
  lat: number,
  lng: number,
  radiusMeters: number
): Promise<Activity[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return [];

  const results: Activity[] = [];

  // Run a few type searches in parallel
  const typesToSearch = ["park", "museum", "amusement_park", "zoo", "aquarium"];

  const responses = await Promise.allSettled(
    typesToSearch.map(type =>
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&type=${type}&key=${key}`
      ).then(r => r.json())
    )
  );

  const seen = new Set<string>();

  for (const res of responses) {
    if (res.status !== "fulfilled") continue;
    for (const place of (res.value.results ?? []).slice(0, 5)) {
      if (seen.has(place.place_id)) continue;
      seen.add(place.place_id);
      results.push(placeToActivity(place, lat, lng));
    }
  }

  return results;
}
