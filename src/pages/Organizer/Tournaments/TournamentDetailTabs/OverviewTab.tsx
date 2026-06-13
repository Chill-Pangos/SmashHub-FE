import {
  LayoutGrid,
  Trophy,
  Users,
  Calendar,
  Clock,
  CalendarRange
} from "lucide-react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import type { Tournament } from "@/types/tournament.types";
import type { ScheduleConfigData } from "./ScheduleConfig/ScheduleConfig";

interface OverviewTabProps {
  tournament: Tournament;
  scheduleConfig?: ScheduleConfigData;
}

export default function OverviewTab({ tournament, scheduleConfig }: OverviewTabProps) {
  const totalEntries =
    tournament.categories?.reduce(
      (sum, cat) => sum + (cat.maxEntries || 0),
      0,
    ) || 0;

  const formatTypes = Array.from(
    new Set(tournament.categories?.map((c) => c.type) || []),
  ).join(", ");

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const registrationStart = scheduleConfig?.registrationStartDate ? new Date(scheduleConfig.registrationStartDate) : undefined;
  const registrationEnd = scheduleConfig?.registrationEndDate ? new Date(scheduleConfig.registrationEndDate) : undefined;
  const bracketDate = scheduleConfig?.bracketGenerationDate ? new Date(scheduleConfig.bracketGenerationDate) : undefined;
  const eventStart = scheduleConfig?.startDate ? new Date(scheduleConfig.startDate) : undefined;
  const eventEnd = scheduleConfig?.endDate ? new Date(scheduleConfig.endDate) : undefined;

  const modifiers: any = {};
  if (registrationStart) {
    modifiers.registration = registrationEnd ? { from: registrationStart, to: registrationEnd } : [registrationStart];
  }
  if (bracketDate) {
    modifiers.bracket = [bracketDate];
  }
  if (eventStart) {
    modifiers.event = eventEnd ? { from: eventStart, to: eventEnd } : [eventStart];
  }

  const modifiersClassNames = {
    registration: "bg-blue-100 text-blue-900 font-bold dark:bg-blue-900 dark:text-blue-100 rounded-md",
    bracket: "bg-yellow-100 text-yellow-900 font-bold dark:bg-yellow-900 dark:text-yellow-100 rounded-md",
    event: "bg-green-100 text-green-900 font-bold dark:bg-green-900 dark:text-green-100 rounded-md",
  };

  return (
    <div className="space-y-6">
      {/* Overview Info Section */}
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
              {scheduleConfig?.numberOfTables ?? tournament.numberOfTables ?? 0}
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

      {/* Dates Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side: 3 time periods combined into 1 larger card */}
        <div className="flex-1 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Tournament Timeline</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground/50" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Registration
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  Start: {formatDateTime(scheduleConfig?.registrationStartDate)}
                </span>
                <span className="text-sm font-medium">
                  End: {formatDateTime(scheduleConfig?.registrationEndDate)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground/50" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Bracket Gen
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold tracking-tight">
                  {formatDate(scheduleConfig?.bracketGenerationDate)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4 text-primary/50" />
                <span className="text-xs font-medium uppercase tracking-wider text-primary">
                  Event Dates
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  Start: {formatDate(scheduleConfig?.startDate)}
                </span>
                <span className="text-sm font-medium">
                  End: {formatDate(scheduleConfig?.endDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The visual calendar */}
        <div className="shrink-0 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col items-center justify-center">
          <CalendarUI
            mode="multiple"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            defaultMonth={registrationStart || eventStart || new Date()}
            className="rounded-md border p-3 bg-background"
          />
          <div className="mt-4 flex flex-col gap-2 text-xs font-medium px-2 w-full max-w-[250px]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 flex-shrink-0 rounded-full bg-blue-100 border border-blue-300 dark:bg-blue-900 dark:border-blue-700" />
              <span>Registration Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 flex-shrink-0 rounded-full bg-yellow-100 border border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700" />
              <span>Bracket Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 flex-shrink-0 rounded-full bg-green-100 border border-green-300 dark:bg-green-900 dark:border-green-700" />
              <span>Event Dates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
