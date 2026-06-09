// ==================== Match Set ====================

/**
 * Match Set interface
 */
export interface MatchSet {
  id: number;
  matchId: number;
  subMatchId: number;
  setNumber: number;
  entryAScore: number;
  entryBScore: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== Request Types ====================

export interface CreateMatchSetRequest {
  subMatchId: number;
  entryAScore: number;
  entryBScore: number;
}

export interface UpdateLiveScoreRequest {
  subMatchId: number;
  setNumber?: number;
  entryAScore: number;
  entryBScore: number;
}

export interface SubmitFinalScoreRequest {
  subMatchId: number;
  setNumber?: number;
  entryAScore: number;
  entryBScore: number;
}

export interface UpdateMatchSetRequest {
  entryAScore: number;
  entryBScore: number;
}

// ==================== Response Types ====================

export type CreateMatchSetResponse = MatchSet;
export type GetMatchSetResponse = MatchSet;
export type GetMatchSetsResponse = { rows: MatchSet[]; count: number };
export type GetMatchSetsByMatchResponse = { sets: MatchSet[]; pagination: any };
export type UpdateMatchSetResponse = MatchSet;
export type DeleteMatchSetResponse = void;
export type UpdateLiveScoreResponse = MatchSet | { success: boolean; message: string };
export type SubmitFinalScoreResponse = MatchSet;
