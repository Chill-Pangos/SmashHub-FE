import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, userService } from "@/services";
import { useAuth, useRole } from "@/store";
import type {
  RegisterRequest,
  LoginRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SendEmailVerificationRequest,
  ResendEmailVerificationRequest,
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

      if (data && typeof data === "object" && "message" in data) {
        return String(data.message);
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
  const { getDefaultRouteForRoles, getRoleNames } = useRole();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvePostAuthRoute = (roleNames: string[]) => {
    if (roleNames.length > 1) {
      return "/";
    }

    const resolvedRoute = getDefaultRouteForRoles(roleNames);

    if (!resolvedRoute || resolvedRoute === "/") {
      return "/";
    }

    return resolvedRoute;
  };

  const resolveRoleNamesFromAuth = (user: User) => {
    return getRoleNames(user.roles ?? []);
  };

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
        // Save tokens so we can call /users/me
        setAuthData(response.data);

        let currentUser = response.data.user;
        try {
          currentUser = await userService.getCurrentUser();
          updateUser(currentUser);
        } catch (err) {
          console.warn("Failed to refresh current user after register:", err);
        }

        const redirectPath = resolvePostAuthRoute(
          resolveRoleNamesFromAuth(currentUser),
        );
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
        // Save tokens so we can call /users/me
        setAuthData(response.data);

        let currentUser = response.data.user;
        try {
          currentUser = await userService.getCurrentUser();
          updateUser(currentUser);
        } catch (err) {
          console.warn("Failed to refresh current user after login:", err);
        }

        const redirectPath = resolvePostAuthRoute(
          resolveRoleNamesFromAuth(currentUser),
        );
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
      navigate("/signin", { replace: true });
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
        "Failed to send verification email",
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
    currentUser: User,
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
    data: ResendEmailVerificationRequest,
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
        "Failed to resend verification email",
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
