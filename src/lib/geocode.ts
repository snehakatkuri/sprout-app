export interface LatLng {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export async function geocodeLocation(location: string): Promise<LatLng | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${key}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" || !data.results?.[0]) return null;

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng, formattedAddress: data.results[0].formatted_address };
}
