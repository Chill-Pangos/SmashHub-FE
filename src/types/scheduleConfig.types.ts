
// ==================== Schedule Config ====================

export interface ScheduleConfig {
  id: number;
  tournamentId: number;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  bracketGenerationDate: string;
  numberOfTables: number;
  matchDurationMinutes: number;
  breakDurationMinutes: number;
  dailyStartHour: number;
  dailyStartMinute: number;
  dailyEndHour: number;
  dailyEndMinute: number;
  lunchBreakStartHour?: number | null;
  lunchBreakStartMinute?: number | null;
  lunchBreakEndHour?: number | null;
  lunchBreakEndMinute?: number | null;
  lunchBreakDurationMinutes?: number | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleConfigDefaults {
  matchDurationMinutes: number;
  breakDurationMinutes: number;
  dailyStartHour: number;
  dailyStartMinute: number;
  dailyEndHour: number;
  dailyEndMinute: number;
  numberOfTables: number;
}

// ==================== Request Types ====================

export interface CreateScheduleConfigRequest {
  tournamentId: number;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  bracketGenerationDate: string;
  numberOfTables?: number;
  matchDurationMinutes?: number;
  breakDurationMinutes?: number;
  dailyStartHour?: number;
  dailyStartMinute?: number;
  dailyEndHour?: number;
  dailyEndMinute?: number;
  lunchBreakStartHour?: number | null;
  lunchBreakStartMinute?: number | null;
  lunchBreakEndHour?: number | null;
  lunchBreakEndMinute?: number | null;
  lunchBreakDurationMinutes?: number | null;
  notes?: string | null;
}

export interface UpdateScheduleConfigRequest {
  startDate?: string;
  endDate?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  bracketGenerationDate?: string;
  numberOfTables?: number;
  matchDurationMinutes?: number;
  breakDurationMinutes?: number;
  dailyStartHour?: number;
  dailyStartMinute?: number;
  dailyEndHour?: number;
  dailyEndMinute?: number;
  lunchBreakStartHour?: number | null;
  lunchBreakStartMinute?: number | null;
  lunchBreakEndHour?: number | null;
  lunchBreakEndMinute?: number | null;
  lunchBreakDurationMinutes?: number | null;
  notes?: string | null;
}

export interface ValidateScheduleConfigRequest {
  category: {
    maxEntries: number;
    isGroupStage?: boolean;
  };
  scheduleConfig: {
    startDate: string;
    endDate: string;
    registrationStartDate: string;
    registrationEndDate: string;
    bracketGenerationDate: string;
    numberOfTables?: number;
    matchDurationMinutes?: number;
    breakDurationMinutes?: number;
    dailyStartHour?: number;
    dailyStartMinute?: number;
    dailyEndHour?: number;
    dailyEndMinute?: number;
    lunchBreakStartHour?: number | null;
    lunchBreakStartMinute?: number | null;
    lunchBreakEndHour?: number | null;
    lunchBreakEndMinute?: number | null;
    lunchBreakDurationMinutes?: number | null;
    notes?: string | null;
  };
}

export interface PreviewScheduleConfigRequest extends CreateScheduleConfigRequest {
  totalMatches: number;
}

export interface PreviewUpdateScheduleConfigRequest extends UpdateScheduleConfigRequest {
  totalMatches: number;
}

// ==================== Response Types ====================

export type ScheduleConfigResponse = ScheduleConfig;
export type ScheduleConfigDefaultsResponse = ScheduleConfigDefaults;
export type DeleteScheduleConfigResponse = void;

export interface ValidateScheduleConfigResponse {
  isValid: boolean;
  message?: string;
  details?: {
    totalMatches: number;
    totalSlots: number;
    estimatedEndTime: string;
    tournamentEndTime: string;
    overflowMinutes: number;
  };
}

export interface PreviewScheduleConfigResponse {
  isValid: boolean;
  message?: string;
  preview?: {
    totalMatches: number;
    totalSlots: number;
    estimatedEndTime: string;
    tournamentEndTime: string;
    availableMinutes: number;
    neededMinutes: number;
    overflowMinutes: number;
    startDate: string;
    endDate: string;
    registrationStartDate: string;
    registrationEndDate: string;
    bracketGenerationDate: string;
    numberOfTables: number;
    matchDurationMinutes: number;
    breakDurationMinutes: number;
  };
}
