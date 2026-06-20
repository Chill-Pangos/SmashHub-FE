import { useState } from "react";
import { Search, Shield, ChevronRight, UserPlus, Settings, LogOut, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tournament, TournamentCategory } from "@/types/tournament.types";
import { useMyEntries, useEntriesByCategory, useConfirmLineup, useMyEntryRole } from "@/hooks/queries/useEntryQueries";
import { usePaymentsByEntry } from "@/hooks/queries/usePaymentQueries";
import { showToast, showApiError } from "@/utils/toast.utils";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/store/useAuth";


interface RegistrationTabProps {
  tournamentId: number;
  tournament: Tournament;
  onNavigateToPayment?: () => void;
}

export default function RegistrationTab({ tournamentId, tournament, onNavigateToPayment }: RegistrationTabProps) {
  const { t } = useTranslation();
  const categories = tournament?.categories || [];
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categories.length > 0 ? (categories[0].id || null) : null
  );

  const { data: myEntriesData, isLoading: isLoadingMyEntries } = useMyEntries();


  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Check if user already has an entry for the selected category
  const myEntryWithRoleRaw = myEntriesData?.rows?.find(
    (row: any) => {
      const catId = row.entry ? row.entry.categoryId : row.categoryId;
      return catId === selectedCategoryId;
    }
  );

  const myEntryWithRole = myEntryWithRoleRaw 
    ? (myEntryWithRoleRaw.entry ? myEntryWithRoleRaw : { entry: myEntryWithRoleRaw, role: myEntryWithRoleRaw.role || "member" })
    : undefined;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {t("publicPlayer.tournamentDetail.registrationTab.registerNow", "Đăng ký thi đấu")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("publicPlayer.tournamentDetail.registrationTab.selectCategory")}
        </p>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id || null)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg border whitespace-nowrap transition-colors ${
                selectedCategoryId === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-secondary/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {isLoadingMyEntries ? (
        <div className="py-10 text-center text-muted-foreground animate-pulse">
          {t("publicPlayer.tournamentDetail.registrationTab.checkingStatus")}
        </div>
      ) : !selectedCategory ? (
        <div className="py-10 text-center text-muted-foreground">
          {t("publicPlayer.tournamentDetail.registrationTab.noCategorySelected")}
        </div>
      ) : myEntryWithRole ? (
        <ManageEntryView entryWithRole={myEntryWithRole} category={selectedCategory} onNavigateToPayment={onNavigateToPayment} />
      ) : (
        <SearchAndJoinTeamView category={selectedCategory} tournamentId={tournamentId} />
      )}
    </div>
  );
}

