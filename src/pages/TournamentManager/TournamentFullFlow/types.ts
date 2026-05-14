export type TournamentFlowMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface TournamentFlowEndpoint {
  method: TournamentFlowMethod;
  path: string;
  noteKey?: string;
  auto?: boolean;
}

export interface TournamentFlowStep {
  id?: string;
  title?: string;
  description?: string;
  endpoints: TournamentFlowEndpoint[];
  autoTriggers?: string[];
  prerequisiteLabels?: string[];
}
