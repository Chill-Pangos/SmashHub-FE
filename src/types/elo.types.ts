/**
 * ELO Types
 * Type definitions for ELO scoring and history endpoints
 */


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

export interface EloListParams {
  page?: number;
  limit?: number;
}

export interface GetEloHistoriesResponse {
  success: boolean;
  data: {
    items: EloHistory[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface GetEloLeaderboardResponse {
  success: boolean;
  data: {
    items: EloScore[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
