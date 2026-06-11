import type { Match } from "./match.types";

// ==================== Enums ====================

export type ScheduleStage = "group" | "knockout";

// ==================== Schedule ====================

export interface Schedule {
  id: number;
  contentId: number;
  categoryId?: number;
  roundNumber?: number;
  groupName?: string | null;
  stage?: ScheduleStage;
  knockoutRound?: string | null;
  tableNumber: number;
  scheduledAt?: string;
  matchId?: number | null;
  match?: Match | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== Request Types ====================

export interface GenerateTournamentScheduleRequest {
  categoryId: number;
}

export interface GenerateGroupStageScheduleRequest {
  categoryId: number;
}

export interface GenerateKnockoutScheduleRequest {
  categoryId: number;
}

export interface SyncMatchEntriesRequest {
  categoryId: number;
}

// ==================== Response Types ====================

export type GetScheduleResponse = { success: boolean; data: Schedule };
export type GetSchedulesByContentData = { schedules: Schedule[]; count: number; page: number; limit: number; };
export type GetSchedulesByContentResponse = { success: boolean; data: GetSchedulesByContentData };

export interface GenerateGroupStageScheduleResponse {
  success: boolean;
  message: string;
  warning?: string;
  data: {
    totalSchedules: number;
    totalMatches: number;
    schedules: Schedule[];
    matches: Match[];
  };
}

export interface GenerateKnockoutScheduleResponse {
  success: boolean;
  message: string;
  warning?: string;
  data: {
    totalSchedules: number;
    totalMatches: number;
    schedules: Schedule[];
    matches: Match[];
  };
}

export interface GenerateTournamentScheduleResponse {
  success: boolean;
  message: string;
  warnings?: string[];
  data: {
    categoryId: number;
    totalSchedules: number;
    totalMatches: number;
  }[];
}

export interface SyncMatchEntriesResponse {
  success: boolean;
  message: string;
  data: {
    updatedSchedules: number;
    syncedMatches: number;
  };
}
