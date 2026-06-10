import axiosInstance from "@/config/axiosConfig";
import { parsePaginatedResponse } from "@/utils/pagination.utils";
import type {
  AssignPermissionToRoleRequest,
  GetPermissionsByRoleResponse,
  GetRolePermissionsResponse,
  GetRolesByPermissionResponse,
  RolePermissionAssignment,
} from "@/types/rolePermission.types";

class RolePermissionService {
  private readonly baseURL = "/role-permissions";

  private toParams(page: number = 1, limit: number = 10) {
    return { page, limit };
  }

  async assignPermissionToRole(
    data: AssignPermissionToRoleRequest,
  ): Promise<void> {
    await axiosInstance.post(this.baseURL, data);
  }

  async getAllRolePermissions(
    page: number = 1,
    limit: number = 10,
  ): Promise<GetRolePermissionsResponse> {
    const response = await axiosInstance.get<unknown>(this.baseURL, {
      params: this.toParams(page, limit),
    });

    return parsePaginatedResponse<RolePermissionAssignment>(response.data, {
      page,
      limit,
    });
  }

  async getPermissionsByRole(
    roleId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetPermissionsByRoleResponse> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/role/${roleId}`,
      { params: this.toParams(page, limit) },
    );

    return parsePaginatedResponse<RolePermissionAssignment>(response.data, {
      page,
      limit,
    });
  }

  async getRolesByPermission(
    permissionId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetRolesByPermissionResponse> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/permission/${permissionId}`,
      { params: this.toParams(page, limit) },
    );

    return parsePaginatedResponse<RolePermissionAssignment>(response.data, {
      page,
      limit,
    });
  }

  async checkRolePermission(
    roleId: number,
    permissionId: number,
  ): Promise<boolean> {
    const response = await axiosInstance.get<unknown>(`${this.baseURL}/check`, {
      params: { roleId, permissionId },
    });

    if (typeof response.data === "boolean") {
      return response.data;
    }

    if (
      response.data &&
      typeof response.data === "object" &&
      "hasPermission" in response.data
    ) {
      return Boolean(
        (response.data as { hasPermission?: unknown }).hasPermission,
      );
    }

    return false;
  }

  async removePermissionFromRole(
    roleId: number,
    permissionId: number,
  ): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${roleId}/${permissionId}`);
  }
}

export default new RolePermissionService();
