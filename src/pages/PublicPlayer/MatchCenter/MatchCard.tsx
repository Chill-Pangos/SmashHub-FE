import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useTournament } from "@/hooks/queries/useTournamentQueries";
import { useDateFormat } from "@/hooks/useDateFormat";

function PlayerDisplay({ entry }: { entry: any }) {
  const { t } = useTranslation();
  
  if (!entry) {
    return (
      <div className="flex flex-col items-center gap-2 w-24">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border border-border">
          <span className="text-xs text-muted-foreground font-semibold">TBD</span>
        </div>
        <span className="text-sm font-semibold text-muted-foreground text-center line-clamp-2">
          {t("publicPlayer.matchCenter.tbd", "TBD")}
        </span>
      </div>
    );
  }

  // Display the first member or captain
  const member = entry.members?.[0]?.user;
  
  return (
    <div className="flex flex-col items-center gap-2 w-24">
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
        {member?.avatarUrl ? (
          <img src={member.avatarUrl} alt={entry.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground font-semibold">
            {entry.name?.substring(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-foreground text-center line-clamp-2" title={entry.name}>
        {entry.name}
      </span>
    </div>
  );
}

export function MatchCard({ match, isRejected, onSelect }: { match: any, isRejected: boolean, onSelect: () => void }) {
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormat();
  const category = match.schedule?.tournamentCategory;
  const tournamentId = category?.tournamentId;
  const { data: tournament } = useTournament(tournamentId as number, { enabled: !!tournamentId });

  // Get stage label
  let stageLabel = "";
  if (match.schedule?.stage === "group" && match.schedule?.groupName) {
    stageLabel = match.schedule.groupName;
  } else if (match.schedule?.knockoutRound) {
    stageLabel = `Round of ${match.schedule.knockoutRound}`; // Example: Round of 16
  }

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-cyan-500/30 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Top/Left Section: Tournament, Category & Schedule */}
        <div className="flex flex-col gap-2 w-full md:w-1/3 shrink-0">
          <span className="font-semibold text-lg text-primary line-clamp-2" title={tournament?.name}>
            {tournament?.name || t("publicPlayer.matchCenter.loadingTournament", "Tournament")}
          </span>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <Badge variant="secondary" className="text-xs font-semibold">
              {category?.name || t("publicPlayer.matchCenter.loadingCategory", "Category")}
            </Badge>
            {stageLabel && (
              <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                {stageLabel}
              </Badge>
            )}
            <span className="text-muted-foreground">
              {t("publicPlayer.matchCenter.matchId", "Match #{{id}}").replace("{{id}}", match.id)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground mt-1 font-medium bg-secondary/50 px-2 py-1 rounded w-max">
            {match.schedule?.scheduledAt
              ? formatDateTime(match.schedule.scheduledAt)
              : t("publicPlayer.matchCenter.tbd", "TBD")}
          </div>
        </div>

        {/* Middle Section: VS Matchup */}
        <div className="flex items-center justify-center gap-4 w-full md:w-auto flex-1 my-2 md:my-0">
          <PlayerDisplay entry={match.entryA} />
          <div className="flex flex-col items-center justify-center px-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-2 py-1 rounded-full">
              {t("publicPlayer.matchCenter.vs", "VS")}
            </span>
          </div>
          <PlayerDisplay entry={match.entryB} />
        </div>

        {/* Right Section: Status & Actions */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 border-border pt-4 md:pt-0">
          <div className="flex flex-col items-start md:items-end gap-2">
            <Badge variant={match.status === "scheduled" ? "outline" : "default"}>
              {t(`constants.status.match.${match.status}`, match.status) as string}
            </Badge>
            {isRejected && (
              <Badge variant="destructive">
                {t("publicPlayer.matchCenter.lineupRejected", "Lineup Rejected")}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            className={isRejected ? "border-destructive text-destructive hover:bg-destructive/10" : ""}
            onClick={onSelect}
          >
            {isRejected ? t("publicPlayer.matchCenter.resubmitLineup", "Resubmit Lineup") : t("publicPlayer.matchCenter.submitLineup", "Submit Lineup")}
          </Button>
        </div>
      </div>
    </div>
  );
}
