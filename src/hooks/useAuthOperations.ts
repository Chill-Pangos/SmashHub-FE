import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services";
import { useAuth, useRole } from "@/store";
import type {
  RegisterRequest,
  LoginRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  SendEmailVerificationRequest,
  VerifyEmailOtpRequest,
  User,
} from "@/types";

// Helper to extract error message from API response
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object" && "response" in error) {
    const response = error.response;
    if (response && typeof response === "object" && "data" in response) {
      const data = response.data;
      if (data && typeof data === "object" && "error" in data) {
        const apiError = data.error;
        if (apiError && typeof apiError === "object" && "message" in apiError) {
          return String(apiError.message);
        }
      }
    }
  }
  return fallback;
};

/**
 * Custom hook for authentication operations
 * Provides common auth functions with loading and error states
 */
export const useAuthOperations = () => {
  const navigate = useNavigate();
  const { login: setAuthData, logout: clearAuthData, updateUser } = useAuth();
  const { getDefaultRouteForRoles } = useRole();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Register a new user
   */
  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);

      // Clear any existing auth data before register
      authService.clearAuthData();
      clearAuthData();

      const response = await authService.register(data);

      if (response.success) {
        // Save new auth data
        setAuthData(response.data);
        // Redirect based on user role
        const redirectPath = getDefaultRouteForRoles(response.data.user.roles);
        navigate(redirectPath, { replace: true });
        return { success: true, data: response.data };
      }
      return { success: false, error: "Registration failed" };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Registration failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      // Clear any existing auth data before login
      authService.clearAuthData();
      clearAuthData();

      const response = await authService.login(data);

      if (response.success) {
        // Save new auth data
        setAuthData(response.data);
        // Debug log
        console.log("Login success - User roles:", response.data.user.roles);
        // Redirect based on user role
        const redirectPath = getDefaultRouteForRoles(response.data.user.roles);
        console.log("Redirecting to:", redirectPath);
        navigate(redirectPath, { replace: true });
        return { success: true, data: response.data };
      }
      return { success: false, error: "Login failed" };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Login failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      // Call backend logout API
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
      // Continue with logout even if API call fails
    } finally {
      // Clear localStorage first
      authService.clearAuthData();
      // Then clear auth context state
      clearAuthData();
      setLoading(false);
      // Redirect to signin
      navigate("/signin");
    }
  };

  /**
   * Change password
   */
  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.changePassword(data);

      if (response.success) {
        return { success: true };
      }
      return { success: false, error: "Password change failed" };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Password change failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request password reset OTP
   */
  const forgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.forgotPassword(data);

      if (response.success) {
        return { success: true };
      }
      return { success: false, error: "Failed to send OTP" };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Failed to send OTP");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP for password reset
   */
  const verifyOtp = async (data: VerifyOtpRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.verifyOtp(data);

      if (response.success) {
        return { success: true };
      }
      return { success: false, error: "OTP verification failed" };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "OTP verification failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password with OTP
   */
  const resetPassword = async (data: ResetPasswordRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.resetPassword(data);

      if (response.success) {
        return { success: true };
      }
      return { success: false, error: "Password reset failed" };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Password reset failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send email verification OTP
   */
  const sendEmailVerification = async (data: SendEmailVerificationRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.sendEmailVerification(data);

      if (response.success) {
        return { success: true };
      }
      return { success: false, error: "Failed to send verification email" };
    } catch (err) {
      const errorMessage = getErrorMessage(
        err,
        "Failed to send verification email"
      );
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify email with OTP
   */
  const verifyEmailOtp = async (
    data: VerifyEmailOtpRequest,
    currentUser: User
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.verifyEmailOtp(data);

      if (response.success) {
        // Update user's email verification status
        updateUser({ ...currentUser, isEmailVerified: true });
        return { success: true };
      }
      return { success: false, error: "Email verification failed" };
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Email verification failed");
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend email verification OTP
   */
  const resendEmailVerification = async (
    data: SendEmailVerificationRequest
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.resendEmailVerification(data);

      if (response.success) {
        return { success: true };
      }
      return { success: false, error: "Failed to resend verification email" };
    } catch (err) {
      const errorMessage = getErrorMessage(
        err,
        "Failed to resend verification email"
      );
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => setError(null);

  return {
    // Operations
    register,
    login,
    logout,
    changePassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
    sendEmailVerification,
    verifyEmailOtp,
    resendEmailVerification,

    // State
    loading,
    error,
    clearError,
  };
};
