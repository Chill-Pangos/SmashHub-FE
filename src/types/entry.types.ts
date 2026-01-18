import type { ApiResponse } from "./auth.types";
import type { TournamentContentType } from "./tournament.types";

// ==================== Entry ====================

/**
 * Entry member interface
 */
export interface EntryMember {
  id: number;
  entryId: number;
  userId: number;
  eloAtRegistration: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    elo?: number;
    gender?: string;
  };
}

/**
 * Entry interface
 */
export interface Entry {
  id: number;
  contentId: number;
  teamId: number;
  createdAt: string;
  updatedAt: string;
  members?: EntryMember[];
  team?: {
    id: number;
    name: string;
    tournamentId: number;
  };
  content?: {
    id: number;
    name: string;
    type: TournamentContentType;
    tournamentId: number;
  };
}

// ==================== Request Types ====================

/**
 * Create entry request (admin/tournament manager)
 */
export interface CreateEntryRequest {
  contentId: number;
  teamId: number;
}

/**
 * Register entry request (team manager)
 */
export interface RegisterEntryRequest {
  contentId: number;
  teamId: number;
  memberIds: number[];
}

/**
 * Update entry request
 */
export interface UpdateEntryRequest {
  memberIds?: number[];
}

// ==================== Import Types ====================

/**
 * Single entry import data
 */
export interface ImportSingleEntryDto {
  name: string;
  email: string;
  rowNumber: number;
}

/**
 * Double entry import data
 */
export interface ImportDoubleEntryDto {
  player1Name: string;
  player1Email: string;
  player2Name: string;
  player2Email: string;
  rowNumber: number;
}

/**
 * Team entry member import data
 */
export interface ImportTeamEntryMemberDto {
  name: string;
  email: string;
}

/**
 * Team entry import data
 */
export interface ImportTeamEntryDto {
  teamName: string;
  members: ImportTeamEntryMemberDto[];
  rowNumber: number;
}

/**
 * Preview import single entries request
 */
export interface PreviewImportSingleEntriesRequest {
  file: File;
  contentId: number;
}

/**
 * Confirm import single entries request
 */
export interface ConfirmImportSingleEntriesRequest {
  contentId: number;
  entries: ImportSingleEntryDto[];
}

/**
 * Preview import double entries request
 */
export interface PreviewImportDoubleEntriesRequest {
  file: File;
  contentId: number;
}

/**
 * Confirm import double entries request
 */
export interface ConfirmImportDoubleEntriesRequest {
  contentId: number;
  entries: ImportDoubleEntryDto[];
}

/**
 * Preview import team entries request
 */
export interface PreviewImportTeamEntriesRequest {
  file: File;
  contentId: number;
}

/**
 * Confirm import team entries request
 */
export interface ConfirmImportTeamEntriesRequest {
  contentId: number;
  entries: ImportTeamEntryDto[];
}

/**
 * Import preview result
 */
export interface ImportEntriesPreviewResult {
  success: boolean;
  data: {
    entries: (
      | ImportSingleEntryDto
      | ImportDoubleEntryDto
      | ImportTeamEntryDto
    )[];
    errors: Array<{
      row: number;
      field: string;
      message: string;
    }>;
  };
}

/**
 * Import confirm result
 */
export interface ImportEntriesConfirmResult {
  success: boolean;
  message: string;
  data: {
    created: number;
    entries: Entry[];
  };
}

// ==================== Response Types ====================

export type EntryResponse = ApiResponse<Entry>;
export type EntriesResponse = ApiResponse<Entry[]>;
export type ImportEntriesPreviewResponse = ApiResponse<
  ImportEntriesPreviewResult["data"]
>;
export type ImportEntriesConfirmResponse = ApiResponse<
  ImportEntriesConfirmResult["data"]
>;
