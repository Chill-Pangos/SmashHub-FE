export interface TournamentFlowEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  noteKey?: string;
  auto?: boolean;
}

export interface TournamentFlowStep {
  endpoints: TournamentFlowEndpoint[];
}
