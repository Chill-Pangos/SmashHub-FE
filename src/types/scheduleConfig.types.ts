import type { ApiResponse } from "./auth.types";

// ==================== Schedule Config ====================

export interface ScheduleConfig {
  id: number;
  tournamentId: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  lunchBreakDurationMinutes?: number;
  matchDurationMinutes?: number;
  matchIntervalMinutes?: number;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ScheduleConfigDefaults {
  startTime?: string;
  endTime?: string;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  lunchBreakDurationMinutes?: number;
  matchDurationMinutes?: number;
  matchIntervalMinutes?: number;
  notes?: string | null;
  [key: string]: unknown;
}

// ==================== Request Types ====================

export interface CreateScheduleConfigRequest {
  tournamentId: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  lunchBreakDurationMinutes?: number;
  matchDurationMinutes?: number;
  matchIntervalMinutes?: number;
  notes?: string | null;
  [key: string]: unknown;
}

export interface UpdateScheduleConfigRequest {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  lunchBreakDurationMinutes?: number;
  matchDurationMinutes?: number;
  matchIntervalMinutes?: number;
  notes?: string | null;
  [key: string]: unknown;
}

export interface ValidateScheduleConfigRequest {
  totalMatches: number;
}

// ==================== Response Types ====================

export type ScheduleConfigResponse = ApiResponse<ScheduleConfig>;
export type ScheduleConfigDefaultsResponse =
  ApiResponse<ScheduleConfigDefaults>;
export type DeleteScheduleConfigResponse = ApiResponse<void>;
export type ValidateScheduleConfigResponse = ApiResponse<{
  isValid: boolean;
  issues?: string[];
}>;
