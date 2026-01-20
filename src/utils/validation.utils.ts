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
  WEAK: "weak",
  MEDIUM: "medium",
  STRONG: "strong",
} as const;

/**
 * Password strength type
 */
export type PasswordStrength =
  (typeof PasswordStrength)[keyof typeof PasswordStrength];

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
  confirmPassword: string,
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
  data: RegisterFormData,
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
    data.confirmPassword,
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
  data: ChangePasswordFormData,
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
    data.confirmNewPassword,
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
  data: ResetPasswordFormData,
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
    data.confirmNewPassword,
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

// ==================== Tournament Validation ====================

/**
 * Validate tournament name
 */
export const validateTournamentName = (name: string): string | null => {
  if (!name || name.trim() === "") {
    return "Tên giải đấu không được để trống";
  }

  if (name.length < 3) {
    return "Tên giải đấu phải có ít nhất 3 ký tự";
  }

  if (name.length > 200) {
    return "Tên giải đấu không được quá 200 ký tự";
  }

  return null;
};

/**
 * Validate tournament location
 */
export const validateTournamentLocation = (location: string): string | null => {
  if (!location || location.trim() === "") {
    return "Địa điểm tổ chức không được để trống";
  }

  if (location.length < 3) {
    return "Địa điểm phải có ít nhất 3 ký tự";
  }

  if (location.length > 300) {
    return "Địa điểm không được quá 300 ký tự";
  }

  return null;
};

/**
 * Validate number of tables
 */
export const validateNumberOfTables = (
  numberOfTables?: number | null,
): string | null => {
  if (numberOfTables === null || numberOfTables === undefined) {
    return null; // Optional field
  }

  if (numberOfTables < 1) {
    return "Số bàn thi đấu phải ít nhất là 1";
  }

  if (numberOfTables > 100) {
    return "Số bàn thi đấu không được quá 100";
  }

  if (!Number.isInteger(numberOfTables)) {
    return "Số bàn thi đấu phải là số nguyên";
  }

  return null;
};

/**
 * Validate tournament dates
 */
export const validateTournamentDates = (
  startDate: string,
  endDate: string,
): { startDate?: string; endDate?: string } => {
  const errors: { startDate?: string; endDate?: string } = {};

  if (!startDate || startDate.trim() === "") {
    errors.startDate = "Ngày bắt đầu không được để trống";
  }

  if (!endDate || endDate.trim() === "") {
    errors.endDate = "Ngày kết thúc không được để trống";
  }

  // If either date is missing, return early
  if (errors.startDate || errors.endDate) {
    return errors;
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    errors.startDate = "Ngày bắt đầu không hợp lệ";
    return errors;
  }

  const end = new Date(endDate);
  if (isNaN(end.getTime())) {
    errors.endDate = "Ngày kết thúc không hợp lệ";
    return errors;
  }

  // Check if startDate is in the past (allow today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (start < today) {
    errors.startDate = "Ngày bắt đầu không được là quá khứ";
  }

  if (end <= start) {
    errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
  }

  return errors;
};

/**
 * Validate tournament content name
 */
export const validateContentName = (name: string): string | null => {
  if (!name || name.trim() === "") {
    return "Tên nội dung thi đấu không được để trống";
  }

  if (name.length < 3) {
    return "Tên nội dung phải có ít nhất 3 ký tự";
  }

  if (name.length > 100) {
    return "Tên nội dung không được quá 100 ký tự";
  }

  return null;
};

/**
 * Validate maxEntries
 */
export const validateMaxEntries = (maxEntries: number): string | null => {
  if (!maxEntries || maxEntries <= 0) {
    return "Số lượng tối đa phải lớn hơn 0";
  }

  if (maxEntries > 256) {
    return "Số lượng tối đa không được quá 256";
  }

  // Should be power of 2 for knockout tournament (2, 4, 8, 16, 32, 64, 128, 256)
  if ((maxEntries & (maxEntries - 1)) !== 0) {
    return "Số lượng tối đa nên là lũy thừa của 2 (2, 4, 8, 16, 32, 64, 128, 256)";
  }

  return null;
};

