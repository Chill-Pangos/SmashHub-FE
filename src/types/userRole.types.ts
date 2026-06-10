/**
 * User Role Types
 * Type definitions for user-role mapping operations
 */

import type { PaginatedResult, PaginationParams } from "./pagination.types";

export interface UserRoleAssignment {
  id?: number;
  userId: number;
  roleId: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AssignRoleToUserRequest {
  userId: number;
  roleId: number;
}

export interface UserRoleListParams extends PaginationParams {
  page?: number;
}

export type GetUserRolesResponse = PaginatedResult<UserRoleAssignment>;
export type GetRolesByUserResponse = PaginatedResult<UserRoleAssignment>;
export type GetUsersByRoleResponse = PaginatedResult<UserRoleAssignment>;
