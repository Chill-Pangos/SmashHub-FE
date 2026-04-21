import type { User } from "./auth.types";
import type { PaginatedResult, PaginationParams } from "./pagination.types";

/**
 * User Types
 * Type definitions for user management operations
 */

/**
 * Request body for creating a user
 * POST /api/users
 */
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: string | null;
  avatarUrl?: string | null;
  dob?: string | null;
  phoneNumber?: string | null;
  isEmailVerified?: boolean;
  roles?: number[];
}

/**
 * Request body for updating a user
 * PUT /api/users/:id
 */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  gender?: string | null;
  avatarUrl?: string | null;
  dob?: string | null;
  phoneNumber?: string | null;
}

/**
 * Request body for self profile update
 * PUT /api/users/:id/profile
 */
export interface UpdateUserProfileRequest {
  avatarUrl?: string | null;
  dob?: string | null;
  phoneNumber?: string | null;
  gender?: string | null;
}

/**
 * Extended user data used by admin pages
 */
export type AdminUser = User & {
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
};

// ==================== Pagination Types ====================

export interface UserListParams extends PaginationParams {
  query?: string;
}

export type PaginatedUsersResult = PaginatedResult<User>;

export interface UsersPaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetUsersPaginatedApiResponse {
  users: User[];
  pagination: UsersPaginationInfo;
}
