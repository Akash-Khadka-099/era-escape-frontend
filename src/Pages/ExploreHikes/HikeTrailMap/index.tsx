import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Map, {
  Layer,
  Marker,
  Popup,
  Source,
  type MapProps,
  type MapRef,
} from "react-map-gl/maplibre";
import maplibregl, {
  type LngLatBounds,
  type LineLayerSpecification,
  type RasterDEMSourceSpecification,
  type StyleSpecification,
  type SymbolLayerSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { kml as kmlToGeoJSON } from "@tmcw/togeojson";
import { Alert, Button, Space, Typography } from "antd";
import {
  AimOutlined,
  ArrowsAltOutlined,
  BorderOutlined,
  ExpandOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  LineString,
  Point,
} from "geojson";
import { useParams } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FaBinoculars,
  FaCampground,
  FaClipboardCheck,
  FaCouch,
  FaFaucet,
  FaFlagCheckered,
  FaHelicopter,
  FaMapPin,
  FaMountain,
  FaMugHot,
  FaParking,
  FaPlaceOfWorship,
  FaRestroom,
  FaSignInAlt,
  FaTrashAlt,
  FaUmbrellaBeach,
} from "react-icons/fa";
import { FaBridgeWater } from "react-icons/fa6";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import SuspensePageLoader from "@/components/Loaders/SuspensePageLoader";
import { SEO } from "@/components/SEO";
import { useGetHikeBlogDetail } from "@/services/hikeServices/hikeServices";
import type { HikingStop } from "@/types/hike";

const { Title, Text } = Typography;
const BASE_API_URL = import.meta.env.VITE_API_URL || "";


type LatLng = [number, number];
type LngLat = [number, number];
type ViewMode = "3d" | "2d";

type HikeMarker = {
  position: LatLng;
  title: string;
  stopType?: string;
  altitude?: number;
  description?: string;
};

type PathData = {
  coordinates: LngLat[];
  name: string;
  description?: string | null;
  distance?: string;
  time?: string;
  midpoint: LngLat | null;
};

export enum TrekHikeStopType {
  WATER_TAP_POINT = "water_tap_point",
  REST_POINT = "rest_point",
  HIGHEST_POINT = "highest_point",
  FINAL_DESTINATION = "final_destination",
  VIEW_POINT = "view_point",
  CAMPING_AREA = "camping_area",
  PARKING_AREA = "parking_area",
  TEA_FOOD_HOUSE = "tea_food_house",
  PICNIC_SPOT = "picnic_spot",
  HELIPAD = "helipad",
  ENTRY_POINT = "entry_point",
  CHECKPOINT = "checkpoint",
  TOILET = "toilet",
  RELIGIOUS_CULTURAL = "religious_cultural",
  RIVER_BRIDGE = "river_bridge",
  WASTE_DISPOSAL = "waste_disposal",
}

export type StopMarkerConfig = {
  color: string;
  accent: string;
  icon: IconType;
};

