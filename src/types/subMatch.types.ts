/**
 * Sub Match Types
 * Type definitions for sub-match management endpoints
 */

import type { ApiResponse } from "./auth.types";

export type SubMatchTeam = "A" | "B";

export interface SubMatchPlayerAssignment {
  entryMemberId: number;
  team: SubMatchTeam;
}

export interface CreateSubMatchesFromFormatRequest {
  matchId: number;
  teamFormat: string;
}

export interface AssignSubMatchPlayersRequest {
  players: SubMatchPlayerAssignment[];
}

export interface SubMatch {
  id: number;
  matchId?: number;
  status?: string;
  teamFormat?: string;
  sets?: unknown[];
  players?: SubMatchPlayerAssignment[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export type SubMatchResponse = ApiResponse<SubMatch>;
export type SubMatchesResponse = ApiResponse<SubMatch[]>;
export type StartSubMatchResponse = ApiResponse<SubMatch>;
export type FinalizeSubMatchResponse = ApiResponse<SubMatch>;
export type AssignSubMatchPlayersResponse = ApiResponse<SubMatch>;
