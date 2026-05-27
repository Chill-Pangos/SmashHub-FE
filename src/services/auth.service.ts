import axiosInstance from "@/config/axiosConfig";
import type {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SendEmailVerificationRequest,
  VerifyEmailOtpRequest,
  ResendEmailVerificationRequest,
  AuthResponse,
  RefreshTokenResponse,
  SuccessResponse,
  User,
  UserRoleInput,
  AuthData,
} from "@/types";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  private readonly AUTH_PREFIX = "/auth";

  private normalizeRoles(roles?: UserRoleInput[]): UserRoleInput[] {
    if (!Array.isArray(roles)) {
      return [];
    }

    return roles
      .map((role) => {
        if (typeof role === "number") {
          return role;
        }

        if (!role || typeof role !== "object") {
          return null;
        }

        if (typeof role.id !== "number" || typeof role.name !== "string") {
          return null;
        }

        return { id: role.id, name: role.name };
      })
      .filter((role): role is UserRoleInput => Boolean(role));
  }

  private normalizeUser(user: User): User {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const fallbackDisplayName = `${firstName} ${lastName}`.trim();
    const roles = this.normalizeRoles(user.roles);

    return {
      ...user,
      firstName,
      lastName,
      roles,
      username: user.username || fallbackDisplayName || user.email,
    };
  }

  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const registerPayload: RegisterRequest = {
      ...data,
      role: data.role ?? "spectator",
    };

    const response = await axiosInstance.post<AuthResponse>(
      `${this.AUTH_PREFIX}/register`,
      registerPayload,
    );
    return response.data;
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      `${this.AUTH_PREFIX}/login`,
      data,
    );
    return response.data;
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await axiosInstance.post<RefreshTokenResponse>(
      `${this.AUTH_PREFIX}/refresh`,
      data,
    );
    return response.data;
  }

  /**
   * Change password
   * POST /api/auth/change-password
   * Requires: Authorization header with Bearer token
   */
  async changePassword(data: ChangePasswordRequest): Promise<SuccessResponse> {
    const response = await axiosInstance.post<SuccessResponse>(
      `${this.AUTH_PREFIX}/change-password`,
      data,
    );
    return response.data;
  }

  /**
   * Request OTP for password reset
   * POST /api/auth/forgot-password
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<SuccessResponse> {
    const response = await axiosInstance.post<SuccessResponse>(
      `${this.AUTH_PREFIX}/forgot-password`,
      data,
    );
    return response.data;
  }

  /**
   * Reset password with OTP
   * POST /api/auth/reset-password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<SuccessResponse> {
    const response = await axiosInstance.post<SuccessResponse>(
      `${this.AUTH_PREFIX}/reset-password`,
      data,
    );
    return response.data;
  }

  /**
   * Logout user
   * POST /api/auth/logout
   * Requires: Authorization header with Bearer token
   */
  async logout(): Promise<SuccessResponse> {
    const response = await axiosInstance.post<SuccessResponse>(
      `${this.AUTH_PREFIX}/logout`,
    );
    return response.data;
  }

  /**
   * Send email verification OTP
   * POST /api/auth/send-email-verification-otp
   */
  async sendEmailVerification(
    data: SendEmailVerificationRequest,
  ): Promise<SuccessResponse> {
    const response = await axiosInstance.post<SuccessResponse>(
      `${this.AUTH_PREFIX}/send-email-verification-otp`,
      data,
    );
    return response.data;
  }

  /**
   * Verify email with OTP
   * POST /api/auth/verify-email-otp
   */
  async verifyEmailOtp(data: VerifyEmailOtpRequest): Promise<SuccessResponse> {
    const response = await axiosInstance.post<SuccessResponse>(
      `${this.AUTH_PREFIX}/verify-email-otp`,
      data,
    );
    return response.data;
  }

  /**
   * Resend email verification OTP
   * POST /api/auth/resend-email-verification-otp
   */
  async resendEmailVerification(
    data: ResendEmailVerificationRequest,
  ): Promise<SuccessResponse> {
    const response = await axiosInstance.post<SuccessResponse>(
      `${this.AUTH_PREFIX}/resend-email-verification-otp`,
      data,
    );
    return response.data;
  }

  /**
   * Helper: Save auth data to localStorage
   */
  saveAuthData(authData: AuthData): void;
  saveAuthData(user: User, accessToken: string, refreshToken: string): void;
  saveAuthData(
    userOrAuthData: User | AuthData,
    accessToken?: string,
    refreshToken?: string,
  ): void {
    if ("user" in userOrAuthData) {
      // AuthData format
      const normalizedUser = this.normalizeUser(userOrAuthData.user);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("accessToken", userOrAuthData.accessToken);
      localStorage.setItem("refreshToken", userOrAuthData.refreshToken);
    } else {
      // Individual parameters format
      const normalizedUser = this.normalizeUser(userOrAuthData);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("accessToken", accessToken!);
      localStorage.setItem("refreshToken", refreshToken!);
    }
  }

  /**
   * Helper: Clear auth data from localStorage
   */
  clearAuthData(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  /**
   * Helper: Get stored user data
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const parsedUser = JSON.parse(userStr) as User;
    return this.normalizeUser(parsedUser);
  }

  /**
   * Helper: Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem("accessToken");
    return !!accessToken;
  }

  /**
   * Helper: Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  /**
   * Helper: Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }
}

// Export singleton instance
export default new AuthService();
