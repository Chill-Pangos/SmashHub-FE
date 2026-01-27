import type { ApiResponse } from "./auth.types";

// ==================== Match Set ====================

/**
 * Match Set interface
 */
export interface MatchSet {
  id: number;
  matchId: number;
  setNumber: number;
  entryAScore: number;
  entryBScore: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== Request Types ====================

/**
 * Create match set request
 */
export interface CreateMatchSetRequest {
  matchId: number;
  setNumber: number;
  entryAScore: number;
  entryBScore: number;
}

/**
 * Create match set with score request (recommended)
 */
export interface CreateMatchSetWithScoreRequest {
  matchId: number;
  entryAScore: number;
  entryBScore: number;
}

/**
 * Update match set request
 */
export interface UpdateMatchSetRequest {
  setNumber?: number;
  entryAScore?: number;
  entryBScore?: number;
}

// ==================== Response Types ====================

/**
 * Create match set response
 */
export type CreateMatchSetResponse = ApiResponse<MatchSet>;

/**
 * Get match set response
 */
export type GetMatchSetResponse = ApiResponse<MatchSet>;

/**
 * Get match sets response
 */
export type GetMatchSetsResponse = ApiResponse<MatchSet[]>;

/**
 * Get match sets by match response
 */
export type GetMatchSetsByMatchResponse = ApiResponse<MatchSet[]>;

/**
 * Update match set response
 */
export type UpdateMatchSetResponse = ApiResponse<MatchSet>;

/**
 * Delete match set response
 */
export type DeleteMatchSetResponse = ApiResponse<void>;

/**
 * Create match set with score response
 */
export type CreateMatchSetWithScoreResponse = ApiResponse<MatchSet>;
