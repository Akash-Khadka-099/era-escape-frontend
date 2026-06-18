import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import Map, { Marker, Popup, type MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { StyleSpecification } from "maplibre-gl";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaWater,
  FaEye,
  FaLandmark,
  FaLeaf,
  FaPray,
  FaHiking,
  FaStar,
  FaRoute,
  FaCompass,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaMoon,
  FaClock,
  FaGem,
} from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Collapse } from "antd";
import styles from "./OutingsDiscovery.module.scss";
import { useFetchOutingBlogsList } from "@/services/outingServices";
import CustomSearchMapPlaces from "@/components/CustomSearchMapPlaces";
import { useValhallaRouting } from "@/hooks/useValhallaRouting";
import MapTrailLayer from "./components/MapTrailLayer";
import TrailInfoOverlay from "./components/TrailInfoOverlay";

/* ─── Types ─────────────────────────────── */

export enum TravelType {
  SOLO = "solo",
  FAMILY = "family",
  COUPLE = "couple",
  GROUP = "group",
}

export enum OutingDestinationType {
  VIEWPOINT = "viewpoint",
  WATERFALL = "waterfall",
  RELIGIOUS_CULTURAL = "religious_cultural",
  DAM = "dam",
  MUSEUM = "museum",
  PARK = "park",
  LAKE = "lake",
  RIVER = "river",
  FOREST_RESERVE = "forest_reserve",
  HISTORICAL_SITE = "historical_site",
  CAVE = "cave",
  GARDEN = "garden",
  AMUSEMENT_PARK = "amusement_park",
  ZOO = "zoo",
  MONUMENT = "monument",
  HOT_SPRING = "hot_spring",
  VILLAGE_TOUR = "village_tour",
  NATIONAL_PARK = "national_park",
}

type DestinationCategory = string;

interface Destination {
  id: string;
  name: string;
  category: DestinationCategory;
  latitude: number;
  longitude: number;
  image: string;
  description: string;
  distanceKm: number;
  isFeatured?: boolean;
  slug: string;
  nearestTown?: {
    name: string;
    distanceKm: number;
    timeToReach: string;
  };
  isNightOutPlace?: boolean;
  isHiddenGem?: boolean;
  isUnescoSite?: boolean;
}

interface CategoryConfig {
  label: string;
  color: string;
  accent: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
}

const BASE_API_URL = import.meta.env.VITE_API_URL || "";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1200&auto=format&fit=crop";

const buildImageUrl = (imagePath?: string) => {
  if (!imagePath) return FALLBACK_IMAGE;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    return imagePath;
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;
  return `${BASE_API_URL}${normalizedPath}`;
};

/* ─── Map Style ─────────────────────────── */

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

/* ─── Category Configs ──────────────────── */

