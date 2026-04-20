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
  type HillshadeLayerSpecification,
  type LineLayerSpecification,
  type LngLatBounds,
  type RasterDEMSourceSpecification,
  type StyleSpecification,
  type SymbolLayerSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { kml as kmlToGeoJSON } from "@tmcw/togeojson";
import { Alert, Button, Space, message } from "antd";
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
import TrailLocationDrawer from "../TrailLocationDrawer";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import {
  fetchDestinationHotels,
  useGetTrekBlogDetail,
} from "@/services/trekServices/trekServices";
import { apiEndpoints } from "@/services/apiEndpoints";
import { useParams } from "react-router-dom";
import ItineraryTimeline from "../components/ItineraryTimeline";
import { useQueryClient } from "@tanstack/react-query";

type TrekTrail3DMapProps = {
  hideWrapper?: boolean;
  hideItinerary?: boolean;
};

type ViewMode = "3d" | "2d";
type LatLng = [number, number];
type LngLat = [number, number];

type DestinationRouteTime = {
  timeToTravel?: number | string;
  toTrailDestination?: {
    name?: string;
    latLong?: unknown;
  } | null;
};

type MarkerRouteTime = DestinationRouteTime & {
  toPosition: LatLng;
};

type MarkerData = {
  position: LatLng;
  name: string;
  description: string | null;
  images: string[];
  locationKey: string;
  destinationSlug: string;
  travelTimeToNext?: string;
  hasMultipleNextDestination?: boolean;
  routeTimes: MarkerRouteTime[];
};

type PathData = {
  coordinates: LngLat[];
  name: string;
  description: string | null;
  distance: string;
  time: string;
  midpoint: LngLat | null;
};

type TrekDestination = {
  latLong?: unknown;
  name?: string;
  description?: string | null;
  images?: string[];
  locationKey?: string;
  slug?: string;
  travelTimeToNext?: number | string | null;
  hasMultipleNextDestination?: boolean;
  multipleDestinationRouteTime?: DestinationRouteTime[];
  routeTimes?: DestinationRouteTime[];
};

type TrekDetailData = {
  title?: string;
  kmlFile?: unknown;
  isWalkedTrail?: boolean;
  destinations?: TrekDestination[];
};

type ItineraryDestination =
  React.ComponentProps<typeof ItineraryTimeline>["destinations"][number];

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

const DEFAULT_VIEW_STATE = {
  latitude: 28.3949,
  longitude: 84.124,
  zoom: 7,
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
  attribution: " Elevation, Trails,  Terrains And Tiles By Era Escape",
};

const trailGlowLayer: LineLayerSpecification = {
  id: "trail-glow",
  type: "line",
  source: "trail-source",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#7dd3fc",
    "line-width": 10,
    "line-opacity": 0.25,
    "line-blur": 1,
  },
};

const trailLineLayer: LineLayerSpecification = {
  id: "trail-line",
  type: "line",
  source: "trail-source",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#0ea5e9",
    "line-width": ["interpolate", ["linear"], ["zoom"], 6, 3, 10, 5, 14, 7],
    "line-opacity": 0.95,
  },
};

const trailLabelLayer: SymbolLayerSpecification = {
  id: "trail-labels",
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
    "text-color": "#f8fafc",
    "text-halo-color": "rgba(15, 23, 42, 0.95)",
    "text-halo-width": 1.6,
  },
};

const hoverRouteLabelLayer: SymbolLayerSpecification = {
  id: "hover-routes-label",
  type: "symbol",
  source: "hover-routes-label-source",
  layout: {
    "text-field": ["get", "label"],
    "text-font": ["Open Sans Bold"],
    "text-size": 12,
    "text-anchor": "center",
    "text-allow-overlap": true,
    "text-ignore-placement": true,
    "text-max-width": 20,
  },
  paint: {
    "text-color": "#fde047",
    "text-halo-color": "rgba(15, 23, 42, 0.95)",
    "text-halo-width": 1.6,
  },
};

const hoverRouteLineLayer: LineLayerSpecification = {
  id: "hover-routes-line",
  type: "line",
  source: "hover-routes-line-source",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#facc15",
    "line-width": 3.5,
    "line-opacity": 0.9,
    "line-blur": 0.2,
  },
};

const TREK_MARKER_ICON_ID = "trek-marker-pin";

