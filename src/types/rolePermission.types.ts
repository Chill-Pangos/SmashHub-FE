/**
 * Role Permission Types
 * Type definitions for role-permission mapping operations
 */

import type { PaginatedResult, PaginationParams } from "./pagination.types";

export interface RolePermissionAssignment {
  id?: number;
  roleId: number;
  permissionId: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AssignPermissionToRoleRequest {
  roleId: number;
  permissionId: number;
}

export interface RolePermissionListParams extends PaginationParams {
  page?: number;
}

export type GetRolePermissionsResponse =
  PaginatedResult<RolePermissionAssignment>;
export type GetPermissionsByRoleResponse =
  PaginatedResult<RolePermissionAssignment>;
export type GetRolesByPermissionResponse =
  PaginatedResult<RolePermissionAssignment>;
