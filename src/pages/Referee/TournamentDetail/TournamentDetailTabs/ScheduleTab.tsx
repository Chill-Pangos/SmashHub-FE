import { useMatches } from '@/hooks/queries';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from "react-i18next";

export default function ScheduleTab() {
  const { t } = useTranslation();
  const { data, isLoading } = useMatches(1, 100);
  const matches = data?.rows || [];
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">{t("referee.scheduleTab.loading", "Loading schedule...")}</div>;
  }

  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <h2 className="text-xl font-semibold mb-6">{t("referee.scheduleTab.title", "Match Schedule")}</h2>
      
      {matches.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">{t("referee.scheduleTab.noMatches", "No matches scheduled.")}</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            const player1 = match.entryA?.team?.name || "Player 1";
            const player2 = match.entryB?.team?.name || "Player 2";
            const category = match.schedule?.tournamentContent?.name || "Category";

            return (
              <div 
                key={match.id} 
                className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-primary">{t("referee.scheduleTab.matchNumber", "Match #")}{match.id}</span>
                    <Badge variant="outline">{category}</Badge>
                    <Badge>{match.status}</Badge>
                  </div>
                  <p className="font-semibold">
                    {player1} <span className="text-muted-foreground mx-2">{t("referee.scheduleTab.vs", "vs")}</span> {player2}
                  </p>
                </div>
                <div>
                  <Button 
                    onClick={() => navigate(`/referee/matches/${match.id}`)}
                  >
                    {t("referee.scheduleTab.matchExecution", "Match Execution")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
