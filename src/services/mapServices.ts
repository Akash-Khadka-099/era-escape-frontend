/**
 * mapServices.ts
 * Handles all external map-related API calls:
 *  - Valhalla routing (OSM-based, free)
 *  - Photon reverse geocoding (Komoot, free)
 */

const VALHALLA_ENDPOINT = "https://valhalla1.openstreetmap.de/route";
const PHOTON_REVERSE_ENDPOINT = "https://photon.komoot.io/reverse";

/* ─── Types ─────────────────────────────── */

export interface ValhallaRouteSummary {
  length: number; // km
  time: number;   // seconds
}

export interface ValhallaRouteResult {
  geojson: GeoJSON.FeatureCollection<GeoJSON.LineString>;
  summary: ValhallaRouteSummary;
}

export interface PhotonLocation {
  name: string;
  city?: string;
  state?: string;
  country?: string;
}

/* ─── Polyline Decoder ──────────────────── */
// Valhalla returns an encoded polyline string (precision 6).
// This decodes it into [lng, lat] coordinate pairs for GeoJSON.

export function decodePolyline(encoded: string, precision = 6): [number, number][] {
  const factor = Math.pow(10, precision);
  const coordinates: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push([lng / factor, lat / factor]);
  }

  return coordinates;
}

/* ─── Valhalla Routing ──────────────────── */

export async function fetchValhallaRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
): Promise<ValhallaRouteResult> {
  const body = {
    locations: [
      { lon: startLng, lat: startLat, type: "break" },
      { lon: endLng, lat: endLat, type: "break" },
    ],
    costing: "auto",
    directions_options: { units: "kilometers" },
  };

  const response = await fetch(VALHALLA_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Valhalla API error: ${response.status}`);
  }

  const data = await response.json();
  const leg = data.trip?.legs?.[0];

  if (!leg) {
    throw new Error("No route returned from Valhalla.");
  }

  const coordinates = decodePolyline(leg.shape, 6);

  const geojson: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates,
        },
        properties: {},
      },
    ],
  };

  return {
    geojson,
    summary: {
      length: data.trip?.summary?.length ?? 0,
      time: data.trip?.summary?.time ?? 0,
    },
  };
}

/* ─── Photon Reverse Geocoding ──────────── */

export async function fetchNearestPlace(
  lat: number,
  lng: number,
): Promise<PhotonLocation> {
  const url = `${PHOTON_REVERSE_ENDPOINT}?lon=${lng}&lat=${lat}&limit=1&lang=en`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Photon API error: ${response.status}`);
  }

  const data = await response.json();
  const props = data?.features?.[0]?.properties;

  if (!props) {
    return { name: "Your Location" };
  }

  // Prefer suburb/village/town over raw city for more precision
  const name =
    props.name ||
    props.suburb ||
    props.village ||
    props.town ||
    props.city ||
    "Your Location";

  return {
    name,
    city: props.city || props.town || props.village,
    state: props.state,
    country: props.country,
  };
}

/* ─── Time Formatter ────────────────────── */

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} min`;
}
