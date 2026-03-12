import type { ApiResponse } from "./auth.types";

// ==================== Enums ====================

/**
 * Tournament referee role enum
 */
export type TournamentRefereeRole = "main" | "assistant";

// ==================== Tournament Referee ====================

/**
 * Referee user info (nested in tournament referee)
 */
export interface RefereeUser {
  id: number;
  username: string;
  fullName: string;
  email?: string;
}

/**
 * Tournament info (nested in tournament referee)
 */
export interface TournamentInfo {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Tournament Referee interface
 */
export interface TournamentReferee {
  id: number;
  tournamentId: number;
  refereeId: number;
  role: TournamentRefereeRole;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  referee?: RefereeUser;
  tournament?: TournamentInfo;
}

/**
 * Assigned referee info (simplified)
 */
export interface AssignedReferee {
  id: number;
  refereeId: number;
  role: TournamentRefereeRole;
  isAvailable: boolean;
}

// ==================== Request Types ====================

/**
 * Create tournament referee request
 */
export interface CreateTournamentRefereeRequest {
  tournamentId: number;
  refereeId: number;
  role: TournamentRefereeRole;
}

/**
 * Assign multiple referees request
 */
export interface AssignRefereesRequest {
  tournamentId: number;
  refereeIds: number[];
}

/**
 * Update tournament referee request
 */
export interface UpdateTournamentRefereeRequest {
  role?: TournamentRefereeRole;
  isAvailable?: boolean;
}

/**
 * Update referee availability request
 */
export interface UpdateAvailabilityRequest {
  isAvailable: boolean;
}

// ==================== Response Types ====================

/**
 * Create tournament referee response
 */
export interface CreateTournamentRefereeResponse {
  success: boolean;
  message: string;
  data: TournamentReferee;
}

/**
 * Assign multiple referees response
 */
export interface AssignRefereesResponse {
  success: boolean;
  message: string;
  data: {
    tournamentId: number;
    assignedCount: number;
    referees: AssignedReferee[];
  };
}

/**
 * Get all tournament referees response (paginated)
 */
export interface GetAllTournamentRefereesResponse {
  data: TournamentReferee[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Get referees by tournament response
 */
export interface GetRefereesByTournamentResponse {
  data: TournamentReferee[];
  total: number;
}

/**
 * Get available referees response
 */
export interface GetAvailableRefereesResponse {
  data: TournamentReferee[];
  availableCount: number;
}

/**
 * Get available chief referees response
 */
export interface GetAvailableChiefRefereesResponse {
  data: RefereeUser[];
  availableCount: number;
}

/**
 * Get tournament referee by ID response
 */
export type GetTournamentRefereeResponse = TournamentReferee;

/**
 * Update tournament referee response
 */
export interface UpdateTournamentRefereeResponse {
  success: boolean;
  message: string;
  data: TournamentReferee;
}

/**
 * Update availability response
 */
export interface UpdateAvailabilityResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    refereeId: number;
    isAvailable: boolean;
    updatedAt: string;
  };
}

/**
 * Delete tournament referee response
 */
export type DeleteTournamentRefereeResponse = ApiResponse<void>;