export const formatStopTypeLabel = (value?: string) => {
  if (!value) {
    return "Trail Stop";
  }

  return value
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

export const STOP_MARKER_CONFIGS: Partial<Record<TrekHikeStopType, StopMarkerConfig>> =
  {
    [TrekHikeStopType.WATER_TAP_POINT]: {
      color: "#0ea5e9",
      accent: "#38bdf8",
      icon: FaFaucet,
    },
    [TrekHikeStopType.REST_POINT]: {
      color: "#8b5cf6",
      accent: "#a78bfa",
      icon: FaCouch,
    },
    [TrekHikeStopType.HIGHEST_POINT]: {
      color: "#f97316",
      accent: "#fb923c",
      icon: FaMountain,
    },
    [TrekHikeStopType.FINAL_DESTINATION]: {
      color: "#dc2626",
      accent: "#f87171",
      icon: FaFlagCheckered,
    },
    [TrekHikeStopType.VIEW_POINT]: {
      color: "#0891b2",
      accent: "#22d3ee",
      icon: FaBinoculars,
    },
    [TrekHikeStopType.CAMPING_AREA]: {
      color: "#16a34a",
      accent: "#4ade80",
      icon: FaCampground,
    },
    [TrekHikeStopType.PARKING_AREA]: {
      color: "#475569",
      accent: "#94a3b8",
      icon: FaParking,
    },
    [TrekHikeStopType.TEA_FOOD_HOUSE]: {
      color: "#b45309",
      accent: "#f59e0b",
      icon: FaMugHot,
    },
    [TrekHikeStopType.PICNIC_SPOT]: {
      color: "#65a30d",
      accent: "#a3e635",
      icon: FaUmbrellaBeach,
    },
    [TrekHikeStopType.HELIPAD]: {
      color: "#6b7280",
      accent: "#d1d5db",
      icon: FaHelicopter,
    },
    [TrekHikeStopType.ENTRY_POINT]: {
      color: "#2563eb",
      accent: "#60a5fa",
      icon: FaSignInAlt,
    },
    [TrekHikeStopType.CHECKPOINT]: {
      color: "#7c3aed",
      accent: "#c4b5fd",
      icon: FaClipboardCheck,
    },
    [TrekHikeStopType.TOILET]: {
      color: "#0f766e",
      accent: "#2dd4bf",
      icon: FaRestroom,
    },
    [TrekHikeStopType.RELIGIOUS_CULTURAL]: {
      color: "#9333ea",
      accent: "#d8b4fe",
      icon: FaPlaceOfWorship,
    },
    [TrekHikeStopType.RIVER_BRIDGE]: {
      color: "#0284c7",
      accent: "#7dd3fc",
      icon: FaBridgeWater,
    },
    [TrekHikeStopType.WASTE_DISPOSAL]: {
      color: "#334155",
      accent: "#94a3b8",
      icon: FaTrashAlt,
    },
  };

export const DEFAULT_STOP_MARKER_CONFIG: StopMarkerConfig = {
  color: "#f97316",
  accent: "#fdba74",
  icon: FaMapPin,
};

const getStopMarkerConfig = (stopType?: string): StopMarkerConfig => {
  if (!stopType) {
    return DEFAULT_STOP_MARKER_CONFIG;
  }

  return (
    STOP_MARKER_CONFIGS[stopType as TrekHikeStopType] ??
    DEFAULT_STOP_MARKER_CONFIG
  );
};

const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 18,
      attribution: "Tiles © Esri",
    },
  },
  layers: [
    {
      id: "satellite",
      type: "raster",
      source: "satellite",
    },
  ],
};

const trailGlowLayer: LineLayerSpecification = {
  id: "hike-trail-glow",
  type: "line",
  source: "trail-source",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#3174e0",
    "line-width": 1,
    "line-opacity": 0.26,
    "line-blur": 1,
  },
};

const trailLineLayer: LineLayerSpecification = {
  id: "hike-trail-line",
  type: "line",
  source: "trail-source",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#3174e0",
    "line-width": ["interpolate", ["linear"], ["zoom"], 6, 2.5, 10, 4, 14, 6],
    "line-opacity": 0.96,
  },
};

const trailLabelLayer: SymbolLayerSpecification = {
  id: "hike-trail-labels",
  type: "symbol",
  source: "trail-label-source",
  layout: {
    "text-field": ["get", "label"],
    "text-font": ["Open Sans Bold"],
    "text-size": 11,
    "text-anchor": "top",
    "text-offset": [0, 1.1],
  },
  paint: {
    "text-color": "#fff7ed",
    "text-halo-color": "rgba(15, 23, 42, 0.92)",
    "text-halo-width": 1.6,
  },
};

const DEFAULT_VIEW_STATE = {
  latitude: 27.7172,
  longitude: 85.324,
  zoom: 8,
  bearing: 28,
  pitch: 72,
};

const MAX_MAP_ZOOM_3D = 15;
const MAX_MAP_ZOOM_2D = 18;
const THREE_D_DEFAULT_BEARING = 32;
const THREE_D_DEFAULT_PITCH = 74;
const THREE_D_FOCUS_BEARING = 36;
const THREE_D_FOCUS_PITCH = 78;

const TERRAIN_SOURCE: RasterDEMSourceSpecification = {
  type: "raster-dem",
  tiles: [
    "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
  ],
  tileSize: 256,
  maxzoom: 15,
  encoding: "terrarium",
  attribution: "Elevation, Trails, Terrains And Tiles By Era Escape",
};

const THREE_D_TERRAIN: NonNullable<MapProps["terrain"]> = {
  source: "terrain-dem",
  exaggeration: 1.95,
};

const THREE_D_SKY: NonNullable<MapProps["sky"]> = {
  "fog-color": "#dbeafe",
  "fog-ground-blend": 0.8,
  "horizon-fog-blend": 0.08,
  "sky-color": "#020617",
  "horizon-color": "#020617",
  "atmosphere-blend": 0.15,
};

