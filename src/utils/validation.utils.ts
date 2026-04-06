/**
 * Validation Utilities
 * Frontend validation for authentication and other forms
 */

import i18n from "@/locales/i18n";

const tValidation = (
  key: string,
  options?: Record<string, string | number>,
): string => i18n.t(key, options) as string;

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
    return tValidation("validation.auth.emailRequired");
  }

  if (!isValidEmail(email)) {
    return tValidation("validation.auth.emailInvalid");
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
    return tValidation("validation.auth.passwordRequired");
  }

  if (password.length < 8) {
    return tValidation("validation.auth.passwordMinLength");
  }

  if (!/[a-z]/.test(password)) {
    return tValidation("validation.auth.passwordLowercaseRequired");
  }

  if (!/[A-Z]/.test(password)) {
    return tValidation("validation.auth.passwordUppercaseRequired");
  }

  if (!/\d/.test(password)) {
    return tValidation("validation.auth.passwordNumberRequired");
  }

  const strength = checkPasswordStrength(password);
  if (strength === PasswordStrength.WEAK) {
    return tValidation("validation.auth.passwordTooWeak");
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
    return tValidation("validation.auth.confirmPasswordRequired");
  }

  if (password !== confirmPassword) {
    return tValidation("validation.auth.confirmPasswordMismatch");
  }

  return null;
};

// ==================== Username Validation ====================

/**
 * Validate username
 */
export const validateUsername = (username: string): string | null => {
  if (!username || username.trim() === "") {
    return tValidation("validation.auth.usernameRequired");
  }

  if (username.length < 3) {
    return tValidation("validation.auth.usernameMinLength");
  }

  if (username.length > 30) {
    return tValidation("validation.auth.usernameMaxLength");
  }

  // Only alphanumeric, underscore, and hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return tValidation("validation.auth.usernameInvalid");
  }

  return null;
};

/**
 * Validate first name / last name
 */
export const validateName = (
  value: string,
  fieldLabel: string,
): string | null => {
  if (!value || value.trim() === "") {
    return tValidation("validation.auth.nameRequired", {
      field: fieldLabel,
    });
  }

  if (value.trim().length < 2) {
    return tValidation("validation.auth.nameMinLength", {
      field: fieldLabel,
    });
  }

  if (value.trim().length > 50) {
    return tValidation("validation.auth.nameMaxLength", {
      field: fieldLabel,
    });
  }

  if (!/^[\p{L}'][\p{L}\s'-]*$/u.test(value.trim())) {
    return tValidation("validation.auth.nameInvalidCharacters", {
      field: fieldLabel,
    });
  }

  return null;
};

// ==================== OTP Validation ====================

/**
 * Validate OTP code
 */
export const validateOTP = (otp: string): string | null => {
  if (!otp || otp.trim() === "") {
    return tValidation("validation.auth.otpRequired");
  }

  if (!/^\d{6}$/.test(otp)) {
    return tValidation("validation.auth.otpInvalid");
  }

  return null;
};

// ==================== Form Validation ====================

/**
 * Register form validation
 */
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateRegisterForm = (
  data: RegisterFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const firstNameError = validateName(
    data.firstName,
    tValidation("validation.fields.firstName"),
  );
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateName(
    data.lastName,
    tValidation("validation.fields.lastName"),
  );
  if (lastNameError) errors.lastName = lastNameError;

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
    errors.password = tValidation("validation.auth.passwordRequired");
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
    errors.oldPassword = tValidation("validation.auth.oldPasswordRequired");
  }

  const newPasswordError = validatePassword(data.newPassword);
  if (newPasswordError) errors.newPassword = newPasswordError;

  if (data.oldPassword === data.newPassword) {
    errors.newPassword = tValidation("validation.auth.newPasswordMustDiffer");
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
    return tValidation("validation.tournament.nameRequired");
  }

  if (name.length < 3) {
    return tValidation("validation.tournament.nameMinLength");
  }

  if (name.length > 200) {
    return tValidation("validation.tournament.nameMaxLength");
  }

  return null;
};

/**
 * Validate tournament location
 */
