import axiosInstance from "@/config/axiosConfig";
import { parsePaginatedResponse } from "@/utils/pagination.utils";
import type {
  Permission,
  CreatePermissionRequest,
  CreatePermissionResponse,
  UpdatePermissionRequest,
  UpdatePermissionResponse,
  PaginatedPermissionsResult,
} from "@/types/permission.types";

/**
 * Permission Service
 * Handles all permission-related API calls
 */
class PermissionService {
  private readonly baseURL = "/permissions";

  /**
   * Create a new permission
   * POST /api/permissions
   */
  async createPermission(
    data: CreatePermissionRequest,
  ): Promise<CreatePermissionResponse> {
    const response = await axiosInstance.post<Permission>(this.baseURL, data);

    return {
      success: true,
      message: "Permission created successfully",
      data: response.data,
    };
  }

  /**
   * Get permissions in a pagination-ready shape.
   * Supports both server pagination payloads and plain arrays.
   */
  async getAllPermissionsPaginated(
    skip: number = 0,
    limit: number = 10,
  ): Promise<PaginatedPermissionsResult> {
    const response = await axiosInstance.get<unknown>(this.baseURL, {
      params: { skip, limit },
    });

    return parsePaginatedResponse<Permission>(response.data, { skip, limit });
  }

  /**
   * Get all permissions with pagination
   * GET /api/permissions
   */
  async getAllPermissions(
    skip: number = 0,
    limit: number = 10,
  ): Promise<Permission[]> {
    const result = await this.getAllPermissionsPaginated(skip, limit);
    return result.items;
  }

  /**
   * Get permission by ID
   * GET /api/permissions/:id
   */
  async getPermissionById(id: number): Promise<Permission> {
    const response = await axiosInstance.get<Permission>(
      `${this.baseURL}/${id}`,
    );
    return response.data;
  }

  /**
   * Update permission
   * PUT /api/permissions/:id
   */
  async updatePermission(
    id: number,
    data: UpdatePermissionRequest,
  ): Promise<UpdatePermissionResponse> {
    const response = await axiosInstance.put<Permission>(
      `${this.baseURL}/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete permission
   * DELETE /api/permissions/:id
   */
  async deletePermission(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${id}`);
  }
}

export default new PermissionService();
