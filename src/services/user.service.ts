import axiosInstance from "@/config/axiosConfig";
import { parsePaginatedResponse } from "@/utils/pagination.utils";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedUsersResult,
  GetUsersPaginatedApiResponse,
} from "@/types";

/**
 * User Service
 * Handles all user-related API calls
 */
class UserService {
  private readonly baseURL = "/users";

  private normalizeUser(user: User): User {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const fallbackDisplayName = `${firstName} ${lastName}`.trim();

    return {
      ...user,
      firstName,
      lastName,
      isEmailVerified: Boolean(user.isEmailVerified),
      roles: Array.isArray(user.roles) ? user.roles : [],
      username: user.username || fallbackDisplayName || user.email,
    };
  }

  /**
   * Create a new user
   * POST /api/users
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await axiosInstance.post<User>(this.baseURL, data);
    return this.normalizeUser(response.data);
  }

  /**
   * Get users in a pagination-ready shape.
   * Supports both server pagination payloads and plain arrays.
   */
  async getUsersPaginated(
    skip: number = 0,
    limit: number = 10,
  ): Promise<PaginatedUsersResult> {
    const response = await axiosInstance.get<
      GetUsersPaginatedApiResponse | User[]
    >(this.baseURL, {
      params: { skip, limit },
    });

    const parsed = parsePaginatedResponse<User>(response.data, { skip, limit });

    return {
      ...parsed,
      items: parsed.items.map((user) => this.normalizeUser(user)),
    };
  }

  /**
   * Get all users with pagination
   * GET /api/users
   *
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of users
   *
   * @example
   * const users = await userService.getUsers(0, 50);
   */
  async getUsers(skip: number = 0, limit: number = 10): Promise<User[]> {
    const result = await this.getUsersPaginated(skip, limit);
    return result.items;
  }

  /**
   * Get user by ID
   * GET /api/users/{id}
   *
   * @param id User ID
   * @returns Promise with user details
   *
   * @example
   * const user = await userService.getUserById(1);
   */
  async getUserById(id: number): Promise<User> {
    const response = await axiosInstance.get<User>(`${this.baseURL}/${id}`);
    return this.normalizeUser(response.data);
  }

  /**
   * Update user by ID
   * PUT /api/users/:id
   */
  async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await axiosInstance.put<User>(
      `${this.baseURL}/${id}`,
      data,
    );
    return this.normalizeUser(response.data);
  }

  /**
   * Delete user by ID
   * DELETE /api/users/:id
   */
  async deleteUser(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Search users in a pagination-ready shape.
   * Supports both server pagination payloads and plain arrays.
   */
  async searchUsersPaginated(
    query: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<PaginatedUsersResult> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/search`,
      {
        params: { query, skip, limit },
      },
    );

    const parsed = parsePaginatedResponse<User>(response.data, { skip, limit });

    return {
      ...parsed,
      items: parsed.items.map((user) => this.normalizeUser(user)),
    };
  }

  /**
   * Search users by email or name
   * GET /api/users/search
   *
   * @param query Search query (email or name)
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of users
   *
   * @example
   * const users = await userService.searchUsers("john@example.com", 0, 20);
   */
  async searchUsers(
    query: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<User[]> {
    const result = await this.searchUsersPaginated(query, skip, limit);
    return result.items;
  }
}

export default new UserService();