export const validateTournamentLocation = (location: string): string | null => {
  if (!location || location.trim() === "") {
    return tValidation("validation.tournament.locationRequired");
  }

  if (location.length < 3) {
    return tValidation("validation.tournament.locationMinLength");
  }

  if (location.length > 300) {
    return tValidation("validation.tournament.locationMaxLength");
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
    return tValidation("validation.tournament.tablesMin");
  }

  if (numberOfTables > 100) {
    return tValidation("validation.tournament.tablesMax");
  }

  if (!Number.isInteger(numberOfTables)) {
    return tValidation("validation.tournament.tablesInteger");
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
    errors.startDate = tValidation("validation.tournament.startDateRequired");
  }

  if (!endDate || endDate.trim() === "") {
    errors.endDate = tValidation("validation.tournament.endDateRequired");
  }

  // If either date is missing, return early
  if (errors.startDate || errors.endDate) {
    return errors;
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    errors.startDate = tValidation("validation.tournament.startDateInvalid");
    return errors;
  }

  const end = new Date(endDate);
  if (isNaN(end.getTime())) {
    errors.endDate = tValidation("validation.tournament.endDateInvalid");
    return errors;
  }

  // Check if startDate is in the past (allow today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (start < today) {
    errors.startDate = tValidation("validation.tournament.startDatePast");
  }

  if (end <= start) {
    errors.endDate = tValidation("validation.tournament.endDateAfterStart");
  }

  return errors;
};

/**
 * Validate tournament content name
 */
export const validateContentName = (name: string): string | null => {
  if (!name || name.trim() === "") {
    return tValidation("validation.content.nameRequired");
  }

  if (name.length < 3) {
    return tValidation("validation.content.nameMinLength");
  }

  if (name.length > 100) {
    return tValidation("validation.content.nameMaxLength");
  }

  return null;
};

/**
 * Validate maxEntries
 */
export const validateMaxEntries = (maxEntries: number): string | null => {
  if (!maxEntries || maxEntries <= 0) {
    return tValidation("validation.content.maxEntriesMin");
  }

  if (maxEntries > 256) {
    return tValidation("validation.content.maxEntriesMax");
  }

  // Should be power of 2 for knockout tournament (2, 4, 8, 16, 32, 64, 128, 256)
  if ((maxEntries & (maxEntries - 1)) !== 0) {
    return tValidation("validation.content.maxEntriesPowerOfTwo");
  }

  return null;
};

/**
 * Validate maxSets
 */
