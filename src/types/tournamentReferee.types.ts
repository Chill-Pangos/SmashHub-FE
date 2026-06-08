
// ==================== Enums ====================

/**
 * Tournament referee role enum
 */
export type TournamentRefereeRole = "main" | "assistant";
export type TournamentRefereeRoleV2 = "referee" | "chief";
export type TournamentRefereeRoleAll =
  | TournamentRefereeRole
  | TournamentRefereeRoleV2;

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
  role: TournamentRefereeRoleAll;
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
  role: TournamentRefereeRoleAll;
  isAvailable: boolean;
}

export type TournamentRefereeInvitationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface TournamentRefereeInvitation {
  id: number;
  tournamentId: number;
  refereeId: number;
  role: TournamentRefereeRoleAll;
  status: TournamentRefereeInvitationStatus;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  referee?: RefereeUser;
  tournament?: TournamentInfo;
}

// ==================== Request Types ====================

/**
 * Create tournament referee request
 */
export interface CreateTournamentRefereeRequest {
  tournamentId: number;
  refereeId: number;
  role: TournamentRefereeRoleAll;
}

export interface InviteRefereeRequest {
  tournamentId: number;
  refereeId: number;
  role: TournamentRefereeRoleAll;
}

export interface AcceptInvitationRequest {
  invitationId: number;
}

export interface RejectInvitationRequest {
  invitationId: number;
  rejectionReason?: string;
}

export interface CancelInvitationRequest {
  invitationId: number;
}

export interface RemoveRefereeRequest {
  tournamentId: number;
  refereeId: number;
}

export interface UpdateRefereeRoleRequest {
  tournamentId: number;
  refereeId: number;
  role: TournamentRefereeRoleAll;
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
  role?: TournamentRefereeRoleAll;
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
export type CreateTournamentRefereeResponse = TournamentReferee;

export type InviteRefereeResponse = TournamentRefereeInvitation;
export type AcceptInvitationResponse = TournamentReferee;
export type RejectInvitationResponse = TournamentRefereeInvitation;
export type CancelInvitationResponse = TournamentRefereeInvitation;
export type RemoveRefereeResponse = void;
export type UpdateRefereeRoleResponse = TournamentReferee;

/**
 * Assign multiple referees response
 */
export interface AssignRefereesResponse {
  tournamentId: number;
  assignedCount: number;
  referees: AssignedReferee[];
}

/**
 * Get all tournament referees response (paginated)
 */
export interface GetAllTournamentRefereesResponse {
  referees: TournamentReferee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Get referees by tournament response
 */
export interface GetRefereesByTournamentResponse {
  referees: TournamentReferee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface GetInvitationsByTournamentResponse {
  invitations: TournamentRefereeInvitation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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
export type UpdateTournamentRefereeResponse = TournamentReferee;

/**
 * Update availability response
 */
export interface UpdateAvailabilityResponse {
  id: number;
  refereeId: number;
  isAvailable: boolean;
  updatedAt: string;
}

/**
 * Delete tournament referee response
 */
export type DeleteTournamentRefereeResponse = void;
