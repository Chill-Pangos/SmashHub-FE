// Thêm interface này vào file định nghĩa types của component
export interface CategoryFormState {
  name: string;
  type: "single" | "double" | "team";
  maxEntries: number;
  maxSets: number;
  teamFormat: string | null;
  minAge: number | null;
  maxAge: number | null;
  minElo: number | null;
  maxElo: number | null;
  maxMembersPerEntry: number | null;
  gender: "male" | "female" | "mixed";
  isGroupStage: boolean;
  entryFee: number | string | null;
  numberOfSingles: number;
  numberOfDoubles: number;
}

export interface TournamentData {
  name: string;
  tier: number; // Chuyển thành number (1, 2, 3)
  location: string;
  startDate: string;
  endDate: string;
  categories: CategoryFormState[]; // Đổi từ category (object) sang categories (array)
  schedule: {
    activeTables: number;
    matchDurationMinutes: number;
    dailyStartTime: string;
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