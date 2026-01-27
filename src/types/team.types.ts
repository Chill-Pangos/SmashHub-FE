import type { ApiResponse } from "./auth.types";

// ==================== Enums ====================

/**
 * Team member role enum
 */
export type TeamMemberRole = "team_manager" | "coach" | "athlete";

// ==================== Team ====================

/**
 * Team interface
 */
export interface Team {
  id: number;
  tournamentId: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  members?: TeamMember[];
}

/**
 * Team member interface
 */
export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  role: TeamMemberRole;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  team?: Team;
}

// ==================== Request Types ====================

/**
 * Create team request
 */
export interface CreateTeamRequest {
  tournamentId: number;
  name: string;
  description?: string;
}

/**
 * Update team request
 */
export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

/**
 * Create team member request
 */
export interface CreateTeamMemberRequest {
  teamId: number;
  userId: number;
  role: TeamMemberRole;
}

/**
 * Update team member request
 */
export interface UpdateTeamMemberRequest {
  role: TeamMemberRole;
}

// ==================== Import Types ====================

/**
 * Team import member data
 */
export interface ImportTeamMemberDto {
  teamName: string;
  memberName: string;
  role: TeamMemberRole;
  email: string;
}

/**
 * Team import data
 */
export interface ImportTeamDto {
  name: string;
  description?: string;
  members: ImportTeamMemberDto[];
  rowNumber: number;
}

/**
 * Preview import teams request
 */
export interface PreviewImportTeamsRequest {
  file: File;
}

/**
 * Confirm import teams request
 */
export interface ConfirmImportTeamsRequest {
  tournamentId: number;
  teams: ImportTeamDto[];
}

/**
 * Import preview result
 */
export interface ImportPreviewResult {
  success: boolean;
  data: {
    teams: ImportTeamDto[];
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
export interface ImportConfirmResult {
  success: boolean;
  message: string;
  data: {
    created: number;
    teams: Team[];
  };
}

// ==================== Response Types ====================

export type TeamResponse = ApiResponse<Team>;
export type TeamsResponse = ApiResponse<Team[]>;
export type TeamMemberResponse = ApiResponse<TeamMember>;
export type TeamMembersResponse = ApiResponse<TeamMember[]>;
export type ImportTeamsPreviewResponse = ApiResponse<
  ImportPreviewResult["data"]
>;
export type ImportTeamsConfirmResponse = ApiResponse<
  ImportConfirmResult["data"]
>;