const resolveKmlUrl = (kmlFile: unknown): string | null => {
  if (!kmlFile) {
    return null;
  }

  let path = "";
  if (typeof kmlFile === "string") {
    path = kmlFile;
  } else if (Array.isArray(kmlFile) && kmlFile.length > 0) {
    const firstEntry = kmlFile[0];
    if (firstEntry && typeof firstEntry === "object" && "path" in firstEntry) {
      path = String(firstEntry.path || "");
    }
  } else if (
    typeof kmlFile === "object" &&
    "path" in (kmlFile as Record<string, unknown>)
  ) {
    path = String((kmlFile as { path?: string }).path || "");
  }

  if (!path) {
    return null;
  }

  try {
    const urlObj = new URL(path);
    // If the URL is from the API or local server, rewrite it to a relative path
    // so the Vite proxy handles it and we avoid CORS errors.
    if (
      urlObj.hostname.includes(BASE_API_URL) ||
      urlObj.hostname.includes("localhost") ||
      urlObj.hostname.includes("127.0.0.1")
    ) {
      return urlObj.pathname + urlObj.search;
    }
  } catch (e) {
    // Ignore invalid URLs
  }

  if (path.startsWith("http")) {
    return path;
  }

  return path.startsWith("/") ? path : `/${path}`;
};

const toNumber = (value: unknown): number | null => {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : null;
};

const parseLatLong = (latLong?: number[]): LatLng | null => {
  if (!Array.isArray(latLong) || latLong.length < 2) {
    return null;
  }

  const lat = toNumber(latLong[0]);
  const lng = toNumber(latLong[1]);
  if (lat === null || lng === null) {
    return null;
  }

  return [lat, lng];
};

const toLngLat = (coord: unknown): LngLat | null => {
  if (!Array.isArray(coord) || coord.length < 2) {
    return null;
  }

  const lng = toNumber(coord[0]);
  const lat = toNumber(coord[1]);

  if (lat === null || lng === null) {
    return null;
  }

  return [lng, lat];
};

const extractLineCoordinates = (
  geometry: Geometry | null | undefined,
): LngLat[][] => {
  if (!geometry) {
    return [];
  }

  if (geometry.type === "LineString") {
    return [
      geometry.coordinates
        .map(toLngLat)
        .filter((coordinate): coordinate is LngLat => coordinate !== null),
    ];
  }

  if (geometry.type === "MultiLineString") {
    return geometry.coordinates.map((line) =>
      line
        .map(toLngLat)
        .filter((coordinate): coordinate is LngLat => coordinate !== null),
    );
  }

  if (geometry.type === "GeometryCollection") {
    return geometry.geometries.flatMap(extractLineCoordinates);
  }

  return [];
};

const metersBetween = ([lng1, lat1]: LngLat, [lng2, lat2]: LngLat): number => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const buildMidpoint = (coordinates: LngLat[]): LngLat | null => {
  if (!coordinates.length) {
    return null;
  }

  if (coordinates.length === 1) {
    return coordinates[0];
  }

  const segmentLengths: number[] = [];
  let totalDistance = 0;

  for (let index = 0; index < coordinates.length - 1; index += 1) {
    const segmentDistance = metersBetween(
      coordinates[index],
      coordinates[index + 1],
    );
    totalDistance += segmentDistance;
    segmentLengths.push(segmentDistance);
  }

  if (totalDistance === 0) {
    return coordinates[0];
  }

  let traversedDistance = 0;
  const halfway = totalDistance / 2;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    const nextDistance = traversedDistance + segmentLengths[index];

    if (nextDistance >= halfway) {
      const [startLng, startLat] = coordinates[index];
      const [endLng, endLat] = coordinates[index + 1];
      const localRatio =
        segmentLengths[index] === 0
          ? 0
          : (halfway - traversedDistance) / segmentLengths[index];

      return [
        startLng + (endLng - startLng) * localRatio,
        startLat + (endLat - startLat) * localRatio,
      ];
    }

    traversedDistance = nextDistance;
  }

  return coordinates[Math.floor(coordinates.length / 2)];
};

const buildPathData = (
  coordinates: LngLat[],
  feature?: Feature<Geometry, GeoJsonProperties>,
  fallbackName = "Hike Trail Segment",
): PathData | null => {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }

  let totalDistance = 0;

  for (let index = 0; index < coordinates.length - 1; index += 1) {
    totalDistance += metersBetween(coordinates[index], coordinates[index + 1]);
  }

  const distanceKm = totalDistance / 1000;
  const hours = totalDistance / 3000;
  const properties = feature?.properties ?? {};
  const name =
    typeof properties.name === "string" && properties.name.length > 0
      ? properties.name
      : fallbackName;
  const description =
    typeof properties.description === "string"
      ? properties.description
      : typeof properties.desc === "string"
        ? properties.desc
        : null;

  return {
    coordinates,
    name,
    description,
    distance: `${distanceKm.toFixed(2)} km`,
    time:
      hours < 1 ? `${Math.round(hours * 60)} mins` : `${hours.toFixed(1)} hrs`,
    midpoint: buildMidpoint(coordinates),
  };
};

