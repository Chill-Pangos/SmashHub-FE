/**
 * Validation Utilities
 * Frontend validation for authentication and other forms
 */

// ==================== Email Validation ====================

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate email with error message
 */
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === "") {
    return "Email không được để trống";
  }

  if (!isValidEmail(email)) {
    return "Email không đúng định dạng";
  }

  return null;
};

// ==================== Password Validation ====================

/**
 * Password strength levels (const object)
 */
export const PasswordStrength = {
  WEAK: 'weak',
  MEDIUM: 'medium',
  STRONG: 'strong',
} as const;

/**
 * Password strength type
 */
export type PasswordStrength = typeof PasswordStrength[keyof typeof PasswordStrength];

/**
 * Check password strength
 */
export const checkPasswordStrength = (password: string): PasswordStrength => {
  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Contains lowercase
  if (/[a-z]/.test(password)) strength++;

  // Contains uppercase
  if (/[A-Z]/.test(password)) strength++;

  // Contains number
  if (/\d/.test(password)) strength++;

  // Contains special character
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  if (strength <= 2) return PasswordStrength.WEAK;
  if (strength <= 4) return PasswordStrength.MEDIUM;
  return PasswordStrength.STRONG;
};

/**
 * Validate password with requirements
 */
export const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === "") {
    return "Mật khẩu không được để trống";
  }

  if (password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự";
  }

  if (!/[a-z]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất một chữ cái thường";
  }

  if (!/[A-Z]/.test(password)) {
    return "Mật khẩu phải chứa ít nhất một chữ cái hoa";
  }

  if (!/\d/.test(password)) {
    return "Mật khẩu phải chứa ít nhất một chữ số";
  }

  const strength = checkPasswordStrength(password);
  if (strength === PasswordStrength.WEAK) {
    return "Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn";
  }

  return null;
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword || confirmPassword.trim() === "") {
    return "Vui lòng xác nhận mật khẩu";
  }

  if (password !== confirmPassword) {
    return "Mật khẩu xác nhận không khớp";
  }

  return null;
};

// ==================== Username Validation ====================

/**
 * Validate username
 */
export const validateUsername = (username: string): string | null => {
  if (!username || username.trim() === "") {
    return "Tên đăng nhập không được để trống";
  }

  if (username.length < 3) {
    return "Tên đăng nhập phải có ít nhất 3 ký tự";
  }

  if (username.length > 30) {
    return "Tên đăng nhập không được quá 30 ký tự";
  }

  // Only alphanumeric, underscore, and hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return "Tên đăng nhập chỉ được chứa chữ cái, số, gạch dưới và gạch ngang";
  }

  return null;
};

// ==================== OTP Validation ====================

/**
 * Validate OTP code
 */
export const validateOTP = (otp: string): string | null => {
  if (!otp || otp.trim() === "") {
    return "Mã OTP không được để trống";
  }

  if (!/^\d{6}$/.test(otp)) {
    return "Mã OTP phải là 6 chữ số";
  }

  return null;
};

// ==================== Form Validation ====================

/**
 * Register form validation
 */
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: "spectator" | "athlete" | "coach" | "team_manager";
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateRegisterForm = (
  data: RegisterFormData
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const usernameError = validateUsername(data.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validatePasswordConfirmation(
    data.password,
    data.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
};

/**
 * Login form validation
 */
export interface LoginFormData {
  email: string;
  password: string;
}

export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  if (!data.password || data.password.trim() === "") {
    errors.password = "Mật khẩu không được để trống";
  }

  return errors;
};

/**
 * Change password form validation
 */
export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const validateChangePasswordForm = (
  data: ChangePasswordFormData
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.oldPassword || data.oldPassword.trim() === "") {
    errors.oldPassword = "Mật khẩu hiện tại không được để trống";
  }

  const newPasswordError = validatePassword(data.newPassword);
  if (newPasswordError) errors.newPassword = newPasswordError;

  if (data.oldPassword === data.newPassword) {
    errors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
  }

  const confirmPasswordError = validatePasswordConfirmation(
    data.newPassword,
    data.confirmNewPassword
  );
  if (confirmPasswordError) errors.confirmNewPassword = confirmPasswordError;

  return errors;
};

/**
 * Forgot password form validation
 */
export const validateForgotPasswordForm = (email: string): string | null => {
  return validateEmail(email);
};

/**
 * Reset password form validation
 */
export interface ResetPasswordFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const validateResetPasswordForm = (
  data: ResetPasswordFormData
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const otpError = validateOTP(data.otp);
  if (otpError) errors.otp = otpError;

  const passwordError = validatePassword(data.newPassword);
  if (passwordError) errors.newPassword = passwordError;

  const confirmPasswordError = validatePasswordConfirmation(
    data.newPassword,
    data.confirmNewPassword
  );
  if (confirmPasswordError) errors.confirmNewPassword = confirmPasswordError;

  return errors;
};

/**
 * Check if validation errors exist
 */
export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
