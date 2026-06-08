import {
  AlertTriangle,
  Info,
  LayoutGrid,
  Trophy,
  Users,
} from "lucide-react";
import type { Tournament } from "@/types/tournament.types";

interface OverviewTabProps {
  tournament: Tournament;
}

export default function OverviewTab({ tournament }: OverviewTabProps) {
  const totalEntries =
    tournament.categories?.reduce(
      (sum, cat) => sum + (cat.maxEntries || 0),
      0,
    ) || 0;

  const formatTypes = Array.from(
    new Set(tournament.categories?.map((c) => c.type) || []),
  ).join(", ");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Max Entries
            </span>
            <Users className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">
              {totalEntries.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-xs font-medium text-chart-3">
            ~ Based on {tournament.categories?.length || 0} categories
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Format Details
            </span>
            <Trophy className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold tracking-tight capitalize">
              {formatTypes || "N/A"}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary" style={{ width: "100%" }}></div>
          </div>
          <div className="mt-2 text-right text-xs font-medium text-muted-foreground">
            Tier {tournament.tier ?? "-"} Event
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Facility Setup
            </span>
            <LayoutGrid className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">
              {tournament.numberOfTables ?? 0}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              Tables
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
              Group Stage:{" "}
              {tournament.categories?.some((c) => c.isGroupStage)
                ? "Yes"
                : "No"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              Critical Alerts
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive">
                    Court 4 Net Sensor Malfunction
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Maintenance dispatched. Estimated resolution in 15 mins.
                  </p>
                </div>
              </div>
              <button className="shrink-0 rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
                Acknowledge
              </button>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-transparent p-4">
              <Info className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground">
                  Schedule Delay: Men's Pro Singles
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Matches running approx 20 mins behind schedule due to
                  tie-breakers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

