import React, { useState, type ReactNode } from "react";
import type { Role, UserRoleInput } from "@/types";
import { roleService } from "@/services";
import i18n from "@/locales/i18n";
import {
  RoleContext,
  type RoleState,
  type RoleContextType,
} from "./roleContext";

interface RoleProviderProps {
  children: ReactNode;
}

// Route mapping by role name (database names)
const ROLE_ROUTES: Record<string, string> = {
  admin: "/admin",
  organizer: "/organizer",
  chief_referee: "/referee",
  referee: "/referee",
  user: "/",
};

// Priority mapping by role name (higher = more important)
const ROLE_PRIORITY: Record<string, number> = {
  admin: 5,
  organizer: 4,
  chief_referee: 3,
  referee: 2,
  user: 1,
};

const ROLE_DISPLAY_KEYS: Record<string, string> = {
  admin: "roles.admin",
  organizer: "roles.organizer",
  chief_referee: "roles.chief_referee",
  referee: "roles.referee",
  user: "roles.user",
};

// TODO: Remove fallback roles once the role API is stable.
const FALLBACK_TIMESTAMP = new Date().toISOString();
const FALLBACK_ROLES: Role[] = [
  {
    id: 1,
    name: "admin",
    description: "Fallback admin role",
    createdAt: FALLBACK_TIMESTAMP,
    updatedAt: FALLBACK_TIMESTAMP,
  },
  {
    id: 2,
    name: "organizer",
    description: "Fallback organizer role",
    createdAt: FALLBACK_TIMESTAMP,
    updatedAt: FALLBACK_TIMESTAMP,
  },
  {
    id: 3,
    name: "chief_referee",
    description: "Fallback chief referee role",
    createdAt: FALLBACK_TIMESTAMP,
    updatedAt: FALLBACK_TIMESTAMP,
  },
  {
    id: 4,
    name: "referee",
    description: "Fallback referee role",
    createdAt: FALLBACK_TIMESTAMP,
    updatedAt: FALLBACK_TIMESTAMP,
  },
  {
    id: 5,
    name: "user",
    description: "Fallback user role",
    createdAt: FALLBACK_TIMESTAMP,
    updatedAt: FALLBACK_TIMESTAMP,
  },
];

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [roleState, setRoleState] = useState<RoleState>({
    roles: FALLBACK_ROLES,
    isLoading: false,
    error: null,
  });

  const fetchRoles = async () => {
    try {
      setRoleState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await roleService.getAllRoles(0, 100);
      setRoleState({
        roles: data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setRoleState((prev) => ({
        roles: prev.roles.length > 0 ? prev.roles : FALLBACK_ROLES,
        isLoading: false,
        error: i18n.t("roleError.title"),
      }));
    }
  };

  const getRegistrationRoles = (): Role[] => {
    return roleState.roles.filter((role) => role.name === "user");
  };

  const getRoleNames = (userRoles?: UserRoleInput[]): string[] => {
    if (!Array.isArray(userRoles)) {
      return [];
    }

    return userRoles
      .map((role) => {
        if (!role || typeof role !== "object") {
          return null;
        }

        if (typeof role.name !== "string") {
          return null;
        }

        return role.name;
      })
      .filter((role): role is string => Boolean(role));
  };

  // ==================== Role Checking Helpers ====================

  const hasRole = (userRoles: string[], requiredRole: string): boolean => {
    return userRoles.includes(requiredRole);
  };

  const hasAnyRole = (userRoles: string[], allowedRoles: string[]): boolean => {
    return allowedRoles.some((role) => userRoles.includes(role));
  };

  const hasAllRoles = (
    userRoles: string[],
    requiredRoles: string[],
  ): boolean => {
    return requiredRoles.every((role) => userRoles.includes(role));
  };

  // ==================== Role Display Helpers ====================

  const getRoleDisplayName = (roleName: string): string => {
    const key = ROLE_DISPLAY_KEYS[roleName];
    if (key) {
      const translated = i18n.t(key);
      if (translated && translated !== key) {
        return translated;
      }
    }

    return roleName;
  };

  const getRoleDisplayNames = (roleNames: string[]): string[] => {
    return roleNames.map((roleName) => getRoleDisplayName(roleName));
  };

  // ==================== Route Helpers ====================

  const getHighestPriorityRoleName = (roleNames: string[]): string | null => {
    if (!roleNames || roleNames.length === 0) return null;

    let highestRoleName: string | null = null;
    let highestPriority = -1;

    for (const roleName of roleNames) {
      const priority = ROLE_PRIORITY[roleName] ?? 0;
      if (priority > highestPriority) {
        highestPriority = priority;
        highestRoleName = roleName;
      }
    }

    return highestRoleName;
  };

  const getDefaultRouteForRoles = (roleNames: string[]): string => {
    const highestRoleName = getHighestPriorityRoleName(roleNames);
    if (!highestRoleName) return "/";

    return ROLE_ROUTES[highestRoleName] || "/";
  };

  const contextValue: RoleContextType = {
    ...roleState,
    fetchRoles,
    getRegistrationRoles,
    getRoleNames,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    getRoleDisplayName,
    getRoleDisplayNames,
    getDefaultRouteForRoles,
    getHighestPriorityRoleName,
  };

  return (
    <RoleContext.Provider value={contextValue}>{children}</RoleContext.Provider>
  );
};
