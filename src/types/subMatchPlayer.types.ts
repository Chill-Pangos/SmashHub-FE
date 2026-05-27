/**
 * Sub Match Player Types
 * Type definitions for sub-match player assignment endpoints
 */

import type { ApiResponse } from "./auth.types";
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

export type SubMatchPlayersResponse = ApiResponse<SubMatchPlayer[]>;
export type SubMatchPlayerResponse = ApiResponse<SubMatchPlayer>;
export type PaginatedSubMatchPlayersResult = PaginatedResult<SubMatchPlayer>;
