/**
 * Sub Match Types
 * Type definitions for sub-match management endpoints
 */

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

export type SubMatchResponse = SubMatch;
export type SubMatchesResponse = { subMatches: SubMatch[]; pagination: any };
export type StartSubMatchResponse = SubMatch;
export type FinalizeSubMatchResponse = SubMatch;
export type AssignSubMatchPlayersResponse = any[]; // Should be SubMatchPlayer[]
