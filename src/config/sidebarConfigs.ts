import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bell,
  ClipboardList,
  LogOut,
  Trophy,
  Users,
  Workflow,
  Shield,
  Gavel,
  BarChart3,
  Settings2,
  Gamepad2,
  TrendingUp,
  History,
} from "lucide-react";

export type PortalSidebarItem = {
  key: string;
  label: string;
  to?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  badge?: string;
  danger?: boolean;
  disabled?: boolean;
  end?: boolean;
};

export type PortalSidebarSection = {
  title?: string;
  items: PortalSidebarItem[];
};

export type PortalBrand = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
};

export type PortalUser = {
  name: string;
  email?: string;
  roles?: string[];
};

export type SidebarConfig = {
  brand: PortalBrand;
  sections: (t: (key: string) => string) => PortalSidebarSection[];
  primaryAction?: (t: (key: string) => string) => PortalSidebarItem;
  footerItems: (
    t: (key: string) => string,
    logout: () => void,
  ) => PortalSidebarItem[];
};

/**
 * Organizer Portal Sidebar Configuration
 */
export const organizerSidebarConfig: SidebarConfig = {
  brand: {
    title: "SmashHub",
    icon: Trophy,
  },
  sections: (t) => [
    {
      title: t("portal.organizer.sections.operations"),
      items: [
        {
          key: "dashboard",
          label: t("nav.dashboard"),
          to: "/organizer",
          icon: ClipboardList,
          end: true,
        },
        {
          key: "tournaments",
          label: t("nav.tournaments"),
          to: "/organizer/tournaments",
          icon: Trophy,
          badge: "LIVE",
        },
        {
          key: "notifications",
          label: t("nav.notifications"),
          to: "/organizer/notifications",
          icon: Bell,
        },
      ],
    },
    {
      title: t("portal.organizer.sections.planning"),
      items: [
        {
          key: "create-tournament",
          label: t("tournament.createTournament"),
          to: "/organizer/tournaments/new",
          icon: Workflow,
        },
        {
          key: "categories",
          label: t("portal.organizer.categories"),
          to: "/organizer/categories",
          icon: BadgeCheck,
        },
      ],
    },
  ],
  primaryAction: (t) => ({
    key: "create-primary",
    label: t("portal.organizer.primaryAction"),
    to: "/organizer/tournaments/new",
    icon: Workflow,
  }),
  footerItems: (t, logout) => [
    {
      key: "logout",
      label: t("auth.signOut"),
      onClick: logout,
      icon: LogOut,
    },
  ],
};

/**
 * Admin Portal Sidebar Configuration
 */
export const adminSidebarConfig: SidebarConfig = {
  brand: {
    title: "Admin Panel",
    subtitle: "SmashHub",
    icon: Shield,
  },
  sections: (t) => [
    {
      title: t("portal.admin.sections.management"),
      items: [
        {
          key: "dashboard",
          label: t("nav.dashboard"),
          to: "/admin",
          icon: BarChart3,
          end: true,
        },
        {
          key: "users",
          label: t("portal.admin.users"),
          to: "/admin/users",
          icon: Users,
        },
        {
          key: "tournaments",
          label: t("nav.tournaments"),
          to: "/admin/tournaments",
          icon: Trophy,
        },
        {
          key: "roles",
          label: t("portal.admin.roles"),
          to: "/admin/roles",
          icon: BadgeCheck,
        },
      ],
    },
    {
      title: t("portal.admin.sections.system"),
      items: [
        {
          key: "settings",
          label: t("nav.settings"),
          to: "/admin/settings",
          icon: Settings2,
        },
        {
          key: "notifications",
          label: t("nav.notifications"),
          to: "/admin/notifications",
          icon: Bell,
        },
      ],
    },
  ],
  footerItems: (t, logout) => [
    {
      key: "logout",
      label: t("auth.signOut"),
      onClick: logout,
      icon: LogOut,
    },
  ],
};

/**
 * Referee Portal Sidebar Configuration
 */
