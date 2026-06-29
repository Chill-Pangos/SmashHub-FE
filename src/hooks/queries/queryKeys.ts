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
    upcomingChanges: (hours?: number) =>
      [...queryKeys.tournaments.all, "upcomingChanges", hours] as const,
    updateStatuses: () =>
      [...queryKeys.tournaments.all, "updateStatuses"] as const,
  },

  // ==================== Tournament Category Keys ====================
  tournamentCategories: {
    all: ["tournamentCategories"] as const,
    lists: () => [...queryKeys.tournamentCategories.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.tournamentCategories.lists(), filters] as const,
    details: () => [...queryKeys.tournamentCategories.all, "detail"] as const,
    detail: (id: number) =>
      [...queryKeys.tournamentCategories.details(), id] as const,
    byTournament: (
      tournamentId: number,
      filters?: { page?: number; limit?: number },
    ) =>
      [
        ...queryKeys.tournamentCategories.all,
        "tournament",
        tournamentId,
        filters,
      ] as const,
  },

  // ==================== Entry Keys ====================
  entries: {
    all: ["entries"] as const,
    lists: () => [...queryKeys.entries.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.entries.lists(), filters] as const,
    details: () => [...queryKeys.entries.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.entries.details(), id] as const,
    byCategory: (categoryId: number) =>
      [...queryKeys.entries.all, "category", categoryId] as const,
    byContent: (contentId: number) => queryKeys.entries.byCategory(contentId),
    byTeam: (teamId: number) =>
      [...queryKeys.entries.all, "team", teamId] as const,
    byTournament: (tournamentId: number) =>
      [...queryKeys.entries.all, "tournament", tournamentId] as const,
    members: (entryId: number, filters?: { page?: number; limit?: number }) =>
      [...queryKeys.entries.all, "members", entryId, filters] as const,
    joinRequests: (
      entryId: number,
      filters?: { status?: string; page?: number; limit?: number },
    ) => [...queryKeys.entries.all, "joinRequests", entryId, filters] as const,
    eligible: (categoryId: number, filters?: { page?: number; limit?: number }) =>
      [...queryKeys.entries.all, "eligible", categoryId, filters] as const,
    myEntries: () => [...queryKeys.entries.all, "me"] as const,
    myRole: (entryId: number) =>
      [...queryKeys.entries.all, "myRole", entryId] as const,
  },

  // ==================== Match Keys ====================
  matches: {
    all: ["matches"] as const,
    lists: () => [...queryKeys.matches.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.matches.lists(), filters] as const,
    details: () => [...queryKeys.matches.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.matches.details(), id] as const,
    bySchedule: (scheduleId: number) =>
      [...queryKeys.matches.all, "schedule", scheduleId] as const,
    byStatus: (status: string) =>
      [...queryKeys.matches.all, "status", status] as const,
    pending: (tournamentId?: number) => 
      tournamentId 
        ? ([...queryKeys.matches.all, "pending", tournamentId] as const)
        : ([...queryKeys.matches.all, "pending"] as const),
    pendingWithElo: (matchId: number) =>
      [...queryKeys.matches.all, "pendingWithElo", matchId] as const,
    eloPreview: (matchId: number) =>
      [...queryKeys.matches.all, "eloPreview", matchId] as const,
    byCategory: (categoryId: number, filters?: object) =>
      [...queryKeys.matches.all, "category", categoryId, filters] as const,
    refereeMy: (filters?: object) =>
      [...queryKeys.matches.all, "referee", "my", filters] as const,
  },

  // ==================== Match Set Keys ====================
  matchSets: {
    all: ["matchSets"] as const,
    lists: () => [...queryKeys.matchSets.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.matchSets.lists(), filters] as const,
    details: () => [...queryKeys.matchSets.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.matchSets.details(), id] as const,
    byMatch: (matchId: number, filters?: { page?: number; limit?: number }) =>
      [...queryKeys.matchSets.all, "match", matchId, filters] as const,
  },

  // ==================== Schedule Keys ====================
  scheduleConfigs: {
    all: ["scheduleConfigs"] as const,
    defaults: () => [...queryKeys.scheduleConfigs.all, "defaults"] as const,
    byTournament: (tournamentId: number) =>
      [...queryKeys.scheduleConfigs.all, "tournament", tournamentId] as const,
  },

  // ==================== Schedule Keys ====================
  schedules: {
    all: ["schedules"] as const,
    lists: () => [...queryKeys.schedules.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.schedules.lists(), filters] as const,
    details: () => [...queryKeys.schedules.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.schedules.details(), id] as const,
    byCategory: (categoryId: number) =>
      [...queryKeys.schedules.all, "category", categoryId] as const,
    byContent: (contentId: number) => queryKeys.schedules.byCategory(contentId),
  },

  // ==================== Group Standing Keys ====================
  groupStandings: {
    all: ["groupStandings"] as const,
    lists: () => [...queryKeys.groupStandings.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.groupStandings.lists(), filters] as const,
    details: () => [...queryKeys.groupStandings.all, "detail"] as const,
    detail: (id: number) =>
      [...queryKeys.groupStandings.details(), id] as const,
    byCategory: (categoryId: number, filters?: { groupName?: string }) =>
      [
        ...queryKeys.groupStandings.all,
        "category",
        categoryId,
        filters,
      ] as const,
    byContent: (contentId: number) =>
      queryKeys.groupStandings.byCategory(contentId),
    bySchedule: (scheduleId: number) =>
      [...queryKeys.groupStandings.all, "schedule", scheduleId] as const,
    byEntry: (entryId: number) =>
      [...queryKeys.groupStandings.all, "entry", entryId] as const,
  },

  // ==================== Knockout Bracket Keys ====================
  knockoutBrackets: {
    all: ["knockoutBrackets"] as const,
    lists: () => [...queryKeys.knockoutBrackets.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.knockoutBrackets.lists(), filters] as const,
    details: () => [...queryKeys.knockoutBrackets.all, "detail"] as const,
    detail: (id: number) =>
      [...queryKeys.knockoutBrackets.details(), id] as const,
    byCategory: (categoryId: number) =>
      [...queryKeys.knockoutBrackets.all, "category", categoryId] as const,
    byContent: (contentId: number) =>
      queryKeys.knockoutBrackets.byCategory(contentId),
    tree: (categoryId: number) =>
      [...queryKeys.knockoutBrackets.all, "tree", categoryId] as const,
    standings: (categoryId: number) =>
      [...queryKeys.knockoutBrackets.all, "standings", categoryId] as const,
  },

  // ==================== Tournament Referee Keys ====================
  tournamentReferees: {
    all: ["tournamentReferees"] as const,
    lists: () => [...queryKeys.tournamentReferees.all, "list"] as const,
    list: (filters?: {
      tournamentId?: number;
      page?: number;
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
    invitations: (tournamentId: number, status?: string) =>
      [
        ...queryKeys.tournamentReferees.all,
        "invitations",
        tournamentId,
        status,
      ] as const,
    availableChiefReferees: () =>
      [...queryKeys.tournamentReferees.all, "availableChiefReferees"] as const,
  },

  // ==================== Role Keys ====================
  roles: {
    all: ["roles"] as const,
    lists: () => [...queryKeys.roles.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.roles.lists(), filters] as const,
    details: () => [...queryKeys.roles.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.roles.details(), id] as const,
    byUser: (userId: number) =>
      [...queryKeys.roles.all, "user", userId] as const,
  },

  // ==================== Permission Keys ====================
  permissions: {
    all: ["permissions"] as const,
    lists: () => [...queryKeys.permissions.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.permissions.lists(), filters] as const,
    details: () => [...queryKeys.permissions.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.permissions.details(), id] as const,
    byName: (name: string) =>
      [...queryKeys.permissions.all, "name", name] as const,
  },

  // ==================== ELO Score Keys ====================
  eloScores: {
    all: ["eloScores"] as const,
    lists: () => [...queryKeys.eloScores.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.eloScores.lists(), filters] as const,
    leaderboard: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.eloScores.all, "leaderboard", filters] as const,
    details: () => [...queryKeys.eloScores.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.eloScores.details(), id] as const,
  },

  // ==================== ELO History Keys ====================
  eloHistories: {
    all: ["eloHistories"] as const,
    lists: () => [...queryKeys.eloHistories.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.eloHistories.lists(), filters] as const,
    details: () => [...queryKeys.eloHistories.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.eloHistories.details(), id] as const,
    byUser: (userId: number, filters?: { page?: number; limit?: number }) =>
      [...queryKeys.eloHistories.all, "user", userId, filters] as const,
    byMatch: (matchId: number, filters?: { page?: number; limit?: number }) =>
      [...queryKeys.eloHistories.all, "match", matchId, filters] as const,
  },

  // ==================== User Role Keys ====================
  userRoles: {
    all: ["userRoles"] as const,
    lists: () => [...queryKeys.userRoles.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.userRoles.lists(), filters] as const,
    byUser: (userId: number, filters?: { page?: number; limit?: number }) =>
      [...queryKeys.userRoles.all, "user", userId, filters] as const,
    byRole: (roleId: number, filters?: { page?: number; limit?: number }) =>
      [...queryKeys.userRoles.all, "role", roleId, filters] as const,
    check: (userId: number, roleId: number) =>
      [...queryKeys.userRoles.all, "check", userId, roleId] as const,
  },

  // ==================== Role Permission Keys ====================
  rolePermissions: {
    all: ["rolePermissions"] as const,
    lists: () => [...queryKeys.rolePermissions.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.rolePermissions.lists(), filters] as const,
    byRole: (roleId: number, filters?: { page?: number; limit?: number }) =>
      [...queryKeys.rolePermissions.all, "role", roleId, filters] as const,
    byPermission: (
      permissionId: number,
      filters?: { page?: number; limit?: number },
    ) =>
      [
        ...queryKeys.rolePermissions.all,
        "permission",
        permissionId,
        filters,
      ] as const,
    check: (roleId: number, permissionId: number) =>
      [
        ...queryKeys.rolePermissions.all,
        "check",
        roleId,
        permissionId,
      ] as const,
  },

  // ==================== Auth Keys ====================
  auth: {
    all: ["auth"] as const,
    user: () => queryKeys.users.me(),
  },

  // ==================== User Keys ====================
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: { page?: number; limit?: number }) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
    me: () => [...queryKeys.users.all, "me"] as const,
    search: (filters?: { query?: string; page?: number; limit?: number }) =>
      [...queryKeys.users.all, "search", filters] as const,
  },

  // ==================== Notification Keys ====================
  notifications: {
    all: ["notifications"] as const,
    lists: () => [...queryKeys.notifications.all, "list"] as const,
    list: (filters?: object) =>
      [...queryKeys.notifications.lists(), filters] as const,
    unread: () => [...queryKeys.notifications.all, "unread"] as const,
    byUser: (userId: number) =>
      [...queryKeys.notifications.all, "user", userId] as const,
    connectedUsers: () =>
      [...queryKeys.notifications.all, "connectedUsers"] as const,
    serviceStatus: () =>
      [...queryKeys.notifications.all, "serviceStatus"] as const,
    userStatus: (userId: string) =>
      [...queryKeys.notifications.all, "userStatus", userId] as const,
    adminSystemSummary: () =>
      [...queryKeys.notifications.all, "adminSystemSummary"] as const,
    adminSystemAuditLogs: (filters?: object) =>
      [...queryKeys.notifications.all, "adminSystemAuditLogs", filters] as const,
  },

  // ==================== Payment Keys ====================
  payments: {
    all: ["payments"] as const,
    lists: () => [...queryKeys.payments.all, "list"] as const,
    list: (filters?: {
      entryId?: number;
      categoryId?: number;
      page?: number;
      limit?: number;
      status?: string;
      method?: string;
    }) => [...queryKeys.payments.lists(), filters] as const,
    details: () => [...queryKeys.payments.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.payments.details(), id] as const,
    byEntry: (
      entryId: number,
      filters?: { page?: number; limit?: number; status?: string },
    ) => [...queryKeys.payments.all, "entry", entryId, filters] as const,
    byCategory: (
      categoryId: number,
      filters?: {
        page?: number;
        limit?: number;
        status?: string;
        method?: string;
      },
    ) => [...queryKeys.payments.all, "category", categoryId, filters] as const,
    pending: (
      categoryId: number,
      filters?: { page?: number; limit?: number; method?: string },
    ) => [...queryKeys.payments.all, "pending", categoryId, filters] as const,
    stats: (categoryId: number) =>
      [...queryKeys.payments.all, "stats", categoryId] as const,
  },

  // ==================== Sub Match Keys ====================
  subMatches: {
    all: ["subMatches"] as const,
    lists: () => [...queryKeys.subMatches.all, "list"] as const,
    list: (filters?: { matchId?: number }) =>
      [...queryKeys.subMatches.lists(), filters] as const,
    details: () => [...queryKeys.subMatches.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.subMatches.details(), id] as const,
    byMatch: (matchId: number) =>
      [...queryKeys.subMatches.all, "match", matchId] as const,
  },

  // ==================== Sub Match Player Keys ====================
  subMatchPlayers: {
    all: ["subMatchPlayers"] as const,
    bySubMatch: (subMatchId: number) =>
      [...queryKeys.subMatchPlayers.all, "subMatch", subMatchId] as const,
    bySubMatchTeam: (subMatchId: number, team: string) =>
      [
        ...queryKeys.subMatchPlayers.all,
        "subMatch",
        subMatchId,
        "team",
        team,
      ] as const,
    byEntryMember: (
      entryMemberId: number,
      filters?: { page?: number; limit?: number },
    ) =>
      [
        ...queryKeys.subMatchPlayers.all,
        "entryMember",
        entryMemberId,
        filters,
      ] as const,
    pendingLineups: () => [...queryKeys.subMatchPlayers.all, "lineups", "pending"] as const,
    rejectedLineups: () => [...queryKeys.subMatchPlayers.all, "lineups", "rejected"] as const,
  },

  // ==================== Chatbot Keys ====================
  chatbot: {
    all: ["chatbot"] as const,
    health: () => [...queryKeys.chatbot.all, "health"] as const,
    files: () => [...queryKeys.chatbot.all, "files"] as const,
  },

  // ==================== System Keys ====================
  system: {
    all: ["system"] as const,
    health: () => [...queryKeys.system.all, "health"] as const,
    metrics: (params?: object) => [...queryKeys.system.all, "metrics", params] as const,
    events: (params?: object) => [...queryKeys.system.all, "events", params] as const,
  },
} as const;

// Type helpers for query keys
export type QueryKeys = typeof queryKeys;
