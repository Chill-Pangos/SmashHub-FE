/**
 * Permission Types
 * Type definitions for permission-related operations
 */

import type { PaginatedResult, PaginationParams } from "./pagination.types";

// ==================== Base Permission Interface ====================

/**
 * Permission entity from API
 */
export interface Permission {
  id: number;
  name: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// ==================== Create Permission ====================

/**
 * Request body for creating a new permission
 * POST /api/permissions
 */
export interface CreatePermissionRequest {
  name: string;
}

/**
 * Request body for updating a permission
 * PUT /api/permissions/:id
 */
export interface UpdatePermissionRequest {
  name?: string;
}

// ==================== Permission Validation ====================

/**
 * Permission form data for frontend forms
 */
export interface PermissionFormData {
  name: string;
}

/**
 * Validation errors for permission forms
 */
export interface PermissionValidationErrors {
  name?: string;
}

// ==================== Pagination Types ====================

export interface PermissionListParams extends PaginationParams {}

export type PaginatedPermissionsResult = PaginatedResult<Permission>;
