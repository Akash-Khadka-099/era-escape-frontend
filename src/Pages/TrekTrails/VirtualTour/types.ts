export interface TrekData {
  trek: Trek;
  tourSummary?: TourSummary;
  elevationProfile?: ElevationProfilePoint[];
}

export interface TourSummary {
  totalStops: number;
  total360Scenes: number;
  totalSpherical360Images: number;
  totalGoogleStreetView360s: number;
  totalVideos: number;
  totalGalleryImages: number;
  minAltitude: number;
  maxAltitude: number;
}

export interface ElevationProfilePoint {
  destinationPointerNumber: number;
  name: string;
  altitude: number;
  latLong: [number, number];
  destinationSlug: string;
  has360?: boolean;
  hasVideo?: boolean;
}

export interface Trek {
  name: string;
  slug: string;
  region: string;
  country: string;
  coverImage: string;
  totalDistance: number;
  totalDistanceUnit: string;
  totalAscent: number;
  totalAscentUnit: string;
  maxAltitude: number;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Challenging" | "Extreme" | string;
  bestSeason: string;
  startingPoint: string;
  endingPoint: string;
  overview: string;
  permitRequired: boolean;
  permitDetails?: string;
  estimatedCost: string;
  highlights?: string[];
  shortNotes?: string;
  featuredVideo?: string;
  youtubeLink?: string;
  destinations: Destination[];
}

export interface Destination {
  destinationPointerNumber: number;
  dayNumber: number;
  hasMultipleNextDestination: boolean;
  travelTimeToNext: number | null;
  travelTimeFromPrevious: number | null;
  distanceFromPrevious: number | null;
  slug: string;
  name: string;
  altitude: number;
  altitudeFt: number;
  latLong: [number, number];
  description: string;
  shortDescription: string;
  featuredImage: string;
  terrainType: string;
  difficultyRating: string;
  trailCondition: string;
  tags: string[];
  facilities: Facility[];
  destinationTypes: string[];
  otherDestinationType?: string | null;
  gallery: GalleryItem[];
  panoramicViews: PanoramicView[];
  videos: VideoItem[];
  navigation?: NavigationData;
  stays: Stay[];
  weather: Weather;
  specialties: Specialty[];
  tips: string[];
  emergencyInfo: EmergencyInfo;
}

export interface VideoItem {
  id: string;
  src: string;
  title: string;
  thumbnail?: string;
  filename?: string;
  originalName?: string;
}

export interface NavigationStop {
  destinationPointerNumber: number;
  name: string;
  destinationSlug: string;
}

export interface OutgoingRoute {
  timeToTravel: number | null;
  note: string;
  toDestinationPointerNumber: number;
  toDestinationSlug: string;
  toDestinationName: string;
}

export interface NavigationData {
  travelTimeToNext: number | null;
  hasMultipleNextDestination: boolean;
  previousStop: NavigationStop | null;
  nextStop: NavigationStop | null;
  outgoingRoutes: OutgoingRoute[];
}

export interface Facility {
  type: string;
  name: string;
  icon: string;
  available: boolean;
  notes?: string;
}

export interface GalleryItem {
  id: string;
  type: "image" | "video" | "360_image" | "360_google";
  src: string;
  thumbnail: string;
  caption: string;
  category: string;
}

export interface PanoramicView {
  id?: string;
  type: "google_embed" | "uploaded_360";
  title: string;
  googleMapsSrc?: string;
  imageSrc?: string;
  thumbnail: string;
  initialViewDirection?: { yaw: number; pitch: number };
  panoData?: {
    panoId?: string;
    latitude?: number;
    longitude?: number;
    heading?: number;
    pitch?: number;
    fov?: number;
  };
}

export interface Stay {
  name: string;
  type: string;
  rating: number;
  priceRange: string;
  image: string;
  amenities: string[];
  bookingAvailable: boolean;
}

export interface Weather {
  bestMonths: string[];
  temperatureRange: { min: number; max: number; unit: string };
  typicalConditions: string;
}

export interface Specialty {
  type: string;
  title: string;
  description: string;
  image?: string;
}

export interface EmergencyInfo {
  nearestHospital: string;
  helicopterEvacuation: boolean;
  phoneSignal: string;
}

export type ViewMode = "image" | "360_google" | "360_uploaded" | "video";