const parseKmlCoordinateBlock = (rawValue: string): LngLat[] => {
  return rawValue
    .trim()
    .split(/[\s\n\r]+/)
    .map((token) => {
      const [lng, lat] = token.split(",").map((part) => part.trim());
      if (!lng || !lat) {
        return null;
      }

      const parsedLng = toNumber(lng);
      const parsedLat = toNumber(lat);

      if (parsedLng === null || parsedLat === null) {
        return null;
      }

      return [parsedLng, parsedLat] as LngLat;
    })
    .filter((coordinate): coordinate is LngLat => coordinate !== null);
};

const parseGxTrackCoordinates = (trackNode: Element): LngLat[] => {
  const gxCoordNodes = Array.from(
    trackNode.getElementsByTagNameNS("*", "coord"),
  );

  return gxCoordNodes
    .map((node) => {
      const [lng, lat] = (node.textContent || "")
        .trim()
        .split(/\s+/)
        .map((part) => part.trim());

      if (!lng || !lat) {
        return null;
      }

      const parsedLng = toNumber(lng);
      const parsedLat = toNumber(lat);

      if (parsedLng === null || parsedLat === null) {
        return null;
      }

      return [parsedLng, parsedLat] as LngLat;
    })
    .filter((coordinate): coordinate is LngLat => coordinate !== null);
};

const extractPathsFromXml = (xml: Document): PathData[] => {
  const extractedPaths: PathData[] = [];

  const placemarks = Array.from(xml.getElementsByTagName("Placemark"));
  placemarks.forEach((placemark, placemarkIndex) => {
    const placemarkName =
      placemark.getElementsByTagName("name")[0]?.textContent?.trim() ||
      `Hike Trail ${placemarkIndex + 1}`;

    const lineStrings = Array.from(
      placemark.getElementsByTagName("LineString"),
    );
    lineStrings.forEach((lineString, lineIndex) => {
      const coordinateText =
        lineString.getElementsByTagName("coordinates")[0]?.textContent || "";
      const coordinates = parseKmlCoordinateBlock(coordinateText);
      const path = buildPathData(
        coordinates,
        undefined,
        `${placemarkName} ${lineIndex + 1}`,
      );

      if (path) {
        extractedPaths.push(path);
      }
    });

    const tracks = Array.from(placemark.getElementsByTagNameNS("*", "Track"));
    tracks.forEach((track, trackIndex) => {
      const coordinates = parseGxTrackCoordinates(track);
      const path = buildPathData(
        coordinates,
        undefined,
        `${placemarkName} Track ${trackIndex + 1}`,
      );

      if (path) {
        extractedPaths.push(path);
      }
    });
  });

  if (extractedPaths.length > 0) {
    return extractedPaths;
  }

  const documentLineStrings = Array.from(
    xml.getElementsByTagName("LineString"),
  );
  documentLineStrings.forEach((lineString, lineIndex) => {
    const coordinateText =
      lineString.getElementsByTagName("coordinates")[0]?.textContent || "";
    const coordinates = parseKmlCoordinateBlock(coordinateText);
    const path = buildPathData(
      coordinates,
      undefined,
      `Hike Trail ${lineIndex + 1}`,
    );

    if (path) {
      extractedPaths.push(path);
    }
  });

  const documentTracks = Array.from(xml.getElementsByTagNameNS("*", "Track"));
  documentTracks.forEach((track, trackIndex) => {
    const coordinates = parseGxTrackCoordinates(track);
    const path = buildPathData(
      coordinates,
      undefined,
      `Hike Track ${trackIndex + 1}`,
    );

    if (path) {
      extractedPaths.push(path);
    }
  });

  return extractedPaths;
};

const fallbackPathsFromKml = (text: string): PathData[] => {
  const coordinateRegex =
    /<[\w:]*coordinates[^>]*>([\s\S]*?)<\/[\w:]*coordinates>/gi;
  const paths: PathData[] = [];
  let match = coordinateRegex.exec(text);

  while (match) {
    const coordinates = (match[1] || "")
      .trim()
      .split(/[\s\n\r]+/)
      .map((entry) => {
        const [lng, lat] = entry.split(",").map((part) => part.trim());
        if (!lng || !lat) {
          return null;
        }

        return [toNumber(lng), toNumber(lat)];
      })
      .filter(
        (coordinate): coordinate is LngLat =>
          Array.isArray(coordinate) &&
          Number.isFinite(coordinate[0]) &&
          Number.isFinite(coordinate[1]),
      );

    if (coordinates.length > 1) {
      const path = buildPathData(
        coordinates,
        undefined,
        `KML Trail Segment ${paths.length + 1}`,
      );
      if (path) {
        paths.push(path);
      }
    }

    match = coordinateRegex.exec(text);
  }

  return paths;
};

