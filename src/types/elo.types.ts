/**
 * ELO Types
 * Type definitions for ELO scoring and history endpoints
 */


export interface EloScore {
  id: number;
  userId?: number;
  score?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
  [key: string]: unknown;
}

export interface EloHistory {
  id: number;
  userId?: number;
  matchId?: number | null;
  previousElo?: number | null;
  newElo?: number | null;
  eloDelta?: number | null;
  changeReason?: string | null;
  tournamentId?: number | null;
  match?: {
    id: number;
    status: string;
  };
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
  rows: EloHistory[];
  count: number;
}

export interface GetEloLeaderboardResponse {
  rows: EloScore[];
  count: number;
}
