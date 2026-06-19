import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useAvailableReferees, useInviteReferee } from "@/hooks/queries";
import { useTranslation } from "react-i18next";

interface InviteRefereeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteMode: "chief" | "referee";
  tournamentId: number;
}

export function InviteRefereeModal({
  open,
  onOpenChange,
  inviteMode,
  tournamentId,
}: InviteRefereeModalProps) {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const isChiefMode = inviteMode === "chief";

  const { data, isLoading } = useAvailableReferees(tournamentId, page, limit, inviteMode, searchQuery, {
    enabled: open,
  });

  const availableReferees = data?.referees || [];
  const pagination = data?.pagination;

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const inviteMutation = useInviteReferee();

  const handleSelect = (id: number) => {
    if (isChiefMode) {
      setSelectedIds([id]);
    } else {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    }
  };

  const handleSendInvitations = async () => {
    try {
      for (const refId of selectedIds) {
        await inviteMutation.mutateAsync({
          tournamentId,
          refereeId: refId,
          role: inviteMode,
        });
      }
      onOpenChange(false);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border shadow-auth-surface-shadow">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {isChiefMode ? t('tournamentManager.refereeManagement.inviteChiefTitle', 'Invite Chief Referee') : t('tournamentManager.refereeManagement.inviteRefereesTitle', 'Invite Referees')}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isChiefMode
              ? t('tournamentManager.refereeManagement.inviteChiefDesc', 'Select a high-clearance official to lead the tournament.')
              : t('tournamentManager.refereeManagement.inviteRefereesDesc', 'Select personnel to send tournament invitations.')}
          </p>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('tournamentManager.refereeManagement.searchNameEmail', 'Search by name or email...')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 bg-input border-border focus-visible:ring-primary"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary">
              {t('tournamentManager.refereeManagement.search', 'Search')}
            </Button>
          </div>

          <div className="text-sm font-medium text-foreground">
            {t('tournamentManager.refereeManagement.availableRefereesCount', 'Available: {{count}}').replace('{{count}}', pagination?.total?.toString() || availableReferees.length.toString())}
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {isLoading && <p className="text-center text-sm text-muted-foreground">{t('tournamentManager.refereeManagement.loading', 'Loading...')}</p>}
            {!isLoading && availableReferees.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">{t('tournamentManager.refereeManagement.noAvailableReferees', 'No available referees found.')}</p>
            )}
            {!isLoading && availableReferees.map((ref) => {
              const name = `${ref.firstName} ${ref.lastName}`;
              return (
                <div
                  key={ref.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => handleSelect(ref.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedIds.includes(ref.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedIds.includes(ref.id) && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                      )}
                    </div>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                        {name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ref.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                {t('tournamentManager.refereeManagement.showing', 'Showing')} {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} {t('tournamentManager.refereeManagement.to', 'to')} {Math.min(pagination.page * pagination.limit, pagination.total)} {t('tournamentManager.refereeManagement.of', 'of')} {pagination.total}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="h-8 text-xs"
                >
                  {t('tournamentManager.refereeManagement.previous', 'Previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  className="h-8 text-xs"
                >
                  {t('tournamentManager.refereeManagement.next', 'Next')}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {isChiefMode
              ? t('tournamentManager.refereeManagement.singleSelectionChief', 'Single selection required for Chief position')
              : t('tournamentManager.refereeManagement.refereeSelected', '{{count}} Referee Selected').replace('{{count}}', selectedIds.length.toString())}
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground"
            >
              {t('tournamentManager.refereeManagement.cancel', 'Cancel')}
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={selectedIds.length === 0 || inviteMutation.isPending}
              onClick={handleSendInvitations}
            >
              {inviteMutation.isPending ? t('tournamentManager.refereeManagement.sending', 'Sending...') : t('tournamentManager.refereeManagement.sendInvitations', 'Send invitations')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