const createBounds = (
  markers: HikeMarker[],
  paths: PathData[],
): LngLatBounds | null => {
  const points = [
    ...markers.map(
      (marker) => [marker.position[1], marker.position[0]] as LngLat,
    ),
    ...paths.flatMap((path) => path.coordinates),
  ];

  if (!points.length) {
    return null;
  }

  const bounds = new maplibregl.LngLatBounds(points[0], points[0]);
  points.slice(1).forEach((point) => bounds.extend(point));
  return bounds;
};

const HikeTrailMap: React.FC = () => {
  const { slug } = useParams();
  const mapRef = useRef<MapRef | null>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("2d");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isTerrainSourceReady, setIsTerrainSourceReady] = useState(false);
  const [isFullPage, setIsFullPage] = useState(false);
  const { data: hikeDetailResponse, isLoading } = useGetHikeBlogDetail(
    slug || "",
  );

  const hikeDetail = hikeDetailResponse?.data;

  const markers = useMemo<HikeMarker[]>(() => {
    const hikingStops: HikingStop[] = hikeDetail?.hikingStops ?? [];

    return hikingStops.reduce<HikeMarker[]>((accumulator, stop) => {
      const position = parseLatLong(stop.latLong);
      if (!position) {
        return accumulator;
      }

      accumulator.push({
        position,
        title: stop?.title || "Trail stop",
        stopType: stop?.stopType,
        altitude: stop?.altitude,
        description: stop?.htmlDescription,
      });

      return accumulator;
    }, []);
  }, [hikeDetail?.hikingStops]);

  const kmlUrl = useMemo(
    () => resolveKmlUrl(hikeDetail?.kmlFile),
    [hikeDetail?.kmlFile],
  );
  const maxMapZoom = viewMode === "3d" ? MAX_MAP_ZOOM_3D : MAX_MAP_ZOOM_2D;

  const displayPaths = useMemo(() => {
    if (paths.length > 0) {
      return paths;
    }

    if (kmlUrl) {
      return [];
    }

    const fallbackCoordinates = markers.map(
      (marker) => [marker.position[1], marker.position[0]] as LngLat,
    );

    if (fallbackCoordinates.length < 2) {
      return [];
    }

    return [
      {
        coordinates: fallbackCoordinates,
        name: hikeDetail?.title ? `${hikeDetail.title} Route` : "Hike Route",
        description: "Fallback route built from hiking stop coordinates.",
        midpoint: buildMidpoint(fallbackCoordinates),
      },
    ];
  }, [hikeDetail?.title, kmlUrl, markers, paths]);

  const trailGeoJson = useMemo<FeatureCollection<LineString>>(
    () => ({
      type: "FeatureCollection",
      features: displayPaths.map((path, index) => ({
        type: "Feature",
        id: `hike-path-${index}`,
        properties: { name: path.name },
        geometry: {
          type: "LineString",
          coordinates: path.coordinates,
        },
      })),
    }),
    [displayPaths],
  );

  const trailLabelGeoJson = useMemo<FeatureCollection<Point>>(
    () => ({
      type: "FeatureCollection",
      features: displayPaths
        .filter((path) => path.midpoint)
        .map((path, index) => ({
          type: "Feature",
          id: `hike-label-${index}`,
          properties: { label: path.name },
          geometry: {
            type: "Point",
            coordinates: path.midpoint as LngLat,
          },
        })),
    }),
    [displayPaths],
  );

  const hoveredMarker =
    hoveredMarkerIndex !== null ? markers[hoveredMarkerIndex] : null;

  const initialViewState = useMemo(() => {
    const firstMarker = markers[0];
    if (firstMarker) {
      return {
        latitude: firstMarker.position[0],
        longitude: firstMarker.position[1],
        zoom: 11,
        bearing: THREE_D_DEFAULT_BEARING,
        pitch: THREE_D_DEFAULT_PITCH,
      };
    }

    const firstPathPoint = displayPaths[0]?.coordinates?.[0];
    if (firstPathPoint) {
      return {
        latitude: firstPathPoint[1],
        longitude: firstPathPoint[0],
        zoom: 10,
        bearing: THREE_D_DEFAULT_BEARING,
        pitch: THREE_D_DEFAULT_PITCH,
      };
    }

    return DEFAULT_VIEW_STATE;
  }, [displayPaths, markers]);

  const terrainConfig: MapProps["terrain"] =
    viewMode === "3d" ? THREE_D_TERRAIN : undefined;
  const projectionConfig: MapProps["projection"] = "mercator";
  const skyConfig: MapProps["sky"] =
    viewMode === "3d" && isTerrainSourceReady ? THREE_D_SKY : undefined;

  useEffect(() => {
    const fetchKml = async () => {
      if (!kmlUrl) {
        setPaths([]);
        return;
      }

      try {
        const response = await fetch(kmlUrl);
        if (!response.ok) {
          throw new Error(`Unable to fetch KML (${response.status})`);
        }

        const text = await response.text();
        const xml = new DOMParser().parseFromString(text, "text/xml");
        const parserError = xml.getElementsByTagName("parsererror")[0];

        if (parserError) {
          throw new Error("The KML file could not be parsed.");
        }

        const geojson = kmlToGeoJSON(xml) as FeatureCollection<
          Geometry,
          GeoJsonProperties
        >;

        const parsedPaths = geojson.features
          .flatMap((feature) =>
            extractLineCoordinates(feature.geometry).map((coordinates, index) =>
              buildPathData(
                coordinates,
                feature,
                `${String(feature.properties?.name || "Hike Trail")} ${index + 1}`,
              ),
            ),
          )
          .filter((path): path is PathData => path !== null);

        if (parsedPaths.length > 0) {
          setPaths(parsedPaths);
          return;
        }

        const xmlDerivedPaths = extractPathsFromXml(xml);
        if (xmlDerivedPaths.length > 0) {
          setPaths(xmlDerivedPaths);
          return;
        }

        setPaths(fallbackPathsFromKml(text));
      } catch (error) {
        console.error("Error fetching or parsing hike KML:", error);
        setPaths([]);
      }
    };

    void fetchKml();
  }, [kmlUrl]);

  const handleFitToTrail = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    const bounds = createBounds(markers, displayPaths);
    if (!bounds) {
      return;
    }

    map.fitBounds(bounds, {
      padding: 80,
      duration: 1800,
      maxZoom: 13,
      pitch: viewMode === "3d" ? THREE_D_DEFAULT_PITCH : 0,
      bearing: viewMode === "3d" ? THREE_D_DEFAULT_BEARING : 0,
      essential: true,
    });
  }, [displayPaths, markers, viewMode]);

  const handleFocusToStart = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    const firstMarker = markers[0];
    if (firstMarker) {
      map.flyTo({
        center: [firstMarker.position[1], firstMarker.position[0]],
        zoom: 13,
        duration: 1500,
        bearing: viewMode === "3d" ? THREE_D_FOCUS_BEARING : 0,
        pitch: viewMode === "3d" ? THREE_D_FOCUS_PITCH : 0,
      });
      return;
    }

    const firstPathPoint = displayPaths[0]?.coordinates?.[0];
    if (firstPathPoint) {
      map.flyTo({
        center: firstPathPoint,
        zoom: 12,
        duration: 1500,
        bearing: viewMode === "3d" ? THREE_D_FOCUS_BEARING : 0,
        pitch: viewMode === "3d" ? THREE_D_FOCUS_PITCH : 0,
      });
    }
  }, [displayPaths, markers, viewMode]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const bounds = createBounds(markers, displayPaths);
      if (!bounds) {
        return;
      }

      map.fitBounds(bounds, {
        padding: 80,
        duration: 1800,
        maxZoom: 13,
        pitch: viewMode === "3d" ? THREE_D_DEFAULT_PITCH : 0,
        bearing: viewMode === "3d" ? THREE_D_DEFAULT_BEARING : 0,
        essential: true,
      });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [displayPaths, markers, viewMode]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!isMapLoaded || !map) {
      return;
    }

    if (viewMode === "3d") {
      map.dragRotate.enable();
      map.touchZoomRotate.enableRotation();
      map.easeTo({
        pitch: Math.max(map.getPitch(), THREE_D_DEFAULT_PITCH),
        bearing:
          map.getBearing() === 0 ? THREE_D_DEFAULT_BEARING : map.getBearing(),
        duration: 900,
      });
      return;
    }

    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.easeTo({
      pitch: 0,
      bearing: 0,
      duration: 900,
    });
  }, [isMapLoaded, viewMode]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    const previousOverflow = document.body.style.overflow;

    if (isFullPage) {
      document.body.style.overflow = "hidden";
    }

    const timeout = window.setTimeout(() => {
      map?.resize();
    }, 320);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timeout);
    };
  }, [isFullPage]);

  if (isLoading) {
    return <SuspensePageLoader />;
  }

  if (!hikeDetail) {
    return <div>Hike map not found.</div>;
  }

  return (
    <>
      <SEO
        title={`${hikeDetail.title} Map`}
        description={`Interactive route map for ${hikeDetail.title}.`}
        canonical={`${window.location.origin}/explore-hikes/map/${hikeDetail.slug}`}
        ogImage={
          hikeDetail.featuredImage?.path
            ? `${import.meta.env.VITE_API_URL}${hikeDetail.featuredImage.path.startsWith("/") ? hikeDetail.featuredImage.path : `/${hikeDetail.featuredImage.path}`}`
            : undefined
        }
      />

      <MiddleContentWrapper extraStyles={{ paddingTop: 24, paddingBottom: 36 }}>
        <div style={{ marginBottom: 20 }}>
          <Title level={1} style={{ marginBottom: 8 }}>
            {hikeDetail?.title} Map
          </Title>
        </div>

        {!kmlUrl && displayPaths.length === 0 ? (
          <Alert
            type="warning"
            showIcon
            icon={<InfoCircleOutlined />}
            message="No KML trail data is available for this hike yet."
          />
        ) : null}

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <Button
            type="primary"
            icon={<AimOutlined />}
            onClick={handleFocusToStart}
          >
            Focus to Start
          </Button>
          <Button
            type="primary"
            icon={<ExpandOutlined />}
            onClick={handleFitToTrail}
          >
            Fit to Trail
          </Button>
        </div>

        {hikeDetail?.isWalkedTrail === false ? (
          <Alert
            message="This route is marked as a reference line and may not reflect a fully walked trail."
            type="warning"
            banner
            showIcon
            icon={<InfoCircleOutlined />}
            style={{ marginBottom: 16 }}
          />
        ) : null}

        <div
          style={{
            height: isFullPage ? "100dvh" : "85vh",
            minHeight: isFullPage ? "100dvh" : 560,
            width: isFullPage ? "100vw" : "100%",
            position: isFullPage ? "fixed" : "relative",
            inset: isFullPage ? 0 : "auto",
            borderRadius: isFullPage ? 0 : 20,
            overflow: "hidden",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            boxShadow: isFullPage
              ? "0 24px 80px rgba(2, 6, 23, 0.42)"
              : "0 24px 60px rgba(15, 23, 42, 0.14)",
            background: "linear-gradient(180deg, #0b1f2d 0%, #234053 100%)",
            transition: "all 0.3s ease",
            zIndex: isFullPage ? 1200 : "auto",
          }}
        >
          <Map
            ref={mapRef}
            mapLib={maplibregl}
            mapStyle={SATELLITE_STYLE}
            initialViewState={initialViewState}
            terrain={terrainConfig}
            projection={projectionConfig}
            sky={skyConfig}
            canvasContextAttributes={{ antialias: true }}
            maxPitch={viewMode === "3d" ? 85 : 0}
            maxZoom={maxMapZoom}
            style={{ width: "100%", height: "100%" }}
            onLoad={() => {
              setIsMapLoaded(true);
              setIsTerrainSourceReady(
                Boolean(mapRef.current?.getMap().getSource("terrain-dem")),
              );
            }}
            onSourceData={(event) => {
              if (
                event.sourceId === "terrain-dem" &&
                (event.isSourceLoaded ||
                  event.sourceDataType === "metadata" ||
                  event.sourceDataType === "content")
              ) {
                setIsTerrainSourceReady(true);
              }
            }}
          >
            <Source id="terrain-dem" {...TERRAIN_SOURCE} />
            {trailGeoJson.features.length > 0 ? (
              <Source id="trail-source" type="geojson" data={trailGeoJson}>
                <Layer {...trailGlowLayer} />
                <Layer {...trailLineLayer} />
              </Source>
            ) : null}

            {trailLabelGeoJson.features.length > 0 ? (
              <Source
                id="trail-label-source"
                type="geojson"
                data={trailLabelGeoJson}
              >
                <Layer {...trailLabelLayer} />
              </Source>
            ) : null}

            {markers.map((marker, index) =>
              (() => {
                const markerConfig = getStopMarkerConfig(marker.stopType);
                const MarkerIcon = markerConfig.icon;
                const markerLabel = marker.stopType
                  ? formatStopTypeLabel(marker.stopType)
                  : marker.title;

                return (
                  <Marker
                    key={`${marker.title}-${index}`}
                    longitude={marker.position[1]}
                    latitude={marker.position[0]}
                    anchor="bottom"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onMouseEnter={() => setHoveredMarkerIndex(index)}
                      onMouseLeave={() =>
                        setHoveredMarkerIndex((current) =>
                          current === index ? null : current,
                        )
                      }
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: "rgba(15, 23, 42, 0.84)",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                          marginBottom: 8,
                          whiteSpace: "nowrap",
                          boxShadow: "0 10px 22px rgba(15, 23, 42, 0.24)",
                        }}
                      >
                        {markerLabel}
                      </div>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${markerConfig.accent} 0%, ${markerConfig.color} 100%)`,
                          border: "2px solid rgba(255, 255, 255, 0.96)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 15,
                          boxShadow: "0 12px 26px rgba(15, 23, 42, 0.28)",
                        }}
                      >
                        <MarkerIcon />
                      </div>
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: "9px solid transparent",
                          borderRight: "9px solid transparent",
                          borderTop: `16px solid ${markerConfig.color}`,
                          marginTop: -2,
                          filter:
                            "drop-shadow(0 8px 14px rgba(15, 23, 42, 0.22))",
                        }}
                      />
                    </div>
                  </Marker>
                );
              })(),
            )}

            {hoveredMarker ? (
              <Popup
                longitude={hoveredMarker.position[1]}
                latitude={hoveredMarker.position[0]}
                anchor="top"
                offset={[0, -36]}
                closeButton={false}
                closeOnClick={false}
                closeOnMove={false}
              >
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700 }}>{hoveredMarker.title}</div>
                  {hoveredMarker.stopType ? (
                    <Text style={{ display: "block", color: "#5f6b6d" }}>
                      {formatStopTypeLabel(hoveredMarker.stopType)}
                    </Text>
                  ) : null}
                  {hoveredMarker.altitude ? (
                    <Text style={{ display: "block", color: "#5f6b6d" }}>
                      {hoveredMarker.altitude} m
                    </Text>
                  ) : null}
                </div>
              </Popup>
            ) : null}
          </Map>

          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              background: "rgba(3, 7, 18, 0.62)",
              backdropFilter: "blur(12px)",
              padding: "12px 18px",
              borderRadius: 14,
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              Hike Route of {hikeDetail.title}
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, opacity: 0.85 }}>
              {viewMode === "3d" ? "3D" : "2D"} KML route and hiking stops
            </p>
          </div>

          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 10,
              background: "rgba(3, 7, 18, 0.62)",
              backdropFilter: "blur(12px)",
              padding: "10px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 18px 40px rgba(2, 6, 23, 0.22)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {[
                { value: "3d" as const, label: "3D", icon: <GlobalOutlined /> },
                { value: "2d" as const, label: "2D", icon: <BorderOutlined /> },
              ].map((option) => {
                const isActive = viewMode === option.value;

                return (
                  <Button
                    key={option.value}
                    type="text"
                    icon={option.icon}
                    onClick={() => setViewMode(option.value)}
                    style={{
                      height: "40px",
                      minWidth: "74px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      border: isActive
                        ? "1px solid rgba(125, 211, 252, 0.5)"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(14, 165, 233, 0.95) 0%, rgba(56, 189, 248, 0.92) 100%)"
                        : "rgba(255, 255, 255, 0.06)",
                      color: isActive ? "#082f49" : "#e2e8f0",
                      fontWeight: 700,
                      boxShadow: isActive
                        ? "0 10px 22px rgba(14, 165, 233, 0.28)"
                        : "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {option.label}
                  </Button>
                );
              })}
              <Button
                type="text"
                icon={isFullPage ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
                onClick={() => setIsFullPage((current) => !current)}
                title={
                  isFullPage ? "Exit full page view" : "Show full page map"
                }
                aria-label={
                  isFullPage ? "Exit full page view" : "Show full page map"
                }
                style={{
                  width: "40px",
                  height: "40px",
                  padding: 0,
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#e2e8f0",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 24,
              right: 20,
              zIndex: 10,
            }}
          >
            <Space direction="vertical">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => mapRef.current?.zoomIn()}
                style={{ width: 44, height: 44, borderRadius: 12 }}
              />
              <Button
                type="primary"
                icon={<MinusOutlined />}
                onClick={() => mapRef.current?.zoomOut()}
                style={{ width: 44, height: 44, borderRadius: 12 }}
              />
            </Space>
          </div>
        </div>
      </MiddleContentWrapper>
    </>
  );
};

export default HikeTrailMap;
