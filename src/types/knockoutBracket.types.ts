import type { ApiResponse } from "./auth.types";

// ==================== Enums ====================

/**
 * Knockout bracket status enum
 */
export type KnockoutBracketStatus =
  | "pending"
  | "ready"
  | "in_progress"
  | "completed";

// ==================== Knockout Bracket ====================

/**
 * Knockout Bracket interface
 */
export interface KnockoutBracket {
  id: number;
  contentId: number;
  roundNumber: number;
  bracketPosition: number;
  entryAId?: number | null;
  entryBId?: number | null;
  seedA?: number | null;
  seedB?: number | null;
  winnerEntryId?: number | null;
  nextBracketId?: number | null;
  previousBracketAId?: number | null;
  previousBracketBId?: number | null;
  scheduleId?: number | null;
  matchId?: number | null;
  roundName?: string | null;
  isByeMatch: boolean;
  status: KnockoutBracketStatus;
  createdAt: string;
  updatedAt: string;
}

// ==================== Request Types ====================

/**
 * Create knockout bracket request
 */
export interface CreateKnockoutBracketRequest {
  contentId: number;
  roundNumber: number;
  bracketPosition: number;
  entryAId?: number | null;
  entryBId?: number | null;
  seedA?: number | null;
  seedB?: number | null;
  nextBracketId?: number | null;
  previousBracketAId?: number | null;
  previousBracketBId?: number | null;
  roundName?: string | null;
  isByeMatch?: boolean;
}

/**
 * Update knockout bracket request
 */
export interface UpdateKnockoutBracketRequest {
  entryAId?: number | null;
  entryBId?: number | null;
  seedA?: number | null;
  seedB?: number | null;
  winnerEntryId?: number | null;
  nextBracketId?: number | null;
  previousBracketAId?: number | null;
  previousBracketBId?: number | null;
  scheduleId?: number | null;
  matchId?: number | null;
  roundName?: string | null;
  isByeMatch?: boolean;
  status?: KnockoutBracketStatus;
}

/**
 * Generate knockout bracket request
 */
export interface GenerateKnockoutBracketRequest {
  contentId: number;
}

/**
 * Generate bracket from groups request
 */
export interface GenerateFromGroupsRequest {
  contentId: number;
  teamsPerGroup: number;
}

/**
 * Advance winner request
 */
export interface AdvanceWinnerRequest {
  bracketId: number;
  winnerEntryId: number;
}

// ==================== Response Types ====================

/**
 * Create knockout bracket response
 */
export type CreateKnockoutBracketResponse = ApiResponse<KnockoutBracket>;

/**
 * Get knockout bracket response
 */
export type GetKnockoutBracketResponse = ApiResponse<KnockoutBracket>;

/**
 * Get all knockout brackets response
 */
export type GetKnockoutBracketsResponse = ApiResponse<KnockoutBracket[]>;

/**
 * Get knockout brackets by content response
 */
export type GetKnockoutBracketsByContentResponse = ApiResponse<
  KnockoutBracket[]
>;

/**
 * Update knockout bracket response
 */
export type UpdateKnockoutBracketResponse = ApiResponse<KnockoutBracket>;

/**
 * Delete knockout bracket response
 */
export type DeleteKnockoutBracketResponse = ApiResponse<void>;

/**
 * Generate knockout bracket response
 */
export type GenerateKnockoutBracketResponse = ApiResponse<KnockoutBracket[]>;

/**
 * Generate from groups response
 */
export type GenerateFromGroupsResponse = ApiResponse<KnockoutBracket[]>;

/**
 * Advance winner response
 */
export type AdvanceWinnerResponse = ApiResponse<KnockoutBracket>;