/**
 * Validate maxSets
 */
export const validateMaxSets = (maxSets: number): string | null => {
  if (!maxSets || maxSets <= 0) {
    return "Số set tối đa phải lớn hơn 0";
  }

  if (maxSets > 7) {
    return "Số set tối đa không được quá 7";
  }

  // Should be odd number (1, 3, 5, 7)
  if (maxSets % 2 === 0) {
    return "Số set tối đa nên là số lẻ (1, 3, 5, 7)";
  }

  return null;
};

/**
 * Validate team format (numberOfSingles + numberOfDoubles)
 */
export const validateTeamFormat = (
  numberOfSingles?: number | null,
  numberOfDoubles?: number | null,
): { numberOfSingles?: string; numberOfDoubles?: string; total?: string } => {
  const errors: {
    numberOfSingles?: string;
    numberOfDoubles?: string;
    total?: string;
  } = {};

  // Must have both fields for team type
  if (
    numberOfSingles === null ||
    numberOfSingles === undefined ||
    numberOfDoubles === null ||
    numberOfDoubles === undefined
  ) {
    errors.numberOfSingles = "Số trận đơn là bắt buộc cho thể thức đồng đội";
    errors.numberOfDoubles = "Số trận đôi là bắt buộc cho thể thức đồng đội";
    return errors;
  }

  if (numberOfSingles < 0) {
    errors.numberOfSingles = "Số trận đơn không được âm";
  }

  if (numberOfDoubles < 0) {
    errors.numberOfDoubles = "Số trận đôi không được âm";
  }

  const total = numberOfSingles + numberOfDoubles;

  // Total must be >= 3
  if (total < 3) {
    errors.total = "Tổng số trận (đơn + đôi) phải >= 3";
  }

  // Total must be odd number
  if (total % 2 === 0) {
    errors.total = "Tổng số trận phải là số lẻ (3, 5, 7, 9...)";
  }

  return errors;
};

/**
 * Validate age restrictions
 */
export const validateAgeRestrictions = (
  minAge?: number | null,
  maxAge?: number | null,
): { minAge?: string; maxAge?: string } => {
  const errors: { minAge?: string; maxAge?: string } = {};

  if (minAge !== null && minAge !== undefined) {
    if (minAge < 5) {
      errors.minAge = "Tuổi tối thiểu phải >= 5";
    }
    if (minAge > 100) {
      errors.minAge = "Tuổi tối thiểu không hợp lệ";
    }
  }

  if (maxAge !== null && maxAge !== undefined) {
    if (maxAge < 5) {
      errors.maxAge = "Tuổi tối đa phải >= 5";
    }
    if (maxAge > 100) {
      errors.maxAge = "Tuổi tối đa không hợp lệ";
    }
  }

  if (
    minAge !== null &&
    minAge !== undefined &&
    maxAge !== null &&
    maxAge !== undefined
  ) {
    if (maxAge <= minAge) {
      errors.maxAge = "Tuổi tối đa phải lớn hơn tuổi tối thiểu";
    }
  }

  return errors;
};

/**
 * Validate ELO restrictions
 */
export const validateEloRestrictions = (
  minElo?: number | null,
  maxElo?: number | null,
): { minElo?: string; maxElo?: string } => {
  const errors: { minElo?: string; maxElo?: string } = {};

  if (minElo !== null && minElo !== undefined) {
    if (minElo < 0) {
      errors.minElo = "ELO tối thiểu không được âm";
    }
    if (minElo > 3000) {
      errors.minElo = "ELO tối thiểu không hợp lệ";
    }
  }

  if (maxElo !== null && maxElo !== undefined) {
    if (maxElo < 0) {
      errors.maxElo = "ELO tối đa không được âm";
    }
    if (maxElo > 3000) {
      errors.maxElo = "ELO tối đa không hợp lệ";
    }
  }

  if (
    minElo !== null &&
    minElo !== undefined &&
    maxElo !== null &&
    maxElo !== undefined
  ) {
    if (maxElo <= minElo) {
      errors.maxElo = "ELO tối đa phải lớn hơn ELO tối thiểu";
    }
  }

  return errors;
};

