import type { ApiResponse } from "@/types";
import { showApiError, getUserFriendlyMessage } from "./toast.utils";

/**
 * API Utilities
 * Handle API response unwrapping and error handling
 */

/**
 * Unwrap API response data
 * Extracts data from ApiResponse wrapper or throws error
 */
export const unwrapApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.success) {
    return response.data;
  }

  // Handle new error format with error.code and error.message
  if ("error" in response && response.error) {
    const userMessage = getUserFriendlyMessage(
      response.error.code,
      response.error.message
    );
    throw new Error(userMessage);
  }

  throw new Error("An error occurred");
};

/**
 * Handle API call with automatic error handling and toast notifications
 * @param apiCall - The API function to call
 * @param options - Configuration options
 * @returns The unwrapped data or throws error
 */
export const handleApiCall = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options?: {
    showSuccessToast?: boolean;
    successMessage?: string;
    showErrorToast?: boolean;
    errorMessage?: string;
  }
): Promise<T> => {
  const {
    showSuccessToast = false,
    successMessage,
    showErrorToast = true,
    errorMessage,
  } = options || {};

  try {
    const response = await apiCall();

    if (!response.success) {
      // Handle new error format
      if ("error" in response && response.error) {
        const userMessage = getUserFriendlyMessage(
          response.error.code,
          response.error.message
        );
        throw new Error(userMessage);
      }
      throw new Error("Request failed");
    }

    // Show success toast if enabled
    if (showSuccessToast) {
      const { showToast } = await import("./toast.utils");
      showToast.success(successMessage || response.message);
    }

    return response.data;
  } catch (error) {
    // Show error toast if enabled
    if (showErrorToast) {
      showApiError(error, errorMessage);
    }
    throw error;
  }
};

/**
 * Safe API call - returns null on error instead of throwing
 * Useful for non-critical operations
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options?: {
    showErrorToast?: boolean;
    errorMessage?: string;
  }
): Promise<T | null> => {
  try {
    return await handleApiCall(apiCall, {
      showErrorToast: options?.showErrorToast ?? false,
      errorMessage: options?.errorMessage,
    });
  } catch {
    return null;
  }
};

/**
 * Batch API calls with error handling
 * Continues executing even if some calls fail
 */
export const batchApiCalls = async <T>(
  apiCalls: Array<() => Promise<ApiResponse<T>>>,
  options?: {
    showErrorToast?: boolean;
  }
): Promise<Array<T | null>> => {
  const results = await Promise.allSettled(
    apiCalls.map((call) =>
      handleApiCall(call, {
        showErrorToast: options?.showErrorToast ?? false,
      })
    )
  );

  return results.map((result) =>
    result.status === "fulfilled" ? result.value : null
  );
};

/**
 * Retry API call with exponential backoff
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options?: {
    maxRetries?: number;
    delayMs?: number;
    backoffMultiplier?: number;
    showErrorToast?: boolean;
  }
): Promise<T> => {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    showErrorToast = true,
  } = options || {};

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await handleApiCall(apiCall, {
        showErrorToast: attempt === maxRetries ? showErrorToast : false,
      });
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = delayMs * Math.pow(backoffMultiplier, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  if (
    "response" in error &&
    error.response &&
    typeof error.response === "object"
  ) {
    const response = error.response as { status?: number };
    return response.status === 401;
  }

  return false;
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  if ("message" in error && typeof error.message === "string") {
    return error.message.toLowerCase().includes("network");
  }

  if ("code" in error) {
    return ["ECONNABORTED", "ETIMEDOUT", "ENOTFOUND", "ENETUNREACH"].includes(
      error.code as string
    );
  }

  return false;
};
