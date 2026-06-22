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

export interface LiveScore {
  subMatchId: number;
  setNumber: number;
  entryAScore: number;
  entryBScore: number;
  updatedBy?: number;
  updatedAt?: string;
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
export interface GetMatchSetsByMatchResponse {
  message: string;
  subMatchId: number;
  count: number;
  sets: MatchSet[];
}

export interface GetLiveScoreResponse {
  liveScore: LiveScore | null;
}
export type UpdateMatchSetResponse = MatchSet;
export type DeleteMatchSetResponse = void;
export interface UpdateLiveScoreResponse {
  message: string;
  liveScore: any | null;
  isCompleted: boolean;
  persistedSet?: MatchSet;
  nextSetNumber: number;
  subMatchReadyToFinalize?: boolean;
  winningTeam?: string;
  finalizationNotice?: any;
}
export type SubmitFinalScoreResponse = MatchSet;
