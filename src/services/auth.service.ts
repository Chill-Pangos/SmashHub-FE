import axiosInstance from '@/config/axiosConfig';
import type {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  AuthResponse,
  RefreshTokenResponse,
  ProfileResponse,
  SuccessResponse,
  User,
  AuthData,
} from '@/types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  private readonly AUTH_PREFIX = '/auth';

  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      `${this.AUTH_PREFIX}/register`,
      data
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
      data
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
      data
    );
    return response.data;
  }

  /**
   * Get user profile
   * GET /api/auth/profile
   * Requires: Authorization header with Bearer token
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await axiosInstance.get<ProfileResponse>(
      `${this.AUTH_PREFIX}/profile`
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
      data
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
      data
    );
    return response.data;
  }

  /**
   * Verify OTP (Optional step)
   * POST /api/auth/verify-otp
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<SuccessResponse> {
    const response = await axiosInstance.post<SuccessResponse>(
      `${this.AUTH_PREFIX}/verify-otp`,
      data
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
      data
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
      `${this.AUTH_PREFIX}/logout`
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
    refreshToken?: string
  ): void {
    if ('user' in userOrAuthData) {
      // AuthData format
      localStorage.setItem('user', JSON.stringify(userOrAuthData.user));
      localStorage.setItem('accessToken', userOrAuthData.accessToken);
      localStorage.setItem('refreshToken', userOrAuthData.refreshToken);
    } else {
      // Individual parameters format
      localStorage.setItem('user', JSON.stringify(userOrAuthData));
      localStorage.setItem('accessToken', accessToken!);
      localStorage.setItem('refreshToken', refreshToken!);
    }
  }

  /**
   * Helper: Clear auth data from localStorage
   */
  clearAuthData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Helper: Get stored user data
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Helper: Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  }

  /**
   * Helper: Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Helper: Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

// Export singleton instance
export default new AuthService();
