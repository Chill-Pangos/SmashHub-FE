import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Medal, Users } from "lucide-react";
import { RefereeCard, Referee, InviteRefereeModal } from "./components";

// Mock Data
const MOCK_REFEREES: Referee[] = [
  { id: "1", name: "Sarah Jenkins", email: "s.jenkins@example.com", status: "CONFIRMED", role: "ASSISTANT" },
  { id: "2", name: "David Chen", email: "d.chen@example.com", status: "PENDING", role: "ASSISTANT" },
  { id: "3", name: "Alexei Volkov", email: "a.volkov@example.com", status: "CONFIRMED", role: "ASSISTANT" },
  { id: "4", name: "Maria Rodriguez", email: "m.rodriguez@example.com", status: "PENDING", role: "ASSISTANT" },
];

export default function RefereeManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteMode, setInviteMode] = useState<"CHIEF" | "ASSISTANT">("ASSISTANT");

  // 👉 CALL REACT QUERY HERE:
  // const { data: tournament } = useQuery(['tournament', id], fetchTournamentData);
  // const { data: referees, isLoading } = useQuery(['referees', tournamentId], fetchReferees);

  // Phân loại data
  const chiefReferee = null; // Thay bằng `referees.find(r => r.role === 'CHIEF')` khi có data thật
  const assistantReferees = MOCK_REFEREES; // Thay bằng `referees.filter(r => r.role === 'ASSISTANT')`

  const handleOpenInvite = (mode: "CHIEF" | "ASSISTANT") => {
    setInviteMode(mode);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      {/* Header Section (Mô phỏng Navigation của hệ thống) */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">
          Neon City Smash Invitational
        </h1>
        <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">PRO CIRCUIT</span>
          <span>MAY 12-14, 2026</span>
          <span>•</span>
          <span>TOKYO SIGHT ARENA</span>
        </div>
        
        {/* Navigation Tabs (Chỉ UI tĩnh để khớp với thiết kế) */}
        <div className="flex gap-6 border-b border-border text-sm font-medium">
          {["Overview", "Referees", "Financials", "Entries", "Schedule", "Brackets"].map((tab) => (
            <div
              key={tab}
              className={`pb-3 cursor-pointer ${
                tab === "Referees"
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Actions */}
      <div className="flex items-center justify-between bg-card border border-border p-4 rounded-xl mb-8">
        <p className="text-sm text-muted-foreground font-medium">
          Manage tournament officials and assign roles.
        </p>
        <Button 
          className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-auth-icon-shadow"
          onClick={() => handleOpenInvite("ASSISTANT")}
        >
          <UserPlus className="mr-2 h-4 w-4" /> INVITE REFEREE
        </Button>
      </div>

      {/* Chief Referee Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Medal className="h-5 w-5 text-chart-4" />
          <h2 className="text-lg font-bold text-foreground">Chief Referee</h2>
          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-bold">MAX 1</span>
        </div>

        {chiefReferee ? (
          <RefereeCard referee={chiefReferee} isChief />
        ) : (
          <div 
            onClick={() => handleOpenInvite("CHIEF")}
            className="flex flex-col items-center justify-center py-8 bg-auth-ghost-bg border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-auth-ghost-bg-hover transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-3">
              <span className="text-xl text-muted-foreground">+</span>
            </div>
            <p className="font-bold text-foreground">Assign Chief Referee</p>
            <p className="text-sm text-muted-foreground mt-1">Select a primary official to oversee tournament rules.</p>
          </div>
        )}
      </div>

      {/* Assistant Referees Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground">Assistant Referees</h2>
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-bold">
              {assistantReferees.length} ASSIGNED
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search officials..." 
              className="pl-9 pr-4 py-1.5 text-sm bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assistantReferees.map((ref) => (
            <RefereeCard key={ref.id} referee={ref} />
          ))}
        </div>
      </div>

      {/* Invite Modal Component */}
      <InviteRefereeModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        inviteMode={inviteMode} 
      />
    </div>
  );
}