import type { TournamentContentType } from "./tournament.types";

// ==================== Entry ====================

/**
 * Entry member interface
 */
export interface EntryMember {
  id: number;
  entryId: number;
  userId: number;
  eloAtEntry: number;
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
  entry?: any; // To avoid circular dependencies if not needed
}

/**
 * Entry interface
 */
export interface Entry {
  id: number;
  categoryId: number;
  captainId: number;
  name: string;
  isAcceptingMembers: boolean;
  requiredMemberCount: number;
  currentMemberCount: number;
  isConfirmed: boolean;
  confirmedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  members?: EntryMember[];
  category?: {
    id: number;
    name: string;
    type: TournamentContentType;
    tournamentId: number;
  };
  captain?: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

// ==================== Entry Flow Types ====================

export type EntryJoinRequestStatus = "pending" | "approved" | "rejected";

export interface EntryJoinRequest {
  id: number;
  entryId: number;
  userId: number;
  status: EntryJoinRequestStatus;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

export type EntryRole = "captain" | "member" | "pending" | "none";

export interface EntryWithRole {
  entry: Entry;
  role: EntryRole;
}

// ==================== Request Types ====================

export interface RegisterEntryRequest {
  categoryId: number;
  action: "create_team" | "join_team";
  name?: string;
  targetEntryId?: number;
}

/**
 * Update entry request (captain only)
 */
export interface UpdateEntryRequest {
  name?: string;
  requiredMemberCount?: number;
  isAcceptingMembers?: boolean;
}

export interface InviteEntryMemberRequest {
  inviteeId: number;
}

export interface TransferCaptaincyRequest {
  newCaptainId: number;
}

export interface RespondJoinRequestRequest {
  action: "approve" | "reject";
  rejectionReason?: string;
}

export interface DisqualifyEntriesRequest {}

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
  categoryId?: number;
}

/**
 * Confirm import single entries request
 */
export interface ConfirmImportSingleEntriesRequest {
  contentId: number;
  categoryId?: number;
  entries: ImportSingleEntryDto[];
}

/**
 * Preview import double entries request
 */
export interface PreviewImportDoubleEntriesRequest {
  file: File;
  contentId: number;
  categoryId?: number;
}

/**
 * Confirm import double entries request
 */
export interface ConfirmImportDoubleEntriesRequest {
  contentId: number;
  categoryId?: number;
  entries: ImportDoubleEntryDto[];
}

/**
 * Preview import team entries request
 */
export interface PreviewImportTeamEntriesRequest {
  file: File;
  contentId: number;
  categoryId?: number;
}

/**
 * Confirm import team entries request
 */
export interface ConfirmImportTeamEntriesRequest {
  contentId: number;
  categoryId?: number;
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

// ==================== Flow Response Types ====================

export interface EntryMembersResponse {
  members: EntryMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface EntryJoinRequestsResponse {
  joinRequests: EntryJoinRequest[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface EntryEligibilityResponse {
  eligible: Entry[];
  ineligible: {
    entry: Entry;
    reasons: string[];
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface EntryRoleResponse {
  entryId: number;
  role: EntryRole;
}

export interface MyEntriesResponse {
  rows: EntryWithRole[];
  count: number;
}

// ==================== Response Types ====================

export interface RegisterEntryResponse {
  entry: Entry;
  message: string;
}

export interface DisqualifyEntriesResponse {
  deletedCount: number;
  deleted: {
    entryId: number;
    reasons: string[];
  }[];
}

export interface EntriesResponse {
  rows: Entry[];
  count: number;
}
