export type TournamentFlowPhaseId =
  | "setup"
  | "registration"
  | "preparation"
  | "execution"
  | "completion";

export type FlowHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface TournamentFlowEndpoint {
  method: FlowHttpMethod;
  path: string;
  noteKey?: string;
  auto?: boolean;
}

export interface TournamentFlowStep {
  id: string;
  titleKey: string;
  descriptionKey: string;
  actorKey: string;
  endpoints: TournamentFlowEndpoint[];
  prerequisites?: string[];
  autoTriggers?: string[];
  tipKey?: string;
}

export interface TournamentFlowPhase {
  id: TournamentFlowPhaseId;
  titleKey: string;
  descriptionKey: string;
  colorClass: string;
  steps: TournamentFlowStep[];
}
