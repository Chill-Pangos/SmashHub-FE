import { useState, useEffect } from 'react';
import { useMatchesByCategory, useTournamentCategoriesByTournament } from '@/hooks/queries';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from "react-i18next";

export default function ScheduleTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tournamentId } = useParams();

  const { data: categoriesData, isLoading: categoriesLoading } = useTournamentCategoriesByTournament(Number(tournamentId), 1, 50);
  const categories = categoriesData || [];
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");

  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId === "") {
      if (categories[0]?.id) setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const { data: categoryMatchesData, isLoading: matchesLoading } = useMatchesByCategory(
    Number(selectedCategoryId), 
    { page: 1, limit: 100 }, 
    { enabled: !!selectedCategoryId }
  );

  const matches = categoryMatchesData?.matches || [];
  const isLoading = categoriesLoading || matchesLoading;


  if (isLoading) {
    return <div className="p-6 text-muted-foreground">{t("referee.scheduleTab.loading", "Loading schedule...")}</div>;
  }

  return (
    <div className="rounded-2xl border border-border/30 bg-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t("referee.scheduleTab.title", "Match Schedule")}</h2>
        <select 
          className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
        >
          {categories.length === 0 && <option value="">{t("referee.scheduleTab.allCategories", "All Categories")}</option>}
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      
      {matches.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">{t("referee.scheduleTab.noMatches", "No matches scheduled.")}</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match: any) => {
            const player1 = match.entryA?.team?.name || "Player 1";
            const player2 = match.entryB?.team?.name || "Player 2";
            const category = match.schedule?.tournamentCategory?.name || "Category";

            return (
              <div 
                key={match.id} 
                className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-primary">{t("referee.scheduleTab.matchNumber", "Match #")}{match.id}</span>
                    <Badge variant="outline">{category}</Badge>
                    <Badge>{t(`constants.status.match.${match.status}`, match.status) as string}</Badge>
                  </div>
                  <p className="font-semibold flex items-center">
                    <span className={match.winnerEntryId === match.entryAId ? "text-yellow-500" : ""}>{player1}</span>
                    {match.status === "completed" && match.setsWonA !== undefined && (
                      <span className="text-lg font-bold ml-2">{match.setsWonA}</span>
                    )}
                    <span className="text-muted-foreground mx-4">{t("referee.scheduleTab.vs", "vs")}</span> 
                    {match.status === "completed" && match.setsWonB !== undefined && (
                      <span className="text-lg font-bold mr-2">{match.setsWonB}</span>
                    )}
                    <span className={match.winnerEntryId === match.entryBId ? "text-yellow-500" : ""}>{player2}</span>
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
