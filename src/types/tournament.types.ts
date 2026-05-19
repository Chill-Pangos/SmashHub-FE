import type { ApiResponse } from "./auth.types";

// ==================== Enums ====================

/**
 * Tournament status enum
 */
export type TournamentStatus =
  | "upcoming"
  | "registration_open"
  | "registration_closed"
  | "ongoing"
  | "completed";

/**
 * Tournament content type enum
 */
export type TournamentContentType = "single" | "team" | "double";

/**
 * Gender enum
 */
export type Gender = "male" | "female" | "mixed";

// ==================== Tournament Content ====================

/**
 * Tournament Content interface
 */
export interface TournamentContent {
  id?: number;
  tournamentId?: number;
  name: string;
  type: TournamentContentType;
  maxEntries: number;
  maxSets: number;
  racketCheck: boolean;
  teamFormat?: string | null;
  entryFee?: number | null;
  // Optional fields
  numberOfSingles?: number | null;
  numberOfDoubles?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  minElo?: number | null;
  maxElo?: number | null;
  gender?: Gender | null;
  isGroupStage?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Tournament Content create request (without id, tournamentId, timestamps)
 */
export interface CreateTournamentContentRequest {
  name: string;
  type: TournamentContentType;
  maxEntries: number;
  maxSets: number;
  racketCheck: boolean;
  teamFormat?: string | null;
  entryFee?: number | null;
  numberOfSingles?: number | null;
  numberOfDoubles?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  minElo?: number | null;
  maxElo?: number | null;
  gender?: Gender | null;
  isGroupStage?: boolean;
}

// ==================== Tournament ====================

/**
 * Tournament interface
 */
export interface Tournament {
  id: number;
  name: string;
  tier?: number;
  status: TournamentStatus;
  startDate: string;
  endDate: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  bracketGenerationDate?: string;
  location: string;
  numberOfTables?: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  contents?: TournamentContent[];
  categories?: TournamentCategory[];
}

/**
 * Create tournament request
 */
export interface CreateTournamentRequest {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  status?: TournamentStatus;
  numberOfTables?: number;
  categories?: CreateTournamentCategoryRequest[];
  contents?: CreateTournamentContentRequest[];
}

/**
 * Update tournament request (partial update)
 */
export interface UpdateTournamentRequest {
  name?: string;
  startDate?: string;
  endDate?: string | null;
  location?: string;
  status?: TournamentStatus;
  numberOfTables?: number;
  categories?: CreateTournamentCategoryRequest[];
  contents?: CreateTournamentContentRequest[];
}

/**
 * Tournament search filters
 */
export interface TournamentSearchFilters {
  // Pagination
  skip?: number;
  limit?: number;
  // User filters
  userId?: number;
  createdBy?: number;
  // Age filters
  minAge?: number;
  maxAge?: number;
  // ELO filters
  minElo?: number;
  maxElo?: number;
  // Other filters
  gender?: Gender;
  racketCheck?: boolean;
  isGroupStage?: boolean;
}

/**
 * Tournament search response
 */
export interface TournamentSearchResponse {
  tournaments: Tournament[];
  total: number;
}

// ==================== Pagination ====================

/**
 * Pagination info
 */
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Tournament list response with pagination
 */
export interface TournamentListResponse {
  tournaments: Tournament[];
  pagination: PaginationInfo;
}

/**
 * Tournament search response with pagination
 */
export interface TournamentSearchResponseWithPagination {
  tournaments: Tournament[];
  pagination: PaginationInfo;
}

// ==================== Tournament Categories ====================

export type TournamentCategoryType = TournamentContentType;

export interface TournamentCategory {
  id?: number;
  tournamentId: number;
  name: string;
  type: TournamentCategoryType;
  maxEntries: number;
  maxSets: number;
  teamFormat?: string | null;
  entryFee?: number | null;
  numberOfSingles?: number | null;
  numberOfDoubles?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  minElo?: number | null;
  maxElo?: number | null;
  gender?: Gender | null;
  isGroupStage?: boolean;
  racketCheck?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTournamentCategoryRequest {
  tournamentId: number;
  name: string;
  type: TournamentCategoryType;
  maxEntries: number;
  maxSets: number;
  teamFormat?: string | null;
  entryFee?: number | null;
  numberOfSingles?: number | null;
  numberOfDoubles?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  minElo?: number | null;
  maxElo?: number | null;
  gender?: Gender | null;
  isGroupStage?: boolean;
  racketCheck?: boolean;
}

export interface UpdateTournamentCategoryRequest {
  name?: string;
  type?: TournamentCategoryType;
  maxEntries?: number;
  maxSets?: number;
  teamFormat?: string | null;
  entryFee?: number | null;
  numberOfSingles?: number | null;
  numberOfDoubles?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  minElo?: number | null;
  maxElo?: number | null;
  gender?: Gender | null;
  isGroupStage?: boolean;
  racketCheck?: boolean;
}

// ==================== Response Types ====================

/**
 * Create tournament response
 */
export type CreateTournamentResponse = ApiResponse<Tournament>;

/**
 * Get tournament response
 */
export type GetTournamentResponse = ApiResponse<Tournament>;

/**
 * Get tournaments list response
 */
export type GetTournamentsResponse = ApiResponse<TournamentListResponse>;

/**
 * Tournament search response (with pagination)
 */
export type SearchTournamentsResponse =
  ApiResponse<TournamentSearchResponseWithPagination>;

/**
 * Get tournaments by status response
 */
export type GetTournamentsByStatusResponse = ApiResponse<Tournament[]>;

/**
 * Update tournament response
 */
export type UpdateTournamentResponse = ApiResponse<Tournament>;

/**
 * Delete tournament response
 */
export type DeleteTournamentResponse = ApiResponse<void>;

export type CreateTournamentCategoryResponse = ApiResponse<TournamentCategory>;
export type GetTournamentCategoryResponse = ApiResponse<TournamentCategory>;
export type GetTournamentCategoriesResponse = ApiResponse<TournamentCategory[]>;
export type UpdateTournamentCategoryResponse = ApiResponse<TournamentCategory>;
export type DeleteTournamentCategoryResponse = ApiResponse<void>;

// ==================== Upcoming Status Changes ====================

/**
 * Tournament opening soon (registration is about to start)
 */
export interface TournamentOpeningSoon {
  id: number;
  name: string;
  registrationStartDate: string;
  status: TournamentStatus;
}

/**
 * Tournament closing soon (registration is about to end)
 */
export interface TournamentClosingSoon {
  id: number;
  name: string;
  registrationEndDate: string;
  status: TournamentStatus;
}

/**
 * Tournament brackets generating soon
 */
export interface TournamentBracketsSoon {
  id: number;
  name: string;
  bracketGenerationDate: string;
  status: TournamentStatus;
}

/**
 * Upcoming changes data
 */
export interface UpcomingChangesData {
  openingSoon: TournamentOpeningSoon[];
  closingSoon: TournamentClosingSoon[];
  bracketsSoon: TournamentBracketsSoon[];
}

/**
 * Metadata for upcoming changes
 */
export interface UpcomingChangesMetadata {
  lookAheadHours: number;
  timestamp: string;
}

/**
 * Response for upcoming tournament status changes
 */
export interface UpcomingTournamentStatusChangesResponse {
  success: boolean;
  data: UpcomingChangesData;
  metadata: UpcomingChangesMetadata;
}

export interface UpdateTournamentStatusesResponse {
  success: boolean;
  message: string;
  data?: {
    updated?: number;
    tournaments?: Tournament[];
  };
}

// ==================== Validation Helpers ====================

/**
 * Validation errors for tournament forms
 */
export interface TournamentValidationErrors {
  [key: string]: string;
}

/**
 * Tournament content validation errors
 */
export interface TournamentContentValidationErrors {
  [key: string]: string;
}
