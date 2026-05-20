import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTournament } from "@/hooks/queries"; // Đảm bảo đường dẫn này đúng với project của bạn
import type { Tournament } from "@/types/tournament.types";
import { Calendar, MapPin } from "lucide-react";
import {
  EntriesManagement,
  OverviewTab,
  RefereeManagement,
  ScheduleConfig,
  ScheduleTab,
} from "@/pages/Organizer/Tournaments/TournamentDetailTabs";

// --- MOCK DATA ---
// Gán chặt kiểu : Tournament cho biến này để TS hiểu các chuỗi là literal type ("single", "upcoming", v.v.)
const MOCK_TOURNAMENT: Tournament = {
  id: 1,
  name: "Spring Championship 2026",
  tier: 3,
  status: "upcoming",
  startDate: "2026-03-15T09:00:00Z",
  endDate: "2026-03-20T18:00:00Z",
  registrationStartDate: "2026-02-15T00:00:00Z",
  registrationEndDate: "2026-03-10T23:59:59Z",
  bracketGenerationDate: "2026-03-12T10:00:00Z",
  location: "National Stadium",
  numberOfTables: 4,
  createdBy: 5,
  createdAt: "2026-02-10T14:30:00Z",
  updatedAt: "2026-02-10T14:30:00Z",
  categories: [
    {
      id: 1,
      tournamentId: 1,
      name: "Men's Singles",
      type: "single",
      maxEntries: 32,
      maxSets: 3,
      numberOfSingles: 3,
      numberOfDoubles: 0,
      minAge: 18,
      maxAge: 65,
      minElo: 1000,
      maxElo: 2500,
      gender: "male",
      isGroupStage: false,
      createdAt: "2026-02-10T14:30:00Z",
      updatedAt: "2026-02-10T14:30:00Z",
    },
  ],
};

export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const id = tournamentId ? parseInt(tournamentId, 10) : 0;

  // Lấy data từ hook API
  const {
    data: apiData,
    isLoading: apiLoading,
    error: apiError,
  } = useTournament(id);

  // --- LOGIC OVERRIDE MOCK DATA ---
  // Nếu ID trên URL là 1, chúng ta dùng Mock Data. Nếu không, dùng API.
  const isMock = id === 1;
  const tournament = isMock ? MOCK_TOURNAMENT : apiData;
  const isLoading = isMock ? false : apiLoading;
  const error = isMock ? null : apiError;

  // State cho Tabs
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = [
    "Overview",
    "Referees",
    "Entries",
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
  const formatEventDate = (start: string, end: string) => {
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
        return <OverviewTab tournament={tournament} />;
      case "Referees":
        return <RefereeManagement tournamentId={id} />;
      case "Entries":
        return <EntriesManagement tournamentId={id} />;
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
          {isMock && (
            <span className="rounded bg-chart-4/20 border border-chart-4/50 px-2 py-1 text-xs font-bold uppercase tracking-wider text-chart-4">
              MOCK DATA
            </span>
          )}
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
              {formatEventDate(tournament.startDate, tournament.endDate)}
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
