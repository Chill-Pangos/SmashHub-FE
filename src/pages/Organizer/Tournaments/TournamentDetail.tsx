import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTournament } from "@/hooks/queries"; // Đảm bảo đường dẫn này đúng với project của bạn
import type { Tournament } from "@/types/tournament.types"; // <-- THÊM IMPORT NÀY
import { 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Info, 
  Megaphone, 
  RotateCw, 
  Download,
  Users,
  Trophy,
  LayoutGrid
} from "lucide-react";

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
      updatedAt: "2026-02-10T14:30:00Z"
    }
  ]
};

export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const id = tournamentId ? parseInt(tournamentId, 10) : 0;

  // Lấy data từ hook API
  const { data: apiData, isLoading: apiLoading, error: apiError } = useTournament(id);

  // --- LOGIC OVERRIDE MOCK DATA ---
  // Nếu ID trên URL là 1, chúng ta dùng Mock Data. Nếu không, dùng API.
  const isMock = id === 1; 
  const tournament = isMock ? MOCK_TOURNAMENT : apiData;
  const isLoading = isMock ? false : apiLoading;
  const error = isMock ? null : apiError;

  // State cho Tabs
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Referees", "Entries", "Schedule", "Schedule Config"];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center rounded-2xl border border-border bg-card">
        <p className="text-muted-foreground animate-pulse">Loading tournament details...</p>
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
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
  };

  // Lúc này TS đã biết chắc chắn cat là TournamentCategory, không cần ép kiểu thủ công nữa
  const totalEntries = tournament.categories?.reduce((sum, cat) => sum + (cat.maxEntries || 0), 0) || 0;
  
  const formatTypes = Array.from(new Set(tournament.categories?.map((c) => c.type))).join(', ');

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
            ID: TRN-{new Date(tournament.createdAt).getFullYear()}-{tournament.id.toString().padStart(3, '0')}
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
            <span>{formatEventDate(tournament.startDate, tournament.endDate)}</span>
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

      {/* 3. OVERVIEW CONTENT */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            
            {/* Card 1: Total Entries */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Max Entries
                </span>
                <Users className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{totalEntries.toLocaleString()}</span>
              </div>
              <div className="mt-2 text-xs font-medium text-chart-3">
                ~ Based on {tournament.categories?.length || 0} categories
              </div>
            </div>

            {/* Card 2: Format Details */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Format Details
                </span>
                <Trophy className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold tracking-tight capitalize">{formatTypes || 'N/A'}</span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '100%' }}></div>
              </div>
              <div className="mt-2 text-right text-xs font-medium text-muted-foreground">
                Tier {tournament.tier} Event
              </div>
            </div>

            {/* Card 3: Facility Logistics */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Facility Setup
                </span>
                <LayoutGrid className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{tournament.numberOfTables}</span>
                <span className="text-sm font-medium text-muted-foreground">Tables</span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                  Group Stage: {tournament.categories?.some((c) => c.isGroupStage) ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Alerts & Quick Actions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Left Column (Spans 2): Critical Alerts */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Critical Alerts</h2>
              </div>
              
              <div className="space-y-3">
                {/* Error Alert */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-destructive">Court 4 Net Sensor Malfunction</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Maintenance dispatched. Estimated resolution in 15 mins.
                      </p>
                    </div>
                  </div>
                  <button className="shrink-0 rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
                    Acknowledge
                  </button>
                </div>

                {/* Info Alert */}
                <div className="flex items-start gap-3 rounded-lg border border-border bg-transparent p-4">
                  <Info className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Schedule Delay: Men's Pro Singles</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Matches running approx 20 mins behind schedule due to tie-breakers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Spans 1): Quick Actions */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-foreground">
                  <div className="h-2 w-2 rounded-full bg-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
              </div>
              
              <div className="flex flex-col gap-2">
                <button className="flex w-full items-center justify-between rounded-lg border border-border bg-transparent px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary">
                  <span>Broadcast Message</span>
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="flex w-full items-center justify-between rounded-lg border border-border bg-transparent px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary">
                  <span>Adjust Schedule</span>
                  <RotateCw className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="flex w-full items-center justify-between rounded-lg border border-border bg-transparent px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary">
                  <span>Export Data</span>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Mock content for other tabs */}
      {activeTab !== "Overview" && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border bg-transparent">
          <p className="text-muted-foreground">Content for {activeTab} will go here.</p>
        </div>
      )}

    </div>
  );
}