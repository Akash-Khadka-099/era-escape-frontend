/**
 * useValhallaRouting.ts
 * Custom hook for managing trail routing state.
 * - Enforces single active trail
 * - Caches routes by coordinate key to prevent redundant API calls
 * - Provides loading and error states
 */

import { useState, useRef, useCallback } from "react";
import {
  fetchValhallaRoute,
  fetchNearestPlace,
  formatDuration,
  type ValhallaRouteResult,
} from "@/services/mapServices";

/* ─── Types ─────────────────────────────── */

export interface ActiveTrail {
  destinationId: string;
  destinationName: string;
  startPlaceName: string;
  geojson: GeoJSON.FeatureCollection<GeoJSON.LineString>;
  distanceKm: number;
  durationLabel: string;
  /** Bounding box [minLng, minLat, maxLng, maxLat] for fitBounds */
  bounds: [number, number, number, number];
}

export interface UseValhallaRoutingReturn {
  activeTrail: ActiveTrail | null;
  isLoadingTrail: boolean;
  trailError: string | null;
  fetchTrail: (params: FetchTrailParams) => Promise<void>;
  clearTrail: () => void;
}

export interface FetchTrailParams {
  destinationId: string;
  destinationName: string;
  userLat: number;
  userLng: number;
  destLat: number;
  destLng: number;
}

/* ─── Cache Key ─────────────────────────── */

const makeCacheKey = (
  userLat: number,
  userLng: number,
  destLat: number,
  destLng: number,
): string =>
  `${userLat.toFixed(4)},${userLng.toFixed(4)}_${destLat.toFixed(4)},${destLng.toFixed(4)}`;

/* ─── Bounds Helper ─────────────────────── */

function computeBounds(
  coords: number[][],
): [number, number, number, number] {
  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity;

  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }

  // Add padding
  const padLng = (maxLng - minLng) * 0.15;
  const padLat = (maxLat - minLat) * 0.15;

  return [minLng - padLng, minLat - padLat, maxLng + padLng, maxLat + padLat];
}

/* ─── Hook ──────────────────────────────── */

export function useValhallaRouting(): UseValhallaRoutingReturn {
  const [activeTrail, setActiveTrail] = useState<ActiveTrail | null>(null);
  const [isLoadingTrail, setIsLoadingTrail] = useState(false);
  const [trailError, setTrailError] = useState<string | null>(null);

  // In-memory cache: cacheKey → resolved result
  const cache = useRef<Map<string, ValhallaRouteResult & { startPlaceName: string }>>(
    new Map(),
  );

  const fetchTrail = useCallback(
    async ({
      destinationId,
      destinationName,
      userLat,
      userLng,
      destLat,
      destLng,
    }: FetchTrailParams) => {
      // If this destination trail is already active, do nothing
      if (activeTrail?.destinationId === destinationId) return;

      setIsLoadingTrail(true);
      setTrailError(null);

      const cacheKey = makeCacheKey(userLat, userLng, destLat, destLng);

      try {
        let result: ValhallaRouteResult & { startPlaceName: string };

        if (cache.current.has(cacheKey)) {
          result = cache.current.get(cacheKey)!;
        } else {
          // Fetch in parallel: route + nearest place name
          const [routeResult, placeResult] = await Promise.all([
            fetchValhallaRoute(userLat, userLng, destLat, destLng),
            fetchNearestPlace(userLat, userLng),
          ]);

          result = { ...routeResult, startPlaceName: placeResult.name };
          cache.current.set(cacheKey, result);
        }

        const coords =
          result.geojson.features[0]?.geometry?.coordinates ?? [];
        const bounds = computeBounds(coords);

        setActiveTrail({
          destinationId,
          destinationName,
          startPlaceName: result.startPlaceName,
          geojson: result.geojson,
          distanceKm: Math.round(result.summary.length * 10) / 10,
          durationLabel: formatDuration(result.summary.time),
          bounds,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch trail.";
        setTrailError(message);
        setActiveTrail(null);
      } finally {
        setIsLoadingTrail(false);
      }
    },
    [activeTrail?.destinationId],
  );

  const clearTrail = useCallback(() => {
    setActiveTrail(null);
    setTrailError(null);
  }, []);

  return { activeTrail, isLoadingTrail, trailError, fetchTrail, clearTrail };
}
