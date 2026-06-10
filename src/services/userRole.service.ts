import axiosInstance from "@/config/axiosConfig";
import { parsePaginatedResponse } from "@/utils/pagination.utils";
import type {
  AssignRoleToUserRequest,
  GetRolesByUserResponse,
  GetUserRolesResponse,
  GetUsersByRoleResponse,
  UserRoleAssignment,
} from "@/types/userRole.types";

class UserRoleService {
  private readonly baseURL = "/user-roles";

  private toParams(page: number = 1, limit: number = 10) {
    return { page, limit };
  }

  async assignRoleToUser(data: AssignRoleToUserRequest): Promise<void> {
    await axiosInstance.post(this.baseURL, data);
  }

  async getAllUserRoles(
    page: number = 1,
    limit: number = 10,
  ): Promise<GetUserRolesResponse> {
    const response = await axiosInstance.get<unknown>(this.baseURL, {
      params: this.toParams(page, limit),
    });

    return parsePaginatedResponse<UserRoleAssignment>(response.data, {
      page,
      limit,
    });
  }

  async getRolesByUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetRolesByUserResponse> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/user/${userId}`,
      { params: this.toParams(page, limit) },
    );

    return parsePaginatedResponse<UserRoleAssignment>(response.data, {
      page,
      limit,
    });
  }

  async getUsersByRole(
    roleId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<GetUsersByRoleResponse> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/role/${roleId}`,
      { params: this.toParams(page, limit) },
    );

    return parsePaginatedResponse<UserRoleAssignment>(response.data, {
      page,
      limit,
    });
  }

  async checkUserRole(userId: number, roleId: number): Promise<boolean> {
    const response = await axiosInstance.get<unknown>(`${this.baseURL}/check`, {
      params: { userId, roleId },
    });

    if (typeof response.data === "boolean") {
      return response.data;
    }

    if (
      response.data &&
      typeof response.data === "object" &&
      "hasRole" in response.data
    ) {
      return Boolean((response.data as { hasRole?: unknown }).hasRole);
    }

    return false;
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await axiosInstance.delete(`${this.baseURL}/${userId}/${roleId}`);
  }
}

export default new UserRoleService();
