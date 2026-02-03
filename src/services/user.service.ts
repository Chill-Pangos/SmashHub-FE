import axiosInstance from "@/config/axiosConfig";
import type { User } from "@/types";

/**
 * User Service
 * Handles all user-related API calls
 */
class UserService {
  private readonly baseURL = "/users";

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
    const response = await axiosInstance.get<User[]>(this.baseURL, {
      params: { skip, limit },
    });
    return response.data;
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
    return response.data;
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
    const response = await axiosInstance.get<User[]>(`${this.baseURL}/search`, {
      params: { query, skip, limit },
    });
    return response.data;
  }
}

export default new UserService();
