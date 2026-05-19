/**
 * Header Breadcrumb Configuration
 * Centralized route-to-breadcrumb mapping for portal headers
 * Maintains consistency across admin, organizer, and referee portals
 */

export type CrumbConfig = {
  labelKey: string;
  to?: string;
};

export type RouteMeta = {
  pattern: string;
  titleKey: string;
  breadcrumbs: CrumbConfig[];
};

/**
 * Route metadata for breadcrumb generation
 * Patterns are matched using react-router's matchPath utility
 * Use :paramName for dynamic route segments (e.g., :tournamentId)
 */
export const ROUTE_META: RouteMeta[] = [
  // Admin Routes
  {
    pattern: "/admin",
    titleKey: "portal.admin.users",
    breadcrumbs: [
      { labelKey: "portal.admin.title", to: "/admin" },
      { labelKey: "portal.admin.users" },
    ],
  },
  {
    pattern: "/admin/users",
    titleKey: "portal.admin.users",
    breadcrumbs: [
      { labelKey: "portal.admin.title", to: "/admin" },
      { labelKey: "portal.admin.users" },
    ],
  },
  {
    pattern: "/admin/roles",
    titleKey: "portal.admin.roles",
    breadcrumbs: [
      { labelKey: "portal.admin.title", to: "/admin" },
      { labelKey: "portal.admin.roles" },
    ],
  },
  {
    pattern: "/admin/notifications",
    titleKey: "nav.notifications",
    breadcrumbs: [
      { labelKey: "portal.admin.title", to: "/admin" },
      { labelKey: "nav.notifications" },
    ],
  },

  // Organizer Routes
  {
    pattern: "/organizer",
    titleKey: "nav.dashboard",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "nav.dashboard" },
    ],
  },
  {
    pattern: "/organizer/tournaments",
    titleKey: "nav.tournaments",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "nav.tournaments" },
    ],
  },
  {
    pattern: "/organizer/tournaments/new",
    titleKey: "tournament.createTournament",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "nav.tournaments", to: "/organizer/tournaments" },
      { labelKey: "tournament.createTournament" },
    ],
  },
  {
    pattern: "/organizer/tournaments/:tournamentId/edit",
    titleKey: "tournament.updateTournament",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "nav.tournaments", to: "/organizer/tournaments" },
      { labelKey: "tournament.updateTournament" },
    ],
  },
  {
    pattern: "/organizer/notifications",
    titleKey: "nav.notifications",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "nav.notifications" },
    ],
  },
  {
    pattern: "/organizer/categories",
    titleKey: "portal.organizer.categories",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "portal.organizer.categories" },
    ],
  },
  {
    pattern: "/organizer/schedule-config",
    titleKey: "nav.schedule",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "nav.schedule" },
    ],
  },
  {
    pattern: "/organizer/entries",
    titleKey: "portal.organizer.playerManagement",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "portal.organizer.playerManagement" },
    ],
  },
  {
    pattern: "/organizer/bulk-import",
    titleKey: "organizer.bulkImport",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "organizer.bulkImport" },
    ],
  },
  {
    pattern: "/organizer/finance",
    titleKey: "organizer.financeVerification",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "organizer.financeVerification" },
    ],
  },
  {
    pattern: "/organizer/draw",
    titleKey: "organizer.groupDraw",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "organizer.groupDraw" },
    ],
  },
  {
    pattern: "/organizer/schedule-generation",
    titleKey: "portal.organizer.scheduleGeneration",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "portal.organizer.scheduleGeneration" },
    ],
  },
  {
    pattern: "/organizer/referees",
    titleKey: "nav.referees",
    breadcrumbs: [
      { labelKey: "portal.organizer.title", to: "/organizer" },
      { labelKey: "nav.referees" },
    ],
  },

  // Referee Routes
  {
    pattern: "/referee",
    titleKey: "portal.referee.invitations",
    breadcrumbs: [
      { labelKey: "portal.referee.title", to: "/referee" },
      { labelKey: "portal.referee.invitations" },
    ],
  },
  {
    pattern: "/referee/invitations",
    titleKey: "portal.referee.invitations",
    breadcrumbs: [
      { labelKey: "portal.referee.title", to: "/referee" },
      { labelKey: "portal.referee.invitations" },
    ],
  },
  {
    pattern: "/referee/assigned",
    titleKey: "portal.referee.assignedMatches",
    breadcrumbs: [
      { labelKey: "portal.referee.title", to: "/referee" },
      { labelKey: "portal.referee.assignedMatches" },
    ],
  },
  {
    pattern: "/referee/live",
    titleKey: "referee.liveScoring",
    breadcrumbs: [
      { labelKey: "portal.referee.title", to: "/referee" },
      { labelKey: "referee.liveScoring" },
    ],
  },
  {
    pattern: "/referee/submit",
    titleKey: "match.submitResult",
    breadcrumbs: [
      { labelKey: "portal.referee.title", to: "/referee" },
      { labelKey: "match.submitResult" },
    ],
  },
  {
    pattern: "/referee/approvals",
    titleKey: "portal.referee.approvals",
    breadcrumbs: [
      { labelKey: "portal.referee.title", to: "/referee" },
      { labelKey: "portal.referee.approvals" },
    ],
  },
  {
    pattern: "/referee/approvals/:matchId",
    titleKey: "portal.referee.approvalDetail",
    breadcrumbs: [
      { labelKey: "portal.referee.title", to: "/referee" },
      { labelKey: "portal.referee.approvals", to: "/referee/approvals" },
      { labelKey: "portal.referee.approvalDetail" },
    ],
  },
];

/**
 * Fallback route mappings by portal path prefix
 * Used when specific route pattern doesn't match
 */
export const PORTAL_FALLBACKS: Record<
  string,
  { title: string; breadcrumb: string }
> = {
  "/admin": {
    title: "portal.admin.title",
    breadcrumb: "portal.admin.title",
  },
  "/organizer": {
    title: "portal.organizer.title",
    breadcrumb: "portal.organizer.title",
  },
  "/referee": {
    title: "portal.referee.title",
    breadcrumb: "portal.referee.title",
  },
};
