import { useRefereesByTournament } from "@/hooks/queries/useTournamentRefereeQueries";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/utils/api.utils";

interface RefereesTabProps {
  tournamentId: number;
}

export default function RefereesTab({ tournamentId }: RefereesTabProps) {
  const { t } = useTranslation();
  const { data: refereesData, isLoading } = useRefereesByTournament(tournamentId, 1, 50);
  const referees = (refereesData as any)?.rows || [];

  return (
    <div className="space-y-6 text-foreground font-sans min-h-[50vh]">
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground animate-pulse">
            {t('referee.tournamentDetail.loadingReferees', 'Loading referees...')}
          </p>
        </div>
      ) : referees.length === 0 ? (
        <div className="flex flex-col h-40 items-center justify-center border border-dashed border-border rounded-xl bg-card/50">
          <Users className="w-8 h-8 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            {t('referee.tournamentDetail.noReferees', 'No referees assigned.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {referees.map((referee: any) => (
            <div key={referee.id} className="flex items-center gap-4 p-4 border border-border bg-card rounded-xl hover:border-primary/50 transition-colors shadow-sm">
              <Avatar className="w-12 h-12 border border-border shadow-sm">
                <AvatarImage src={getImageUrl(referee.user?.avatarUrl || "")} alt={referee.user?.firstName || "Referee"} />
                <AvatarFallback className="bg-secondary text-primary font-bold text-lg">
                  {referee.user?.firstName ? referee.user.firstName.charAt(0) : <Users className="w-5 h-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-foreground truncate text-base">
                  {referee.user?.firstName} {referee.user?.lastName}
                </span>
                <span className="text-xs text-muted-foreground truncate uppercase font-semibold">
                  {t(`constants.roles.${referee.role}`, referee.role) as string}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