const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  label: "Destination",
  color: "#6b7280",
  accent: "#f3f4f6",
  icon: FaMapMarkerAlt,
};

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  [OutingDestinationType.MUSEUM]: {
    label: "Museum",
    color: "#dc2626",
    accent: "#fee2e2",
    icon: FaLandmark,
  },
  [OutingDestinationType.RELIGIOUS_CULTURAL]: {
    label: "Religious Site",
    color: "#9333ea",
    accent: "#f3e8ff",
    icon: FaPray,
  },
  [OutingDestinationType.LAKE]: {
    label: "Lake",
    color: "#3b82f6",
    accent: "#dbeafe",
    icon: FaWater,
  },
  [OutingDestinationType.DAM]: {
    label: "Dam",
    color: "#0ea5e9",
    accent: "#e0f2fe",
    icon: FaWater,
  },
  [OutingDestinationType.RIVER]: {
    label: "River",
    color: "#0284c7",
    accent: "#e0f2fe",
    icon: FaWater,
  },
  [OutingDestinationType.WATERFALL]: {
    label: "Waterfall",
    color: "#0ea5e9",
    accent: "#e0f2fe",
    icon: FaWater,
  },
  [OutingDestinationType.VIEWPOINT]: {
    label: "Viewpoint",
    color: "#f59e0b",
    accent: "#fef3c7",
    icon: FaEye,
  },
  [OutingDestinationType.PARK]: {
    label: "Park",
    color: "#16a34a",
    accent: "#dcfce7",
    icon: FaLeaf,
  },
  [OutingDestinationType.FOREST_RESERVE]: {
    label: "Forest Reserve",
    color: "#15803d",
    accent: "#dcfce7",
    icon: FaLeaf,
  },
  [OutingDestinationType.HISTORICAL_SITE]: {
    label: "Historical Site",
    color: "#b91c1c",
    accent: "#fee2e2",
    icon: FaLandmark,
  },
  [OutingDestinationType.CAVE]: {
    label: "Cave",
    color: "#57534e",
    accent: "#e7e5e4",
    icon: FaCompass,
  },
  [OutingDestinationType.GARDEN]: {
    label: "Garden",
    color: "#22c55e",
    accent: "#dcfce7",
    icon: FaLeaf,
  },
  [OutingDestinationType.AMUSEMENT_PARK]: {
    label: "Amusement",
    color: "#f97316",
    accent: "#ffedd5",
    icon: FaStar,
  },
  [OutingDestinationType.ZOO]: {
    label: "Zoo",
    color: "#84cc16",
    accent: "#ecfccb",
    icon: FaLeaf,
  },
  [OutingDestinationType.MONUMENT]: {
    label: "Monument",
    color: "#991b1b",
    accent: "#fee2e2",
    icon: FaLandmark,
  },
  [OutingDestinationType.HOT_SPRING]: {
    label: "Hot Spring",
    color: "#ef4444",
    accent: "#fee2e2",
    icon: FaWater,
  },
  [OutingDestinationType.VILLAGE_TOUR]: {
    label: "Village Tour",
    color: "#d97706",
    accent: "#fef3c7",
    icon: FaHiking,
  },
  [OutingDestinationType.NATIONAL_PARK]: {
    label: "National Park",
    color: "#065f46",
    accent: "#d1fae5",
    icon: FaLeaf,
  },
};

/* ─── Helper: Haversine ─────────────────── */

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ─── Component ─────────────────────────── */