export const refereeSidebarConfig: SidebarConfig = {
  brand: {
    title: "Referee Portal",
    subtitle: "SmashHub",
    icon: Gavel,
  },
  sections: (t) => [
    {
      title: t("portal.referee.sections.main"),
      items: [
        {
          key: "pending-invitations",
          label: t("portal.referee.pendingInvitations"),
          to: "/referee/invitations",
          icon: ClipboardList,
        },
        {
          key: "tournaments",
          label: t("nav.tournaments"),
          to: "/referee/tournaments",
          icon: Trophy,
        },
        {
          key: "notifications",
          label: t("nav.notifications"),
          to: "/referee/notifications",
          icon: Bell,
        },
      ],
    },
  ],
  footerItems: (t, logout) => [
    {
      key: "logout",
      label: t("auth.signOut"),
      onClick: logout,
      icon: LogOut,
    },
  ],
};

/**
 * Chief Referee Portal Sidebar Configuration
 */
export const chiefRefereeSidebarConfig: SidebarConfig = {
  brand: {
    title: "Chief Referee Portal",
    subtitle: "SmashHub",
    icon: Gavel,
  },
  sections: (t) => [
    {
      title: t("portal.referee.sections.main"),
      items: [
        {
          key: "pending-invitations",
          label: t("portal.referee.pendingInvitations"),
          to: "/referee/invitations",
          icon: ClipboardList,
        },
        {
          key: "pending-matches",
          label: t("portal.referee.pendingMatches") || "Pending Verification",
          to: "/referee/pending-matches",
          icon: BadgeCheck,
        },
        {
          key: "tournaments",
          label: t("nav.tournaments"),
          to: "/referee/tournaments",
          icon: Trophy,
        },
        {
          key: "notifications",
          label: t("nav.notifications"),
          to: "/referee/notifications",
          icon: Bell,
        },
      ],
    },
  ],
  footerItems: (t, logout) => [
    {
      key: "logout",
      label: t("auth.signOut"),
      onClick: logout,
      icon: LogOut,
    },
  ],
};

/**
 * Pro Player Portal Sidebar Configuration
 */
export const proPlayerSidebarConfig: SidebarConfig = {
  brand: {
    title: "SmashHub",
    subtitle: "Pro Player Portal",
    icon: Gamepad2,
  },
  sections: (t) => [
    {
      items: [
        {
          key: "dashboard",
          label: t("nav.dashboard") || "Dashboard",
          to: "/dashboard",
          icon: BarChart3,
          end: true,
        },
        {
          key: "tournaments",
          label: t("nav.tournaments") || "Tournaments",
          to: "/tournaments",
          icon: Trophy,
        },
        {
          key: "elo",
          label: t("nav.elo") || "Elo",
          to: "/elo",
          icon: TrendingUp,
        },
        {
          key: "analytics",
          label: t("nav.analytics") || "Analytics",
          to: "/analytics",
          icon: BarChart3,
        },
        {
          key: "team",
          label: t("nav.team") || "Team",
          to: "/team",
          icon: Users,
        },
        {
          key: "matches",
          label: t("nav.matches") || "Match Center",
          to: "/matches",
          icon: History,
        },
        {
          key: "elo-history",
          label: t("nav.eloHistory") || "Elo History",
          to: "/elo/history",
          icon: TrendingUp,
        },
      ],
    },
  ],
  footerItems: (t, logout) => [
    {
      key: "logout",
      label: t("auth.signOut") || "Sign Out",
      onClick: logout,
      icon: LogOut,
    },
  ],
};

export function getRefereeSidebarConfig(
  isChiefReferee: boolean,
): SidebarConfig {
  return isChiefReferee ? chiefRefereeSidebarConfig : refereeSidebarConfig;
}

/**
 * Get sidebar config by portal type
 */
export function getSidebarConfig(
  portalType: "organizer" | "admin" | "referee" | "player",
): SidebarConfig {
  const configs: Record<string, SidebarConfig> = {
    organizer: organizerSidebarConfig,
    admin: adminSidebarConfig,
    referee: refereeSidebarConfig,
    player: proPlayerSidebarConfig,
  };

  return configs[portalType] || organizerSidebarConfig;
}
