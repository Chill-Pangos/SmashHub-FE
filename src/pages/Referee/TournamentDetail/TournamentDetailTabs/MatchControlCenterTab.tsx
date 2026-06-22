import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMatchesByCategory, useStartMatch, useBulkStartMatches, useTournamentCategoriesByTournament } from '@/hooks/queries';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { showToast, showApiError } from "@/utils/toast.utils";

export default function MatchControlCenterTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tournamentId } = useParams();

  const { data: categoriesData, isLoading: categoriesLoading } = useTournamentCategoriesByTournament(Number(tournamentId), 1, 50);
  const categories = categoriesData || [];
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [resultStatusFilter, setResultStatusFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<string>("10");
  const [selectedMatchIds, setSelectedMatchIds] = useState<Set<number>>(new Set());
  const [isBulkStartDialogOpen, setIsBulkStartDialogOpen] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId === "all") {
      if (categories[0]?.id) setSelectedCategoryId(String(categories[0].id));
    }
  }, [categories, selectedCategoryId]);

  const { data: categoryMatchesData, isLoading: matchesLoading } = useMatchesByCategory(
    selectedCategoryId === "all" ? 0 : Number(selectedCategoryId), 
    { 
      page, 
      limit: Number(limit),
      ...(stageFilter !== "all" ? { stage: stageFilter } : {}),
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(resultStatusFilter !== "all" ? { resultStatus: resultStatusFilter } : {})
    }, 
    { enabled: selectedCategoryId !== "all" }
  );

  const matches = categoryMatchesData?.matches || [];
  const pagination = categoryMatchesData?.pagination;
  const isLoading = categoriesLoading || matchesLoading;
  
  const startMatchMutation = useStartMatch();
  const bulkStartMutation = useBulkStartMatches();

  const groupedMatches = matches.reduce((acc: any, match: any) => {
    const round = match.schedule?.stage === 'group' 
      ? (match.schedule?.groupName ? `Group ${match.schedule.groupName}` : 'Group Stage')
      : (match.schedule?.knockoutRound || 'Knockout Stage');
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {});

  const handleStartMatch = (id: number) => {
    startMatchMutation.mutate(id, {
      onSuccess: () => showToast.success(t("referee.matchControlCenter.startSuccess", "Match started successfully")),
      onError: (err: any) => showApiError(err, t("referee.matchControlCenter.startError", "Failed to start match")),
    });
  };

  const handleBulkStartClick = () => {
    if (selectedMatchIds.size === 0) return;
    setIsBulkStartDialogOpen(true);
  };

  const handleConfirmBulkStart = () => {
    const matchIds = Array.from(selectedMatchIds);
    bulkStartMutation.mutate({ matchIds }, {
      onSuccess: () => {
        showToast.success(t("referee.matchControlCenter.bulkStartSuccess", "Bulk start successful"));
        setSelectedMatchIds(new Set());
        setIsBulkStartDialogOpen(false);
      },
      onError: (err: any) => {
        showApiError(err, t("referee.matchControlCenter.bulkStartError", "Failed to bulk start matches"));
        setIsBulkStartDialogOpen(false);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex items-end justify-between bg-card p-4 rounded-xl border border-border shadow-auth-surface-shadow">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">{t("referee.matchControlCenter.category", "Category")}</label>
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("referee.matchControlCenter.allCategories", "All Categories")} />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 && <SelectItem value="all">{t("referee.matchControlCenter.allCategories", "All Categories")}</SelectItem>}
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">{t("referee.matchControlCenter.stage", "Stage")}</label>
            <Select value={stageFilter} onValueChange={(val) => { setStageFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t("referee.matchControlCenter.allStages", "All Stages")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("referee.matchControlCenter.allStages", "All Stages")}</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="knockout">Knockout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">{t("referee.matchControlCenter.status", "Status")}</label>
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("referee.matchControlCenter.allStatuses", "All Statuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("referee.matchControlCenter.allStatuses", "All Statuses")}</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">{t("referee.matchControlCenter.resultStatus", "Result Status")}</label>
            <Select value={resultStatusFilter} onValueChange={(val) => { setResultStatusFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("referee.matchControlCenter.anyResult", "Any Result")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("referee.matchControlCenter.anyResult", "Any Result")}</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleBulkStartClick}
            disabled={bulkStartMutation.isPending || selectedMatchIds.size === 0}
            className="shadow-[var(--auth-primary-glow)]"
          >
            {t("referee.matchControlCenter.bulkStart", "Bulk Start")} ({selectedMatchIds.size})
          </Button>

          <AlertDialog open={isBulkStartDialogOpen} onOpenChange={setIsBulkStartDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("referee.matchControlCenter.bulkStartTitle", "Confirm Bulk Start")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("referee.matchControlCenter.confirmBulkStart", "Are you sure you want to start the selected matches?")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={bulkStartMutation.isPending}>{t("common.cancel", "Cancel")}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={(e) => {
                    e.preventDefault();
                    handleConfirmBulkStart();
                  }} 
                  disabled={bulkStartMutation.isPending}
                >
                  {bulkStartMutation.isPending ? t("common.processing", "Processing...") : t("common.continue", "Continue")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {isLoading && <div className="p-4 text-muted-foreground">{t("referee.matchControlCenter.loading", "Loading matches...")}</div>}
      {!isLoading && matches.length === 0 && <div className="p-4 text-muted-foreground">{t("referee.matchControlCenter.noMatches", "No matches found.")}</div>}

      {/* Match Cards */}
      <div className="flex flex-col gap-8">
        {Object.entries(groupedMatches).map(([roundName, roundMatches]: [string, any]) => (
          <div key={roundName} className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2 px-2">
              <h3 className="text-lg font-bold text-foreground">{roundName}</h3>
              <div className="flex items-center gap-2">
                 <Checkbox 
                   id={`select-all-${roundName.replace(/\s+/g, '-')}`}
                   checked={roundMatches.filter((m: any) => m.status === 'scheduled').length > 0 && roundMatches.filter((m: any) => m.status === 'scheduled').every((m: any) => selectedMatchIds.has(m.id))}
                   onCheckedChange={(checked) => {
                     const newSet = new Set(selectedMatchIds);
                     const sched = roundMatches.filter((m: any) => m.status === 'scheduled');
                     if (checked) {
                       sched.forEach((m: any) => newSet.add(m.id));
                     } else {
                       sched.forEach((m: any) => newSet.delete(m.id));
                     }
                     setSelectedMatchIds(newSet);
                   }}
                   disabled={roundMatches.filter((m: any) => m.status === 'scheduled').length === 0}
                 />
                 <label htmlFor={`select-all-${roundName.replace(/\s+/g, '-')}`} className="text-sm font-semibold leading-none cursor-pointer">
                   {t("referee.matchControlCenter.selectAllRound", "Select Round")}
                 </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roundMatches.map((match: any) => {
                const player1 = match.entryA?.team?.name || match.entryA?.name || "Player 1";
                const player2 = match.entryB?.team?.name || match.entryB?.name || "Player 2";
                const category = match.schedule?.tournamentCategory?.name || t("referee.matchControlCenter.unknownCategory", "Unknown Category");
                const court = match.schedule?.tableNumber ? `${t("referee.matchControlCenter.court", "Court")} ${match.schedule.tableNumber}` : t("referee.matchControlCenter.tbd", "TBD");
                const isReady = match.status === 'scheduled';
                const scheduleTime = match.schedule?.scheduledAt ? new Date(match.schedule.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : t("referee.matchControlCenter.tbdTime", "Time TBD");
                
                let refereesText = t("referee.matchControlCenter.tbd", "TBD");
                if (match.matchReferees && match.matchReferees.length > 0) {
                  const umpireId = match.subMatches?.[0]?.umpireId;
                  const assistantUmpireId = match.subMatches?.[0]?.assistantUmpireId;
                  
                  const umpire = match.matchReferees.find((r: any) => r.refereeId === umpireId);
                  const assistant = match.matchReferees.find((r: any) => r.refereeId === assistantUmpireId);
                  
                  if (umpire || assistant) {
                    const parts = [];
                    if (umpire) parts.push(`Umpire: ${umpire.referee?.firstName || ''} ${umpire.referee?.lastName || ''}`.trim());
                    if (assistant) parts.push(`Asst: ${assistant.referee?.firstName || ''} ${assistant.referee?.lastName || ''}`.trim());
                    refereesText = parts.join(' | ');
                  } else {
                    refereesText = match.matchReferees.map((r: any) => `${r.referee?.firstName || ''} ${r.referee?.lastName || ''}`.trim()).join(', ');
                  }
                } else if (match.umpire) {
                  refereesText = `${match.umpire}`;
                }

                return (
                  <div key={match.id} className={`bg-card border ${selectedMatchIds.has(match.id) ? 'border-primary shadow-[0_0_10px_var(--auth-primary-glow)]' : 'border-border'} rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-200`}>
                    <div className="flex justify-between items-center text-xs font-bold text-muted-foreground tracking-wider">
                      <div className="flex items-center gap-2">
                        {isReady && (
                          <Checkbox 
                            checked={selectedMatchIds.has(match.id)}
                            onCheckedChange={(checked) => {
                              const newSet = new Set(selectedMatchIds);
                              if (checked) newSet.add(match.id);
                              else newSet.delete(match.id);
                              setSelectedMatchIds(newSet);
                            }}
                          />
                        )}
                        <span>{t("referee.matchControlCenter.matchNumber", "MATCH #")}{match.id} • {category}</span>
                      </div>
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
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" /> {t("referee.matchControlCenter.ref", "Ref:")} {refereesText}
                        </p>
                        <p className="text-[10px] font-semibold text-muted-foreground">
                          {scheduleTime} • {court}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/referee/matches/${match.id}`)}
                        >
                          {t("referee.matchControlCenter.openExecution", "Execution")}
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleStartMatch(match.id)}
                          disabled={startMatchMutation.isPending || !isReady}
                          variant={isReady ? "default" : "secondary"}
                          className={isReady ? "shadow-[var(--auth-primary-glow)]" : ""}
                        >
                          {isReady ? t("referee.matchControlCenter.startMatch", "Start") : t("referee.matchControlCenter.prepMatch", "Prep")}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-2 px-2">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled={!pagination?.hasPrevPage} onClick={() => setPage(p => Math.max(1, p - 1))}>
            {t("common.prev", "Prev")}
          </Button>
          <span className="text-sm font-semibold">{t("common.page", "Page")} {pagination?.page || page} / {pagination?.totalPages || 1}</span>
          <Button variant="secondary" size="sm" disabled={!pagination?.hasNextPage} onClick={() => setPage(p => p + 1)}>
            {t("common.next", "Next")}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-muted-foreground">{t("common.perPage", "Per Page")}:</label>
          <Select value={limit} onValueChange={(val) => { setLimit(val); setPage(1); }}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}