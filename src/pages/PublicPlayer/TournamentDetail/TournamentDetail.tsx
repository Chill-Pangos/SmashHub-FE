import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTournament, useScheduleConfigByTournament } from "@/hooks/queries";
import { useMyEntries } from "@/hooks/queries/useEntryQueries";

import { Calendar, MapPin } from "lucide-react";
import {
  OverviewTab,
  ScheduleTab,
  RegistrationTab,
  PaymentTab,
  ParticipantsTab,
} from "@/pages/PublicPlayer/TournamentDetail/TournamentDetailTabs";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "@/hooks/useDateFormat";

export default function TournamentDetail() {
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormat();
  const { tournamentId } = useParams();
  const location = useLocation();
  const id = tournamentId ? parseInt(tournamentId, 10) : 0;

  const {
    data: tournament,
    isLoading: isTournamentLoading,
    error,
  } = useTournament(id);

  const { data: scheduleConfig, isLoading: isScheduleLoading } = useScheduleConfigByTournament(id, { enabled: !!id });
  const { data: myEntriesData, isLoading: isMyEntriesLoading } = useMyEntries();

  const isLoading = isTournamentLoading || isScheduleLoading || isMyEntriesLoading;

  // Check if user is registered for any category in this tournament
  const isRegistered = myEntriesData?.rows?.some((row: any) => {
    const catId = row.entry ? row.entry.categoryId : row.categoryId;
    return tournament?.categories?.some((c) => c.id === catId);
  });

  const hideRegistration = tournament?.status && ["registration_closed", "brackets_generated", "ongoing", "completed", "cancelled"].includes(tournament.status);

  // State cho Tabs
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || t("publicPlayer.tournamentDetail.overview", "Overview")
  );
  const tabs = [
    t("publicPlayer.tournamentDetail.overview", "Overview"),
    t("publicPlayer.tournamentDetail.scheduleTab.title", "Schedule"),
  ];

  if (!hideRegistration) {
    tabs.push(t("publicPlayer.tournamentDetail.registrationTab.title", "Registration"));
  }

  tabs.push(t("publicPlayer.tournamentDetail.participantsTab.title", "Participants"));

  if (isRegistered) {
    tabs.push(t("publicPlayer.paymentTab.title", "Payment"));
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center rounded-2xl border border-border bg-card">
        <p className="text-muted-foreground animate-pulse">
          {t("publicPlayer.tournamentDetail.loading")}
        </p>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="flex h-[50vh] items-center justify-center rounded-2xl border border-destructive/20 bg-card p-6">
        <p className="text-destructive font-medium">
          {error?.message || "Failed to load tournament"}
        </p>
      </div>
    );
  }

  // --- Hàm hỗ trợ xử lý dữ liệu ---

  // Format ngày tháng
  const formatEventDate = (start?: string, end?: string) => {
    if (!start && !end) return "TBD";
    if (start && end) {
      return `${formatDateTime(start)} - ${formatDateTime(end)}`;
    } else if (start) {
      return formatDateTime(start);
    }
    return "TBD";
  };

  const renderTabContent = () => {
    if (activeTab === t("publicPlayer.tournamentDetail.overview", "Overview")) {
      return <OverviewTab tournament={tournament} scheduleConfig={scheduleConfig} />;
    }
    if (activeTab === t("publicPlayer.tournamentDetail.scheduleTab.title", "Schedule")) {
      return <ScheduleTab tournamentId={id} tournament={tournament} scheduleConfig={scheduleConfig || undefined} />;
    }
    if (activeTab === t("publicPlayer.tournamentDetail.registrationTab.title", "Registration")) {
      return (
        <RegistrationTab 
          tournamentId={id} 
          tournament={tournament} 
          onNavigateToPayment={() => setActiveTab(t("publicPlayer.paymentTab.title", "Payment"))}
        />
      );
    }
    if (activeTab === t("publicPlayer.paymentTab.title", "Payment")) {
      return <PaymentTab tournamentId={id} tournament={tournament} />;
    }
    if (activeTab === t("publicPlayer.tournamentDetail.participantsTab.title", "Participants")) {
      return <ParticipantsTab tournamentId={id} />;
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. HEADER SECTION */}
      <div className="space-y-4">
        {/* Status & ID Badge */}
        <div className="flex items-center gap-3">
          <span className="rounded bg-primary px-2 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">{t(`constants.status.tournament.${tournament.status}`, tournament.status) as string}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ID: TRN-{new Date(tournament.createdAt).getFullYear()}-
            {tournament.id.toString().padStart(3, "0")}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {tournament.name}
        </h1>

        {/* Date & Location Info */}
        <div className="flex flex-wrap items-center gap-6 text-base font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary/70" />
            <span>{formatEventDate(scheduleConfig?.startDate || tournament.startDate, scheduleConfig?.endDate || tournament.endDate)}</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{tournament.location}</span>
          </div>
        </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
}
