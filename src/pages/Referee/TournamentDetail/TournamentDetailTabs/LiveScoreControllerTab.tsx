import { useState, useEffect } from 'react';
import { useRefereeMatches, useTournamentCategoriesByTournament } from '@/hooks/queries';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDateFormat } from "@/hooks/useDateFormat";
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/queries/useAuthQueries';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/utils/api.utils";

export default function LiveScoreControllerTab() {
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormat();
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const { data: userData } = useCurrentUser();
  const currentUserId = userData?.id;

  const { data: categoriesData, isLoading: categoriesLoading } = useTournamentCategoriesByTournament(Number(tournamentId), 1, 50);
  const categories = categoriesData || [];
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);

  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId === "") {
      if (categories[0]?.id) setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const { data: activeMatchesData, isLoading: matchesLoading } = useRefereeMatches(
    { categoryId: Number(selectedCategoryId) || undefined, status: 'in_progress', page, limit },
    { enabled: true }
  );
  
  const matches = activeMatchesData?.matches || [];
  const pagination: any = activeMatchesData;

  const isLoading = categoriesLoading || matchesLoading;

  if (isLoading) {
    return <div className="text-muted-foreground p-10 text-center border border-dashed border-border rounded-xl">{t("referee.liveScoreController.loading", "Loading assigned matches...")}</div>
  }

  if (matches.length === 0) {
    return <div className="text-muted-foreground p-10 text-center border border-dashed border-border rounded-xl">{t("referee.liveScoreController.noActiveMatches", "No active matches assigned to you at the moment.")}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex justify-end mb-2">
        <div className="flex flex-col gap-1.5 w-64">
          <label className="text-xs font-semibold text-muted-foreground">{t("referee.liveScoreController.category", "Category")}</label>
          <select 
            className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary"
            value={selectedCategoryId}
            onChange={(e) => { setSelectedCategoryId(Number(e.target.value)); setPage(1); }}
          >
            <option value="">{t("referee.liveScoreController.allCategories", "All Categories")}</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Match Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {matches.map((match: any) => {
          const p1Name = match.entryA?.team?.name || match.entryA?.name || "Player 1";
          const p2Name = match.entryB?.team?.name || match.entryB?.name || "Player 2";
          const categoryName = match.schedule?.tournamentCategory?.name || "Unknown";
          const court = match.schedule?.tableNumber ? `${t("referee.matchControlCenter.court", "Court")} ${match.schedule.tableNumber}` : t("referee.matchControlCenter.tbd", "TBD");
          const scheduleTime = match.schedule?.scheduledAt ? formatDateTime(match.schedule.scheduledAt) : t("referee.matchControlCenter.tbdTime", "Time TBD");

          const umpireId = match.subMatches?.[0]?.umpireId;
          const assistantId = match.subMatches?.[0]?.assistantUmpireId;
          const isUmpire = umpireId === currentUserId;
          const isAssistant = assistantId === currentUserId;
          
          let roleText = isUmpire ? t("referee.matchControlCenter.umpire", "Umpire") : isAssistant ? t("referee.matchControlCenter.assistant", "Assistant") : t("referee.referee", "Referee");
          
          return (
            <div key={match.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {match.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-secondary text-foreground px-2 py-1 rounded font-semibold whitespace-nowrap">
                    {categoryName}
                  </span>
                  <span className={`text-[10px] px-2 py-1 rounded font-semibold uppercase ${isUmpire ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-500'}`}>
                    {roleText}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <Avatar className="w-12 h-12 border border-border flex-shrink-0">
                    <AvatarImage src={getImageUrl(match.entryA?.team?.avatarUrl || match.entryA?.avatarUrl || "")} alt={p1Name} />
                    <AvatarFallback className="bg-secondary text-lg font-bold">{p1Name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-sm text-center truncate w-full">{p1Name}</p>
                </div>
                <div className="px-4 text-muted-foreground font-black italic text-lg flex-shrink-0">VS</div>
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <Avatar className="w-12 h-12 border border-border flex-shrink-0">
                    <AvatarImage src={getImageUrl(match.entryB?.team?.avatarUrl || match.entryB?.avatarUrl || "")} alt={p2Name} />
                    <AvatarFallback className="bg-secondary text-lg font-bold">{p2Name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-sm text-center truncate w-full">{p2Name}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-semibold text-muted-foreground">
                    {scheduleTime} • {court}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/referee/matches/${match.id}`)}
                    className={isUmpire ? "shadow-[var(--auth-primary-glow)]" : ""}
                    variant={isUmpire ? "default" : "secondary"}
                  >
                    {isUmpire ? t("referee.liveScoreController.execute", "Execute") : t("referee.liveScoreController.viewMatch", "View Info")}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 p-4 bg-card border border-border rounded-xl">
          <span className="text-sm text-muted-foreground">
            {t("common.page", "Page")} {pagination.page} {t("common.of", "of")} {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t("common.previous", "Previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage(p => p + 1)}
            >
              {t("common.next", "Next")}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}