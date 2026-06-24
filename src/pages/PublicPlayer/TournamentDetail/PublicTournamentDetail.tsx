import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTournament, useScheduleConfigByTournament } from "@/hooks/queries";
import { Calendar, MapPin, AlertCircle } from "lucide-react";
import { OverviewTab, ScheduleTab } from "@/pages/PublicPlayer/TournamentDetail/TournamentDetailTabs";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "@/hooks/useDateFormat";

export default function PublicTournamentDetail() {
  const { t } = useTranslation();
  const { tournamentId } = useParams();
  const { formatDate } = useDateFormat();
  const id = tournamentId ? parseInt(tournamentId, 10) : 0;

  const { data: tournament, isLoading: isTournamentLoading, error: tournamentError } = useTournament(id);
  const { data: scheduleConfig } = useScheduleConfigByTournament(id, { enabled: !!id });

  const [activeTab, setActiveTab] = useState(t("publicPlayer.tournamentDetail.overview", "Overview"));
  const tabs = [t("publicPlayer.tournamentDetail.overview", "Overview"), t("publicPlayer.tournamentDetail.scheduleTab.title", "Schedule")];

  if (isTournamentLoading) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="flex h-[40vh] items-center justify-center rounded-2xl border border-border bg-card">
          <p className="text-muted-foreground animate-pulse">{t("publicPlayer.tournamentDetail.loading")}</p>
        </div>
      </div>
    );
  }

  if (tournamentError || !tournament) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="flex flex-col h-[40vh] items-center justify-center rounded-2xl border border-destructive/20 bg-card p-6">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <p className="text-destructive font-medium text-lg">
            {tournamentError?.message || "Failed to load tournament"}
          </p>
        </div>
      </div>
    );
  }

  const formatEventDate = (start?: string, end?: string) => {
    if (!start && !end) return "TBD";
    
    if (start && end) {
      return `${formatDate(start)} - ${formatDate(end)}`;
    } else if (start) {
      return formatDate(start);
    }
    
    return "TBD";
  };

  const renderTabContent = () => {
    if (activeTab === t("publicPlayer.tournamentDetail.overview", "Overview")) {
      return <OverviewTab tournament={tournament} scheduleConfig={scheduleConfig || undefined} />;
    }
    if (activeTab === t("publicPlayer.tournamentDetail.scheduleTab.title", "Schedule")) {
      return <ScheduleTab tournamentId={id} tournament={tournament} scheduleConfig={scheduleConfig || undefined} />;
    }
    return null;
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl space-y-8 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary ring-1 ring-primary/20">{t(`constants.status.tournament.${tournament.status}`, tournament.status) as string}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ID: TRN-{new Date(tournament.createdAt).getFullYear()}-{tournament.id.toString().padStart(3, "0")}
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {tournament.name}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-base font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary/70" />
            <span>{formatEventDate(scheduleConfig?.startDate || tournament.startDate, scheduleConfig?.endDate || tournament.endDate)}</span>
          </div>
          <div className="h-5 w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary/70" />
            <span>{tournament.location}</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-border mt-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-1 pb-4 text-base font-medium transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
