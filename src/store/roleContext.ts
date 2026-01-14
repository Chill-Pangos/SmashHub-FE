import { createContext } from "react";
import type { Role } from "@/types";

export interface RoleState {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
}

export interface RoleContextType extends RoleState {
  // Fetch and data access
  fetchRoles: () => Promise<void>;
  getRoleById: (id: number) => Role | undefined;
  getRoleByName: (name: string) => Role | undefined;
  getRegistrationRoles: () => Role[];

  // Role checking helpers
  hasRole: (userRoles: number[], requiredRole: number) => boolean;
  hasAnyRole: (userRoles: number[], allowedRoles: number[]) => boolean;
  hasAllRoles: (userRoles: number[], requiredRoles: number[]) => boolean;

  // Role name helpers
  getRoleNameById: (roleId: number) => string;
  getRoleNames: (roleIds: number[]) => string[];

  // Route helpers
  getDefaultRouteForRoles: (roleIds: number[]) => string;
  getHighestPriorityRole: (roleIds: number[]) => number | null;
}

export const RoleContext = createContext<RoleContextType | undefined>(
  undefined
);