/**
 * Tournament form data interface
 */
export interface TournamentFormData {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  status?: "upcoming" | "ongoing" | "completed";
  numberOfTables?: number;
}

/**
 * Tournament content form data interface
 */
export interface TournamentContentFormData {
  name: string;
  type: "single" | "team" | "double";
  maxEntries: number;
  maxSets: number;
  racketCheck: boolean;
  numberOfSingles?: number | null;
  numberOfDoubles?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  minElo?: number | null;
  maxElo?: number | null;
  gender?: "male" | "female" | "mixed" | null;
  isGroupStage?: boolean;
}

/**
 * Validate tournament contents count
 * Backend chỉ cho phép 1 giải đấu có 1 nội dung thi đấu duy nhất
 */
export const validateTournamentContentsCount = (
  contents: unknown[],
): string | null => {
  if (!contents || contents.length === 0) {
    return "Giải đấu phải có ít nhất 1 nội dung thi đấu";
  }

  if (contents.length > 1) {
    return "Hiện tại hệ thống chỉ cho phép tạo 1 nội dung thi đấu cho mỗi giải đấu";
  }

  return null;
};

/**
 * Validate entire tournament form
 */
export const validateTournamentForm = (
  data: TournamentFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const nameError = validateTournamentName(data.name);
  if (nameError) errors.name = nameError;

  const locationError = validateTournamentLocation(data.location);
  if (locationError) errors.location = locationError;

  const dateErrors = validateTournamentDates(data.startDate, data.endDate);
  if (dateErrors.startDate) errors.startDate = dateErrors.startDate;
  if (dateErrors.endDate) errors.endDate = dateErrors.endDate;

  const numberOfTablesError = validateNumberOfTables(data.numberOfTables);
  if (numberOfTablesError) errors.numberOfTables = numberOfTablesError;

  return errors;
};

/**
 * Validate tournament content form
 */
export const validateTournamentContentForm = (
  data: TournamentContentFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const nameError = validateContentName(data.name);
  if (nameError) errors.name = nameError;

  const maxEntriesError = validateMaxEntries(data.maxEntries);
  if (maxEntriesError) errors.maxEntries = maxEntriesError;

  const maxSetsError = validateMaxSets(data.maxSets);
  if (maxSetsError) errors.maxSets = maxSetsError;

  // Validate team format if type is "team"
  if (data.type === "team") {
    const teamErrors = validateTeamFormat(
      data.numberOfSingles,
      data.numberOfDoubles,
    );
    if (teamErrors.numberOfSingles)
      errors.numberOfSingles = teamErrors.numberOfSingles;
    if (teamErrors.numberOfDoubles)
      errors.numberOfDoubles = teamErrors.numberOfDoubles;
    if (teamErrors.total) errors.teamTotal = teamErrors.total;
  } else {
    // For single and double, these fields should be null
    if (
      data.numberOfSingles !== null &&
      data.numberOfSingles !== undefined &&
      data.numberOfSingles !== 0
    ) {
      errors.numberOfSingles = "Số trận đơn chỉ dành cho thể thức đồng đội";
    }
    if (
      data.numberOfDoubles !== null &&
      data.numberOfDoubles !== undefined &&
      data.numberOfDoubles !== 0
    ) {
      errors.numberOfDoubles = "Số trận đôi chỉ dành cho thể thức đồng đội";
    }
  }

  // Validate age restrictions if provided
  if (
    (data.minAge !== null && data.minAge !== undefined) ||
    (data.maxAge !== null && data.maxAge !== undefined)
  ) {
    const ageErrors = validateAgeRestrictions(data.minAge, data.maxAge);
    if (ageErrors.minAge) errors.minAge = ageErrors.minAge;
    if (ageErrors.maxAge) errors.maxAge = ageErrors.maxAge;
  }

  // Validate ELO restrictions if provided
  if (
    (data.minElo !== null && data.minElo !== undefined) ||
    (data.maxElo !== null && data.maxElo !== undefined)
  ) {
    const eloErrors = validateEloRestrictions(data.minElo, data.maxElo);
    if (eloErrors.minElo) errors.minElo = eloErrors.minElo;
    if (eloErrors.maxElo) errors.maxElo = eloErrors.maxElo;
  }

  return errors;
};

