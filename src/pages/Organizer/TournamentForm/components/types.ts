export interface TournamentData {
  // Step 1
  name: string;
  tier: string;
  location: string;
  startDate: string;
  endDate: string;
  category: {
    format: string;
    maxEntries: number;
    pointSystem: string;
  };
  // Step 2
  schedule: {
    activeTables: number;
    matchDurationMinutes: number;
    dailyStartTime: string; // Format: "HH:mm"
    dailyEndTime: string;
    hasBreak: boolean;
    breakStartTime: string;
    breakDurationMinutes: number;
    notes: string;
  };
}

export interface StepProps {
  data: TournamentData;
  updateData: (fields: Partial<TournamentData>) => void;
  onNext?: () => void;
  onBack?: () => void;
}