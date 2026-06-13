import { Calendar, Clock, Coffee, PlayCircle } from "lucide-react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import type { ScheduleConfigResponse } from "@/types/scheduleConfig.types";

interface PublicScheduleViewProps {
  config: ScheduleConfigResponse;
}

export default function PublicScheduleView({ config }: PublicScheduleViewProps) {
  const formatTime = (hour: number | null | undefined, minute: number | null | undefined) => {
    if (hour == null || minute == null) return "N/A";
    const h = hour.toString().padStart(2, "0");
    const m = minute.toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const registrationStart = config?.registrationStartDate ? new Date(config.registrationStartDate) : undefined;
  const registrationEnd = config?.registrationEndDate ? new Date(config.registrationEndDate) : undefined;
  const bracketDate = config?.bracketGenerationDate ? new Date(config.bracketGenerationDate) : undefined;
  const eventStart = config?.startDate ? new Date(config.startDate) : undefined;
  const eventEnd = config?.endDate ? new Date(config.endDate) : undefined;

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
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Text Dates */}
        <div className="flex-1 space-y-6">
          {/* Tournament Dates */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Tournament Dates</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span className="font-medium">{formatDate(config.startDate)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">End Date</span>
                <span className="font-medium">{formatDate(config.endDate)}</span>
              </div>
            </div>
          </div>

          {/* Registration Dates */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <PlayCircle className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Registration Period</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Opens</span>
                <span className="font-medium">{formatDate(config.registrationStartDate)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Closes</span>
                <span className="font-medium">{formatDate(config.registrationEndDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The visual calendar */}
        <div className="shrink-0 rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center lg:w-[350px]">
          <CalendarUI
            mode="multiple"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            defaultMonth={registrationStart || eventStart || new Date()}
            className="rounded-md border p-3 bg-background"
          />
          <div className="mt-6 flex flex-col gap-3 text-sm font-medium w-full">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 flex-shrink-0 rounded-full bg-blue-100 border border-blue-300 dark:bg-blue-900 dark:border-blue-700" />
              <span>Registration Period</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 flex-shrink-0 rounded-full bg-yellow-100 border border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700" />
              <span>Bracket Generation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 flex-shrink-0 rounded-full bg-green-100 border border-green-300 dark:bg-green-900 dark:border-green-700" />
              <span>Event Dates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Schedule Timeline */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-secondary/20">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Daily Schedule Format
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Standard format for match days during the tournament.
          </p>
        </div>
        
        <div className="p-6">
          <div className="relative border-l-2 border-primary/30 pl-8 ml-4 space-y-8">
            {/* Start Time */}
            <div className="relative">
              <div className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">
                  {formatTime(config.dailyStartHour, config.dailyStartMinute)}
                </span>
                <span className="font-semibold text-primary">Matches Begin</span>
                <span className="text-sm text-muted-foreground mt-1">
                  Each match is scheduled for {config.matchDurationMinutes} minutes, with a {config.breakDurationMinutes}-minute break between matches.
                </span>
              </div>
            </div>

            {/* Lunch Break */}
            {config.lunchBreakStartHour !== null && (
              <div className="relative">
                <div className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-secondary ring-4 ring-background">
                  <Coffee className="h-3 w-3 text-secondary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-foreground">
                    {formatTime(config.lunchBreakStartHour, config.lunchBreakStartMinute)} - {formatTime(config.lunchBreakEndHour, config.lunchBreakEndMinute)}
                  </span>
                  <span className="font-semibold text-secondary-foreground">Lunch Break</span>
                  <span className="text-sm text-muted-foreground mt-1">
                    Play pauses for {config.lunchBreakDurationMinutes} minutes.
                  </span>
                </div>
              </div>
            )}

            {/* End Time */}
            <div className="relative">
              <div className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground ring-4 ring-background">
                <div className="h-2 w-2 rounded-full bg-background" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">
                  {formatTime(config.dailyEndHour, config.dailyEndMinute)}
                </span>
                <span className="font-semibold text-muted-foreground">End of Play</span>
                <span className="text-sm text-muted-foreground mt-1">
                  All matches for the day must conclude by this time.
                </span>
              </div>
            </div>
          </div>
          
          {config.notes && (
            <div className="mt-8 rounded-xl bg-secondary/30 p-4 border border-secondary/50">
              <h4 className="font-semibold text-sm mb-1">Additional Notes</h4>
              <p className="text-sm text-muted-foreground">{config.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
