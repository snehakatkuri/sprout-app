export interface LatLng {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export async function geocodeLocation(location: string): Promise<LatLng | null> {
  // Try Google first if key is available
  const googleKey = process.env.GOOGLE_PLACES_API_KEY;
  if (googleKey) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${googleKey}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data.status === "OK" && data.results?.[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng, formattedAddress: data.results[0].formatted_address };
    }
  }

  // Fallback: OpenStreetMap Nominatim (free, no key required)
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
  const res  = await fetch(url, {
    headers: { "User-Agent": "SproutApp/1.0 (kid-activity-finder)" },
  });
  const data = await res.json();

  if (!data?.[0]) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    formattedAddress: data[0].display_name,
  };
}
