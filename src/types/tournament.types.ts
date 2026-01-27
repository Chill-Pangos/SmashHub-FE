import type { ApiResponse } from "./auth.types";

// ==================== Enums ====================

/**
 * Tournament status enum
 */
export type TournamentStatus = "upcoming" | "ongoing" | "completed";

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
  startDate: string;
  endDate: string;
  location: string;
  status: TournamentStatus;
  numberOfTables?: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  contents?: TournamentContent[];
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
export type GetTournamentsResponse = ApiResponse<Tournament[]>;

/**
 * Tournament search response (with total count)
 */
export type SearchTournamentsResponse = ApiResponse<TournamentSearchResponse>;

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
