import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTournamentCategoriesByTournament, useEligibleEntriesByCategory } from "@/hooks/queries";
import { useCurrentUser } from "@/hooks/queries/useAuthQueries";
import { useTranslation } from "react-i18next";
import { Users, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/utils/api.utils";
import { useUser } from "@/hooks/queries/useUserQueries";

function ParticipantCard({ entry, currentUser, t }: { entry: any, currentUser: any, t: any }) {
  // Call API for captain details
  const { data: user } = useUser(entry.captainId, { enabled: !!entry.captainId });

  const isMe =
    currentUser &&
    ((entry.userId && entry.userId === currentUser.id) ||
     (entry.captainId === currentUser.id) ||
     (entry.members && entry.members.some((m: any) => m.userId === currentUser.id)));

  const eloScoreObj = user?.eloScore as any;
  const elo = (eloScoreObj?.score ?? eloScoreObj) || entry.members?.[0]?.eloAtEntry || 0;

  return (
    <div className="flex items-center gap-4 p-4 border border-border bg-card rounded-xl hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden">
      {isMe && (
        <div className="absolute top-0 right-0">
          <Badge variant="default" className="rounded-none rounded-bl-lg text-[10px] px-2 py-0">
            {t("constants.you", "Bạn")}
          </Badge>
        </div>
      )}
      <Avatar className="w-12 h-12 border border-border shadow-sm">
        <AvatarImage src={getImageUrl(user?.avatarUrl || "")} alt={entry.name} />
        <AvatarFallback className="bg-secondary text-primary font-bold text-lg">
          {entry.name ? entry.name.charAt(0) : <Users className="w-5 h-5" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-foreground truncate text-base">{entry.name}</span>
        {user && entry.requiredMemberCount > 1 && (
          <span className="text-xs text-muted-foreground truncate">
            {t('publicPlayer.tournamentDetail.participantsTab.captain', 'Captain')}: {user.firstName} {user.lastName}
          </span>
        )}
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 mt-0.5">
          <TrendingUp className="w-3 h-3 text-cyan-500" /> ELO: <span className="text-foreground">{elo}</span>
        </span>
      </div>
    </div>
  );
}

interface ParticipantsTabProps {
  tournamentId: number;
}

export default function ParticipantsTab({ tournamentId }: ParticipantsTabProps) {
  const { t } = useTranslation();
  const { data: currentUser } = useCurrentUser();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);

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
              {t('publicPlayer.tournamentDetail.participantsTab.category', 'Category')}
            </label>
            <Select value={selectedCategoryId} onValueChange={(val) => { setSelectedCategoryId(val); setPage(1); }}>
              <SelectTrigger className="w-[200px] bg-input border-border text-foreground">
                <SelectValue placeholder={t('publicPlayer.tournamentDetail.participantsTab.selectCategory', 'Select Category')} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                ))}
                {categories.length === 0 && <SelectItem value="all" disabled>{t('publicPlayer.tournamentDetail.participantsTab.noCategories', 'No categories')}</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {t('publicPlayer.tournamentDetail.participantsTab.limit', 'Items per page')}
            </label>
            <Select value={limit.toString()} onValueChange={(val) => { setLimit(parseInt(val, 10)); setPage(1); }}>
              <SelectTrigger className="w-[120px] bg-input border-border text-foreground">
                <SelectValue placeholder="12" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8 px-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('publicPlayer.tournamentDetail.participantsTab.totalParticipants', 'Total Participants')}
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
            {t('publicPlayer.tournamentDetail.participantsTab.loading', 'Loading participants...')}
          </p>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col h-40 items-center justify-center border border-dashed border-border rounded-xl bg-card/50">
          <Users className="w-8 h-8 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            {t('publicPlayer.tournamentDetail.participantsTab.noParticipants', 'No participants found in this category.')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry: any) => (
              <ParticipantCard key={entry.id} entry={entry} currentUser={currentUser} t={t} />
            ))}
          </div>
          
          {entriesData?.pagination && entriesData.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!entriesData.pagination.hasPrevPage}
                >
                  {t('constants.previous', 'Previous')}
                </Button>
                <span className="flex items-center px-4 text-sm font-medium text-muted-foreground">
                  {page} / {entriesData.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(entriesData.pagination.totalPages, p + 1))}
                  disabled={!entriesData.pagination.hasNextPage}
                >
                  {t('constants.next', 'Next')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
