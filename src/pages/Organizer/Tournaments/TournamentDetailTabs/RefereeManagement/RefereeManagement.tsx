import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Medal, Search, UserPlus, Users } from "lucide-react";
import { InviteRefereeModal, RefereeCard } from "./components";
import { useRefereesByTournament, useTournamentRefereeInvitations } from "@/hooks/queries";
import type { RefereeDisplay } from "./components/RefereeCard";
import { useTranslation } from "react-i18next";

interface RefereeManagementProps {
  tournamentId: number;
}

export default function RefereeManagement({
  tournamentId,
}: RefereeManagementProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteMode, setInviteMode] = useState<"chief" | "referee">("referee");
  const [search, setSearch] = useState("");

  const { data: refsData } = useRefereesByTournament(tournamentId);
  const { data: invData } = useTournamentRefereeInvitations(tournamentId);

  const allDisplays = useMemo(() => {
    const list: RefereeDisplay[] = [];
    if (refsData?.referees) {
      refsData.referees.forEach(r => {
        list.push({ id: r.id, user: r.referee, status: "CONFIRMED", role: r.role });
      });
    }
    if (invData?.invitations) {
      invData.invitations.filter(i => i.status === "pending").forEach(i => {
        list.push({ id: i.id, user: i.referee, status: "PENDING", role: i.role });
      });
    }
    return list;
  }, [refsData, invData]);

  const chiefReferee = allDisplays.find(r => r.role === "chief");
  const assistantReferees = allDisplays.filter(r => r.role === "referee" && (
    r.user?.firstName.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.lastName.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.email.toLowerCase().includes(search.toLowerCase())
  ));

  const handleOpenInvite = (mode: "chief" | "referee") => {
    setInviteMode(mode);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t('tournamentManager.refereeManagement.title', 'Referees')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('tournamentManager.refereeManagement.subtitle', 'Manage tournament officials and assign roles.')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('tournamentManager.refereeManagement.tournamentId', 'Tournament #{{id}}').replace('{{id}}', tournamentId.toString())}
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-auth-icon-shadow"
          onClick={() => handleOpenInvite("referee")}
        >
          <UserPlus className="mr-2 h-4 w-4" /> {t('tournamentManager.refereeManagement.inviteReferee', 'INVITE REFEREE')}
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground font-medium">
          {t('tournamentManager.refereeManagement.description', 'Assign a chief referee and manage assistant referees for this tournament.')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Medal className="h-5 w-5 text-chart-4" />
          <h3 className="text-lg font-bold text-foreground">{t('tournamentManager.refereeManagement.chiefReferee', 'Chief Referee')}</h3>
          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-bold">
            {t('tournamentManager.refereeManagement.max1', 'MAX 1')}
          </span>
        </div>

        {chiefReferee ? (
          <RefereeCard referee={chiefReferee} isChief />
        ) : (
          <div
            onClick={() => handleOpenInvite("chief")}
            className="flex flex-col items-center justify-center py-8 bg-auth-ghost-bg border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-auth-ghost-bg-hover transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-3">
              <span className="text-xl text-muted-foreground">+</span>
            </div>
            <p className="font-bold text-foreground">{t('tournamentManager.refereeManagement.assignChiefReferee', 'Assign Chief Referee')}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('tournamentManager.refereeManagement.assignChiefDesc', 'Select a primary official to oversee tournament rules.')}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground">
              {t('tournamentManager.refereeManagement.assistantReferees', 'Assistant Referees')}
            </h3>
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-bold">
              {t('tournamentManager.refereeManagement.assignedInvited', '{{count}} ASSIGNED/INVITED').replace('{{count}}', assistantReferees.length.toString())}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('tournamentManager.refereeManagement.searchPlaceholder', 'Search officials...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assistantReferees.map((ref) => (
            <RefereeCard key={ref.id} referee={ref} />
          ))}
          {assistantReferees.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-2">{t('tournamentManager.refereeManagement.noRefereesFound', 'No referees found.')}</p>
          )}
        </div>
      </div>

      <InviteRefereeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        inviteMode={inviteMode}
        tournamentId={tournamentId}
      />
    </div>
  );
}