export const validateMaxSets = (maxSets: number): string | null => {
  if (!maxSets || maxSets <= 0) {
    return tValidation("validation.content.maxSetsMin");
  }

  if (maxSets > 7) {
    return tValidation("validation.content.maxSetsMax");
  }

  // Should be odd number (1, 3, 5, 7)
  if (maxSets % 2 === 0) {
    return tValidation("validation.content.maxSetsOdd");
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
    errors.numberOfSingles = tValidation(
      "validation.teamFormat.singlesRequired",
    );
    errors.numberOfDoubles = tValidation(
      "validation.teamFormat.doublesRequired",
    );
    return errors;
  }

  if (numberOfSingles < 0) {
    errors.numberOfSingles = tValidation(
      "validation.teamFormat.singlesNonNegative",
    );
  }

  if (numberOfDoubles < 0) {
    errors.numberOfDoubles = tValidation(
      "validation.teamFormat.doublesNonNegative",
    );
  }

  const total = numberOfSingles + numberOfDoubles;

  // Total must be >= 3
  if (total < 3) {
    errors.total = tValidation("validation.teamFormat.totalMin");
  }

  // Total must be odd number
  if (total % 2 === 0) {
    errors.total = tValidation("validation.teamFormat.totalOdd");
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
      errors.minAge = tValidation("validation.age.minAgeMin");
    }
    if (minAge > 100) {
      errors.minAge = tValidation("validation.age.minAgeInvalid");
    }
  }

  if (maxAge !== null && maxAge !== undefined) {
    if (maxAge < 5) {
      errors.maxAge = tValidation("validation.age.maxAgeMin");
    }
    if (maxAge > 100) {
      errors.maxAge = tValidation("validation.age.maxAgeInvalid");
    }
  }

  if (
    minAge !== null &&
    minAge !== undefined &&
    maxAge !== null &&
    maxAge !== undefined
  ) {
    if (maxAge <= minAge) {
      errors.maxAge = tValidation("validation.age.maxAgeGreaterThanMin");
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
      errors.minElo = tValidation("validation.elo.minEloNonNegative");
    }
    if (minElo > 3000) {
      errors.minElo = tValidation("validation.elo.minEloInvalid");
    }
  }

  if (maxElo !== null && maxElo !== undefined) {
    if (maxElo < 0) {
      errors.maxElo = tValidation("validation.elo.maxEloNonNegative");
    }
    if (maxElo > 3000) {
      errors.maxElo = tValidation("validation.elo.maxEloInvalid");
    }
  }

  if (
    minElo !== null &&
    minElo !== undefined &&
    maxElo !== null &&
    maxElo !== undefined
  ) {
    if (maxElo <= minElo) {
      errors.maxElo = tValidation("validation.elo.maxEloGreaterThanMin");
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
    return tValidation("validation.content.contentsMin");
  }

  if (contents.length > 1) {
    return tValidation("validation.content.contentsMaxOne");
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
      errors.numberOfSingles = tValidation(
        "validation.teamFormat.singlesOnlyTeam",
      );
    }
    if (
      data.numberOfDoubles !== null &&
      data.numberOfDoubles !== undefined &&
      data.numberOfDoubles !== 0
    ) {
      errors.numberOfDoubles = tValidation(
        "validation.teamFormat.doublesOnlyTeam",
      );
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
      errors.skip = tValidation("validation.filters.skipMin");
    }
  }

  if (filters.limit !== undefined && filters.limit !== null) {
    const limit = Number(filters.limit);
    if (isNaN(limit) || limit <= 0) {
      errors.limit = tValidation("validation.filters.limitMin");
    }
    if (limit > 100) {
      errors.limit = tValidation("validation.filters.limitMax");
    }
  }

  // Validate user IDs
  if (filters.userId !== undefined && filters.userId !== null) {
    const userId = Number(filters.userId);
    if (isNaN(userId) || userId <= 0) {
      errors.userId = tValidation("validation.filters.userIdInvalid");
    }
  }

  if (filters.createdBy !== undefined && filters.createdBy !== null) {
    const createdBy = Number(filters.createdBy);
    if (isNaN(createdBy) || createdBy <= 0) {
      errors.createdBy = tValidation("validation.filters.createdByInvalid");
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
      errors.gender = tValidation("validation.filters.genderInvalid");
    }
  }

  // Validate boolean fields
  if (filters.racketCheck !== undefined && filters.racketCheck !== null) {
    if (typeof filters.racketCheck !== "boolean") {
      errors.racketCheck = tValidation("validation.filters.racketCheckBoolean");
    }
  }

  if (filters.isGroupStage !== undefined && filters.isGroupStage !== null) {
    if (typeof filters.isGroupStage !== "boolean") {
      errors.isGroupStage = tValidation(
        "validation.filters.isGroupStageBoolean",
      );
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
    return tValidation("validation.role.nameRequired");
  }

  if (name.length < 2) {
    return tValidation("validation.role.nameMinLength");
  }

  if (name.length > 50) {
    return tValidation("validation.role.nameMaxLength");
  }

  // Allow letters, numbers, spaces, hyphens, underscores
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
    return tValidation("validation.role.nameInvalid");
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
    return tValidation("validation.role.descriptionMaxLength");
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
    return tValidation("validation.matchSet.scoreNonNegative");
  }

  // At least one player must reach 11 to win
  const maxScore = Math.max(score1, score2);
  const minScore = Math.min(score1, score2);

  if (maxScore < 11) {
    return tValidation("validation.matchSet.winScoreMin");
  }

  // Check if it's a valid win
  if (maxScore >= 30) {
    // Cap rule: game ends at 30 points
    if (maxScore > 30 || minScore !== 29) {
      return tValidation("validation.matchSet.capRule");
    }
  } else if (maxScore >= 11) {
    // Normal win: must be ahead by at least 2 points, or exactly 11-X where X < 10
    if (maxScore < 11) {
      return tValidation("validation.matchSet.winScoreMin");
    }

    // If score is 11 or above, check deuce rule
    if (minScore >= 10) {
      // Deuce: must win by 2
      if (maxScore - minScore < 2) {
        return tValidation("validation.matchSet.deuceRule");
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
    return tValidation("validation.matchSet.setNumberMin");
  }

  if (setNumber > maxSets) {
    return tValidation("validation.matchSet.setNumberMax", { maxSets });
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
    errors.startDate = tValidation("validation.schedule.startDateRequired");
  }

  if (!endDate || endDate.trim() === "") {
    errors.endDate = tValidation("validation.schedule.endDateRequired");
  }

  // If either date is missing, return early
  if (errors.startDate || errors.endDate) {
    return errors;
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    errors.startDate = tValidation("validation.schedule.startDateInvalid");
    return errors;
  }

  const end = new Date(endDate);
  if (isNaN(end.getTime())) {
    errors.endDate = tValidation("validation.schedule.endDateInvalid");
    return errors;
  }

  if (end < start) {
    errors.endDate = tValidation(
      "validation.schedule.endDateAfterOrEqualStart",
    );
  }

  return errors;
};

/**
 * Validate schedule time
 */
export const validateScheduleTime = (time: string): string | null => {
  if (!time || time.trim() === "") {
    return tValidation("validation.schedule.timeRequired");
  }

  // Validate time format (HH:MM or HH:MM:SS)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
  if (!timeRegex.test(time)) {
    return tValidation("validation.schedule.timeInvalidFormat");
  }

  return null;
};

/**
 * Validate match duration
 */
export const validateMatchDuration = (duration: number): string | null => {
  if (duration <= 0) {
    return tValidation("validation.schedule.durationMin");
  }

  if (duration > 300) {
    return tValidation("validation.schedule.durationMax");
  }

  if (!Number.isInteger(duration)) {
    return tValidation("validation.schedule.durationInteger");
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
    return tValidation("validation.schedule.tablesMin");
  }

  if (numberOfTables > 100) {
    return tValidation("validation.schedule.tablesMax");
  }

  if (!Number.isInteger(numberOfTables)) {
    return tValidation("validation.schedule.tablesInteger");
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
    return tValidation("validation.knockout.positionMin");
  }

  if (position > 256) {
    return tValidation("validation.knockout.positionInvalid");
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
    return tValidation("validation.knockout.roundMin");
  }

  if (round > maxRounds) {
    return tValidation("validation.knockout.roundMax", { maxRounds });
  }

  return null;
};

/**
 * Validate bracket size (must be power of 2)
 */
export const validateBracketSize = (size: number): string | null => {
  if (size < 2) {
    return tValidation("validation.knockout.sizeMin");
  }

  if (size > 256) {
    return tValidation("validation.knockout.sizeMax");
  }

  // Must be power of 2
  if ((size & (size - 1)) !== 0) {
    return tValidation("validation.knockout.sizePowerOfTwo");
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
    return tValidation("validation.group.nameRequired");
  }

  if (name.length > 50) {
    return tValidation("validation.group.nameMaxLength");
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
    return tValidation("validation.group.numberOfGroupsMin");
  }

  if (numberOfGroups > 32) {
    return tValidation("validation.group.numberOfGroupsMax");
  }

  return null;
};

/**
 * Validate teams per group
 */
export const validateTeamsPerGroup = (teamsPerGroup: number): string | null => {
  if (teamsPerGroup < 2) {
    return tValidation("validation.group.teamsPerGroupMin");
  }

  if (teamsPerGroup > 16) {
    return tValidation("validation.group.teamsPerGroupMax");
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
    return tValidation("validation.group.qualifiedTeamsMin");
  }

  if (qualifiedTeams > teamsPerGroup) {
    return tValidation("validation.group.qualifiedTeamsMax");
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
    return tValidation("validation.match.statusCurrentInvalid");
  }

  if (!validTransitions[currentStatus].includes(newStatus)) {
    return tValidation("validation.match.statusTransitionInvalid", {
      currentStatus,
      newStatus,
    });
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
    return tValidation("validation.match.tableNumberMin");
  }

  if (tableNumber > 100) {
    return tValidation("validation.match.tableNumberMax");
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
