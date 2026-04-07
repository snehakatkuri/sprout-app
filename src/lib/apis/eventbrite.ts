import { Activity } from "@/types";

interface EventbriteEvent {
  id: string;
  name: { text: string };
  description: { text: string };
  start: { local: string };
  logo?: { url: string };
  venue?: {
    address: { localized_address_display: string };
    latitude: string;
    longitude: string;
  };
  ticket_availability?: { minimum_ticket_price?: { display: string }; is_free: boolean };
  category_id?: string;
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

function eventToActivity(event: EventbriteEvent, originLat: number, originLng: number): Activity {
  const venueLat = parseFloat(event.venue?.latitude ?? "0");
  const venueLng = parseFloat(event.venue?.longitude ?? "0");
  const dist = distanceMiles(originLat, originLng, venueLat, venueLng);
  const isFree = event.ticket_availability?.is_free ?? false;
  const priceLabel = isFree
    ? "Free"
    : event.ticket_availability?.minimum_ticket_price?.display ?? "See event";

  // Format date for schedule
  const date = new Date(event.start.local);
  const schedule = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  return {
    id:            `eb_${event.id}`,
    name:          event.name.text,
    type:          "Event",
    description:   event.description?.text ?? event.name.text,
    imageUrl:      event.logo?.url || `https://picsum.photos/seed/${event.id}/800/500`,
    address:       event.venue?.address?.localized_address_display ?? "See event page",
    distanceMiles: Math.round(dist * 10) / 10,
    driveMinutes:  Math.round(dist * 3.5),
    ageMin:        0,
    ageMax:        null,
    cost:          isFree ? null : null,
    costLabel:     priceLabel,
    tags:          ["Event", "Family", "Kids"],
    schedule,
    lat:           venueLat,
    lng:           venueLng,
  };
}

export async function fetchEventbriteEvents(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<Activity[]> {
  const key = process.env.EVENTBRITE_API_KEY;
  if (!key) return [];

  const url = new URL("https://www.eventbriteapi.com/v3/events/search/");
  url.searchParams.set("location.latitude", String(lat));
  url.searchParams.set("location.longitude", String(lng));
  url.searchParams.set("location.within", `${radiusKm}km`);
  url.searchParams.set("categories", "1"); // Music + family friendly
  url.searchParams.set("q", "kids family children");
  url.searchParams.set("expand", "venue,ticket_availability,logo");
  url.searchParams.set("page_size", "10");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${key}` },
  });

  if (!res.ok) return [];
  const data = await res.json();

  return (data.events ?? [])
    .filter((e: EventbriteEvent) => e.venue?.latitude)
    .map((e: EventbriteEvent) => eventToActivity(e, lat, lng));
}
