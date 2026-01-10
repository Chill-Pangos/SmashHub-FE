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
    // Handle axios error response
    if (
      "response" in error &&
      error.response &&
      typeof error.response === "object"
    ) {
      const response = error.response as {
        data?: { message?: string; success?: boolean };
      };
      if (response.data?.message) {
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
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors - Lỗi xác thực
  "Token expired": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  "Invalid credentials": "Email hoặc mật khẩu không chính xác.",
  "Email already exists": "Email này đã được đăng ký.",
  "Invalid refresh token": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  "Refresh token expired": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  "Token blacklisted": "Phiên đăng nhập đã bị vô hiệu hóa. Vui lòng đăng nhập lại.",

  // Password errors - Lỗi mật khẩu
  "Invalid old password": "Mật khẩu hiện tại không chính xác.",
  "Password too weak": "Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.",

  // OTP errors - Lỗi OTP
  "Invalid OTP": "Mã xác thực không chính xác.",
  "OTP has expired": "Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.",
  "OTP already used": "Mã xác thực đã được sử dụng. Vui lòng yêu cầu mã mới.",

  // Network errors - Lỗi mạng
  "Network Error": "Vui lòng kiểm tra kết nối internet của bạn.",
  timeout: "Yêu cầu hết thời gian chờ. Vui lòng thử lại.",

  // Generic errors - Lỗi chung
  "User not found": "Không tìm thấy tài khoản người dùng.",
  Unauthorized: "Bạn không có quyền thực hiện hành động này.",
  Forbidden: "Truy cập bị từ chối.",
  "Not Found": "Không tìm thấy tài nguyên.",
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (technicalError: string): string => {
  return ERROR_MESSAGES[technicalError] || technicalError;
};
