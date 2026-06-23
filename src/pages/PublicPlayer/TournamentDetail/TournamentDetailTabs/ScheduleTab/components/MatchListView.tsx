import { useTranslation } from "react-i18next";
import { Clock, Users, Calendar, Hash } from "lucide-react";
import { format } from "date-fns";

interface MatchListViewProps {
  schedules: any[];
}

export default function MatchListView({ schedules }: MatchListViewProps) {
  const { t } = useTranslation();

  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-xl border-border bg-card/50">
        <Calendar className="w-8 h-8 mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">{t("publicPlayer.tournamentDetail.scheduleTab.noMatches", "No matches found.")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {schedules.map((schedule) => {
        const match = schedule.scheduledMatches?.[0];
        if (!match) return null;

        const entryA = match.entryA?.name || "TBD";
        const entryB = match.entryB?.name || "TBD";
        const isCompleted = match.status === "completed";
        const isInProgress = match.status === "in_progress";
        const timeFormatted = schedule.scheduledAt 
            ? format(new Date(schedule.scheduledAt), "MMM dd, yyyy - HH:mm") 
            : "TBD";

        let badgeClass = "bg-secondary text-secondary-foreground";
        if (isCompleted) badgeClass = "bg-primary/20 text-primary";
        if (isInProgress) badgeClass = "bg-chart-2/20 text-chart-2";

        return (
          <div key={schedule.id} className="flex flex-col p-5 border shadow-sm rounded-xl border-border bg-card hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${badgeClass}`}>
                {t(`constants.status.match.${match.status}`, match.status) as string}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                <Hash className="w-3.5 h-3.5" />
                <span>Table {schedule.tableNumber || "TBD"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
              <span className="capitalize">{schedule.stage}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{schedule.groupName || schedule.knockoutRound || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between flex-1 p-4 mb-4 border rounded-lg bg-secondary/20 border-border/50">
              <div className="flex flex-col items-center flex-1 text-center">
                <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-primary/10 text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-semibold text-foreground line-clamp-2">{entryA}</span>
              </div>
              
              <div className="px-4 text-xs font-bold text-muted-foreground/50">VS</div>
              
              <div className="flex flex-col items-center flex-1 text-center">
                <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-chart-3/10 text-chart-3">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-semibold text-foreground line-clamp-2">{entryB}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 mt-auto text-xs font-medium border-t text-muted-foreground border-border/50">
              <Clock className="w-3.5 h-3.5 text-primary/70" />
              <span>{timeFormatted}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
