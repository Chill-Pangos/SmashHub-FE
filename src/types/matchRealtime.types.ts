import type { MatchStatus, MatchResultStatus } from "./match.types";

export type MatchRealtimeEventType =
  | "match_started"
  | "sub_match_players_assigned"
  | "sub_match_started"
  | "live_score_updated"
  | "set_created"
  | "set_score_updated"
  | "set_deleted"
  | "sub_match_finalized"
  | "match_result_submitted"
  | "match_result_approved";

export interface RealtimeMatchData {
  id: number;
  scheduleId: number;
  entryAId: number;
  entryBId: number;
  status: MatchStatus;
  winnerEntryId?: number | null;
  resultStatus?: MatchResultStatus;
}

export interface RealtimeSubMatchPlayer {
  id: number;
  subMatchId: number;
  entryMemberId: number;
  team: "A" | "B";
}

export interface RealtimeSubMatchData {
  id: number;
  matchId: number;
  subMatchNumber: number;
  status: string;
  winnerTeam?: "A" | "B" | null;
  umpireId?: number | null;
  assistantUmpireId?: number | null;
}

export interface RealtimeLiveScoreData {
  subMatchId: number;
  setNumber: number;
  entryAScore: number;
  entryBScore: number;
  updatedBy: number;
  updatedAt: string;
}

export interface RealtimeSetData {
  id: number;
  subMatchId: number;
  setNumber: number;
  entryAScore: number;
  entryBScore: number;
}

export type MatchRealtimePayloadData =
  | {
    // match_started | match_result_submitted | match_result_approved
    match: RealtimeMatchData;
  }
  | {
    // sub_match_players_assigned
    subMatchId: number;
    players: RealtimeSubMatchPlayer[];
  }
  | {
    // sub_match_started
    subMatch: RealtimeSubMatchData;
  }
  | {
    // sub_match_finalized
    subMatch: RealtimeSubMatchData;
    matchReadyToFinalize: boolean;
  }
  | {
    // live_score_updated
    liveScore: RealtimeLiveScoreData;
  }
  | {
    // set_created | set_score_updated | set_deleted
    set: RealtimeSetData;
  };

export type MatchRealtimePayload = {
  roomId: `match:${number}`;
  matchId: number;
  type: MatchRealtimeEventType;
  data: MatchRealtimePayloadData;
  occurredAt: string;
};
