import axiosInstance from "@/config/axiosConfig";
import type {
  Role,
  CreateRoleRequest,
  CreateRoleResponse,
  UpdateRoleRequest,
  UpdateRoleResponse,
} from "@/types/role.types";

/**
 * Role Service
 * Handles all role-related API calls
 */
class RoleService {
  private readonly baseURL = "/roles";

  /**
   * Create a new role
   * POST /api/roles
   *
   * @param data Role creation data
   * @returns Promise with created role data
   *
   * @example
   * const role = await roleService.createRole({
   *   name: "Tournament Manager",
   *   description: "Can create, update and manage tournaments"
   * });
   */
  async createRole(data: CreateRoleRequest): Promise<CreateRoleResponse> {
    const response = await axiosInstance.post<Role>(this.baseURL, data);

    // Transform axios response to ApiResponse format
    return {
      success: true,
      message: "Role created successfully",
      data: response.data,
    };
  }

  /**
   * Get all roles with pagination
   * GET /api/roles
   *
   * @param skip Number of records to skip (default: 0)
   * @param limit Maximum number of records to return (default: 10)
   * @returns Promise with array of roles
   *
   * @example
   * const roles = await roleService.getAllRoles(0, 20);
   */
  async getAllRoles(skip: number = 0, limit: number = 10): Promise<Role[]> {
    const response = await axiosInstance.get<Role[]>(this.baseURL, {
      params: { skip, limit },
    });
    return response.data;
  }

  /**
   * Get role by ID
   * GET /api/roles/:id
   *
   * @param id Role ID
   * @returns Promise with role details
   *
   * @example
   * const role = await roleService.getRoleById(1);
   */
  async getRoleById(id: number): Promise<Role> {
    const response = await axiosInstance.get<Role>(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Get role by name
   * GET /api/roles/name/:name
   *
   * @param name Role name (exact match)
   * @returns Promise with role details
   *
   * @example
   * const role = await roleService.getRoleByName("Admin");
   */
  async getRoleByName(name: string): Promise<Role> {
    // URL encode the name to handle spaces and special characters
    const encodedName = encodeURIComponent(name);
    const response = await axiosInstance.get<Role>(
      `${this.baseURL}/name/${encodedName}`
    );
    return response.data;
  }

  /**
   * Update role
   * PUT /api/roles/:id
   *
   * @param id Role ID
   * @param data Partial role data to update
   * @returns Promise with update response
   *
   * @example
   * const result = await roleService.updateRole(1, {
   *   description: "Updated description"
   * });
   */
  async updateRole(
    id: number,
    data: UpdateRoleRequest
  ): Promise<UpdateRoleResponse> {
    const response = await axiosInstance.put<UpdateRoleResponse>(
      `${this.baseURL}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete role
   * DELETE /api/roles/:id
   *
   * @param id Role ID
   * @returns Promise<void>
   *
   * @example
   * await roleService.deleteRole(1);
   */
  async deleteRole(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Check if role name exists
   * Helper method to check if a role name is already taken
   *
   * @param name Role name to check
   * @returns Promise<boolean> - true if exists, false otherwise
   *
   * @example
   * const exists = await roleService.roleNameExists("Admin");
   */
  async roleNameExists(name: string): Promise<boolean> {
    try {
      await this.getRoleByName(name);
      return true;
    } catch {
      // If 404, role doesn't exist
      return false;
    }
  }
}

// Export singleton instance
export default new RoleService();
