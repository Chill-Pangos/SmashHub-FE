// ==================== Base API Response ====================

export type ApiResponse<T = void> = 
  | { success: true; message: string; data: T }
  | { success: false; error: { code: string; message: string }; data?: never };

export interface ApiError {
  code: string;
  message: string;
}

// ==================== Request Types ====================

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'spectator' | 'player' | 'organizer';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface SendEmailVerificationRequest {
  email: string;
}

export interface VerifyEmailOtpRequest {
  email: string;
  otp: string;
}

export interface ResendEmailVerificationRequest {
  email: string;
}

// ==================== Data Models ====================

export interface User {
  id: number;
  username: string;
  email: string;
  roles: number[];
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ==================== Response Types (using ApiResponse) ====================

export type AuthResponse = ApiResponse<AuthData>;
export type RefreshTokenResponse = ApiResponse<AuthTokens>;
export type ProfileResponse = ApiResponse<User>;
export type SuccessResponse = ApiResponse<void>;
