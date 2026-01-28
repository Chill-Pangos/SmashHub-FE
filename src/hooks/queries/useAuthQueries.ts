import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  SendEmailVerificationRequest,
  VerifyEmailOtpRequest,
  ResendEmailVerificationRequest,
} from "@/types";

// ==================== Query Hooks ====================

/**
 * Hook để lấy profile user hiện tại
 */
export const useProfile = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: () => authService.getProfile(),
    enabled: options?.enabled ?? true,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook để đăng ký tài khoản mới
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Save auth data
        authService.saveAuthData(response.data);
        // Invalidate auth queries
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.all,
        });
      }
    },
  });
};

/**
 * Hook để đăng nhập
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Save auth data
        authService.saveAuthData(response.data);
        // Invalidate auth queries
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.all,
        });
      }
    },
  });
};

/**
 * Hook để đăng xuất
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear auth data
      authService.clearAuthData();
      // Clear all cache
      queryClient.clear();
    },
    onError: () => {
      // Even on error, clear local auth data
      authService.clearAuthData();
      queryClient.clear();
    },
  });
};

/**
 * Hook để đổi mật khẩu
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data),
  });
};

/**
 * Hook để yêu cầu reset password (gửi OTP)
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
  });
};

/**
 * Hook để verify OTP
 */
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),
  });
};

/**
 * Hook để reset password với OTP
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });
};

/**
 * Hook để gửi email verification
 */
export const useSendEmailVerification = () => {
  return useMutation({
    mutationFn: (data: SendEmailVerificationRequest) =>
      authService.sendEmailVerification(data),
  });
};

/**
 * Hook để verify email với OTP
 */
export const useVerifyEmailOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyEmailOtpRequest) =>
      authService.verifyEmailOtp(data),
    onSuccess: () => {
      // Refetch profile to get updated isEmailVerified status
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.profile(),
      });
    },
  });
};

/**
 * Hook để resend email verification
 */
export const useResendEmailVerification = () => {
  return useMutation({
    mutationFn: (data: ResendEmailVerificationRequest) =>
      authService.resendEmailVerification(data),
  });
};
