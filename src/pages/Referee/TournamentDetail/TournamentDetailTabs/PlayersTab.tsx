import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTournamentCategoriesByTournament, useEligibleEntriesByCategory } from "@/hooks/queries";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/utils/api.utils";

interface PlayersTabProps {
  tournamentId: number;
}

export default function PlayersTab({ tournamentId }: PlayersTabProps) {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const limit = 50;

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

  const entries = entriesData?.eligible || [];

  return (
    <div className="space-y-6 text-foreground font-sans min-h-[50vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
        <div className="flex gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {t('tournamentManager.entriesManagement.category', 'Category')}
            </label>
            <Select value={selectedCategoryId} onValueChange={(val) => { setSelectedCategoryId(val); setPage(1); }}>
              <SelectTrigger className="w-[200px] bg-input border-border text-foreground">
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
            <p className="text-2xl font-bold text-foreground">
              {entriesData?.pagination?.total || entries.length || 0}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground animate-pulse">
            {t('tournamentManager.entriesManagement.loadingEntries', 'Loading entries...')}
          </p>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col h-40 items-center justify-center border border-dashed border-border rounded-xl bg-card/50">
          <Users className="w-8 h-8 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            {t('tournamentManager.entriesManagement.noEligibleEntries', 'No eligible entries.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry: any) => (
            <div key={entry.id} className="flex items-center gap-4 p-4 border border-border bg-card rounded-xl hover:border-primary/50 transition-colors shadow-sm">
              <Avatar className="w-12 h-12 border border-border shadow-sm">
                <AvatarImage src={getImageUrl(entry.team?.avatarUrl || entry.avatarUrl || "")} alt={entry.name} />
                <AvatarFallback className="bg-secondary text-primary font-bold text-lg">
                  {entry.name ? entry.name.charAt(0) : <Users className="w-5 h-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-foreground truncate text-base">{entry.name}</span>
                {entry.captain && (
                  <span className="text-xs text-muted-foreground truncate">
                    Captain: {entry.captain.firstName} {entry.captain.lastName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
