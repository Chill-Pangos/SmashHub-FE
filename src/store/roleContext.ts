import { createContext } from "react";
import type { Role, UserRoleInput } from "@/types";

export interface RoleState {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
}

export interface RoleContextType extends RoleState {
  // Fetch and data access
  fetchRoles: () => Promise<void>;
  getRegistrationRoles: () => Role[];
  getRoleNames: (userRoles?: UserRoleInput[]) => string[];

  // Role display helpers
  getRoleDisplayName: (roleName: string) => string;
  getRoleDisplayNames: (roleNames: string[]) => string[];

  // Role checking helpers
  hasRole: (userRoles: string[], requiredRole: string) => boolean;
  hasAnyRole: (userRoles: string[], allowedRoles: string[]) => boolean;
  hasAllRoles: (userRoles: string[], requiredRoles: string[]) => boolean;

  // Route helpers
  getDefaultRouteForRoles: (roleNames: string[]) => string;
  getHighestPriorityRoleName: (roleNames: string[]) => string | null;
}

export const RoleContext = createContext<RoleContextType | undefined>(
  undefined,
);
