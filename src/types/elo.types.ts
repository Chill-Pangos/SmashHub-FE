/**
 * ELO Types
 * Type definitions for ELO scoring and history endpoints
 */

import type { ApiResponse } from "./auth.types";
import type { PaginatedResult, PaginationParams } from "./pagination.types";

export interface EloScore {
  id: number;
  userId?: number;
  matchId?: number | null;
  score?: number;
  delta?: number | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export interface EloHistory {
  id: number;
  userId?: number;
  matchId?: number | null;
  scoreBefore?: number | null;
  scoreAfter?: number | null;
  delta?: number | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export interface CreateEloScoreRequest {
  [key: string]: unknown;
}

export interface CreateEloHistoryRequest {
  [key: string]: unknown;
}

export interface EloListParams extends PaginationParams {
  page?: number;
}

export type EloScoreResponse = ApiResponse<EloScore>;
export type EloScoresResponse = ApiResponse<EloScore[]>;
export type EloHistoryResponse = ApiResponse<EloHistory>;
export type EloHistoriesResponse = ApiResponse<EloHistory[]>;
export type DeleteEloScoreResponse = ApiResponse<void>;
export type DeleteEloHistoryResponse = ApiResponse<void>;
export type EloLeaderboardResponse = ApiResponse<EloScore[]>;
export type PaginatedEloScoresResult = PaginatedResult<EloScore>;
export type PaginatedEloHistoriesResult = PaginatedResult<EloHistory>;