// ==================== Tournament Search Filters Validation ====================

/**
 * Validate tournament search filters
 */
export const validateTournamentSearchFilters = (
  filters: Record<string, unknown>,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate pagination
  if (filters.skip !== undefined && filters.skip !== null) {
    const skip = Number(filters.skip);
    if (isNaN(skip) || skip < 0) {
      errors.skip = "Skip phải là số >= 0";
    }
  }

  if (filters.limit !== undefined && filters.limit !== null) {
    const limit = Number(filters.limit);
    if (isNaN(limit) || limit <= 0) {
      errors.limit = "Limit phải là số > 0";
    }
    if (limit > 100) {
      errors.limit = "Limit không được quá 100";
    }
  }

  // Validate user IDs
  if (filters.userId !== undefined && filters.userId !== null) {
    const userId = Number(filters.userId);
    if (isNaN(userId) || userId <= 0) {
      errors.userId = "User ID không hợp lệ";
    }
  }

  if (filters.createdBy !== undefined && filters.createdBy !== null) {
    const createdBy = Number(filters.createdBy);
    if (isNaN(createdBy) || createdBy <= 0) {
      errors.createdBy = "Created By ID không hợp lệ";
    }
  }

  // Validate age filters
  if (
    (filters.minAge !== undefined && filters.minAge !== null) ||
    (filters.maxAge !== undefined && filters.maxAge !== null)
  ) {
    const ageErrors = validateAgeRestrictions(
      filters.minAge as number | null,
      filters.maxAge as number | null,
    );
    if (ageErrors.minAge) errors.minAge = ageErrors.minAge;
    if (ageErrors.maxAge) errors.maxAge = ageErrors.maxAge;
  }

  // Validate ELO filters
  if (
    (filters.minElo !== undefined && filters.minElo !== null) ||
    (filters.maxElo !== undefined && filters.maxElo !== null)
  ) {
    const eloErrors = validateEloRestrictions(
      filters.minElo as number | null,
      filters.maxElo as number | null,
    );
    if (eloErrors.minElo) errors.minElo = eloErrors.minElo;
    if (eloErrors.maxElo) errors.maxElo = eloErrors.maxElo;
  }

  // Validate gender
  if (filters.gender !== undefined && filters.gender !== null) {
    const gender = filters.gender as string;
    if (!["male", "female", "mixed"].includes(gender)) {
      errors.gender = "Giới tính phải là: male, female, hoặc mixed";
    }
  }

  // Validate boolean fields
  if (filters.racketCheck !== undefined && filters.racketCheck !== null) {
    if (typeof filters.racketCheck !== "boolean") {
      errors.racketCheck = "Racket check phải là true hoặc false";
    }
  }

  if (filters.isGroupStage !== undefined && filters.isGroupStage !== null) {
    if (typeof filters.isGroupStage !== "boolean") {
      errors.isGroupStage = "Is group stage phải là true hoặc false";
    }
  }

  return errors;
};

// ==================== Role Validation ====================

/**
 * Validate role name
 */
export const validateRoleName = (name: string): string | null => {
  if (!name || name.trim() === "") {
    return "Tên role không được để trống";
  }

  if (name.length < 2) {
    return "Tên role phải có ít nhất 2 ký tự";
  }

  if (name.length > 50) {
    return "Tên role không được vượt quá 50 ký tự";
  }

  // Allow letters, numbers, spaces, hyphens, underscores
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
    return "Tên role chỉ được chứa chữ cái, số, khoảng trắng, gạch ngang và gạch dưới";
  }

  return null;
};

/**
 * Validate role description
 */
export const validateRoleDescription = (
  description?: string,
): string | null => {
  if (!description || description.trim() === "") {
    return null; // Description is optional
  }

  if (description.length > 500) {
    return "Mô tả không được vượt quá 500 ký tự";
  }

  return null;
};