const createTrekMarkerIcon = (): ImageData | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 72;
  canvas.height = 84;

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.shadowColor = "rgba(15, 23, 42, 0.28)";
  context.shadowBlur = 10;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 8;

  context.fillStyle = "#ef4444";
  context.beginPath();
  context.arc(36, 24, 18, 0, Math.PI * 2);
  context.fill();

  context.lineWidth = 6;
  context.strokeStyle = "#ffffff";
  context.stroke();

  context.beginPath();
  context.moveTo(36, 62);
  context.lineTo(21, 36);
  context.lineTo(51, 36);
  context.closePath();
  context.fill();

  context.shadowColor = "transparent";

  return context.getImageData(0, 0, canvas.width, canvas.height);
};

const trekMarkerIconLayer: SymbolLayerSpecification = {
  id: "trek-markers-icon",
  type: "symbol",
  source: "trek-markers-source",
  layout: {
    "icon-image": TREK_MARKER_ICON_ID,
    "icon-anchor": "bottom",
    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
    "icon-size": [
      "case",
      ["boolean", ["get", "isHovered"], false],
      1.08,
      1,
    ],
  },
};

const trekMarkerLabelLayer: SymbolLayerSpecification = {
  id: "trek-markers-label",
  type: "symbol",
  source: "trek-markers-source",
  layout: {
    "text-field": ["get", "name"],
    "text-font": ["Open Sans Bold"],
    "text-size": 12,
    "text-anchor": "top",
    "text-offset": [0, 1.35],
    "text-allow-overlap": true,
    "text-ignore-placement": true,
    "text-max-width": 12,
  },
  paint: {
    "text-color": "#ffffff",
    "text-halo-color": "rgba(15, 23, 42, 0.95)",
    "text-halo-width": 1.6,
  },
};

const trekMarkerHitAreaLayer = {
  id: "trek-markers-hit-area",
  type: "circle",
  source: "trek-markers-source",
  paint: {
    "circle-radius": 20,
    "circle-color": "#000000",
    "circle-opacity": 0.001,
  },
} as const;

