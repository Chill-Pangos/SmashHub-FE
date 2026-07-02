import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { EntriesTable } from "./components/EntriesTable";
import { useTournamentCategoriesByTournament, useEligibleEntriesByCategory, useDisqualifyEntries } from "@/hooks/queries";
import { useTranslation } from "react-i18next";
import { showToast, showApiError } from "@/utils/toast.utils";

interface EntriesManagementProps {
  tournamentId: number;
}

export default function EntriesManagement({
  tournamentId,
}: EntriesManagementProps) {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const { data: categoriesData } = useTournamentCategoriesByTournament(tournamentId, 1, 50);
  const categories = (categoriesData as any[]) || [];

  const categoryIdToFetch = selectedCategoryId !== "all" ? parseInt(selectedCategoryId) : (categories[0]?.id || 0);

  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId === "all") {
      setSelectedCategoryId(categories[0].id.toString());
    }
  }, [categories, selectedCategoryId]);

  const { data: entriesData, isLoading } = useEligibleEntriesByCategory(categoryIdToFetch, {
    page,
    limit,
    enabled: categoryIdToFetch > 0
  });

  const disqualifyMutation = useDisqualifyEntries();

  const handleSelectAll = (checked: boolean) => {
    if (checked && entriesData?.eligible) {
      setSelectedIds(entriesData.eligible.map((e) => e.id));
    } else setSelectedIds([]);
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) setSelectedIds((prev) => [...prev, id]);
    else setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleMassDisqualify = () => {
    if (categoryIdToFetch > 0) {
      disqualifyMutation.mutate({ categoryId: categoryIdToFetch }, {
        onSuccess: () => showToast.success(t("tournamentManager.entriesManagement.disqualifySuccess", "Entries disqualified successfully")),
        onError: (err: any) => showApiError(err, t("tournamentManager.entriesManagement.disqualifyError", "Failed to disqualify entries")),
      });
    }
  };

  // Map API entries to the format expected by EntriesTable
  const mappedEntries = (entriesData?.eligible || []).map(entry => ({
    id: entry.id,
    entryIdString: `#ENT-${entry.id.toString().padStart(4, "0")}`,
    name: entry.name || t('tournamentManager.entriesManagement.na', 'N/A'),
    avatarUrl: entry.captain?.username ? undefined : undefined, // Simplification
    categoryId: entry.categoryId,
    categoryName: entry.category?.name || t('tournamentManager.entriesManagement.unknown', 'Unknown'),
    captainId: entry.captainId,
    isAcceptingMembers: entry.isAcceptingMembers,
    requiredMemberCount: entry.requiredMemberCount,
    currentMemberCount: entry.currentMemberCount,
    lineupStatus: entry.isConfirmed ? t('tournamentManager.entriesManagement.confirmed', 'CONFIRMED') : t('tournamentManager.entriesManagement.pending', 'PENDING'),
    paymentStatus: t('tournamentManager.entriesManagement.paid', 'PAID'), // Placeholder since payment isn't in Entry type directly
    members: (entry.members || []).map(m => ({
      id: m.id,
      entryId: m.entryId,
      userId: m.userId,
      eloAtEntry: m.eloAtEntry,
      avatarUrl: undefined
    })),
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  })) as any[];

  return (
    <div className="space-y-6 text-foreground font-sans bg-background min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl">
        <div className="flex gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {t('tournamentManager.entriesManagement.category', 'Category')}
            </label>
            <Select value={selectedCategoryId} onValueChange={(val) => { setSelectedCategoryId(val); setPage(1); }}>
              <SelectTrigger className="w-[180px] bg-input border-border text-foreground">
                <SelectValue placeholder={t('tournamentManager.entriesManagement.selectCategory', 'Select Category')} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                ))}
                {categories.length === 0 && <SelectItem value="all" disabled>{t('tournamentManager.entriesManagement.noCategories', 'No categories')}</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8 px-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('tournamentManager.entriesManagement.eligibleEntries', 'Eligible Entries')}
            </p>
            <p className="text-2xl font-bold text-foreground">{entriesData?.pagination?.total || entriesData?.eligible?.length || 0}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('tournamentManager.entriesManagement.ineligibleEntries', 'Ineligible Entries')}
            </p>
            <p className="text-2xl font-bold text-destructive drop-shadow-auth-primary-glow">
              {entriesData?.ineligible?.length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          variant="destructive" 
          onClick={handleMassDisqualify}
          disabled={disqualifyMutation.isPending || !entriesData?.ineligible?.length || categoryIdToFetch === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {disqualifyMutation.isPending ? t('tournamentManager.entriesManagement.disqualifying', 'Disqualifying...') : t('tournamentManager.entriesManagement.massDisqualify', 'Mass Disqualify Ineligible')}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">{t('tournamentManager.entriesManagement.loadingEntries', 'Loading entries...')}</p>
      ) : (
        <>
          <EntriesTable
            entries={mappedEntries}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
          />
          {entriesData?.pagination && entriesData.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {t('tournamentManager.entriesManagement.showing', 'Showing')} {Math.min((entriesData.pagination.page - 1) * entriesData.pagination.limit + 1, entriesData.pagination.total)} {t('tournamentManager.entriesManagement.to', 'to')} {Math.min(entriesData.pagination.page * entriesData.pagination.limit, entriesData.pagination.total)} {t('tournamentManager.entriesManagement.of', 'of')} {entriesData.pagination.total} {t('tournamentManager.entriesManagement.entries', 'entries')}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('tournamentManager.entriesManagement.perPage', 'Rows per page')}</span>
                  <Select value={limit.toString()} onValueChange={(val) => { setLimit(parseInt(val)); setPage(1); }}>
                    <SelectTrigger className="w-[70px] h-8 bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!entriesData.pagination.hasPrevPage}
                  >
                    {t('tournamentManager.entriesManagement.previous', 'Previous')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!entriesData.pagination.hasNextPage}
                  >
                    {t('tournamentManager.entriesManagement.next', 'Next')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
