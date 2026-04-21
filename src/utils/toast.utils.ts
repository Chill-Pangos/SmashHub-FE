import { toast } from "sonner";
import i18n from "@/locales/i18n";

const tToast = (key: string): string => i18n.t(key) as string;

/**
 * Toast Utilities
 * Centralized toast notifications using Sonner
 */

export const showToast = {
  /**
   * Show success message
   */
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * Show error message
   */
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show info message
   */
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * Show warning message
   */
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * Show loading message
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a toast
   */
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },

  /**
   * Promise-based toast
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
  ) => {
    return toast.promise(promise, messages);
  },
};

/**
 * Show API error with proper formatting
 */
export const showApiError = (error: unknown, fallbackMessage?: string) => {
  let errorMessage = fallbackMessage || tToast("toast.errors.INTERNAL_ERROR");
  let description: string | undefined;

  if (error && typeof error === "object") {
    // Handle axios error response with new error format
    if (
      "response" in error &&
      error.response &&
      typeof error.response === "object"
    ) {
      const response = error.response as {
        data?: {
          error?: { code?: string; message?: string };
          message?: string;
          success?: boolean;
        };
      };

      // New error format: { success: false, error: { code, message } }
      if (response.data?.error?.message) {
        errorMessage = getUserFriendlyMessage(
          response.data.error.code || "",
          response.data.error.message,
        );
      }
      // Fallback to old format
      else if (response.data?.message) {
        errorMessage = getUserFriendlyMessage(
          response.data.message,
          response.data.message,
        );
      }
    }
    // Handle Error object
    else if ("message" in error && typeof error.message === "string") {
      errorMessage = error.message;
    }
    // Handle ApiResponse error format
    else if (
      "success" in error &&
      error.success === false &&
      "message" in error
    ) {
      errorMessage = (error as { message: string }).message;
    }
  }

  showToast.error(errorMessage, description);
};

/**
 * User-friendly error messages mapping (Vietnamese)
 * Based on error codes from AUTH_FLOW.md
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  INVALID_TOKEN: "toast.errors.INVALID_TOKEN",
  TOKEN_REVOKED: "toast.errors.TOKEN_REVOKED",
  NO_TOKEN_PROVIDED: "toast.errors.NO_TOKEN_PROVIDED",
  INVALID_CREDENTIALS: "toast.errors.INVALID_CREDENTIALS",
  UNAUTHORIZED: "toast.errors.UNAUTHORIZED",

  // Registration errors
  EMAIL_ALREADY_EXISTS: "toast.errors.EMAIL_ALREADY_EXISTS",
  USERNAME_ALREADY_EXISTS: "toast.errors.USERNAME_ALREADY_EXISTS",
  ROLE_NOT_FOUND: "toast.errors.ROLE_NOT_FOUND",

  // Password errors
  INVALID_OLD_PASSWORD: "toast.errors.INVALID_OLD_PASSWORD",
  SAME_PASSWORD: "toast.errors.SAME_PASSWORD",

  // OTP errors
  INVALID_OTP: "toast.errors.INVALID_OTP",
  EXPIRED_OTP: "toast.errors.EXPIRED_OTP",

  // Email verification
  EMAIL_NOT_VERIFIED: "toast.errors.EMAIL_NOT_VERIFIED",
  EMAIL_SEND_ERROR: "toast.errors.EMAIL_SEND_ERROR",

  // User errors
  USER_NOT_FOUND: "toast.errors.USER_NOT_FOUND",

  // Generic errors
  BAD_REQUEST: "toast.errors.BAD_REQUEST",
  FORBIDDEN: "toast.errors.FORBIDDEN",
  INTERNAL_ERROR: "toast.errors.INTERNAL_ERROR",

  // Network errors
  "Network Error": "toast.errors.NETWORK_ERROR",
  timeout: "toast.errors.TIMEOUT",

  // Legacy error messages (for backward compatibility)
  "Token expired": "toast.errors.INVALID_TOKEN",
  "Invalid credentials": "toast.errors.INVALID_CREDENTIALS",
  "Email already exists": "toast.errors.EMAIL_ALREADY_EXISTS",
  "Invalid refresh token": "toast.errors.INVALID_TOKEN",
  "Refresh token expired": "toast.errors.INVALID_TOKEN",
  "Token blacklisted": "toast.errors.TOKEN_REVOKED",
  "Invalid old password": "toast.errors.INVALID_OLD_PASSWORD",
  "Password too weak": "toast.errors.PASSWORD_TOO_WEAK",
  "Invalid OTP": "toast.errors.INVALID_OTP",
  "OTP has expired": "toast.errors.EXPIRED_OTP",
  "OTP already used": "toast.errors.OTP_ALREADY_USED",
  "User not found": "toast.errors.USER_NOT_FOUND",
  Unauthorized: "toast.errors.FORBIDDEN",
  Forbidden: "toast.errors.ACCESS_DENIED",
  "Not Found": "toast.errors.NOT_FOUND",
};

/**
 * Get user-friendly error message
 * Supports both new error format (code, message) and legacy format
 */
export const getUserFriendlyMessage = (
  errorCodeOrMessage: string,
  fallbackMessage?: string,
): string => {
  // Try to match by error code first
  if (ERROR_MESSAGES[errorCodeOrMessage]) {
    return tToast(ERROR_MESSAGES[errorCodeOrMessage]);
  }

  // If no match and fallback provided, try fallback
  if (fallbackMessage && ERROR_MESSAGES[fallbackMessage]) {
    return tToast(ERROR_MESSAGES[fallbackMessage]);
  }

  // Return the message as-is if no mapping found
  return (
    fallbackMessage ||
    errorCodeOrMessage ||
    tToast("toast.errors.INTERNAL_ERROR")
  );
};