function ManageEntryView({ entryWithRole, category, onNavigateToPayment }: { entryWithRole: any, category: TournamentCategory, onNavigateToPayment?: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { entry, role: initialRole } = entryWithRole;
  
  const { data: roleData } = useMyEntryRole(entry.id);
  const role = roleData?.role || initialRole || "member";
  
  const isCaptain = role === "captain" || category.type === "single" || entry.captainId === user?.id;

  const confirmLineupMutation = useConfirmLineup();

  // Payment status for this entry
  const { data: paymentsResponse } = usePaymentsByEntry(entry.id, 1, 5);
  const latestPayment = paymentsResponse?.data?.rows?.[0];
  const paymentStatus = latestPayment?.status;

  const handleConfirmLineup = () => {
    confirmLineupMutation.mutate(entry.id, {
      onSuccess: () => {
        showToast.success(t("publicPlayer.tournamentDetail.registrationTab.lineupConfirmSuccess", "Lineup confirmed successfully"));
        onNavigateToPayment?.();
      },
      onError: (err: any) => {
        showApiError(err, t("publicPlayer.tournamentDetail.registrationTab.lineupConfirmError", "Failed to confirm lineup"));
      }
    });
  };

  const paymentStatusBadge = () => {
    if (!paymentStatus) return null;
    const config: Record<string, { color: string; label: string }> = {
      pending: { color: "text-orange-500 bg-orange-500/10 border-orange-500/20", label: t("publicPlayer.paymentTab.statusPending", "Payment Pending") },
      completed: { color: "text-green-500 bg-green-500/10 border-green-500/20", label: t("publicPlayer.paymentTab.statusCompleted", "Payment Confirmed") },
      failed: { color: "text-destructive bg-destructive/10 border-destructive/20", label: t("publicPlayer.paymentTab.statusFailed", "Payment Rejected") },
      refunded: { color: "text-blue-500 bg-blue-500/10 border-blue-500/20", label: t("publicPlayer.paymentTab.statusRefunded", "Refunded") },
    };
    const info = config[paymentStatus];
    if (!info) return null;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${info.color}`}>
        <CreditCard className="w-3 h-3" />
        {info.label}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-primary">{t("publicPlayer.tournamentDetail.registrationTab.yourEntry")}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t("publicPlayer.tournamentDetail.categories").replace("ies", "y")}: {category.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {paymentStatusBadge()}
          <div className="px-3 py-1 rounded bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
            {role}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("publicPlayer.entryRegistration.teamName", "Entry Name / Team")}</p>
          <p className="text-lg font-medium">{entry.name || "N/A"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("publicPlayer.tournamentDetail.registrationTab.status")}</p>
          <p className="text-lg font-medium flex items-center gap-2">
            {entry.isConfirmed ? (
              <span className="text-green-500 flex items-center gap-1">
                <Shield className="w-4 h-4" /> {t("publicPlayer.tournamentDetail.registrationTab.confirmed")}
              </span>
            ) : (
              <span className="text-orange-500">{t("publicPlayer.tournamentDetail.registrationTab.pendingConfirmation")}</span>
            )}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("publicPlayer.tournamentDetail.registrationTab.members")}</p>
          <p className="text-lg font-medium">{entry.currentMemberCount} / {entry.requiredMemberCount || category.maxEntries}</p>
        </div>
        {entry.captain && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("publicPlayer.tournamentDetail.registrationTab.captain")}</p>
            <p className="text-lg font-medium">{entry.captain.firstName} {entry.captain.lastName}</p>
          </div>
        )}
      </div>

      {isCaptain && (
        <div className="pt-4 border-t border-border mt-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("publicPlayer.tournamentDetail.registrationTab.captainActions")}</h4>
          <div className="flex flex-wrap gap-3">
            {category.type !== "single" && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <UserPlus className="w-4 h-4" /> {t("publicPlayer.tournamentDetail.registrationTab.inviteMember")}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <Settings className="w-4 h-4" /> {t("publicPlayer.tournamentDetail.registrationTab.editTeam")}
                </button>
              </>
            )}
            {!entry.isConfirmed ? (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                onClick={handleConfirmLineup}
                disabled={confirmLineupMutation.isPending}
              >
                {confirmLineupMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                {t("publicPlayer.tournamentDetail.registrationTab.confirmLineup", "Confirm Lineup")}
              </button>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {t("publicPlayer.tournamentDetail.registrationTab.lineupConfirmed", "Lineup Confirmed")}
              </span>
            )}
            <button className="flex items-center gap-2 px-4 py-2 border border-destructive/50 text-destructive rounded-lg text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors ml-auto">
              <LogOut className="w-4 h-4" /> {t("publicPlayer.tournamentDetail.registrationTab.leaveTeam")}
            </button>
          </div>
        </div>
      )}
      {!isCaptain && (
        <div className="pt-4 border-t border-border mt-6 flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 border border-destructive/50 text-destructive rounded-lg text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors">
            <LogOut className="w-4 h-4" /> {t("publicPlayer.tournamentDetail.registrationTab.leaveTeam")}
          </button>
        </div>
      )}
    </div>
  );
}

function SearchAndJoinTeamView({ category, tournamentId }: { category: TournamentCategory, tournamentId: number }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: teamsData, isLoading } = useEntriesByCategory(category.id || 0, 1, 50, { isAcceptingMembers: true });
  
  // Create a placeholder for single/double registration if it's not a team format
  const isTeamFormat = category.type !== 'single';

  return (
    <div className="space-y-6">
      {isTeamFormat && (
        <div className="flex justify-between items-center bg-primary/10 border border-primary/20 rounded-xl p-4">
          <div>
            <h3 className="font-bold text-primary">{t("publicPlayer.tournamentDetail.registrationTab.needTeam")}</h3>
            <p className="text-sm text-primary/80 mt-1">{t("publicPlayer.tournamentDetail.registrationTab.joinExisting")}</p>
          </div>
          <button
            onClick={() => navigate(`/tournaments/${tournamentId}/register`)}
            className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            {t("publicPlayer.tournamentDetail.registrationTab.createTeam")}
          </button>
        </div>
      )}

      {!isTeamFormat && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
          <h3 className="font-bold text-lg text-primary mb-2">{t("publicPlayer.tournamentDetail.registrationTab.registerSingles")}</h3>
          <p className="text-sm text-primary/80 mb-4">{t("publicPlayer.tournamentDetail.registrationTab.notRegistered")}</p>
          <button
            onClick={() => navigate(`/tournaments/${tournamentId}/register`)}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            {t("publicPlayer.tournamentDetail.registrationTab.registerNow")}
          </button>
        </div>
      )}

      {isTeamFormat && (
        <>
          <div className="flex items-center justify-between mt-8 mb-4">
            <h3 className="text-lg font-bold">{t("publicPlayer.tournamentDetail.registrationTab.recruitingTeams")}</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search teams..."
                className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground animate-pulse">
              {t("publicPlayer.tournamentDetail.registrationTab.findingTeams")}
            </div>
          ) : !teamsData?.rows || teamsData.rows.length === 0 ? (
            <div className="py-10 text-center border border-border rounded-xl bg-card">
              <p className="text-muted-foreground">{t("publicPlayer.tournamentDetail.registrationTab.noRecruitingTeams")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamsData.rows.map((team: any) => (
                <div key={team.id} className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold truncate pr-2">{team.name}</h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-1 rounded tracking-wider border bg-primary/10 text-primary border-primary/20 shrink-0">
                        {t("publicPlayer.tournamentDetail.registrationTab.recruiting")}
                      </span>
                    </div>

                    <div className="rounded-lg bg-secondary/50 p-3 flex items-center gap-3 border border-border">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("publicPlayer.tournamentDetail.registrationTab.captain")}
                        </span>
                        <span className="font-semibold text-sm truncate">
                          {team.captain?.firstName} {team.captain?.lastName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-muted-foreground">{t("publicPlayer.tournamentDetail.registrationTab.roster")}</span>
                      <span className="text-foreground">
                        {team.currentMemberCount} / {team.requiredMemberCount || category.maxEntries}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/tournaments/${tournamentId}/register`)}
                      className="w-full py-2 mt-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      {t("publicPlayer.tournamentDetail.registrationTab.requestToJoin")}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
