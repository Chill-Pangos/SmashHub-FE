
// ==================== Group Standing ====================

/**
 * Entry info nested in GroupStanding
 */
export interface GroupStandingEntry {
  id: number;
  team?: {
    id?: number;
    name: string;
  };
}

/**
 * Group Standing interface
 */
export interface GroupStanding {
  id: number;
  contentId: number;
  categoryId?: number;
  entryId: number;
  groupName: string;
  position: number | null;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  setsWon: number;
  setsLost: number;
  setsDiff: number;
  pointsWon?: number;
  pointsLost?: number;
  points?: number;
  isQualified?: boolean;
  entry?: GroupStandingEntry;
  createdAt: string;
  updatedAt: string;
}

/**
 * Group placeholder for random draw
 */
export interface GroupPlaceholder {
  groupName: string;
  slots: number;
  entryIds: number[];
}

/**
 * Group assignment for saving
 */
export interface GroupAssignment {
  groupName: string;
  entryIds: number[];
}

// ==================== Request Types ====================

/**
 * Generate placeholders request
 */
export interface GeneratePlaceholdersRequest {
  categoryId: number;
}

/**
 * Random draw request
 */
export interface RandomDrawRequest {
  categoryId: number;
}

/**
 * Save assignments request
 */
export interface SaveAssignmentsRequest {
  categoryId: number;
  groupAssignments: GroupAssignment[];
}

/**
 * Calculate standings request
 */
export interface CalculateStandingsRequest {
  categoryId: number;
  groupName?: string;
}

// ==================== Response Types ====================

/**
 * Generate placeholders response
 */
export interface GeneratePlaceholdersResponse {
  success: boolean;
  data: GroupPlaceholder[];
  message: string;
}

/**
 * Random draw response
 */
export interface RandomDrawResponse {
  success: boolean;
  data: GroupPlaceholder[];
  message: string;
}

/**
 * Save assignments response
 */
export interface SaveAssignmentsResponse {
  success: boolean;
  data: GroupStanding[];
  message: string;
}

/**
 * Calculate standings response
 */
export interface CalculateStandingsResponse {
  success: boolean;
  data: GroupStanding[];
  message: string;
}

/**
 * Get standings by content response
 */
export interface GetStandingsByContentResponse {
  success: boolean;
  data: GroupStanding[];
}

/**
 * Get qualified teams response
 */
export interface GroupQualifiers {
  groupName: string;
  qualifiers: GroupStanding[];
}

export interface GetQualifiedTeamsResponse {
  success: boolean;
  data: {
    qualifiers: GroupQualifiers[];
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

/**
 * Sync standings response
 */
export interface SyncStandingsResponse {
  success: boolean;
  message: string;
}
