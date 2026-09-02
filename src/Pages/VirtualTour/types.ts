export interface TrekData {
  trek: Trek;
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
  difficulty: "Easy" | "Moderate" | "Challenging" | "Extreme";
  bestSeason: string;
  startingPoint: string;
  endingPoint: string;
  overview: string;
  permitRequired: boolean;
  permitDetails?: string;
  estimatedCost: string;
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
  gallery: GalleryItem[];
  panoramicViews: PanoramicView[];
  stays: Stay[];
  weather: Weather;
  specialties: Specialty[];
  tips: string[];
  emergencyInfo: EmergencyInfo;
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
  type: "google_embed" | "uploaded_360";
  title: string;
  googleMapsSrc?: string;
  imageSrc?: string;
  thumbnail: string;
  initialViewDirection?: { yaw: number; pitch: number };
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
