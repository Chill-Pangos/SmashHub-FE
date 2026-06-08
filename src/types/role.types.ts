/**
 * Role Types
 * Type definitions for role-related operations
 */


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
 * Request body for updating a role
 * PATCH /api/roles/:id
 */
export interface UpdateRoleRequest {
  name?: string; // Optional - New unique name
  description?: string; // Optional - New description
}

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

export interface GetRolesResponse {
  roles: Role[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
