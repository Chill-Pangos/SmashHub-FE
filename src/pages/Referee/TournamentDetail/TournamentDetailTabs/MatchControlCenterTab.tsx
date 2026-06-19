import { Filter, User } from 'lucide-react';
import { useMatches, useStartMatch, useBulkStartMatches } from '@/hooks/queries';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function MatchControlCenterTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useMatches(1, 100);
  const matches = data?.rows || [];
  
  const startMatchMutation = useStartMatch();
  const bulkStartMutation = useBulkStartMatches();

  const scheduledMatches = matches.filter(m => m.status === 'scheduled');

  const handleStartMatch = (id: number) => {
    startMatchMutation.mutate(id);
  };

  const handleBulkStart = () => {
    if (scheduledMatches.length === 0) return;
    const matchIds = scheduledMatches.map(m => m.id);
    if (confirm(t("referee.matchControlCenter.confirmBulkStart", "Are you sure you want to start all scheduled matches?"))) {
      bulkStartMutation.mutate({ matchIds });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex items-end justify-between bg-card p-4 rounded-xl border border-border shadow-auth-surface-shadow">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">{t("referee.matchControlCenter.category", "Category")}</label>
            <select className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary">
              <option value="">{t("referee.matchControlCenter.allCategories", "All Categories")}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">{t("referee.matchControlCenter.court", "Court")}</label>
            <select className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary">
              <option value="">{t("referee.matchControlCenter.allCourts", "All Courts")}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">{t("referee.matchControlCenter.status", "Status")}</label>
            <select className="bg-input text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-primary">
              <option value="">{t("referee.matchControlCenter.scheduled", "Scheduled")}</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleBulkStart}
            disabled={bulkStartMutation.isPending || scheduledMatches.length === 0}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors border border-transparent text-sm font-medium shadow-[var(--auth-primary-glow)] disabled:opacity-50"
          >
            {t("referee.matchControlCenter.bulkStart", "Bulk Start")}
          </button>
          <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors border border-border text-sm font-medium">
            <Filter className="w-4 h-4" /> {t("referee.matchControlCenter.moreFilters", "More Filters")}
          </button>
        </div>
      </div>

      {isLoading && <div className="p-4 text-muted-foreground">{t("referee.matchControlCenter.loading", "Loading matches...")}</div>}
      {!isLoading && matches.length === 0 && <div className="p-4 text-muted-foreground">{t("referee.matchControlCenter.noMatches", "No matches found.")}</div>}

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map(match => {
          const player1 = match.entryA?.team?.name || "Player 1";
          const player2 = match.entryB?.team?.name || "Player 2";
          const category = match.schedule?.tournamentContent?.name || t("referee.matchControlCenter.unknownCategory", "Unknown Category");
          const court = match.schedule?.tableNumber ? `${t("referee.matchControlCenter.court", "Court")} ${match.schedule.tableNumber}` : t("referee.matchControlCenter.tbd", "TBD");
          const isReady = match.status === 'scheduled';

          return (
            <div key={match.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground tracking-wider">
                <span>{t("referee.matchControlCenter.matchNumber", "MATCH #")}{match.id} • {category} • {court}</span>
                <span className={`px-2 py-1 rounded text-[10px] ${isReady ? 'bg-chart-4/20 text-chart-4' : 'bg-secondary text-secondary-foreground'}`}>
                  {match.status.toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-lg font-bold">{player1.charAt(0)}</div>
                  <div className="text-center">
                    <p className="font-bold text-sm truncate w-full">{player1}</p>
                  </div>
                </div>
                <div className="text-xl font-black text-muted-foreground w-1/3 text-center">{t("referee.matchControlCenter.vs", "VS")}</div>
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-lg font-bold">{player2.charAt(0)}</div>
                  <div className="text-center">
                    <p className="font-bold text-sm truncate w-full">{player2}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" /> {t("referee.matchControlCenter.ref", "Ref:")} {match.umpire ? `${match.umpire}` : t("referee.matchControlCenter.tbd", "TBD")}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/referee/matches/${match.id}`)}
                    className="px-4 py-2 rounded-md font-semibold text-sm transition-colors bg-secondary text-secondary-foreground hover:bg-muted border border-border"
                  >
                    {t("referee.matchControlCenter.openExecution", "Execution")}
                  </button>
                  <button 
                    onClick={() => handleStartMatch(match.id)}
                    disabled={startMatchMutation.isPending || !isReady}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${isReady ? 'bg-primary text-primary-foreground shadow-[var(--auth-primary-glow)] hover:opacity-90' : 'bg-secondary text-secondary-foreground border border-border opacity-50'}`}
                  >
                    {isReady ? t("referee.matchControlCenter.startMatch", "Start Match") : t("referee.matchControlCenter.prepMatch", "Prep Match")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}