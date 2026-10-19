import {
  TrekData,
  Destination,
  Facility,
  PanoramicView,
  VideoItem,
  GalleryItem,
} from "@/Pages/TrekTrails/VirtualTour/types";
import { buildImageUrl, capitalizeFirstWord } from "@/utils/helper";

const FACILITY_ICONS: Record<string, string> = {
  wifi: "📶",
  atm: "🏧",
  teahouses: "☕",
  "medical-post": "🏥",
  charging: "🔋",
  "hot-shower": "🚿",
  bakery: "🥐",
  "gear-shops": "🎒",
  museum: "🏛️",
  laundry: "🧺",
  restaurant: "🍽️",
  water: "💧",
};

const defaultEmptyTrekData: TrekData = {
  trek: {
    name: "",
    slug: "",
    region: "",
    country: "Nepal",
    coverImage: "",
    totalDistance: 0,
    totalDistanceUnit: "km",
    totalAscent: 0,
    totalAscentUnit: "m",
    maxAltitude: 0,
    duration: "",
    difficulty: "Moderate",
    bestSeason: "",
    startingPoint: "",
    endingPoint: "",
    overview: "",
    permitRequired: false,
    estimatedCost: "",
    destinations: [],
  },
};

/**
 * Generates free Google Maps Street View Embed URL from panoId or lat/lng.
 * Uses free protobuf or svembed URL format without consuming API keys.
 */
export function formatGoogleStreetViewUrl(
  streetView: any,
  defaultLatLong?: [number, number],
): string {
  if (!streetView) return "";
  if (streetView.embedUrl) return streetView.embedUrl;
  if (streetView.googleMapsSrc) return streetView.googleMapsSrc;
  if (streetView.src && (streetView.src.startsWith("http") || streetView.src.startsWith("//"))) {
    return streetView.src;
  }

  const heading = streetView.heading ?? 0;
  const pitch = streetView.pitch ?? 0;
  const lat = streetView.latitude ?? defaultLatLong?.[0] ?? 0;
  const lng = streetView.longitude ?? defaultLatLong?.[1] ?? 0;

  if (streetView.panoId) {
    // Free Google Maps Street View Embed (standard protobuf format without key)
    return `https://www.google.com/maps/embed?pb=!4v1788339744240!6m8!1m7!1s${encodeURIComponent(
      streetView.panoId,
    )}!2m2!1d${lat}!2d${lng}!3f${heading}!4f${pitch}!5f0.7820865974627469`;
  }

  if (lat && lng) {
    // Free Street View embed by coordinates
    return `https://maps.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=11,${heading},0,${pitch},0&output=svembed`;
  }

  return "";
}

/**
 * Formats a raw facility string or object into a standardized Facility UI object.
 */
export function formatFacility(fac: any): Facility {
  if (typeof fac === "string") {
    const normalizedKey = fac.toLowerCase().trim();
    const icon = FACILITY_ICONS[normalizedKey] || "📍";
    const name = capitalizeFirstWord(normalizedKey.replace(/-/g, " "));
    return {
      type: normalizedKey,
      name,
      icon,
      available: true,
    };
  }

  return {
    type: fac.type || "general",
    name: fac.name || "Facility",
    icon: fac.icon || FACILITY_ICONS[fac.type?.toLowerCase()] || "📍",
    available: fac.available !== false,
    notes: fac.notes,
  };
}

/**
 * Transforms backend API virtual tour response or trek detail into normalized TrekData for UI.
 */
