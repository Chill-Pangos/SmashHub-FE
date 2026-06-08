
// ==================== Match Set ====================

/**
 * Match Set interface
 */
export interface MatchSet {
  id: number;
  matchId: number;
  setNumber: number;
  entryAScore: number;
  entryBScore: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== Request Types ====================

/**
 * Create match set request
 */
export interface CreateMatchSetRequest {
  matchId: number;
  setNumber: number;
  entryAScore: number;
  entryBScore: number;
}

/**
 * Create match set with score request (recommended)
 */
export interface CreateMatchSetWithScoreRequest {
  matchId: number;
  entryAScore: number;
  entryBScore: number;
}

/**
 * Update match set request
 */
export interface UpdateMatchSetRequest {
  setNumber?: number;
  entryAScore?: number;
  entryBScore?: number;
}

// ==================== Response Types ====================

/**
 * Create match set response
 */
export type CreateMatchSetResponse = MatchSet;
export type GetMatchSetResponse = MatchSet;
export type GetMatchSetsResponse = { rows: MatchSet[]; count: number };
export type GetMatchSetsByMatchResponse = { sets: MatchSet[]; pagination: any }; // subMatchId
export type UpdateMatchSetResponse = MatchSet;
export type DeleteMatchSetResponse = void;
export type CreateMatchSetWithScoreResponse = MatchSet;
