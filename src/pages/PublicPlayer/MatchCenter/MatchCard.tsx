import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useTournament } from "@/hooks/queries/useTournamentQueries";

export function MatchCard({ match, isRejected, onSelect }: { match: any, isRejected: boolean, onSelect: () => void }) {
  const { t } = useTranslation();
  const category = match.schedule?.tournamentContent;
  const tournamentId = category?.tournamentId;
  const { data: tournament } = useTournament(tournamentId as number, { enabled: !!tournamentId });

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-1 w-full md:w-1/2">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-lg text-primary">{tournament?.name || t("publicPlayer.matchCenter.loadingTournament", "Tournament")}</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Badge variant="secondary" className="text-xs font-semibold">{category?.name || t("publicPlayer.matchCenter.loadingCategory", "Category")}</Badge>
            <span>{t("publicPlayer.matchCenter.matchId", "Match #{{id}}").replace("{{id}}", match.id)}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2 font-medium">
          {match.scheduledStartTime
            ? format(new Date(match.scheduledStartTime), "PPp")
            : t("publicPlayer.matchCenter.tbd", "TBD")}
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
        <Badge variant={match.status === "scheduled" ? "outline" : "default"}>
          {t(`constants.status.match.${match.status}`, match.status) as string}
        </Badge>
        {isRejected && (
          <Badge variant="destructive" className="ml-2">
            {t("publicPlayer.matchCenter.lineupRejected", "Lineup Rejected")}
          </Badge>
        )}
      </div>
      <div className="shrink-0">
        <Button
          variant="outline"
          onClick={onSelect}
        >
          {isRejected ? t("publicPlayer.matchCenter.resubmitLineup", "Resubmit Lineup") : t("publicPlayer.matchCenter.submitLineup", "Submit Lineup")}
        </Button>
      </div>
    </div>
  );
}
