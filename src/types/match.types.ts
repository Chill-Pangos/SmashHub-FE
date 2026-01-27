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

/**
 * Match result status enum (for approval workflow)
 */
export type MatchResultStatus = "pending" | "approved" | "rejected";

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
  resultStatus?: MatchResultStatus;
  umpire?: number | null;
  assistantUmpire?: number | null;
  coachAId?: number | null;
  coachBId?: number | null;
  isConfirmedByWinner?: boolean;
  reviewNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  // Nested relations (when populated)
  entryA?: MatchEntry;
  entryB?: MatchEntry;
}

/**
 * Match entry with team info (nested)
 */
export interface MatchEntry {
  id: number;
  team?: {
    name: string;
  };
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
 * Finalize match request (no body needed, matchId is in URL)
 */
export interface FinalizeMatchRequest {
  matchId: number;
}

/**
 * Approve match result request
 */
export interface ApproveMatchRequest {
  reviewNotes?: string;
}

/**
 * Reject match result request
 */
export interface RejectMatchRequest {
  reviewNotes: string;
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

/**
 * Get pending matches response
 */
export type GetPendingMatchesResponse = ApiResponse<Match[]>;

/**
 * ELO change for a player
 */
export interface EloChange {
  userId: number;
  username?: string;
  currentElo: number;
  expectedElo: number;
  change: number;
}

/**
 * ELO preview entry info
 */
export interface EloPreviewEntry {
  averageElo: number;
  expectedScore: number;
  actualScore: number;
}

/**
 * ELO preview response
 */
export interface EloPreview {
  entryA: EloPreviewEntry;
  entryB: EloPreviewEntry;
  marginMultiplier: number;
  changes: EloChange[];
}

/**
 * Get pending match with ELO preview response
 */
export interface GetPendingMatchWithEloResponse {
  match: Match;
  eloPreview: EloPreview;
}

/**
 * Preview ELO changes response
 */
export type PreviewEloChangesResponse = EloPreview;

/**
 * Approve match result response
 */
export interface ApproveMatchResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    status: MatchStatus;
    resultStatus: MatchResultStatus;
    winnerEntryId: number;
    reviewNotes?: string;
    eloUpdated: boolean;
  };
}

/**
 * Reject match result response
 */
export interface RejectMatchResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    status: MatchStatus;
    resultStatus: MatchResultStatus;
    winnerEntryId: null;
    reviewNotes: string;
  };
}
