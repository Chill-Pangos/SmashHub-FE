import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const LOCAL_TIMEZONE = 'Asia/Ho_Chi_Minh'; // GMT+7

/**
 * Converts a UTC string/date to a local Date object shifted to GMT+7 for display/input.
 */
export const toLocalDisplay = (date: string | Date | number): Date => {
  if (!date) return new Date();
  
  let dateObj: Date | string | number = date;
  
  // If string, ensure it has 'Z' if missing (assume UTC from API)
  if (typeof date === 'string' && !date.endsWith('Z') && !date.includes('+') && !date.includes('-')) {
    // Basic check for ISO string without timezone indicator
    if (date.includes('T')) {
      dateObj = `${date}Z`;
    }
  }

  return toZonedTime(dateObj, LOCAL_TIMEZONE);
};

/**
 * Converts a local Date object (from UI components) to a UTC string for API payload.
 */
export const toUtcString = (localDate: Date): string => {
  if (!localDate) return '';
  const utcDate = fromZonedTime(localDate, LOCAL_TIMEZONE);
  return utcDate.toISOString();
};

/**
 * Shifts schedule hours based on a provided timezone config (e.g. "UTC").
 * Useful for displaying dailyStartHour/dailyEndHour on the frontend.
 */
export const applyScheduleTimezone = (hour: number, minute: number, sourceTz: string = 'UTC'): { hour: number; minute: number } => {
  // Create a dummy date today with the given hour/minute in the source timezone
  const todayStr = new Date().toISOString().split('T')[0];
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
  const tzSuffix = sourceTz === 'UTC' ? 'Z' : ''; 
  
  const d = new Date(`${todayStr}T${timeStr}${tzSuffix}`);
  const localD = toZonedTime(d, LOCAL_TIMEZONE);
  
  return {
    hour: localD.getHours(),
    minute: localD.getMinutes()
  };
};

/**
 * Reverse of applyScheduleTimezone. 
 * Takes local hour/minute from UI and converts to target timezone (e.g. UTC) for API payload.
 */
export const extractScheduleTimezone = (localHour: number, localMinute: number): { hour: number; minute: number } => {
  const d = new Date();
  d.setHours(localHour, localMinute, 0, 0);
  
  const targetD = fromZonedTime(d, LOCAL_TIMEZONE);
  
  return {
    hour: targetD.getUTCHours(), // Use getUTCHours since we want the UTC time parts
    minute: targetD.getUTCMinutes()
  };
};

/**
 * Combines a UTC date string with specific UTC hours and minutes.
 * Useful when the date portion and time portion are stored separately (like startDate and dailyStartHour).
 */
export const getCombinedDateTimeStr = (dateString?: string, hourUtc?: number | null, minuteUtc?: number | null): string | undefined => {
  if (!dateString) return undefined;
  const d = new Date(dateString);
  if (hourUtc != null && minuteUtc != null) {
    d.setUTCHours(hourUtc, minuteUtc, 0, 0);
  }
  return d.toISOString();
};
