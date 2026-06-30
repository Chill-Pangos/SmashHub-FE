export type TournamentRefereeRoleAll = "referee" | "chief";

export type TournamentRefereeInvitationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "expired";

export interface RefereeUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export interface TournamentInfo {
  id: number;
  name: string;
  location?: string;
  tier?: number;
  status?: string;
  createdBy?: number;
  scheduleConfig?: {
    startDate?: string;
    endDate?: string;
    registrationStartDate?: string;
    registrationEndDate?: string;
    bracketGenerationDate?: string;
  };
}

export interface TournamentReferee {
  id: number;
  tournamentId: number;
  refereeId: number;
  role: TournamentRefereeRoleAll;
  createdAt: string;
  updatedAt: string;
  referee?: RefereeUser;
}

export interface TournamentRefereeInvitation {
  id: number;
  tournamentId: number;
  refereeId: number;
  invitedBy: number;
  role: TournamentRefereeRoleAll;
  status: TournamentRefereeInvitationStatus;
  expiresAt: string;
  respondedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  tournament?: TournamentInfo;
  referee?: RefereeUser;
  inviter?: RefereeUser;
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
  newRole: TournamentRefereeRoleAll;
}

export type InviteRefereeResponse = TournamentRefereeInvitation;
export type AcceptInvitationResponse = TournamentReferee;
export type RejectInvitationResponse = TournamentRefereeInvitation;
export type CancelInvitationResponse = TournamentRefereeInvitation;
export type RemoveRefereeResponse = void;
export type UpdateRefereeRoleResponse = TournamentReferee;

export interface GetRefereesByTournamentResponse {
  referees: TournamentReferee[];
  pagination: any;
}

export interface GetInvitationsByTournamentResponse {
  invitations: TournamentRefereeInvitation[];
  pagination: any;
}

export interface GetAvailableRefereesResponse {
  referees: RefereeUser[];
  pagination: any;
}

export interface GetMyInvitationsResponse {
  invitations: TournamentRefereeInvitation[];
  pagination: any;
}