/**
 * Role form data interface
 */
export interface RoleFormData {
  name: string;
  description?: string;
}

/**
 * Validate entire role form
 */
export const validateRoleForm = (data: RoleFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  const nameError = validateRoleName(data.name);
  if (nameError) errors.name = nameError;

  if (data.description) {
    const descError = validateRoleDescription(data.description);
    if (descError) errors.description = descError;
  }

  return errors;
};

// ==================== Match Set Validation ====================

/**
 * Validate match set score (Badminton rules)
 * - Regular game: First to 11 points
 * - Deuce at 10-10: Must win by 2 points (e.g., 12-10, 13-11, 14-12)
 * - Cap at 30 points (game ends at 30-29)
 */
export const validateMatchSetScore = (
  score1: number,
  score2: number,
): string | null => {
  // Both scores must be non-negative
  if (score1 < 0 || score2 < 0) {
    return "Điểm số không được âm";
  }

  // At least one player must reach 11 to win
  const maxScore = Math.max(score1, score2);
  const minScore = Math.min(score1, score2);

  if (maxScore < 11) {
    return "Điểm số thắng phải ít nhất là 11";
  }

  // Check if it's a valid win
  if (maxScore >= 30) {
    // Cap rule: game ends at 30 points
    if (maxScore > 30 || minScore !== 29) {
      return "Trận đấu kết thúc ở 30-29";
    }
  } else if (maxScore >= 11) {
    // Normal win: must be ahead by at least 2 points, or exactly 11-X where X < 10
    if (maxScore < 11) {
      return "Điểm số thắng phải ít nhất là 11";
    }

    // If score is 11 or above, check deuce rule
    if (minScore >= 10) {
      // Deuce: must win by 2
      if (maxScore - minScore < 2) {
        return "Sau 10-10, phải thắng cách biệt ít nhất 2 điểm";
      }
    }
  }

  return null;
};

/**
 * Validate match set numbers
 */
export const validateSetNumbers = (
  setNumber: number,
  maxSets: number,
): string | null => {
  if (setNumber < 1) {
    return "Số set phải lớn hơn 0";
  }

  if (setNumber > maxSets) {
    return `Số set không được vượt quá ${maxSets}`;
  }

  return null;
};

/**
 * Match set form data interface
 */
export interface MatchSetFormData {
  setNumber: number;
  score1: number;
  score2: number;
  maxSets: number;
}

/**
 * Validate match set form
 */
export const validateMatchSetForm = (
  data: MatchSetFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const setNumberError = validateSetNumbers(data.setNumber, data.maxSets);
  if (setNumberError) errors.setNumber = setNumberError;

  const scoreError = validateMatchSetScore(data.score1, data.score2);
  if (scoreError) errors.score = scoreError;

  return errors;
};

// ==================== Schedule Validation ====================

/**
 * Validate schedule date range
 */
export const validateScheduleDateRange = (
  startDate: string,
  endDate: string,
): { startDate?: string; endDate?: string } => {
  const errors: { startDate?: string; endDate?: string } = {};

  if (!startDate || startDate.trim() === "") {
    errors.startDate = "Ngày bắt đầu lịch thi đấu không được để trống";
  }

  if (!endDate || endDate.trim() === "") {
    errors.endDate = "Ngày kết thúc lịch thi đấu không được để trống";
  }

  // If either date is missing, return early
  if (errors.startDate || errors.endDate) {
    return errors;
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    errors.startDate = "Ngày bắt đầu không hợp lệ";
    return errors;
  }

  const end = new Date(endDate);
  if (isNaN(end.getTime())) {
    errors.endDate = "Ngày kết thúc không hợp lệ";
    return errors;
  }

  if (end < start) {
    errors.endDate = "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu";
  }

  return errors;
};

/**
 * Validate schedule time
 */
