/**
 * Sub Match Player Types
 * Type definitions for sub-match player assignment endpoints
 */

import type { PaginatedResult, PaginationParams } from "./pagination.types";

export type TeamSide = "A" | "B";

export interface SubMatchPlayer {
  id?: number;
  subMatchId?: number;
  entryMemberId?: number;
  team?: TeamSide;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export interface SubMatchPlayersByEntryMemberParams extends PaginationParams {
  page?: number;
}

export interface LineupSubmitRequest {
  lineups: {
    subMatchId: number;
    entryMemberIds: number[];
  }[];
}

export interface LineupSubmitResponse {
  message: string;
  lineups: any[];
}

export interface GetPendingLineupsResponse {
  lineups: any[];
}

export interface ApproveLineupResponse {
  message: string;
  players: SubMatchPlayer[];
}

export interface RejectLineupRequest {
  reviewNotes?: string;
}

export interface RejectLineupResponse {
  message: string;
  rejected: any[];
}

export interface GetRejectedLineupsResponse {
  rejected: any[];
}

export type SubMatchPlayersResponse = { players: SubMatchPlayer[]; pagination: any };
export type SubMatchPlayerResponse = SubMatchPlayer;
export type SubMatchPlayerMatchesResponse = { matches: SubMatchPlayer[]; pagination: any };
export type PaginatedSubMatchPlayersResult = PaginatedResult<SubMatchPlayer>;