export const buildVirtualTourData = (
  apiPayload?: any,
  fallbackTrekDetail?: any,
): TrekData => {
  // Extract nested data payload if wrapped in axios or { data: { ... } }
  const rawData = apiPayload?.data || apiPayload;
  const rawTrek = rawData?.trek || fallbackTrekDetail;
  const rawDestinations = rawData?.destinations || fallbackTrekDetail?.destinations;

  if (!rawTrek && !rawDestinations) {
    return defaultEmptyTrekData;
  }

  const trekTitle = rawTrek?.title || rawTrek?.name || "";
  const trekSlug = rawTrek?.slug || "";

  const regionName = Array.isArray(rawTrek?.trekRegion)
    ? rawTrek.trekRegion[0]?.name || ""
    : rawTrek?.trekRegion?.name || rawTrek?.country || "";

  const coverImage = rawTrek?.featuredImage?.path
    ? buildImageUrl(rawTrek.featuredImage.path)
    : rawTrek?.featuredImage && typeof rawTrek.featuredImage === "string"
    ? buildImageUrl(rawTrek.featuredImage)
    : "";

  const featuredVideo = rawTrek?.featuredVideo?.path
    ? buildImageUrl(rawTrek.featuredVideo.path)
    : rawTrek?.featuredVideo && typeof rawTrek.featuredVideo === "string"
    ? buildImageUrl(rawTrek.featuredVideo)
    : undefined;

  let mappedDestinations: Destination[] = [];

  if (Array.isArray(rawDestinations) && rawDestinations.length > 0) {
    mappedDestinations = rawDestinations.map((dest: any, idx: number) => {
      const destMedia = dest?.media || {};

      // 1. Featured image
      const featuredImagePath =
        destMedia?.featuredImage?.path ||
        dest?.featuredImage?.path ||
        (typeof dest?.featuredImage === "string" ? dest.featuredImage : undefined) ||
        (Array.isArray(dest?.images) && dest.images[0] ? dest.images[0] : undefined);

      const destFeaturedImage = featuredImagePath ? buildImageUrl(featuredImagePath) : "";

      // 2. Panoramic Views (Spherical 360 + Google Street View)
      const panoramicViews: PanoramicView[] = [];

      // A. Spherical 360 images (uploaded)
      if (Array.isArray(destMedia.spherical360Images)) {
        destMedia.spherical360Images.forEach((spherical: any, sIdx: number) => {
          if (spherical?.path) {
            const url = buildImageUrl(spherical.path);
            const cleanTitle =
              spherical.originalName?.replace(/\.[^/.]+$/, "") ||
              `${dest.name || `Stop ${idx + 1}`} 360° Photo`;
            panoramicViews.push({
              id: `spherical-${idx}-${sIdx}`,
              type: "uploaded_360",
              title: cleanTitle,
              imageSrc: url,
              thumbnail: url,
              initialViewDirection: { yaw: 0, pitch: 0 },
            });
          }
        });
      }

      // B. Google Street View 360s
      if (Array.isArray(destMedia.googleStreetView360s)) {
        destMedia.googleStreetView360s.forEach((gView: any, gIdx: number) => {
          const embedUrl = formatGoogleStreetViewUrl(gView, dest.latLong);
          if (embedUrl) {
            panoramicViews.push({
              id: `google-${idx}-${gIdx}`,
              type: "google_embed",
              title: `${dest.name || `Stop ${idx + 1}`} Street View`,
              googleMapsSrc: embedUrl,
              thumbnail: destFeaturedImage,
              panoData: gView,
            });
          }
        });
      }

      // Support existing panoramicViews array if already formatted
      if (panoramicViews.length === 0 && Array.isArray(dest?.panoramicViews) && dest.panoramicViews.length > 0) {
        panoramicViews.push(...dest.panoramicViews);
      }

      // 3. Videos
      const videos: VideoItem[] = [];
      if (Array.isArray(destMedia.videos)) {
        destMedia.videos.forEach((vid: any, vIdx: number) => {
          if (vid?.path) {
            const cleanTitle =
              vid.originalName?.replace(/\.[^/.]+$/, "") ||
              `${dest.name || `Stop ${idx + 1}`} Video`;
            videos.push({
              id: `video-${idx}-${vIdx}`,
              src: buildImageUrl(vid.path),
              title: cleanTitle,
              thumbnail: destFeaturedImage,
              filename: vid.filename,
              originalName: vid.originalName,
            });
          }
        });
      }

      // 4. Gallery Images
      const gallery: GalleryItem[] = [];
      if (Array.isArray(destMedia.galleryImages) && destMedia.galleryImages.length > 0) {
        destMedia.galleryImages.forEach((item: any, gIdx: number) => {
          if (item?.path) {
            const url = buildImageUrl(item.path);
            const caption =
              item.originalName?.replace(/\.[^/.]+$/, "") ||
              `${dest.name || "Stop"} Photo ${gIdx + 1}`;
            gallery.push({
              id: `${dest.destinationSlug || idx}-gallery-${gIdx}`,
              type: "image",
              src: url,
              thumbnail: url,
              caption,
              category: "scenery",
            });
          }
        });
      } else if (Array.isArray(dest?.gallery) && dest.gallery.length > 0) {
        gallery.push(...dest.gallery);
      } else if (Array.isArray(dest?.images) && dest.images.length > 0) {
        dest.images.forEach((img: string, i: number) => {
          const url = buildImageUrl(img);
          gallery.push({
            id: `${dest.slug || idx}-img-${i}`,
            type: "image",
            src: url,
            thumbnail: url,
            caption: dest.name || `View ${i + 1}`,
            category: "scenery",
          });
        });
      }

      // 5. Facilities
      const rawFacilities = dest.facilities || [];
      const facilities: Facility[] = Array.isArray(rawFacilities)
        ? rawFacilities.map((fac) => formatFacility(fac))
        : [];

      // 6. Navigation
      const nav = dest.navigation;
      const travelTimeToNext =
        typeof nav?.travelTimeToNext === "number"
          ? nav.travelTimeToNext
          : typeof dest?.travelTimeToNext === "number"
          ? dest.travelTimeToNext
          : null;

      const travelTimeFromPrevious =
        nav?.previousStop?.destinationPointerNumber
          ? Math.round((travelTimeToNext || 180) / 60)
          : typeof dest?.travelTimeFromPrevious === "number"
          ? dest.travelTimeFromPrevious
          : null;

      return {
        destinationPointerNumber: dest.destinationPointerNumber || idx + 1,
        dayNumber: dest.destinationPointerNumber || dest.dayNumber || Math.floor(idx / 2) + 1,
        hasMultipleNextDestination: Boolean(
          nav?.hasMultipleNextDestination ?? dest.hasMultipleNextDestination,
        ),
        travelTimeToNext,
        travelTimeFromPrevious,
        distanceFromPrevious: dest.distanceFromPrevious || null,
        slug: dest.destinationSlug || dest.trailPlaceSlug || dest.slug || `stop-${idx + 1}`,
        name: dest.name || `Stop ${idx + 1}`,
        altitude: dest.altitude || 0,
        altitudeFt: dest.altitude ? Math.round(dest.altitude * 3.28084) : 0,
        latLong:
          Array.isArray(dest.latLong) && dest.latLong.length === 2 ? dest.latLong : [0, 0],
        description: dest.description || "",
        shortDescription: dest.description?.slice(0, 100) || "",
        featuredImage: destFeaturedImage,
        terrainType: dest.terrainType || "Alpine Trail",
        difficultyRating: dest.difficultyRating || rawTrek?.difficulty || "Moderate",
        trailCondition: dest.trailCondition || "Well-marked trail",
        tags: Array.isArray(dest.tags) ? dest.tags : [],
        facilities,
        destinationTypes: Array.isArray(dest.destinationTypes) ? dest.destinationTypes : [],
        otherDestinationType: dest.otherDestinationType,
        gallery,
        panoramicViews,
        videos,
        navigation: nav,
        stays: Array.isArray(dest.stays) ? dest.stays : [],
        weather: dest.weather || {
          bestMonths: [],
          temperatureRange: { min: 0, max: 0, unit: "°C" },
          typicalConditions: "",
        },
        specialties: Array.isArray(dest.specialties) ? dest.specialties : [],
        tips: Array.isArray(dest.tips) ? dest.tips : [],
        emergencyInfo: dest.emergencyInfo || {
          nearestHospital: "Trail Medical Center",
          helicopterEvacuation: true,
          phoneSignal: "Variable",
        },
      };
    });
  }

  return {
    trek: {
      name: trekTitle,
      slug: trekSlug,
      region: regionName,
      country: rawTrek?.country || "Nepal",
      coverImage,
      totalDistance: rawTrek?.distanceKm || rawTrek?.totalDistance || 0,
      totalDistanceUnit: "km",
      totalAscent: rawTrek?.totalAscent || 0,
      totalAscentUnit: "m",
      maxAltitude: rawTrek?.maxAltitudeMeter || rawTrek?.maxAltitude || 0,
      duration: rawTrek?.averageDurationDays
        ? `${rawTrek.averageDurationDays} days`
        : rawTrek?.duration || "",
      difficulty: rawTrek?.difficulty || "Moderate",
      bestSeason: Array.isArray(rawTrek?.recommendedSeasons)
        ? rawTrek.recommendedSeasons.join(", ")
        : rawTrek?.bestSeason || "",
      startingPoint: rawTrek?.startingPoint || mappedDestinations[0]?.name || "",
      endingPoint:
        rawTrek?.endingPoint || mappedDestinations[mappedDestinations.length - 1]?.name || "",
      overview: rawTrek?.shortNotes || rawTrek?.overview || "",
      permitRequired: Boolean(rawTrek?.permitRequired),
      permitDetails: rawTrek?.permitDetails,
      estimatedCost: rawTrek?.estimatedCost || "",
      highlights: rawTrek?.highlights,
      shortNotes: rawTrek?.shortNotes,
      featuredVideo,
      youtubeLink: rawTrek?.youtubeLink,
      destinations: mappedDestinations,
    },
    tourSummary: rawData?.tourSummary,
    elevationProfile: rawData?.elevationProfile,
  };
};