const hillshadeLayer: HillshadeLayerSpecification = {
  id: "terrain-hillshade",
  type: "hillshade",
  source: "terrain-dem",
  paint: {
    "hillshade-shadow-color": "#3f2a1d",
    "hillshade-highlight-color": "#f8f6ef",
    "hillshade-accent-color": "#6c4f3d",
  },
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

const toNumber = (value: unknown): number | null => {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : null;
};

const formatTravelTime = (value?: number | string | null) => {
  if (value === null || value === undefined) {
    return "";
  }

  const normalizedValue = String(value).trim();
  if (!normalizedValue) {
    return "";
  }

  return /\bhr(s)?\b/i.test(normalizedValue)
    ? normalizedValue
    : `${normalizedValue} hr`;
};

const parseLatLong = (latLong: unknown): LatLng => {
  if (typeof latLong === "string" && latLong.includes(",")) {
    const [lat, lng] = latLong.split(",");
    return [toNumber(lat) ?? 0, toNumber(lng) ?? 0];
  }

  if (Array.isArray(latLong) && latLong.length >= 2) {
    return [toNumber(latLong[0]) ?? 0, toNumber(latLong[1]) ?? 0];
  }

  if (latLong && typeof latLong === "object") {
    const value = latLong as Record<string, unknown>;
    return [
      toNumber(value.lat ?? value.latitude) ?? 0,
      toNumber(value.lng ?? value.long ?? value.longitude) ?? 0,
    ];
  }

  return [0, 0];
};

const resolveKmlUrl = (kmlFile: unknown): string | null => {
  if (!kmlFile) {
    return null;
  }

  let path = "";

  if (typeof kmlFile === "string") {
    path = kmlFile;
  } else if (Array.isArray(kmlFile) && kmlFile.length > 0) {
    const first = kmlFile[0] as { path?: string } | undefined;
    path = first?.path ?? "";
  } else if (typeof kmlFile === "object") {
    path = (kmlFile as { path?: string }).path ?? "";
  }

  if (!path) {
    return null;
  }

  if (path.startsWith("http")) {
    return path;
  }

  return path.startsWith("/") ? path : `/${path}`;
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

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
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
        .filter((coord): coord is LngLat => coord !== null),
    ];
  }

  if (geometry.type === "MultiLineString") {
    return geometry.coordinates.map((line) =>
      line.map(toLngLat).filter((coord): coord is LngLat => coord !== null),
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

const midpointOnPath = (coordinates: LngLat[]): LngLat | null => {
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
  fallbackName = "Trail Segment",
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
    midpoint: midpointOnPath(coordinates),
  };
};

const fallbackPathsFromKml = (text: string): PathData[] => {
  const coordinateRegex =
    /<[\w:]*coordinates[^>]*>([\s\S]*?)<\/[\w:]*coordinates>/gi;
  const paths: PathData[] = [];
  let match = coordinateRegex.exec(text);

  while (match) {
    const coordinates = match[1]
      .trim()
      .split(/[\s\n\r]+/)
      .map((token) => {
        const [lng, lat] = token.split(",").map((part) => part.trim());
        if (!lng || !lat) {
          return null;
        }

        return [toNumber(lng), toNumber(lat)];
      })
      .filter(
        (point): point is LngLat =>
          Array.isArray(point) &&
          Number.isFinite(point[0]) &&
          Number.isFinite(point[1]),
      );

    if (coordinates.length > 1) {
      const path = buildPathData(coordinates, undefined, "KML Trail Segment");
      if (path) {
        paths.push(path);
      }
    }

    match = coordinateRegex.exec(text);
  }

  return paths;
};

const createBounds = (
  markers: MarkerData[],
  paths: PathData[],
): LngLatBounds | null => {
  const points = [
    ...markers.map((marker) => [marker.position[1], marker.position[0]] as LngLat),
    ...paths.flatMap((path) => path.coordinates),
  ];

  if (!points.length) {
    return null;
  }

  const bounds = new maplibregl.LngLatBounds(points[0], points[0]);
  points.slice(1).forEach((point) => bounds.extend(point));
  return bounds;
};

const TrekTrail3DMap: React.FC<TrekTrail3DMapProps> = ({
  hideWrapper = false,
  hideItinerary = false,
}) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDestinationSlug, setSelectedDestinationSlug] = useState("");
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(
    null,
  );
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullPage, setIsFullPage] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isMarkerIconReady, setIsMarkerIconReady] = useState(false);
  const [isTerrainSourceReady, setIsTerrainSourceReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("2d");
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const mapRef = useRef<MapRef | null>(null);
  const initialZoomRef = useRef(false);

  const { data: trekDetailResponse } = useGetTrekBlogDetail(slug || "", {
    ignoreLog: true,
  });

  const trekData = trekDetailResponse?.data as TrekDetailData | undefined;

  const itineraryDestinations = useMemo<
    React.ComponentProps<typeof ItineraryTimeline>["destinations"]
  >(
    () =>
      (trekData?.destinations ?? []).map((destination) => ({
        position: destination.latLong
          ? parseLatLong(destination.latLong)
          : undefined,
        name: destination.name ?? null,
        description: destination.description ?? null,
        images: Array.isArray(destination.images) ? destination.images : [],
        locationKey: destination.locationKey,
        slug: destination.slug ?? null,
        travelTimeToNext: destination.travelTimeToNext ?? null,
        hasMultipleNextDestination: destination.hasMultipleNextDestination,
        multipleDestinationRouteTime:
          destination.multipleDestinationRouteTime as ItineraryDestination["multipleDestinationRouteTime"],
        routeTimes: destination.routeTimes as ItineraryDestination["routeTimes"],
        latLong:
          typeof destination.latLong === "string" ? destination.latLong : undefined,
      })),
    [trekData?.destinations],
  );

  const displayPaths = useMemo(() => {
    if (paths.length > 0) {
      return paths;
    }

    const fallbackCoordinates = markers
      .map((marker) => [marker.position[1], marker.position[0]] as LngLat)
      .filter(
        (coordinate, index, coordinates) =>
          index === 0 ||
          coordinate[0] !== coordinates[index - 1][0] ||
          coordinate[1] !== coordinates[index - 1][1],
      );

    if (fallbackCoordinates.length < 2) {
      return [];
    }

    const fallbackPath = buildPathData(
      fallbackCoordinates,
      undefined,
      trekData?.title ? `${trekData.title} Route` : "Trail Route",
    );

    return fallbackPath ? [fallbackPath] : [];
  }, [markers, paths, trekData?.title]);

  const kmlUrl = useMemo(
    () => resolveKmlUrl(trekData?.kmlFile),
    [trekData?.kmlFile],
  );

  const maxMapZoom = viewMode === "3d" ? MAX_MAP_ZOOM_3D : MAX_MAP_ZOOM_2D;

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

  const ensureTrekMarkerIcon = useCallback(async () => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    if (map.hasImage(TREK_MARKER_ICON_ID)) {
      setIsMarkerIconReady(true);
      return;
    }

    const imageData = createTrekMarkerIcon();
    if (!imageData) {
      setIsMarkerIconReady(false);
      return;
    }

    try {
      if (!map.hasImage(TREK_MARKER_ICON_ID)) {
        map.addImage(TREK_MARKER_ICON_ID, imageData, {
          pixelRatio: 2,
        });
      }

      setIsMarkerIconReady(true);
    } catch (error) {
      console.error("Unable to register trek marker icon", error);
      setIsMarkerIconReady(false);
    }
  }, []);

  const handleOpenHotelsDrawer = useCallback(
    async (destinationSlug?: string | null) => {
      const safeDestinationSlug = destinationSlug?.trim();
      if (!slug || !safeDestinationSlug) {
        return;
      }

      try {
        await queryClient.fetchQuery({
          queryKey: [
            apiEndpoints.trekBlogs.fetchDestinationHotels,
            slug,
            safeDestinationSlug,
          ],
          queryFn: () =>
            fetchDestinationHotels({
              trekBlogSlug: slug,
              destinationSlug: safeDestinationSlug,
            }),
          retry: false,
          staleTime: 60 * 1000,
        });

        setSelectedDestinationSlug(safeDestinationSlug);
        setDrawerOpen(true);
      } catch (error: unknown) {
        const status =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { status?: number } }).response?.status ===
            "number"
            ? (error as { response?: { status?: number } }).response?.status
            : undefined;

        if (status !== 401) {
          message.error("Unable to load destination hotels right now.");
        }
      }
    },
    [queryClient, slug],
  );

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
      duration: 2200,
      maxZoom: 13,
      pitch: viewMode === "3d" ? THREE_D_DEFAULT_PITCH : 0,
      bearing: viewMode === "3d" ? THREE_D_DEFAULT_BEARING : 0,
      essential: true,
    });
  }, [displayPaths, markers, viewMode]);

  const handleInitialFlyToTrail = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    const bounds = createBounds(markers, displayPaths);
    if (!bounds) {
      return;
    }

    map.stop();

    if (viewMode === "3d") {
      map.jumpTo({
        center: [84.124, 28.3949],
        zoom: 1.6,
        pitch: 18,
        bearing: 10,
      });
    }

    window.setTimeout(() => {
      map.fitBounds(bounds, {
        padding: 80,
        duration: viewMode === "3d" ? 4200 : 2600,
        maxZoom: 13,
        pitch: viewMode === "3d" ? THREE_D_DEFAULT_PITCH : 0,
        bearing: viewMode === "3d" ? THREE_D_DEFAULT_BEARING : 0,
        essential: true,
      });
    }, viewMode === "3d" ? 260 : 0);
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
        duration: 2000,
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
        duration: 2000,
        bearing: viewMode === "3d" ? THREE_D_FOCUS_BEARING : 0,
        pitch: viewMode === "3d" ? THREE_D_FOCUS_PITCH : 0,
      });
    }
  }, [displayPaths, markers, viewMode]);

  useEffect(() => {
    const destinations = trekData?.destinations;
    if (!Array.isArray(destinations) || destinations.length === 0) {
      setMarkers([]);
      return;
    }

    const nextMarkers: MarkerData[] = destinations.map((destination) => {
      const routeTimeSource =
        destination.multipleDestinationRouteTime &&
        destination.multipleDestinationRouteTime.length > 0
          ? destination.multipleDestinationRouteTime
          : destination.routeTimes;

      const processedRouteTimes: MarkerRouteTime[] = (routeTimeSource ?? [])
        .filter((route) => route?.toTrailDestination?.latLong)
        .map((route) => ({
          ...route,
          toPosition: parseLatLong(route.toTrailDestination?.latLong),
        }));

      return {
        position: parseLatLong(destination.latLong),
        name: destination.name || "Unnamed Point",
        description: destination.description || null,
        images: destination.images || [],
        locationKey: destination.locationKey || "",
        destinationSlug: destination.slug || "",
        travelTimeToNext: destination.travelTimeToNext
          ? `${destination.travelTimeToNext} hr`
          : undefined,
        hasMultipleNextDestination: destination.hasMultipleNextDestination,
        routeTimes: processedRouteTimes,
      };
    });

    setMarkers(nextMarkers);
  }, [trekData]);

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
                `${feature.properties?.name || "Trail"} ${index + 1}`,
              ),
            ),
          )
          .filter((path): path is PathData => path !== null);

        if (parsedPaths.length > 0) {
          setPaths(parsedPaths);
          return;
        }

        setPaths(fallbackPathsFromKml(text));
      } catch (error) {
        console.error("Error fetching or parsing KML:", error);
        setPaths([]);
      }
    };

    void fetchKml();
  }, [kmlUrl]);

  useEffect(() => {
    if (hoveredMarkerIndex !== null && !markers[hoveredMarkerIndex]) {
      setHoveredMarkerIndex(null);
    }
  }, [hoveredMarkerIndex, markers]);

  useEffect(() => {
    if (!isMapLoaded) {
      return;
    }

    void ensureTrekMarkerIcon();
  }, [ensureTrekMarkerIcon, isMapLoaded]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }

    const timeout = window.setTimeout(() => {
      map.resize();
    }, 320);

    return () => window.clearTimeout(timeout);
  }, [isMinimized]);

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

  useEffect(() => {
    if (!isMapLoaded || initialZoomRef.current) {
      return;
    }

    const hasMarkers = markers.length > 0;
    const hasPaths = displayPaths.length > 0;
    const isKmlExpected = Boolean(kmlUrl);

    if ((isKmlExpected && !hasPaths) || (!isKmlExpected && !hasMarkers)) {
      return;
    }

    const timeout = window.setTimeout(() => {
      handleInitialFlyToTrail();
      initialZoomRef.current = true;
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [displayPaths.length, handleInitialFlyToTrail, isMapLoaded, kmlUrl, markers]);

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

  const trailGeoJson = useMemo(
    (): FeatureCollection<LineString> => ({
      type: "FeatureCollection",
      features: displayPaths.map((path, index) => ({
        type: "Feature",
        id: `trail-${index}`,
        properties: {
          name: path.name,
          description: path.description,
        },
        geometry: {
          type: "LineString",
          coordinates: path.coordinates,
        },
      })),
    }),
    [displayPaths],
  );

  const trailLabelGeoJson = useMemo(
    (): FeatureCollection<Point> => ({
      type: "FeatureCollection",
      features: displayPaths
        .filter((path) => path.midpoint !== null && path.name)
        .map((path, index) => ({
          type: "Feature",
          id: `trail-label-${index}`,
          properties: {
            label: [path.name, path.distance].filter(Boolean).join(" • "),
          },
          geometry: {
            type: "Point",
            coordinates: path.midpoint as LngLat,
          },
        })),
    }),
    [displayPaths],
  );

  const hoveredRouteLineGeoJson = useMemo(
    (): FeatureCollection<LineString> => {
      if (hoveredMarkerIndex === null || !markers[hoveredMarkerIndex]) {
        return {
          type: "FeatureCollection",
          features: [],
        };
      }

      const marker = markers[hoveredMarkerIndex];
      const markerLngLat: LngLat = [marker.position[1], marker.position[0]];
      const features: Array<Feature<LineString>> = [];

      if (marker.hasMultipleNextDestination && marker.routeTimes.length > 0) {
        marker.routeTimes.forEach((route, routeIndex) => {
          if (
            route.timeToTravel === null ||
            route.timeToTravel === undefined ||
            route.timeToTravel === ""
          ) {
            return;
          }

          const destinationLngLat: LngLat = [
            route.toPosition[1],
            route.toPosition[0],
          ];

          features.push({
            type: "Feature",
            id: `route-line-${hoveredMarkerIndex}-${routeIndex}`,
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [markerLngLat, destinationLngLat],
            },
          });
        });

        return {
          type: "FeatureCollection",
          features,
        };
      }

      const nextMarker = markers[hoveredMarkerIndex + 1];
      if (
        !nextMarker ||
        !marker.travelTimeToNext ||
        marker.travelTimeToNext === ""
      ) {
        return {
          type: "FeatureCollection",
          features: [],
        };
      }

      features.push({
        type: "Feature",
        id: `route-line-${hoveredMarkerIndex}`,
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            markerLngLat,
            [nextMarker.position[1], nextMarker.position[0]],
          ],
        },
      });

      return {
        type: "FeatureCollection",
        features,
      };
    },
    [hoveredMarkerIndex, markers],
  );

  const hoveredRouteLabelGeoJson = useMemo((): FeatureCollection<Point> => {
    if (hoveredMarkerIndex === null || !markers[hoveredMarkerIndex]) {
      return {
        type: "FeatureCollection",
        features: [],
      };
    }

    const marker = markers[hoveredMarkerIndex];
    const markerLngLat: LngLat = [marker.position[1], marker.position[0]];
    const features: Array<Feature<Point>> = [];

    if (marker.hasMultipleNextDestination && marker.routeTimes.length > 0) {
      marker.routeTimes.forEach((route, routeIndex) => {
        if (
          route.timeToTravel === null ||
          route.timeToTravel === undefined ||
          route.timeToTravel === ""
        ) {
          return;
        }

        const destinationLngLat: LngLat = [
          route.toPosition[1],
          route.toPosition[0],
        ];

        features.push({
          type: "Feature",
          id: `route-label-${hoveredMarkerIndex}-${routeIndex}`,
          properties: {
            label: `Estimated Time from ${
              marker.name || "current destination"
            } to ${
              route.toTrailDestination?.name || "next destination"
            }: ${formatTravelTime(route.timeToTravel)}`,
          },
          geometry: {
            type: "Point",
            coordinates: [
              (markerLngLat[0] + destinationLngLat[0]) / 2,
              (markerLngLat[1] + destinationLngLat[1]) / 2,
            ],
          },
        });
      });

      return {
        type: "FeatureCollection",
        features,
      };
    }

    const nextMarker = markers[hoveredMarkerIndex + 1];
    if (
      !nextMarker ||
      !marker.travelTimeToNext ||
      marker.travelTimeToNext === ""
    ) {
      return {
        type: "FeatureCollection",
        features: [],
      };
    }

    const nextLngLat: LngLat = [nextMarker.position[1], nextMarker.position[0]];

    features.push({
      type: "Feature",
      id: `route-label-${hoveredMarkerIndex}`,
      properties: {
        label: `~${marker.travelTimeToNext} to ${nextMarker.name}`,
      },
      geometry: {
        type: "Point",
        coordinates: [
          (markerLngLat[0] + nextLngLat[0]) / 2,
          (markerLngLat[1] + nextLngLat[1]) / 2,
        ],
      },
    });

    return {
      type: "FeatureCollection",
      features,
    };
  }, [hoveredMarkerIndex, markers]);

  const hoveredMarker =
    hoveredMarkerIndex !== null ? markers[hoveredMarkerIndex] : null;

  const markerGeoJson = useMemo(
    (): FeatureCollection<Point> => ({
      type: "FeatureCollection",
      features: markers.map((marker, index) => ({
        type: "Feature",
        id: `trek-marker-${index}`,
        properties: {
          markerIndex: index,
          name: marker.name,
          destinationSlug: marker.destinationSlug,
          isHovered: hoveredMarkerIndex === index,
        },
        geometry: {
          type: "Point",
          coordinates: [marker.position[1], marker.position[0]],
        },
      })),
    }),
    [hoveredMarkerIndex, markers],
  );

  const getMarkerIndexFromFeatures = useCallback((features?: Array<any>) => {
    const markerFeature = features?.find((feature) => {
      const layerId = feature?.layer?.id;
      return (
        layerId === trekMarkerHitAreaLayer.id ||
        layerId === trekMarkerIconLayer.id ||
        layerId === trekMarkerLabelLayer.id
      );
    });

    const markerIndex = Number(markerFeature?.properties?.markerIndex);
    return Number.isInteger(markerIndex) ? markerIndex : null;
  }, []);

  const mapContent = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <Button
          type="primary"
          size="small"
          icon={<AimOutlined />}
          onClick={handleFocusToStart}
        >
          Focus to Start
        </Button>
        <Button
          size="small"
          type="primary"
          icon={<ExpandOutlined />}
          onClick={handleFitToTrail}
        >
          Fit to Trail
        </Button>
        <Button
          size="small"
          type="primary"
          icon={isMinimized ? <ArrowsAltOutlined /> : <ShrinkOutlined />}
          onClick={() => setIsMinimized((current) => !current)}
        >
          {isMinimized ? "Maximize" : "Minimize"}
        </Button>
      </div>

      {trekData?.isWalkedTrail === false && (
        <Alert
          message="This is an imaginary trail line drawn for reference purposes. We will be providing the real trail path in the near future."
          type="warning"
          banner
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ margin: "1rem 0" }}
        />
      )}

      <div
        style={{
          height: isFullPage ? "100dvh" : isMinimized ? "300px" : "85vh",
          width: isFullPage ? "100vw" : "100%",
          position: isFullPage ? "fixed" : "relative",
          inset: isFullPage ? 0 : "auto",
          transition: "height 0.3s ease",
          borderRadius: isFullPage ? 0 : "16px",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
          zIndex: isFullPage ? 1200 : "auto",
          boxShadow: isFullPage ? "0 24px 80px rgba(2, 6, 23, 0.42)" : "none",
          background:
            "linear-gradient(180deg, rgba(11,31,45,1) 0%, rgba(35,63,83,1) 100%)",
        }}
      >
        <Map
          ref={mapRef}
          mapLib={maplibregl}
          mapStyle={SATELLITE_STYLE}
          initialViewState={initialViewState}
          interactiveLayerIds={
            viewMode === "3d"
              ? [
                  trekMarkerHitAreaLayer.id,
                  trekMarkerIconLayer.id,
                  trekMarkerLabelLayer.id,
                ]
              : undefined
          }
          terrain={terrainConfig}
          projection={projectionConfig}
          sky={skyConfig}
          canvasContextAttributes={{ antialias: true }}
          maxPitch={viewMode === "3d" ? 85 : 0}
          maxZoom={maxMapZoom}
          style={{ width: "100%", height: "100%" }}
          onMouseMove={(event) => {
            if (viewMode !== "3d") {
              return;
            }

            const markerIndex = getMarkerIndexFromFeatures(event.features);
            setHoveredMarkerIndex(markerIndex);

            const canvas = mapRef.current?.getMap().getCanvas();
            if (canvas) {
              canvas.style.cursor = markerIndex !== null ? "pointer" : "";
            }
          }}
          onMouseLeave={() => {
            if (viewMode !== "3d") {
              return;
            }

            setHoveredMarkerIndex(null);

            const canvas = mapRef.current?.getMap().getCanvas();
            if (canvas) {
              canvas.style.cursor = "";
            }
          }}
          onClick={(event) => {
            if (viewMode !== "3d") {
              return;
            }

            const markerIndex = getMarkerIndexFromFeatures(event.features);
            if (markerIndex === null) {
              return;
            }

            const marker = markers[markerIndex];
            if (!marker) {
              return;
            }

            void handleOpenHotelsDrawer(marker.destinationSlug);
          }}
          onLoad={() => {
            setIsMapLoaded(true);
            setIsTerrainSourceReady(
              Boolean(mapRef.current?.getMap().getSource("terrain-dem")),
            );
            void ensureTrekMarkerIcon();
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
          {viewMode === "3d" && <Layer {...hillshadeLayer} />}

          {trailGeoJson.features.length > 0 && (
            <Source id="trail-source" type="geojson" data={trailGeoJson}>
              <Layer {...trailGlowLayer} />
              <Layer {...trailLineLayer} />
            </Source>
          )}

          {trailLabelGeoJson.features.length > 0 && (
            <Source
              id="trail-label-source"
              type="geojson"
              data={trailLabelGeoJson}
            >
              <Layer {...trailLabelLayer} />
            </Source>
          )}

          {hoveredRouteLineGeoJson.features.length > 0 && (
            <Source
              id="hover-routes-line-source"
              type="geojson"
              data={hoveredRouteLineGeoJson}
            >
              <Layer {...hoverRouteLineLayer} />
            </Source>
          )}

          {hoveredRouteLabelGeoJson.features.length > 0 && (
            <Source
              id="hover-routes-label-source"
              type="geojson"
              data={hoveredRouteLabelGeoJson}
            >
              <Layer {...hoverRouteLabelLayer} />
            </Source>
          )}

          {viewMode === "3d" ? (
            markerGeoJson.features.length > 0 && isMarkerIconReady && (
              <Source id="trek-markers-source" type="geojson" data={markerGeoJson}>
                <Layer {...trekMarkerIconLayer} />
                <Layer {...trekMarkerLabelLayer} />
                <Layer {...trekMarkerHitAreaLayer} />
              </Source>
            )
          ) : (
            markers.map((marker, index) => (
              <React.Fragment key={`marker-${index}`}>
                <Marker
                  longitude={marker.position[1]}
                  latitude={marker.position[0]}
                  anchor="bottom"
                  offset={[0, -28]}
                  rotationAlignment="viewport"
                  pitchAlignment="viewport"
                  subpixelPositioning
                  style={{ willChange: "transform" }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      void handleOpenHotelsDrawer(marker.destinationSlug);
                    }}
                    onMouseEnter={() => setHoveredMarkerIndex(index)}
                    onMouseLeave={() =>
                      setHoveredMarkerIndex((current) => {
                        if (current !== index) {
                          return current;
                        }
                        return null;
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        void handleOpenHotelsDrawer(marker.destinationSlug);
                      }
                    }}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "999px",
                      background: "rgba(15, 23, 42, 0.78)",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.28)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      cursor: "pointer",
                      outline: "none",
                      transform: hoveredMarkerIndex === index ? "scale(1.04)" : "",
                      transition: "transform 0.18s ease",
                    }}
                  >
                    {marker.name}
                  </div>
                </Marker>

                <Marker
                  longitude={marker.position[1]}
                  latitude={marker.position[0]}
                  anchor="bottom"
                  rotationAlignment="viewport"
                  pitchAlignment="viewport"
                  subpixelPositioning
                  style={{ willChange: "transform" }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      void handleOpenHotelsDrawer(marker.destinationSlug);
                    }}
                    onMouseEnter={() => setHoveredMarkerIndex(index)}
                    onMouseLeave={() =>
                      setHoveredMarkerIndex((current) => {
                        if (current !== index) {
                          return current;
                        }
                        return null;
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        void handleOpenHotelsDrawer(marker.destinationSlug);
                      }
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      outline: "none",
                      transform: hoveredMarkerIndex === index ? "scale(1.04)" : "",
                      transition: "transform 0.18s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "#ef4444",
                        border: "3px solid #fff",
                        boxShadow: "0 10px 20px rgba(239, 68, 68, 0.35)",
                      }}
                    />
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        marginTop: "-2px",
                        borderLeft: "7px solid transparent",
                        borderRight: "7px solid transparent",
                        borderTop: "14px solid #ef4444",
                        filter: "drop-shadow(0 8px 12px rgba(15,23,42,0.28))",
                      }}
                    />
                  </div>
                </Marker>
              </React.Fragment>
            ))
          )}

          {hoveredMarker && (
            <Popup
              longitude={hoveredMarker.position[1]}
              latitude={hoveredMarker.position[0]}
              anchor="top"
              offset={[0, -36]}
              closeButton={false}
              closeOnClick={false}
              closeOnMove={false}
              focusAfterOpen={false}
            >
              <div
                style={{
                  minWidth: "170px",
                  color: "#0f172a",
                }}
              >
                <div style={{ fontWeight: 700 }}>{hoveredMarker.name}</div>
                <div style={{ fontSize: "11px", opacity: 0.8 }}>
                  {hoveredMarker.position[0].toFixed(4)}°N,{" "}
                  {hoveredMarker.position[1].toFixed(4)}°E
                </div>
              </div>
            </Popup>
          )}
        </Map>

        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "rgba(3, 7, 18, 0.62)",
            backdropFilter: "blur(12px)",
            padding: "12px 20px",
            borderRadius: "12px",
            color: "white",
            zIndex: 10,
            pointerEvents: "none",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
            {viewMode === "3d" ? "3D" : "2D"} Trek Trail of {trekData?.title}
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.8 }}>
            Powered by Era Escape
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
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
              title={isFullPage ? "Exit full page view" : "Show full page map"}
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
            bottom: "40px",
            right: "20px",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Space direction="vertical">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => mapRef.current?.zoomIn()}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "rgba(3, 7, 18, 0.62)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            />
            <Button
              type="primary"
              icon={<MinusOutlined />}
              onClick={() => mapRef.current?.zoomOut()}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "rgba(3, 7, 18, 0.62)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            />
          </Space>
        </div>

        <TrailLocationDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          destinationSlug={selectedDestinationSlug}
        />
      </div>

      {!hideItinerary && (
        <div className="my-4">
          <ItineraryTimeline
            destinations={itineraryDestinations}
            onViewHotels={(destinationSlug: string) => {
              void handleOpenHotelsDrawer(destinationSlug);
            }}
          />
        </div>
      )}
    </>
  );

  return hideWrapper ? (
    mapContent
  ) : (
    <MiddleContentWrapper>{mapContent}</MiddleContentWrapper>
  );
};

export default TrekTrail3DMap;
