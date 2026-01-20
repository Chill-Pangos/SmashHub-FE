import type { ApiResponse } from "./auth.types";

// ==================== Enums ====================

/**
 * Match status enum
 */
export type MatchStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

// ==================== Match ====================

/**
 * Match interface
 */
export interface Match {
  id: number;
  scheduleId: number;
  entryAId: number;
  entryBId: number;
  winnerEntryId?: number | null;
  status: MatchStatus;
  umpire?: number | null;
  assistantUmpire?: number | null;
  coachAId?: number | null;
  coachBId?: number | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== Request Types ====================

/**
 * Create match request
 */
export interface CreateMatchRequest {
  scheduleId: number;
  entryAId: number;
  entryBId: number;
  status: MatchStatus;
  umpire?: number | null;
  assistantUmpire?: number | null;
  coachAId?: number | null;
  coachBId?: number | null;
}

/**
 * Update match request
 */
export interface UpdateMatchRequest {
  scheduleId?: number;
  entryAId?: number;
  entryBId?: number;
  winnerEntryId?: number | null;
  status?: MatchStatus;
  umpire?: number | null;
  assistantUmpire?: number | null;
  coachAId?: number | null;
  coachBId?: number | null;
}

/**
 * Start match request
 */
export interface StartMatchRequest {
  matchId: number;
}

/**
 * Finalize match request
 */
export interface FinalizeMatchRequest {
  matchId: number;
  winnerEntryId: number;
}

// ==================== Response Types ====================

/**
 * Create match response
 */
export type CreateMatchResponse = ApiResponse<Match>;

/**
 * Get match response
 */
export type GetMatchResponse = ApiResponse<Match>;

/**
 * Get matches response
 */
export type GetMatchesResponse = ApiResponse<Match[]>;

/**
 * Get matches by schedule response
 */
export type GetMatchesByScheduleResponse = ApiResponse<Match[]>;

/**
 * Get matches by status response
 */
export type GetMatchesByStatusResponse = ApiResponse<Match[]>;

/**
 * Update match response
 */
export type UpdateMatchResponse = ApiResponse<Match>;

/**
 * Delete match response
 */
export type DeleteMatchResponse = ApiResponse<void>;

/**
 * Start match response
 */
export type StartMatchResponse = ApiResponse<Match>;

/**
 * Finalize match response
 */
export type FinalizeMatchResponse = ApiResponse<Match>;
