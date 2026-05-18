import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bell,
  CalendarDays,
  ClipboardList,
  LogOut,
  Settings2,
  Trophy,
  UserCheck,
  Users,
  Workflow,
  Shield,
  Gavel,
  BarChart3,
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
          key: "player-management",
          label: t("portal.organizer.playerManagement"),
          to: "/organizer/entries",
          icon: Users,
        },
        {
          key: "referees",
          label: t("nav.referees"),
          to: "/organizer/referees",
          icon: UserCheck,
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
        {
          key: "schedule-config",
          label: t("nav.schedule"),
          to: "/organizer/schedule-config",
          icon: CalendarDays,
        },
        {
          key: "schedule-generation",
          label: t("portal.organizer.scheduleGeneration"),
          to: "/organizer/schedule-generation",
          icon: Settings2,
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
          key: "dashboard",
          label: t("nav.dashboard"),
          to: "/referee",
          icon: ClipboardList,
          end: true,
        },
        {
          key: "assigned-matches",
          label: t("portal.referee.assignedMatches"),
          to: "/referee/matches",
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
 * Get sidebar config by portal type
 */
export function getSidebarConfig(
  portalType: "organizer" | "admin" | "referee",
): SidebarConfig {
  const configs: Record<string, SidebarConfig> = {
    organizer: organizerSidebarConfig,
    admin: adminSidebarConfig,
    referee: refereeSidebarConfig,
  };

  return configs[portalType] || organizerSidebarConfig;
}