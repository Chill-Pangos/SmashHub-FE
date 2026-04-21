/**
 * Role Types
 * Type definitions for role-related operations
 */

import type { PaginatedResult, PaginationParams } from "./pagination.types";

// ==================== Base Role Interface ====================

/**
 * Role entity from API
 */
export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ==================== Create Role ====================

/**
 * Request body for creating a new role
 * POST /api/roles
 */
export interface CreateRoleRequest {
  name: string; // Required - Unique role name
  description?: string; // Optional - Role description
}

/**
 * Response from create role API
 */
export interface CreateRoleResponse {
  success: boolean;
  message: string;
  data: Role;
}

// ==================== Update Role ====================

/**
 * Request body for updating a role
 * PUT /api/roles/:id
 */
export interface UpdateRoleRequest {
  name?: string; // Optional - New unique name
  description?: string; // Optional - New description
}

/**
 * Update role response
 * Sequelize returns: [affectedCount, [updatedRole]]
 */
export type UpdateRoleResponse = [
  number, // Number of rows updated
  Role[], // Array of updated role(s)
];

// ==================== Role Validation ====================

/**
 * Role form data for frontend forms
 */
export interface RoleFormData {
  name: string;
  description?: string;
}

/**
 * Validation errors for role forms
 */
export interface RoleValidationErrors {
  name?: string;
  description?: string;
}

// ==================== Pagination Types ====================

export interface RoleListParams extends PaginationParams {}

export type PaginatedRolesResult = PaginatedResult<Role>;
