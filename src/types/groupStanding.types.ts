import type { ApiResponse } from "./auth.types";

// ==================== Group Standing ====================

/**
 * Group Standing interface
 */
export interface GroupStanding {
  id: number;
  contentId: number;
  entryId: number;
  groupName: string;
  position: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  setsWon: number;
  setsLost: number;
  pointsWon: number;
  pointsLost: number;
  points: number;
  isQualified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Group placeholder for random draw
 */
export interface GroupPlaceholder {
  groupName: string;
  slots: number;
  entries: number[];
}

/**
 * Group assignment for saving
 */
export interface GroupAssignment {
  groupName: string;
  entryIds: number[];
}

// ==================== Request Types ====================

/**
 * Generate placeholders request
 */
export interface GeneratePlaceholdersRequest {
  contentId: number;
}

/**
 * Random draw request
 */
export interface RandomDrawRequest {
  contentId: number;
}

/**
 * Save assignments request
 */
export interface SaveAssignmentsRequest {
  contentId: number;
  groupAssignments: GroupAssignment[];
}

/**
 * Random draw and save request
 */
export interface RandomDrawAndSaveRequest {
  contentId: number;
}

/**
 * Calculate standings request
 */
export interface CalculateStandingsRequest {
  contentId: number;
}

// ==================== Response Types ====================

/**
 * Generate placeholders response
 */
export interface GeneratePlaceholdersResponse {
  success: boolean;
  data: GroupPlaceholder[];
  message: string;
}

/**
 * Random draw response
 */
export interface RandomDrawResponse {
  success: boolean;
  data: GroupPlaceholder[];
  message: string;
}

/**
 * Save assignments response
 */
export type SaveAssignmentsResponse = ApiResponse<GroupStanding[]>;

/**
 * Random draw and save response
 */
export interface RandomDrawAndSaveResponse {
  success: boolean;
  data: {
    groupStandings: GroupStanding[];
    assignments: GroupPlaceholder[];
  };
  message: string;
}

/**
 * Calculate standings response
 */
export type CalculateStandingsResponse = ApiResponse<GroupStanding[]>;

/**
 * Get standings by content response
 */
export type GetStandingsByContentResponse = ApiResponse<GroupStanding[]>;

/**
 * Get qualified teams response
 */
export interface QualifiedTeam {
  entryId: number;
  groupName: string;
  position: number;
}

export type GetQualifiedTeamsResponse = ApiResponse<QualifiedTeam[]>;
