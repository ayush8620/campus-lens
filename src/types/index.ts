import type { OwnershipType, NAACGrade, ExamType, Category } from "@prisma/client";

// ─── API Response Types ───────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  cursor?: string;
}

// ─── College Types ────────────────────────────────────

export interface CollegeCard {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  bannerImage: string | null;
  city: string;
  state: string;
  rating: number;
  avgFees: number;
  ownershipType: OwnershipType;
  naacGrade: NAACGrade | null;
  nirfRanking: number | null;
  courses: { name: string }[];
  placements: {
    averagePackage: number;
    placementRate: number;
  } | null;
}

export interface CollegeDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  logo: string | null;
  bannerImage: string | null;
  images: string[];
  website: string | null;
  city: string;
  state: string;
  address: string | null;
  pincode: string | null;
  established: number | null;
  ownershipType: OwnershipType;
  naacGrade: NAACGrade | null;
  nirfRanking: number | null;
  rating: number;
  accreditation: string[];
  avgFees: number;
  minFees: number | null;
  maxFees: number | null;
  hostel: boolean;
  wifi: boolean;
  library: boolean;
  sports: boolean;
  lab: boolean;
  cafeteria: boolean;
  medicalFacility: boolean;
  courses: CourseInfo[];
  placements: PlacementInfo | null;
  reviews: ReviewInfo[];
}

export interface CourseInfo {
  id: string;
  name: string;
  duration: string;
  fees: number;
  eligibility: string | null;
  seats: number | null;
}

export interface PlacementInfo {
  id: string;
  averagePackage: number;
  highestPackage: number;
  medianPackage: number | null;
  placementRate: number;
  topRecruiters: string[];
  year: number;
}

export interface ReviewInfo {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  pros: string | null;
  cons: string | null;
  createdAt: string;
}

// ─── Compare Types ────────────────────────────────────

export interface CompareCollege {
  id: string;
  name: string;
  slug: string;
  bannerImage: string | null;
  city: string;
  state: string;
  rating: number;
  avgFees: number;
  established: number | null;
  ownershipType: OwnershipType;
  naacGrade: NAACGrade | null;
  nirfRanking: number | null;
  accreditation: string[];
  hostel: boolean;
  wifi: boolean;
  library: boolean;
  sports: boolean;
  lab: boolean;
  cafeteria: boolean;
  medicalFacility: boolean;
  courses: { name: string; fees: number; duration: string }[];
  placements: PlacementInfo | null;
}

// ─── Predictor Types ──────────────────────────────────

export interface PredictorInput {
  exam: ExamType;
  rank: number;
  category: Category;
  homeState?: string;
  preferredCity?: string;
  preferredBranch: string;
}

export interface PredictorResult {
  college: CollegeCard;
  chance: "Safe" | "Moderate" | "Dream";
  chancePercentage: number;
  matchedBranch: string;
  closingRank: number;
  openingRank: number;
}

export interface PredictorResponse {
  safe: PredictorResult[];
  moderate: PredictorResult[];
  dream: PredictorResult[];
  total: number;
}

// ─── Filter Types ─────────────────────────────────────

export interface CollegeFilters {
  search?: string;
  state?: string;
  city?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  ownership?: OwnershipType;
  naacGrade?: NAACGrade;
  course?: string;
  sort?: string;
  cursor?: string;
  limit?: number;
}

// ─── Saved Types ──────────────────────────────────────

export interface SavedCollegeItem {
  id: string;
  collegeId: string;
  createdAt: string;
  college: CollegeCard;
}