export const validateScheduleTime = (time: string): string | null => {
  if (!time || time.trim() === "") {
    return "Thời gian thi đấu không được để trống";
  }

  // Validate time format (HH:MM or HH:MM:SS)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
  if (!timeRegex.test(time)) {
    return "Thời gian không đúng định dạng (HH:MM hoặc HH:MM:SS)";
  }

  return null;
};

/**
 * Validate match duration
 */
export const validateMatchDuration = (duration: number): string | null => {
  if (duration <= 0) {
    return "Thời lượng trận đấu phải lớn hơn 0";
  }

  if (duration > 300) {
    return "Thời lượng trận đấu không được quá 300 phút";
  }

  if (!Number.isInteger(duration)) {
    return "Thời lượng trận đấu phải là số nguyên";
  }

  return null;
};

/**
 * Validate number of tables for schedule
 */
export const validateScheduleNumberOfTables = (
  numberOfTables: number,
): string | null => {
  if (numberOfTables < 1) {
    return "Số bàn thi đấu phải ít nhất là 1";
  }

  if (numberOfTables > 100) {
    return "Số bàn thi đấu không được quá 100";
  }

  if (!Number.isInteger(numberOfTables)) {
    return "Số bàn thi đấu phải là số nguyên";
  }

  return null;
};

/**
 * Schedule form data interface
 */
export interface ScheduleFormData {
  startDate: string;
  endDate: string;
  startTime: string;
  matchDuration: number;
  numberOfTables: number;
}

/**
 * Validate schedule form
 */
export const validateScheduleForm = (
  data: ScheduleFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const dateErrors = validateScheduleDateRange(data.startDate, data.endDate);
  if (dateErrors.startDate) errors.startDate = dateErrors.startDate;
  if (dateErrors.endDate) errors.endDate = dateErrors.endDate;

  const timeError = validateScheduleTime(data.startTime);
  if (timeError) errors.startTime = timeError;

  const durationError = validateMatchDuration(data.matchDuration);
  if (durationError) errors.matchDuration = durationError;

  const tablesError = validateScheduleNumberOfTables(data.numberOfTables);
  if (tablesError) errors.numberOfTables = tablesError;

  return errors;
};

// ==================== Knockout Bracket Validation ====================

/**
 * Validate bracket position
 */
export const validateBracketPosition = (position: number): string | null => {
  if (position < 1) {
    return "Vị trí trong nhánh đấu phải lớn hơn 0";
  }

  if (position > 256) {
    return "Vị trí trong nhánh đấu không hợp lệ";
  }

  return null;
};

/**
 * Validate round number
 */
export const validateRoundNumber = (
  round: number,
  maxRounds: number,
): string | null => {
  if (round < 1) {
    return "Vòng đấu phải lớn hơn 0";
  }

  if (round > maxRounds) {
    return `Vòng đấu không được vượt quá ${maxRounds}`;
  }

  return null;
};

/**
 * Validate bracket size (must be power of 2)
 */
export const validateBracketSize = (size: number): string | null => {
  if (size < 2) {
    return "Kích thước nhánh đấu phải ít nhất là 2";
  }

  if (size > 256) {
    return "Kích thước nhánh đấu không được quá 256";
  }

  // Must be power of 2
  if ((size & (size - 1)) !== 0) {
    return "Kích thước nhánh đấu phải là lũy thừa của 2 (2, 4, 8, 16, 32, 64, 128, 256)";
  }

  return null;
};

/**
 * Knockout bracket form data interface
 */
export interface KnockoutBracketFormData {
  position: number;
  round: number;
  size: number;
}

/**
 * Validate knockout bracket form
 */
export const validateKnockoutBracketForm = (
  data: KnockoutBracketFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const positionError = validateBracketPosition(data.position);
  if (positionError) errors.position = positionError;

  const sizeError = validateBracketSize(data.size);
  if (sizeError) errors.size = sizeError;

  // Calculate max rounds from size
  const maxRounds = Math.log2(data.size);
  const roundError = validateRoundNumber(data.round, maxRounds);
  if (roundError) errors.round = roundError;

  return errors;
};

// ==================== Group Standing Validation ====================

/**
 * Validate group name
 */
