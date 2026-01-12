import { toast } from "sonner";

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
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

/**
 * Show API error with proper formatting
 */
export const showApiError = (
  error: unknown,
  fallbackMessage = "Đã có lỗi xảy ra"
) => {
  let errorMessage = fallbackMessage;
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
          response.data.error.message
        );
      }
      // Fallback to old format
      else if (response.data?.message) {
        errorMessage = response.data.message;
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
  // Authentication errors - Lỗi xác thực
  INVALID_TOKEN: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  TOKEN_REVOKED: "Phiên đăng nhập đã bị vô hiệu hóa. Vui lòng đăng nhập lại.",
  NO_TOKEN_PROVIDED: "Thiếu token xác thực. Vui lòng đăng nhập.",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác.",
  UNAUTHORIZED: "Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.",

  // Registration errors - Lỗi đăng ký
  EMAIL_ALREADY_EXISTS: "Email này đã được đăng ký.",
  USERNAME_ALREADY_EXISTS: "Tên người dùng đã tồn tại.",
  ROLE_NOT_FOUND: "Vai trò không hợp lệ.",

  // Password errors - Lỗi mật khẩu
  INVALID_OLD_PASSWORD: "Mật khẩu hiện tại không chính xác.",
  SAME_PASSWORD: "Mật khẩu mới không được trùng với mật khẩu cũ.",

  // OTP errors - Lỗi OTP
  INVALID_OTP: "Mã xác thực không chính xác.",
  EXPIRED_OTP: "Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.",

  // Email verification - Xác thực email
  EMAIL_NOT_VERIFIED: "Vui lòng xác thực email để tiếp tục.",
  EMAIL_SEND_ERROR: "Không thể gửi email. Vui lòng thử lại sau.",

  // User errors - Lỗi người dùng
  USER_NOT_FOUND: "Không tìm thấy tài khoản người dùng.",

  // Generic errors - Lỗi chung
  BAD_REQUEST: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
  FORBIDDEN: "Bạn không có quyền thực hiện hành động này.",
  INTERNAL_ERROR: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",

  // Network errors - Lỗi mạng
  "Network Error": "Vui lòng kiểm tra kết nối internet của bạn.",
  timeout: "Yêu cầu hết thời gian chờ. Vui lòng thử lại.",

  // Legacy error messages (for backward compatibility)
  "Token expired": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  "Invalid credentials": "Email hoặc mật khẩu không chính xác.",
  "Email already exists": "Email này đã được đăng ký.",
  "Invalid refresh token":
    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  "Refresh token expired":
    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  "Token blacklisted":
    "Phiên đăng nhập đã bị vô hiệu hóa. Vui lòng đăng nhập lại.",
  "Invalid old password": "Mật khẩu hiện tại không chính xác.",
  "Password too weak": "Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.",
  "Invalid OTP": "Mã xác thực không chính xác.",
  "OTP has expired": "Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.",
  "OTP already used": "Mã xác thực đã được sử dụng. Vui lòng yêu cầu mã mới.",
  "User not found": "Không tìm thấy tài khoản người dùng.",
  Unauthorized: "Bạn không có quyền thực hiện hành động này.",
  Forbidden: "Truy cập bị từ chối.",
  "Not Found": "Không tìm thấy tài nguyên.",
};

/**
 * Get user-friendly error message
 * Supports both new error format (code, message) and legacy format
 */
export const getUserFriendlyMessage = (
  errorCodeOrMessage: string,
  fallbackMessage?: string
): string => {
  // Try to match by error code first
  if (ERROR_MESSAGES[errorCodeOrMessage]) {
    return ERROR_MESSAGES[errorCodeOrMessage];
  }

  // If no match and fallback provided, try fallback
  if (fallbackMessage && ERROR_MESSAGES[fallbackMessage]) {
    return ERROR_MESSAGES[fallbackMessage];
  }

  // Return the message as-is if no mapping found
  return fallbackMessage || errorCodeOrMessage;
};
