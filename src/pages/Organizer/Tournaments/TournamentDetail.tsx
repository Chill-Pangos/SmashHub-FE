import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTournament } from "@/hooks/queries"; // Đảm bảo đường dẫn này đúng với project của bạn
import scheduleConfigService from "@/services/scheduleConfig.service";

import { Calendar, MapPin } from "lucide-react";
import {
  EntriesManagement,
  OverviewTab,
  RefereeManagement,
  ScheduleConfig,
  ScheduleTab,
  PaymentManagement,
} from "@/pages/Organizer/Tournaments/TournamentDetailTabs";



export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const id = tournamentId ? parseInt(tournamentId, 10) : 0;

  // Lấy data từ hook API
  const {
    data: apiData,
    isLoading: apiLoading,
    error: apiError,
  } = useTournament(id);

  const tournament = apiData;
  const isLoading = apiLoading;
  const error = apiError;

  const { data: scheduleConfig } = useQuery({
    queryKey: ['schedule-config', id],
    queryFn: () => scheduleConfigService.getScheduleConfigByTournament(id),
    enabled: !!id,
  });

  // State cho Tabs
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = [
    "Overview",
    "Referees",
    "Entries",
    "Payments",
    "Schedule",
    "Schedule Config",
  ];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center rounded-2xl border border-border bg-card">
        <p className="text-muted-foreground animate-pulse">
          Loading tournament details...
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

  // Format ngày tháng (VD: Oct 15 - Oct 18, 2026)
  const formatEventDate = (start?: string, end?: string) => {
    if (!start || !end) return "TBD";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", { ...options, year: "numeric" })}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab tournament={tournament} scheduleConfig={scheduleConfig} />;
      case "Referees":
        return <RefereeManagement tournamentId={id} />;
      case "Entries":
        return <EntriesManagement tournamentId={id} />;
      case "Payments":
        return <PaymentManagement tournamentId={id} />;
      case "Schedule":
        return <ScheduleTab tournamentId={id} tournament={tournament} />;
      case "Schedule Config":
        return <ScheduleConfig tournamentId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. HEADER SECTION */}
      <div className="space-y-4">
        {/* Status & ID Badge */}
        <div className="flex items-center gap-3">
          <span className="rounded bg-primary px-2 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            {tournament.status}
          </span>
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
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>
              {formatEventDate(scheduleConfig?.startDate, scheduleConfig?.endDate)}
            </span>
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
              className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${activeTab === tab
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