const Outings: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<MapRef | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  /* ── Trail state ── */
  const { activeTrail, isLoadingTrail, trailError, fetchTrail, clearTrail } =
    useValhallaRouting();
  const [showDistanceWarning, setShowDistanceWarning] = useState(false);
  const [warningDistance, setWarningDistance] = useState(0);

  /* ── Location accuracy warning ── */
  // True when browser accuracy is > 1200m (IP-address-level fallback)
  const [locationImprecise, setLocationImprecise] = useState(false);
  const [locationWarningDismissed, setLocationWarningDismissed] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [activeCategories, setActiveCategories] = useState<
    Set<DestinationCategory>
  >(new Set());
  const [isHiddenGem, setIsHiddenGem] = useState(false);
  const [isNightOut, setIsNightOut] = useState(false);
  const [showOtherCategories, setShowOtherCategories] = useState(false);

  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  // searchLocation is the confirmed location used for API queries and the user marker.
  // It is set by: GPS auto-detect (best effort) OR the user searching via the map search bar.
  const [searchLocation, setSearchLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);

  /**
   * userPhysicalLocation — the real GPS fix of the device.
   * Only set on GPS success. Never overwritten by map pan/search.
   * Used as the sole truth for trail distance checks and routing.
   */
  const userPhysicalLocation = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Attempt GPS silently in the background on mount.
  // On desktop, this may be inaccurate (Wi-Fi triangulation).
  // The user can always search the map search bar to correct their location —
  // that search updates both searchLocation (API) and userPhysicalLocation (trail calc).
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    let watchId: number | null = null;
    let locked = false;
    const timeoutId = setTimeout(() => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      locked = true;
    }, 15000);

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        userPhysicalLocation.current = { latitude, longitude };
        setSearchLocation((prev) =>
          // Only auto-set on first detection; don't overwrite if user already searched
          prev ? prev : { latitude, longitude, name: "Current Location" },
        );
        // If accuracy is worse than 1200m, the browser is using an IP-address
        // fallback rather than a real GPS or Wi-Fi fix.
        setLocationImprecise(accuracy > 1200);
        if (accuracy <= 100 && !locked) {
          locked = true;
          clearTimeout(timeoutId);
          navigator.geolocation.clearWatch(watchId!);
        }
      },
      () => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        clearTimeout(timeoutId);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeoutId);
    };
  }, []);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean> = {
      mapMode: "true",
    };
    const hasSearchQuery = !!debouncedSearchQuery.trim();

    if (hasSearchQuery) {
      params.q = debouncedSearchQuery.trim();
    }
    if (activeCategories.size > 0)
      params.destinationType = Array.from(activeCategories).join(",");
    if (isHiddenGem) params.isHiddenGem = "true";
    if (isNightOut) params.isNightOut = "true";

    // Only send real GPS coords — no IP fallback
    if (!hasSearchQuery && searchLocation) {
      params.lat = searchLocation.latitude;
      params.lng = searchLocation.longitude;
      params.near = "true";
    }
    return params;
  }, [
    debouncedSearchQuery,
    activeCategories,
    isHiddenGem,
    isNightOut,
    searchLocation,
  ]);

  const { data } = useFetchOutingBlogsList(queryParams);

  const dynamicDestinations = useMemo<Destination[]>(() => {
    const rawOutings = data?.data || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawOutings.map((item: any) => {
      const destType =
        item.destinationType && item.destinationType.length > 0
          ? item.destinationType[0]
          : OutingDestinationType.VIEWPOINT;

      return {
        id: item._id || item.slug,
        name: item.title,
        category: destType,
        latitude: item.latitude || searchLocation?.latitude || 0,
        longitude: item.longitude || searchLocation?.longitude || 0,
        image: buildImageUrl(item.featuredImage?.path),
        description: item.shortSlogan || "A wonderful destination to visit.",
        distanceKm: Number(
          (item.distanceKm || item.nearestTown?.distanceKm || 0).toFixed(1),
        ),
        isFeatured: item.isHomepagePriority || false,
        slug: item.slug,
        nearestTown: item.nearestTown,
        isNightOutPlace: item.isNightOut?.isNightOutPlace,
        isHiddenGem: item.isHiddenGem,
        isUnescoSite: item.isUnescoSite,
      };
    });
  }, [data, searchLocation]);

  /* ── Computed Data ── */

  const filteredDestinations = dynamicDestinations;

  const recommendedDestinations = useMemo(() => {
    const featured = dynamicDestinations.filter((d) => d.isFeatured);
    return featured.length > 0
      ? featured.slice(0, 3)
      : dynamicDestinations.slice(0, 3);
  }, [dynamicDestinations]);

  /* ── Handlers ── */

  const toggleCategory = useCallback((category: DestinationCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const handleMarkerClick = useCallback((dest: Destination) => {
    setSelectedDestination(dest);
    mapRef.current?.flyTo({
      center: [dest.longitude, dest.latitude],
      zoom: 14,
      duration: 1200,
    });
  }, []);

  const handleRecommendedClick = useCallback(
    (dest: Destination) => {
      handleMarkerClick(dest);
      setSidebarOpen(false);
    },
    [handleMarkerClick],
  );

  const flyToUserLocation = useCallback(() => {
    const loc = searchLocation ?? { latitude: 27.7172, longitude: 85.324 };
    mapRef.current?.flyTo({
      center: [loc.longitude, loc.latitude],
      zoom: 12,
      duration: 1000,
    });
  }, [searchLocation]);

  const handlePlaceSelect = useCallback(
    (lat: number, lon: number, name: string) => {
      // Update both searchLocation (API) and userPhysicalLocation (trail distance calc)
      // so that when the user searches their real area, everything aligns correctly.
      setSearchLocation({ latitude: lat, longitude: lon, name });
      userPhysicalLocation.current = { latitude: lat, longitude: lon };
      // User has corrected their location manually — hide the imprecise warning.
      setLocationImprecise(false);
      setLocationWarningDismissed(false);
      mapRef.current?.flyTo({
        center: [lon, lat],
        zoom: 13,
        duration: 3500,
        essential: true,
      });
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setActiveCategories(new Set());
    setIsHiddenGem(false);
    setIsNightOut(false);
    setSelectedDestination(null);
    clearTrail();
  }, [clearTrail]);

  /* ── Trail: fit map to show both start + end ── */
  useEffect(() => {
    if (!activeTrail || !mapRef.current) return;
    const [minLng, minLat, maxLng, maxLat] = activeTrail.bounds;
    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 60, duration: 1600, essential: true },
    );
  }, [activeTrail]);

  /* ── Trail: show error as warning ── */
  useEffect(() => {
    if (trailError) {
      setShowDistanceWarning(true);
    }
  }, [trailError]);

  /* ── Trail: handle view trails click ── */
  const handleViewTrail = useCallback(
    (dest: Destination) => {
      // Always use the physical GPS location — never the map search location.
      // This ensures a Kathmandu user searching Pokhara still gets measured
      // from Kathmandu, correctly blocking Pokhara outings beyond 120km.
      if (!userPhysicalLocation.current) return;
      const { latitude: userLat, longitude: userLng } =
        userPhysicalLocation.current;
      const distance = haversineDistance(
        userLat,
        userLng,
        dest.latitude,
        dest.longitude,
      );

      if (distance > 120) {
        setWarningDistance(Math.round(distance));
        setShowDistanceWarning(true);
        return;
      }

      fetchTrail({
        destinationId: dest.id,
        destinationName: dest.name,
        userLat,
        userLng,
        destLat: dest.latitude,
        destLng: dest.longitude,
      });
    },
    [fetchTrail], // userPhysicalLocation is a ref — stable, no need in deps
  );

  const serverCategories = useMemo<DestinationCategory[]>(() => {
    const cats = new Set<string>();
    dynamicDestinations.forEach((d) => cats.add(d.category));
    return Array.from(cats);
  }, [dynamicDestinations]);

  const remainingCategories = useMemo<DestinationCategory[]>(() => {
    const allVals = Object.values(OutingDestinationType) as string[];
    return allVals.filter((cat) => !serverCategories.includes(cat));
  }, [serverCategories]);

  return (
    <>
      <SEO
        title="Discover Outings | Era Escape"
        description="Explore nearby destinations, waterfalls, viewpoints, heritage sites, and hidden gems around Kathmandu Valley."
        canonical={`${window.location.origin}/outings`}
      />

      <div className={styles.pageWrapper}>
        {/* ── Sidebar Toggle (Mobile) ── */}
        <button
          className={styles.sidebarToggle}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          id="outing-sidebar-toggle"
        >
          <FaBars />
        </button>

        {/* ── Sidebar Overlay (Mobile) ── */}
        {sidebarOpen && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
        >
          <button
            className={styles.sidebarClose}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>

          <div className={styles.sidebarHeader}>
            <h1 className={styles.sidebarTitle}>
              <span>Discover</span> Outings
            </h1>
            <p className={styles.sidebarSubtitle}>
              Find stunning destinations around your cities.
            </p>
          </div>

          <div className={styles.sidebarContent}>
            {/* ── Search ── */}
            <div className={styles.searchWrapper}>
              <FaSearch className={styles.searchIcon} />
              <input
                id="outing-search-input"
                className={styles.searchInput}
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ── Imprecise Location Warning ── */}
            {locationImprecise && !locationWarningDismissed && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fcd34d",
                  borderLeft: "4px solid #f59e0b",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  marginBottom: "12px",
                  fontSize: "12px",
                  color: "#78350f",
                  lineHeight: 1.5,
                  position: "relative",
                }}
              >
                <button
                  onClick={() => setLocationWarningDismissed(true)}
                  aria-label="Dismiss location warning"
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 8,
                    background: "none",
                    border: "none",
                    color: "#92400e",
                    cursor: "pointer",
                    fontSize: 14,
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ✕
                </button>
                <span style={{ fontWeight: 700, fontSize: 12 }}>
                  📍 Approximate Location
                </span>
                <span>
                  We couldn&apos;t pinpoint your exact device location.
                  Distances shown are estimated from a nearby area.
                </span>
                <button
                  onClick={() => {
                    document.getElementById("outing-search-input")?.focus();
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#b45309",
                    fontWeight: 700,
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 12,
                    textAlign: "left",
                    width: "fit-content",
                  }}
                >
                  Search the outing destinations →
                </button>
              </div>
            )}

            <Collapse
              ghost
              expandIconPosition="end"
              defaultActiveKey={[]}
              style={{ marginBottom: 16 }}
              items={[
                {
                  key: "filters",
                  label: (
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#1a2e23",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Filters
                    </span>
                  ),
                  children: (
                    <>
                      {/* ── Categories ── */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <p
                          className={styles.sectionLabel}
                          style={{ marginBottom: 0 }}
                        >
                          Categories
                        </p>
                        {activeCategories.size > 0 && (
                          <button
                            onClick={() => setActiveCategories(new Set())}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc2626",
                              fontSize: 11,
                              cursor: "pointer",
                              fontWeight: 600,
                              padding: 0,
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className={styles.categoryFilters}>
                        {serverCategories.map((cat) => {
                          const config =
                            CATEGORY_CONFIGS[cat] || DEFAULT_CATEGORY_CONFIG;
                          const isActive = activeCategories.has(cat);
                          return (
                            <button
                              key={cat}
                              id={`outing-category-${cat}`}
                              className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ""}`}
                              onClick={() => toggleCategory(cat)}
                            >
                              <span
                                className={styles.categoryDot}
                                style={{
                                  background: isActive ? "#fff" : config.color,
                                }}
                              />
                              {config.label}
                            </button>
                          );
                        })}

                        {remainingCategories.length > 0 && (
                          <button
                            className={styles.categoryChip}
                            onClick={() =>
                              setShowOtherCategories((prev) => !prev)
                            }
                            style={{ opacity: 0.8 }}
                          >
                            {showOtherCategories
                              ? "- Hide other categories"
                              : "+ Show other categories"}
                          </button>
                        )}

                        {showOtherCategories &&
                          remainingCategories.map((cat) => {
                            const config =
                              CATEGORY_CONFIGS[cat] || DEFAULT_CATEGORY_CONFIG;
                            const isActive = activeCategories.has(cat);
                            return (
                              <button
                                key={cat}
                                id={`outing-category-${cat}`}
                                className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ""}`}
                                onClick={() => toggleCategory(cat)}
                              >
                                <span
                                  className={styles.categoryDot}
                                  style={{
                                    background: isActive
                                      ? "#fff"
                                      : config.color,
                                  }}
                                />
                                {config.label}
                              </button>
                            );
                          })}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <p
                          className={styles.sectionLabel}
                          style={{ marginBottom: 0 }}
                        >
                          Features
                        </p>
                        {(isHiddenGem || isNightOut) && (
                          <button
                            onClick={() => {
                              setIsHiddenGem(false);
                              setIsNightOut(false);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc2626",
                              fontSize: 11,
                              cursor: "pointer",
                              fontWeight: 600,
                              padding: 0,
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <div className={styles.categoryFilters}>
                        <button
                          className={`${styles.categoryChip} ${isHiddenGem ? styles.categoryChipActive : ""}`}
                          onClick={() => setIsHiddenGem(!isHiddenGem)}
                        >
                          Hidden Gem
                        </button>
                        <button
                          className={`${styles.categoryChip} ${isNightOut ? styles.categoryChipActive : ""}`}
                          onClick={() => setIsNightOut(!isNightOut)}
                        >
                          Night Out
                        </button>
                      </div>

                      {/* ── Active Filter Reset ── */}
                      {(debouncedSearchQuery ||
                        activeCategories.size > 0 ||
                        isHiddenGem ||
                        isNightOut) && (
                        <div style={{ textAlign: "center", marginBottom: 16 }}>
                          <button
                            className={styles.resetBtn}
                            onClick={resetFilters}
                          >
                            Reset All Filters
                          </button>
                        </div>
                      )}
                    </>
                  ),
                },
              ]}
            />

            <div className={styles.divider} style={{ margin: "8px 0" }} />

            <h3
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#1a2e23",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 12,
              }}
            >
              <FaMapMarkerAlt style={{ color: "#e8a838" }} /> Nearby Places
            </h3>

            {/* ── Scrollable Outings List ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                paddingBottom: 24,
              }}
            >
              {filteredDestinations.map((dest) => {
                const config =
                  CATEGORY_CONFIGS[dest.category] || DEFAULT_CATEGORY_CONFIG;
                return (
                  <div
                    key={dest.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: 12,
                      borderRadius: 12,
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                    }}
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minWidth: 0,
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1a2e23",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {dest.name}
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 11,
                            color: "#64748b",
                            marginTop: 4,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: config.color,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {config.label}
                          </span>
                          {dest.distanceKm > 0 && (
                            <span style={{ flexShrink: 0 }}>
                              • {dest.distanceKm} km
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button
                          onClick={() => {
                            mapRef.current?.flyTo({
                              center: [dest.longitude, dest.latitude],
                              zoom: 15,
                              duration: 1500,
                            });
                            if (window.innerWidth <= 1024)
                              setSidebarOpen(false);
                          }}
                          style={{
                            flex: 1,
                            padding: "6px 0",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#1a6b4a",
                            background: "rgba(26,107,74,0.1)",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          View in Map
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/outings-detail/${dest.slug}`);
                            if (window.innerWidth <= 1024)
                              setSidebarOpen(false);
                          }}
                          style={{
                            flex: 1,
                            padding: "6px 0",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#fff",
                            background: "#1a6b4a",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── No Results ── */}
              {filteredDestinations.length === 0 && (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🗺️</span>
                  <p className={styles.emptyTitle}>No destinations found</p>
                  <p className={styles.emptySubtitle}>
                    Try adjusting your filters or search query
                  </p>
                  <button className={styles.resetBtn} onClick={resetFilters}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ── Map Area ── */}
        <div className={styles.mapArea}>
          <div className={styles.searchBarContainer}>
            <CustomSearchMapPlaces onPlaceSelect={handlePlaceSelect} />
          </div>

          {/* ── Destination Counter ── */}
          <div className={styles.destCountBadge} id="outing-dest-count">
            <span className={styles.destCountIcon} />
            <FaLayerGroup style={{ fontSize: 14, color: "#5a7267" }} />
            <span>
              {filteredDestinations.length}{" "}
              {filteredDestinations.length === 1
                ? "destination"
                : "destinations"}
            </span>
          </div>

          {/* ── Map Controls ── */}
          <div className={styles.mapControls}>
            <button
              className={styles.mapControlBtn}
              onClick={flyToUserLocation}
              title="Go to my location"
              id="outing-my-location-btn"
            >
              <MdMyLocation />
            </button>
            <button
              className={styles.mapControlBtn}
              onClick={() => {
                const loc = searchLocation ?? {
                  latitude: 27.7172,
                  longitude: 85.324,
                };
                mapRef.current?.flyTo({
                  center: [loc.longitude, loc.latitude],
                  zoom: 11,
                  duration: 1000,
                });
              }}
              title="Reset view"
              id="outing-reset-view-btn"
            >
              <FaCompass />
            </button>
          </div>

          {/* ── The Map ── */}
          <Map
            ref={mapRef}
            mapLib={maplibregl}
            mapStyle={SATELLITE_STYLE}
            initialViewState={{
              latitude: 27.7172,
              longitude: 85.324,
              zoom: 11,
            }}
            maxZoom={18}
            style={{ width: "100%", height: "100%" }}
          >
            {/* ── User Location Marker ── */}
            {searchLocation && (
              <Marker
                latitude={searchLocation.latitude}
                longitude={searchLocation.longitude}
                anchor="center"
              >
                <div className={styles.userMarker} title={searchLocation.name}>
                  <div className={styles.userMarkerPulse} />
                  <div className={styles.userMarkerDot} />
                </div>
              </Marker>
            )}

            {/* ── Destination Markers ── */}
            {filteredDestinations.map((dest) => {
              const config =
                CATEGORY_CONFIGS[dest.category] || DEFAULT_CATEGORY_CONFIG;
              const isSelected = selectedDestination?.id === dest.id;
              const IconComp = config.icon;

              return (
                <Marker
                  key={dest.id}
                  latitude={dest.latitude}
                  longitude={dest.longitude}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    handleMarkerClick(dest);
                  }}
                >
                  <div className={styles.markerWrapper}>
                    {isSelected && (
                      <div
                        className={styles.markerPulse}
                        style={{ background: config.color }}
                      />
                    )}
                    <div
                      className={`${styles.markerPin} ${isSelected ? styles.markerActive : ""}`}
                      style={{ background: config.color }}
                    >
                      <IconComp className={styles.markerIcon} />
                    </div>
                    <div className={styles.markerLabelContainer}>
                      <span className={styles.markerLabelShort}>
                        {dest.name.split(" ")[0]}
                        {dest.name.split(" ").length > 1 ? "..." : ""}
                      </span>
                      <span className={styles.markerLabelFull}>
                        {dest.name}
                      </span>
                    </div>
                  </div>
                </Marker>
              );
            })}

            {/* ── Trail Layer ── */}
            {activeTrail && <MapTrailLayer geojson={activeTrail.geojson} />}

            {/* ── Popup ── */}
            {selectedDestination && (
              <Popup
                latitude={selectedDestination.latitude}
                longitude={selectedDestination.longitude}
                anchor="bottom"
                offset={[0, -48] as [number, number]}
                closeOnClick={false}
                onClose={() => setSelectedDestination(null)}
                maxWidth="320px"
                className="outing-popup"
              >
                <DestinationPopupCard
                  destination={selectedDestination}
                  activeTrailId={activeTrail?.destinationId ?? null}
                  isLoadingTrail={isLoadingTrail}
                  onViewTrail={handleViewTrail}
                />
              </Popup>
            )}
          </Map>

          {/* ── Trail Info Overlay ── */}
          {activeTrail && (
            <TrailInfoOverlay
              startPlaceName={activeTrail.startPlaceName}
              destinationName={activeTrail.destinationName}
              distanceKm={activeTrail.distanceKm}
              durationLabel={activeTrail.durationLabel}
              onClear={clearTrail}
            />
          )}
        </div>
      </div>

      {/* ── Distance Warning Modal ── */}
      {showDistanceWarning && (
        <div
          className={styles.distanceWarningBackdrop}
          onClick={() => setShowDistanceWarning(false)}
        >
          <div
            className={styles.distanceWarningCard}
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.distanceWarningIcon}>🗺️</span>
            <h3 className={styles.distanceWarningTitle}>
              {trailError ? "Route Unavailable" : "Too Far for Trails"}
            </h3>
            <p className={styles.distanceWarningText}>
              {trailError
                ? "We couldn't calculate a route to this destination. Please try again later."
                : `This destination is approximately ${warningDistance} km away. You can only view trails for destinations within 120 km of your current location.`}
            </p>
            <button
              className={styles.distanceWarningCloseBtn}
              onClick={() => setShowDistanceWarning(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* ─── Popup Card Sub-Component ──────────── */

interface PopupCardProps {
  destination: Destination;
  activeTrailId: string | null;
  isLoadingTrail: boolean;
  onViewTrail: (dest: Destination) => void;
}

const DestinationPopupCard: React.FC<PopupCardProps> = ({
  destination,
  activeTrailId,
  isLoadingTrail,
  onViewTrail,
}) => {
  const navigate = useNavigate();
  const config =
    CATEGORY_CONFIGS[destination.category] || DEFAULT_CATEGORY_CONFIG;

  return (
    <div className={styles.popupCard}>
      <img
        src={destination.image}
        alt={destination.name}
        className={styles.popupImage}
        loading="lazy"
      />
      <div className={styles.popupBody}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <span
            className={styles.popupCategory}
            style={{
              background: config.accent,
              color: config.color,
              marginBottom: 0,
            }}
          >
            <config.icon style={{ fontSize: 11 }} />
            {config.label}
          </span>
          {destination.isNightOutPlace && (
            <span
              className={styles.popupCategory}
              style={{
                background: "#1e293b",
                color: "#fef08a",
                marginBottom: 0,
                padding: "4px 8px",
              }}
            >
              <FaMoon style={{ fontSize: 10 }} /> Night Out
            </span>
          )}
        </div>
        <h3 className={styles.popupName}>{destination.name}</h3>
        <p className={styles.popupDescription}>{destination.description}</p>

        {destination.nearestTown && (
          <div
            style={{
              fontSize: 12,
              color: "#64748b",
              marginBottom: 12,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <FaMapMarkerAlt /> {destination.nearestTown.name} (
              {destination.nearestTown.distanceKm}km)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <FaClock /> {destination.nearestTown.timeToReach}
            </span>
          </div>
        )}

        {destination.isHiddenGem || destination.isUnescoSite ? (
          <>
            <div className={styles.popupFooter}>
              {destination.isHiddenGem ? (
                <span
                  className={styles.popupDistance}
                  style={{
                    color: "#d97706",
                    background: "#fef3c7",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  <FaGem style={{ fontSize: 13, marginRight: 4 }} /> Hidden Gem
                </span>
              ) : (
                <span
                  className={styles.popupDistance}
                  style={{
                    color: "#4338ca",
                    background: "#e0e7ff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  <FaLandmark style={{ fontSize: 13, marginRight: 4 }} /> UNESCO
                  Site
                </span>
              )}
              <button
                className={styles.popupViewBtn}
                id={`outing-view-${destination.id}`}
                onClick={() => navigate(`/outings-detail/${destination.slug}`)}
              >
                View Details
              </button>
            </div>

            {/* ── Trail Button ── */}
            <button
              id={`outing-trail-${destination.id}`}
              className={`${styles.trailBtn} ${
                activeTrailId === destination.id ? styles.trailBtnActive : ""
              } ${isLoadingTrail ? styles.trailBtnLoading : ""}`}
              onClick={() => onViewTrail(destination)}
              disabled={isLoadingTrail}
            >
              {isLoadingTrail && activeTrailId !== destination.id ? (
                <>
                  <span className={styles.trailBtnSpinner} />
                  Fetching Trail...
                </>
              ) : activeTrailId === destination.id ? (
                <>
                  <FaRoute /> Trail Active
                </>
              ) : (
                <>
                  <FaRoute /> View Map Trail
                </>
              )}
            </button>
          </>
        ) : (
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button
              className={styles.popupViewBtn}
              style={{
                flex: 1,
                margin: 0,
                padding: "8px 0",
                textAlign: "center",
              }}
              id={`outing-view-${destination.id}`}
              onClick={() => navigate(`/outings-detail/${destination.slug}`)}
            >
              View Details
            </button>
            <button
              id={`outing-trail-${destination.id}`}
              className={`${styles.trailBtn} ${
                activeTrailId === destination.id ? styles.trailBtnActive : ""
              } ${isLoadingTrail ? styles.trailBtnLoading : ""}`}
              style={{ flex: 1, margin: 0, padding: "8px 0" }}
              onClick={() => onViewTrail(destination)}
              disabled={isLoadingTrail}
            >
              {isLoadingTrail && activeTrailId !== destination.id ? (
                <>
                  <span className={styles.trailBtnSpinner} />
                  Fetching...
                </>
              ) : activeTrailId === destination.id ? (
                <>
                  <FaRoute /> Active
                </>
              ) : (
                <>
                  <FaRoute /> Map Trail
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Outings;
