export interface HikeMediaAsset {
  _id: string;
  path: string;
  originalName: string;
  filename: string;
}

export interface HikeCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface HikeRegion {
  _id: string;
  name: string;
  slug: string;
  tags?: string[];
  country?: string;
  location?: string;
  description?: string;
}

export interface HikeBlogSection {
  title: string;
  htmlDescription: string;
  images?: HikeMediaAsset[];
}

export interface HikeFaq {
  question: string;
  answer: string;
}

export interface HikingStop {
  _id: string;
  title: string;
  stopType: string;
  htmlDescription?: string;
  altitude?: number;
  hikeBlog?: string;
  latLong?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface HikeBlogListItem {
  _id?: string;
  title: string;
  slug: string;
  featuredImage?: HikeMediaAsset;
  difficulty?: string;
  maxAltitudeMeter?: number;
  recommendedSeasons?: string[];
  shortSlogan?: string;
  trailDistanceKm?: number;
  trailType?: string;
  tags?: string[];
  highlights?: string[];
  isPicnic?: boolean;
  hikeRegion?: HikeRegion[];
  categories?: HikeCategory[];
  isWalkedTrail?: boolean;
  createdAt?: string;
}

export interface HikeBlogListingPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface HikeBlogListingResponse {
  success?: boolean;
  data: HikeBlogListItem[];
  pagination?: HikeBlogListingPagination;
  searchKey?: string;
}

export interface HikeBlogDetail extends HikeBlogListItem {
  _id: string;
  categories?: HikeCategory[];
  hikeRegion?: HikeRegion[];
  tags?: string[];
  blogContent?: HikeBlogSection[];
  isBikeFriendly?: boolean;
  bikeRideDescription?: string;
  isWaterSourceAvailable?: boolean;
  isCampingAllowed?: boolean;
  campingDescription?: string;
  isPermitRequired?: boolean;
  permitDetailDescription?: string;
  faqs?: HikeFaq[];
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
  latLong?: number[];
  kmlFile?: HikeMediaAsset;
  updatedAt?: string;
  hikingStops?: HikingStop[];
  picnicDescription?: string;
}

export interface HikeBlogDetailResponse {
  data: HikeBlogDetail;
}
