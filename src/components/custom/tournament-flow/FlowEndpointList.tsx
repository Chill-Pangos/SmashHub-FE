import { Badge } from "@/components/ui/badge";
import type { TournamentFlowEndpoint } from "./types";

interface FlowEndpointListProps {
  endpoints: TournamentFlowEndpoint[];
  noteResolver: (key: string) => string;
  autoLabel: string;
}

const methodVariantMap: Record<TournamentFlowEndpoint["method"], string> = {
  GET: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  POST: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  PUT: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  PATCH: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  DELETE: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export default function FlowEndpointList({
  endpoints,
  noteResolver,
  autoLabel,
}: FlowEndpointListProps) {
  return (
    <div className="space-y-2">
      {endpoints.map((endpoint) => (
        <div
          key={`${endpoint.method}-${endpoint.path}`}
          className="rounded-md border bg-background px-3 py-2"
        >
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge className={methodVariantMap[endpoint.method]}>
              {endpoint.method}
            </Badge>
            <span className="font-mono text-xs sm:text-sm break-all">
              {endpoint.path}
            </span>
            {endpoint.auto ? (
              <Badge variant="outline" className="ml-auto">
                {autoLabel}
              </Badge>
            ) : null}
          </div>
          {endpoint.noteKey ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {noteResolver(endpoint.noteKey)}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
