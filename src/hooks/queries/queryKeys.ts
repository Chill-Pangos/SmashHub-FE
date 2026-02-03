/**
 * Query Keys Factory
 * Quản lý tất cả query keys theo chuẩn factory pattern
 * Giúp invalidate queries dễ dàng và tránh xung đột keys
 */

export const queryKeys = {
  // ==================== Tournament Keys ====================
  tournaments: {
    all: ["tournaments"] as const,
    lists: () => [...queryKeys.tournaments.all, "list"] as const,
    list: (filters: object) =>
      [...queryKeys.tournaments.lists(), filters] as const,
    search: (filters: object) =>
      [...queryKeys.tournaments.all, "search", filters] as const,
    details: () => [...queryKeys.tournaments.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.tournaments.details(), id] as const,
    byStatus: (status: string) =>
      [...queryKeys.tournaments.all, "status", status] as const,
  },

  // ==================== Team Keys ====================
  teams: {
    all: ["teams"] as const,
    lists: () => [...queryKeys.teams.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.teams.lists(), filters] as const,
    details: () => [...queryKeys.teams.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.teams.details(), id] as const,
    byTournament: (tournamentId: number) =>
      [...queryKeys.teams.all, "tournament", tournamentId] as const,
  },

  // ==================== Team Member Keys ====================
  teamMembers: {
    all: ["teamMembers"] as const,
    lists: () => [...queryKeys.teamMembers.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.teamMembers.lists(), filters] as const,
    details: () => [...queryKeys.teamMembers.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.teamMembers.details(), id] as const,
    byTeam: (teamId: number) =>
      [...queryKeys.teamMembers.all, "team", teamId] as const,
    byTournament: (tournamentId: number) =>
      [...queryKeys.teamMembers.all, "tournament", tournamentId] as const,
    byUser: (userId: number) =>
      [...queryKeys.teamMembers.all, "user", userId] as const,
  },

  // ==================== Entry Keys ====================
  entries: {
    all: ["entries"] as const,
    lists: () => [...queryKeys.entries.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.entries.lists(), filters] as const,
    details: () => [...queryKeys.entries.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.entries.details(), id] as const,
    byContent: (contentId: number) =>
      [...queryKeys.entries.all, "content", contentId] as const,
    byTeam: (teamId: number) =>
      [...queryKeys.entries.all, "team", teamId] as const,
    byTournament: (tournamentId: number) =>
      [...queryKeys.entries.all, "tournament", tournamentId] as const,
  },

  // ==================== Match Keys ====================
  matches: {
    all: ["matches"] as const,
    lists: () => [...queryKeys.matches.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.matches.lists(), filters] as const,
    details: () => [...queryKeys.matches.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.matches.details(), id] as const,
    bySchedule: (scheduleId: number) =>
      [...queryKeys.matches.all, "schedule", scheduleId] as const,
    byStatus: (status: string) =>
      [...queryKeys.matches.all, "status", status] as const,
    pending: () => [...queryKeys.matches.all, "pending"] as const,
    pendingWithElo: (matchId: number) =>
      [...queryKeys.matches.all, "pendingWithElo", matchId] as const,
    eloPreview: (matchId: number) =>
      [...queryKeys.matches.all, "eloPreview", matchId] as const,
  },

  // ==================== Match Set Keys ====================
  matchSets: {
    all: ["matchSets"] as const,
    lists: () => [...queryKeys.matchSets.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.matchSets.lists(), filters] as const,
    details: () => [...queryKeys.matchSets.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.matchSets.details(), id] as const,
    byMatch: (matchId: number) =>
      [...queryKeys.matchSets.all, "match", matchId] as const,
  },

  // ==================== Schedule Keys ====================
  schedules: {
    all: ["schedules"] as const,
    lists: () => [...queryKeys.schedules.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.schedules.lists(), filters] as const,
    details: () => [...queryKeys.schedules.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.schedules.details(), id] as const,
    byContent: (contentId: number) =>
      [...queryKeys.schedules.all, "content", contentId] as const,
  },

  // ==================== Group Standing Keys ====================
  groupStandings: {
    all: ["groupStandings"] as const,
    lists: () => [...queryKeys.groupStandings.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.groupStandings.lists(), filters] as const,
    details: () => [...queryKeys.groupStandings.all, "detail"] as const,
    detail: (id: number) =>
      [...queryKeys.groupStandings.details(), id] as const,
    byContent: (contentId: number) =>
      [...queryKeys.groupStandings.all, "content", contentId] as const,
    bySchedule: (scheduleId: number) =>
      [...queryKeys.groupStandings.all, "schedule", scheduleId] as const,
    byEntry: (entryId: number) =>
      [...queryKeys.groupStandings.all, "entry", entryId] as const,
  },

  // ==================== Knockout Bracket Keys ====================
  knockoutBrackets: {
    all: ["knockoutBrackets"] as const,
    lists: () => [...queryKeys.knockoutBrackets.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.knockoutBrackets.lists(), filters] as const,
    details: () => [...queryKeys.knockoutBrackets.all, "detail"] as const,
    detail: (id: number) =>
      [...queryKeys.knockoutBrackets.details(), id] as const,
    byContent: (contentId: number) =>
      [...queryKeys.knockoutBrackets.all, "content", contentId] as const,
  },

  // ==================== Tournament Referee Keys ====================
  tournamentReferees: {
    all: ["tournamentReferees"] as const,
    lists: () => [...queryKeys.tournamentReferees.all, "list"] as const,
    list: (filters?: {
      tournamentId?: number;
      skip?: number;
      limit?: number;
    }) => [...queryKeys.tournamentReferees.lists(), filters] as const,
    details: () => [...queryKeys.tournamentReferees.all, "detail"] as const,
    detail: (id: number) =>
      [...queryKeys.tournamentReferees.details(), id] as const,
    byTournament: (tournamentId: number) =>
      [
        ...queryKeys.tournamentReferees.all,
        "tournament",
        tournamentId,
      ] as const,
    availableChiefReferees: () =>
      [...queryKeys.tournamentReferees.all, "availableChiefReferees"] as const,
  },

  // ==================== Role Keys ====================
  roles: {
    all: ["roles"] as const,
    lists: () => [...queryKeys.roles.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.roles.lists(), filters] as const,
    details: () => [...queryKeys.roles.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.roles.details(), id] as const,
    byUser: (userId: number) =>
      [...queryKeys.roles.all, "user", userId] as const,
  },

  // ==================== Auth Keys ====================
  auth: {
    all: ["auth"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },

  // ==================== User Keys ====================
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
    search: (filters?: { query?: string; skip?: number; limit?: number }) =>
      [...queryKeys.users.all, "search", filters] as const,
  },

  // ==================== Notification Keys ====================
  notifications: {
    all: ["notifications"] as const,
    lists: () => [...queryKeys.notifications.all, "list"] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.notifications.lists(), filters] as const,
    unread: () => [...queryKeys.notifications.all, "unread"] as const,
    byUser: (userId: number) =>
      [...queryKeys.notifications.all, "user", userId] as const,
  },
} as const;

// Type helpers for query keys
export type QueryKeys = typeof queryKeys;
