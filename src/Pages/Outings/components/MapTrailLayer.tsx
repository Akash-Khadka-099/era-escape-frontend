/**
 * MapTrailLayer.tsx
 * Renders the active trail as an animated GeoJSON line on the MapLibre map.
 * Uses a progressive draw animation via line-dasharray.
 * Kept as a pure, memoized component to avoid unnecessary re-renders.
 */

import React, { useEffect, useRef } from "react";
import { Source, Layer, useMap } from "react-map-gl/maplibre";
import type { LineLayerSpecification } from "maplibre-gl";

interface MapTrailLayerProps {
  geojson: GeoJSON.FeatureCollection<GeoJSON.LineString>;
}

const TRAIL_SOURCE_ID = "valhalla-trail-source";
const TRAIL_GLOW_LAYER_ID = "valhalla-trail-glow";
const TRAIL_LINE_LAYER_ID = "valhalla-trail-line";
const TRAIL_ANIM_LAYER_ID = "valhalla-trail-animated";

// Glow/shadow layer behind the main line for a premium look
const glowLayerStyle: LineLayerSpecification = {
  id: TRAIL_GLOW_LAYER_ID,
  type: "line",
  source: TRAIL_SOURCE_ID,
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#34d399",
    "line-width": 12,
    "line-opacity": 0.18,
    "line-blur": 6,
  },
};

// Solid base trail line
const trailLineStyle: LineLayerSpecification = {
  id: TRAIL_LINE_LAYER_ID,
  type: "line",
  source: TRAIL_SOURCE_ID,
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#10b981",
    "line-width": 4,
    "line-opacity": 0.9,
  },
};

// Animated dashed overlay on top for the "drawing" effect
const animatedLayerStyle: LineLayerSpecification = {
  id: TRAIL_ANIM_LAYER_ID,
  type: "line",
  source: TRAIL_SOURCE_ID,
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#ffffff",
    "line-width": 2.5,
    "line-opacity": 0.7,
    "line-dasharray": [0, 4, 3],
  },
};

const MapTrailLayer: React.FC<MapTrailLayerProps> = ({ geojson }) => {
  const { current: map } = useMap();
  const animFrameRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  // Progressive draw-on animation via line-dasharray manipulation
  useEffect(() => {
    if (!map) return;

    // Reset step on new trail
    stepRef.current = 0;

    const dashArraySequence = [
      [0, 4, 3],
      [0.5, 4, 2.5],
      [1, 4, 2],
      [1.5, 4, 1.5],
      [2, 4, 1],
      [2.5, 4, 0.5],
      [3, 4, 0],
      [0, 0.5, 3, 3.5],
      [0, 1, 3, 3],
      [0, 1.5, 3, 2.5],
      [0, 2, 3, 2],
      [0, 2.5, 3, 1.5],
      [0, 3, 3, 1],
      [0, 3.5, 3, 0.5],
    ];

    const animate = () => {
      const idx = stepRef.current % dashArraySequence.length;
      // map.getMap() returns the underlying native maplibre-gl Map instance,
      // which has setPaintProperty/getLayer — not available on the MapRef wrapper.
      const nativeMap = map.getMap();
      const layer = nativeMap.getLayer(TRAIL_ANIM_LAYER_ID);
      if (layer) {
        nativeMap.setPaintProperty(
          TRAIL_ANIM_LAYER_ID,
          "line-dasharray",
          dashArraySequence[idx],
        );
      }
      stepRef.current++;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    // Small delay to let the source/layers mount before animation starts
    const timeout = setTimeout(() => {
      animFrameRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [map, geojson]);

  return (
    <Source id={TRAIL_SOURCE_ID} type="geojson" data={geojson}>
      <Layer {...glowLayerStyle} />
      <Layer {...trailLineStyle} />
      <Layer {...animatedLayerStyle} />
    </Source>
  );
};

export default React.memo(MapTrailLayer);