export const validateGroupName = (name: string): string | null => {
  if (!name || name.trim() === "") {
    return "Tên bảng đấu không được để trống";
  }

  if (name.length > 50) {
    return "Tên bảng đấu không được quá 50 ký tự";
  }

  return null;
};

/**
 * Validate number of groups
 */
export const validateNumberOfGroups = (
  numberOfGroups: number,
): string | null => {
  if (numberOfGroups < 1) {
    return "Số lượng bảng đấu phải ít nhất là 1";
  }

  if (numberOfGroups > 32) {
    return "Số lượng bảng đấu không được quá 32";
  }

  return null;
};

/**
 * Validate teams per group
 */
export const validateTeamsPerGroup = (teamsPerGroup: number): string | null => {
  if (teamsPerGroup < 2) {
    return "Số đội mỗi bảng phải ít nhất là 2";
  }

  if (teamsPerGroup > 16) {
    return "Số đội mỗi bảng không được quá 16";
  }

  return null;
};

/**
 * Validate qualified teams per group
 */
export const validateQualifiedTeamsPerGroup = (
  qualifiedTeams: number,
  teamsPerGroup: number,
): string | null => {
  if (qualifiedTeams < 1) {
    return "Số đội đi tiếp phải ít nhất là 1";
  }

  if (qualifiedTeams > teamsPerGroup) {
    return "Số đội đi tiếp không được nhiều hơn số đội trong bảng";
  }

  return null;
};

/**
 * Group standing form data interface
 */
export interface GroupStandingFormData {
  groupName: string;
  numberOfGroups: number;
  teamsPerGroup: number;
  qualifiedTeamsPerGroup: number;
}

/**
 * Validate group standing form
 */
export const validateGroupStandingForm = (
  data: GroupStandingFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const nameError = validateGroupName(data.groupName);
  if (nameError) errors.groupName = nameError;

  const groupsError = validateNumberOfGroups(data.numberOfGroups);
  if (groupsError) errors.numberOfGroups = groupsError;

  const teamsError = validateTeamsPerGroup(data.teamsPerGroup);
  if (teamsError) errors.teamsPerGroup = teamsError;

  const qualifiedError = validateQualifiedTeamsPerGroup(
    data.qualifiedTeamsPerGroup,
    data.teamsPerGroup,
  );
  if (qualifiedError) errors.qualifiedTeamsPerGroup = qualifiedError;

  return errors;
};

// ==================== Match Validation ====================

/**
 * Validate match status transition
 */
export const validateMatchStatusTransition = (
  currentStatus: string,
  newStatus: string,
): string | null => {
  const validTransitions: Record<string, string[]> = {
    scheduled: ["in_progress", "cancelled"],
    in_progress: ["completed", "cancelled"],
    completed: [],
    cancelled: ["scheduled"],
  };

  if (!validTransitions[currentStatus]) {
    return "Trạng thái hiện tại không hợp lệ";
  }

  if (!validTransitions[currentStatus].includes(newStatus)) {
    return `Không thể chuyển từ trạng thái "${currentStatus}" sang "${newStatus}"`;
  }

  return null;
};

/**
 * Validate match table number
 */
export const validateMatchTableNumber = (
  tableNumber: number,
): string | null => {
  if (tableNumber < 1) {
    return "Số bàn thi đấu phải lớn hơn 0";
  }

  if (tableNumber > 100) {
    return "Số bàn thi đấu không được quá 100";
  }

  return null;
};

/**
 * Match form data interface
 */
export interface MatchFormData {
  tableNumber: number;
  status?: string;
  currentStatus?: string;
}

/**
 * Validate match form
 */
export const validateMatchForm = (data: MatchFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  const tableError = validateMatchTableNumber(data.tableNumber);
  if (tableError) errors.tableNumber = tableError;

  // Validate status transition if both current and new status are provided
  if (data.currentStatus && data.status) {
    const transitionError = validateMatchStatusTransition(
      data.currentStatus,
      data.status,
    );
    if (transitionError) errors.status = transitionError;
  }

  return errors;
};
