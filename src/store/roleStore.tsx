import React, { useState, useEffect, type ReactNode } from "react";
import type { Role } from "@/types";
import { roleService } from "@/services";
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
  organizer: "/tournament-manager",
  chief_referee: "/chief-referee",
  referee: "/referee",
  team_manager: "/team-manager",
  coach: "/coach",
  athlete: "/athlete",
  spectator: "/spectator",
};

// Priority mapping by role name (higher = more important)
const ROLE_PRIORITY: Record<string, number> = {
  admin: 8,
  organizer: 7,
  chief_referee: 6,
  referee: 5,
  team_manager: 4,
  coach: 3,
  athlete: 2,
  spectator: 1,
};

// Vietnamese role names by role name
const ROLE_DISPLAY_NAMES: Record<string, string> = {
  admin: "Quản trị viên",
  organizer: "Quản lý giải đấu",
  chief_referee: "Tổng trọng tài",
  referee: "Trọng tài",
  athlete: "Vận động viên",
  spectator: "Khán giả",
  team_manager: "Quản lý đoàn",
  coach: "Huấn luyện viên",
};

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [roleState, setRoleState] = useState<RoleState>({
    roles: [],
    isLoading: true,
    error: null,
  });

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

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
      setRoleState({
        roles: [],
        isLoading: false,
        error: "Không thể tải danh sách vai trò",
      });
    }
  };

  const getRoleById = (id: number): Role | undefined => {
    return roleState.roles.find((role) => role.id === id);
  };

  const getRoleByName = (name: string): Role | undefined => {
    return roleState.roles.find((role) => role.name === name);
  };

  const getRegistrationRoles = (): Role[] => {
    return roleState.roles.filter(
      (role) =>
        role.name !== "admin" &&
        role.name !== "organizer" &&
        role.name !== "chief_referee" &&
        role.name !== "referee",
    );
  };

  // ==================== Role Checking Helpers ====================

  const hasRole = (userRoles: number[], requiredRole: number): boolean => {
    return userRoles.includes(requiredRole);
  };

  const hasAnyRole = (userRoles: number[], allowedRoles: number[]): boolean => {
    return allowedRoles.some((role) => userRoles.includes(role));
  };

  const hasAllRoles = (
    userRoles: number[],
    requiredRoles: number[],
  ): boolean => {
    return requiredRoles.every((role) => userRoles.includes(role));
  };

  // ==================== Role Name Helpers ====================

  const getRoleNameById = (roleId: number): string => {
    const role = getRoleById(roleId);
    if (role) {
      return ROLE_DISPLAY_NAMES[role.name] || role.name;
    }
    return "Không xác định";
  };

  const getRoleNames = (roleIds: number[]): string[] => {
    return roleIds.map((id) => getRoleNameById(id));
  };

  // ==================== Route Helpers ====================

  const getHighestPriorityRole = (roleIds: number[]): number | null => {
    if (!roleIds || roleIds.length === 0) return null;

    let highestRoleId = roleIds[0];
    let highestPriority = 0;

    const highestRole = getRoleById(highestRoleId);
    if (highestRole) {
      highestPriority = ROLE_PRIORITY[highestRole.name] || 0;
    }

    for (const roleId of roleIds) {
      const role = getRoleById(roleId);
      if (role) {
        const priority = ROLE_PRIORITY[role.name] || 0;
        if (priority > highestPriority) {
          highestPriority = priority;
          highestRoleId = roleId;
        }
      }
    }

    return highestRoleId;
  };

  const getDefaultRouteForRoles = (roleIds: number[]): string => {
    const highestRoleId = getHighestPriorityRole(roleIds);
    if (!highestRoleId) return "/";

    const role = getRoleById(highestRoleId);
    if (!role) return "/";

    return ROLE_ROUTES[role.name] || "/";
  };

  const contextValue: RoleContextType = {
    ...roleState,
    fetchRoles,
    getRoleById,
    getRoleByName,
    getRegistrationRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    getRoleNameById,
    getRoleNames,
    getDefaultRouteForRoles,
    getHighestPriorityRole,
  };

  return (
    <RoleContext.Provider value={contextValue}>{children}</RoleContext.Provider>
  );
};
