import type { ApiResponse } from "./auth.types";
import type { Match } from "./match.types";

// ==================== Enums ====================

/**
 * Schedule stage enum
 */
export type ScheduleStage = "group" | "knockout";

// ==================== Schedule ====================

/**
 * Schedule interface
 */
export interface Schedule {
  id: number;
  contentId: number;
  roundNumber?: number;
  groupName?: string | null;
  stage?: ScheduleStage;
  knockoutRound?: string | null;
  tableNumber: number;
  scheduledAt?: string;
  matchTime?: string; // Legacy field
  matchId?: number | null;
  match?: Match | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Group result for knockout entry update
 */
export interface GroupResult {
  groupName: string;
  qualifiedEntryIds: number[];
}

// ==================== Request Types ====================

/**
 * Create schedule request
 */
export interface CreateScheduleRequest {
  contentId: number;
  matchTime: string;
  tableNumber?: number;
  matchId?: number | null;
}

/**
 * Update schedule request
 */
export interface UpdateScheduleRequest {
  contentId?: number;
  matchTime?: string;
  tableNumber?: number;
  matchId?: number | null;
}

/**
 * Generate schedule request
 */
export interface GenerateScheduleRequest {
  contentId: number;
  startDate: string;
  endDate: string;
}

/**
 * Update knockout entries request
 */
export interface UpdateKnockoutEntriesRequest {
  contentId: number;
  groupResults: GroupResult[];
}

/**
 * Generate group stage schedule request
 */
export interface GenerateGroupStageScheduleRequest {
  contentId: number;
  startDate: string;
  endDate: string;
}

/**
 * Generate complete schedule request
 */
export interface GenerateCompleteScheduleRequest {
  contentId: number;
  startDate: string;
  endDate: string;
  groupStageEndDate?: string;
}

/**
 * Generate knockout only schedule request
 */
export interface GenerateKnockoutOnlyScheduleRequest {
  contentId: number;
  startDate: string;
  endDate: string;
}

/**
 * Generate knockout stage schedule request
 */
export interface GenerateKnockoutStageScheduleRequest {
  contentId: number;
  startDate: string;
  endDate: string;
}

// ==================== Response Types ====================

/**
 * Create schedule response
 */
export type CreateScheduleResponse = ApiResponse<Schedule>;

/**
 * Get schedule response
 */
export type GetScheduleResponse = ApiResponse<Schedule>;

/**
 * Get schedules response
 */
export type GetSchedulesResponse = ApiResponse<Schedule[]>;

/**
 * Update schedule response
 */
export type UpdateScheduleResponse = ApiResponse<Schedule>;

/**
 * Delete schedule response
 */
export type DeleteScheduleResponse = ApiResponse<void>;

/**
 * Generate schedule response
 */
export interface GenerateScheduleResponse {
  success: boolean;
  message: string;
  data: {
    schedulesCreated: number;
    matchesCreated: number;
  };
}

/**
 * Update knockout entries response
 */
export interface UpdateKnockoutEntriesResponse {
  success: boolean;
  message: string;
  data: {
    updatedBrackets: number;
  };
}

/**
 * Generate group stage schedule response
 */
export type GenerateGroupStageScheduleResponse = GenerateScheduleResponse;

/**
 * Generate complete schedule response
 */
export interface GenerateCompleteScheduleResponse {
  success: boolean;
  message: string;
  data: {
    groupStage: {
      totalMatches: number;
      groups: string[];
      schedules: Schedule[];
    };
    knockoutStage: {
      totalMatches: number;
      rounds: string[];
      schedules: Schedule[];
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Generate knockout only schedule response
 */
export interface GenerateKnockoutOnlyScheduleResponse {
  success: boolean;
  message: string;
  data: {
    totalMatches: number;
    totalEntries: number;
    bracketSize: number;
    rounds: string[];
    schedules: Schedule[];
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Generate knockout stage schedule response
 */
export type GenerateKnockoutStageScheduleResponse = GenerateScheduleResponse;

/**
 * Get schedules by content response data
 */
export interface GetSchedulesByContentData {
  schedules: Schedule[];
  count: number;
  skip: number;
  limit: number;
}

/**
 * Get schedules by content response
 */
export type GetSchedulesByContentResponse = ApiResponse<GetSchedulesByContentData>;
