// ==================== Enums ====================

/**
 * Knockout bracket status enum
 */
export type KnockoutBracketStatus =
  | "pending"
  | "ready"
  | "in_progress"
  | "completed";

// ==================== Knockout Bracket ====================

/**
 * Knockout Bracket interface
 */
export interface KnockoutBracket {
  id: number;
  contentId: number;
  categoryId?: number;
  roundNumber: number;
  bracketPosition: number;
  entryAId?: number | null;
  entryBId?: number | null;
  seedA?: number | null;
  seedB?: number | null;
  winnerEntryId?: number | null;
  nextBracketId?: number | null;
  previousBracketAId?: number | null;
  previousBracketBId?: number | null;
  scheduleId?: number | null;
  matchId?: number | null;
  roundName?: string | null;
  isByeMatch: boolean;
  status: KnockoutBracketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BracketNode {
  id: number;
  roundNumber: number;
  roundName: string;
  bracketPosition: number;
  entryA?: {
    entryId: number;
    entryName: string;
  } | null;
  entryB?: {
    entryId: number;
    entryName: string;
  } | null;
  winnerEntryId?: number | null;
  status: KnockoutBracketStatus;
  isByeMatch: boolean;
  previousBracketAId?: number | null;
  previousBracketBId?: number | null;
  nextBracketId?: number | null;
  scheduleId?: number | null;
  matchId?: number | null;
}

export interface KnockoutBracketRound {
  roundNumber: number;
  roundName: string;
  brackets: BracketNode[];
}

export interface KnockoutBracketTree {
  categoryId: number;
  totalRounds: number;
  totalBrackets: number;
  rounds: KnockoutBracketRound[];
}

export interface KnockoutStandings {
  champion?: number;
  runnerUp?: number;
  thirdPlace?: number[];
  eliminated?: {
    entryId: number;
    eliminatedAt: string;
  }[];
}
// ==================== Request Types ====================

/**
 * Create knockout bracket request
 */
export interface CreateKnockoutBracketRequest {
  contentId: number;
  categoryId?: number;
  roundNumber: number;
  bracketPosition: number;
  entryAId?: number | null;
  entryBId?: number | null;
  seedA?: number | null;
  seedB?: number | null;
  nextBracketId?: number | null;
  previousBracketAId?: number | null;
  previousBracketBId?: number | null;
  roundName?: string | null;
  isByeMatch?: boolean;
}

/**
 * Update knockout bracket request
 */
export interface UpdateKnockoutBracketRequest {
  entryAId?: number | null;
  entryBId?: number | null;
  seedA?: number | null;
  seedB?: number | null;
  winnerEntryId?: number | null;
  nextBracketId?: number | null;
  previousBracketAId?: number | null;
  previousBracketBId?: number | null;
  scheduleId?: number | null;
  matchId?: number | null;
  roundName?: string | null;
  isByeMatch?: boolean;
  status?: KnockoutBracketStatus;
}

/**
 * Generate placeholders request
 */
export interface GenerateKnockoutPlaceholdersRequest {
  categoryId: number;
}

/**
 * Fill qualifiers request
 */
export interface FillQualifiersRequest {
  categoryId: number;
}

/**
 * Generate from entries request
 */
export interface GenerateFromEntriesRequest {
  categoryId: number;
}

export interface SaveKnockoutAssignmentsRequest {
  categoryId: number;
  entryIds?: number[];
  assignments?: number[];
}

/**
 * Advance winner request
 */
export interface AdvanceWinnerRequest {
  winnerEntryId: number;
}

export interface ValidateKnockoutBracketRequest {
  categoryId?: number;
  bracketId?: number;
}

// ==================== Response Types ====================

/**
 * Advance winner response
 */
export interface AdvanceWinnerResponse {
  success: boolean;
  data: KnockoutBracket;
  message: string;
}

export interface GetKnockoutBracketTreeResponse {
  success: boolean;
  data: KnockoutBracketTree;
}

export interface GetKnockoutStandingsResponse {
  success: boolean;
  data: KnockoutStandings;
}

export interface ValidateKnockoutBracketResponse {
  success: boolean;
  data: {
    valid: boolean;
    errors?: string[];
  };
}

export interface PreviewKnockoutBracketTreeResponse {
  success: boolean;
  data: {
    entryIds?: number[];
    bracketTree?: KnockoutBracketTree;
    categoryId?: number;
    totalRounds?: number;
    totalBrackets?: number;
    rounds?: KnockoutBracketRound[];
  };
  message?: string;
}

export interface SaveKnockoutAssignmentsResponse {
  success: boolean;
  data: KnockoutBracketTree;
  message: string;
}

export interface GenerateKnockoutBracketTreeResponse {
  success: boolean;
  data: KnockoutBracketTree;
  message: string;
}

export interface GetKnockoutBracketsByEntryResponse {
  success: boolean;
  data: {
    brackets: KnockoutBracket[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
