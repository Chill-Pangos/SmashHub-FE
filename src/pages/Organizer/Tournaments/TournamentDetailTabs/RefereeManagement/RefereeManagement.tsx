import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Medal, Search, UserPlus, Users } from "lucide-react";
import { InviteRefereeModal, type Referee, RefereeCard } from "./components";

interface RefereeManagementProps {
  tournamentId: number;
}

const MOCK_REFEREES: Referee[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    email: "s.jenkins@example.com",
    status: "CONFIRMED",
    role: "ASSISTANT",
  },
  {
    id: "2",
    name: "David Chen",
    email: "d.chen@example.com",
    status: "PENDING",
    role: "ASSISTANT",
  },
  {
    id: "3",
    name: "Alexei Volkov",
    email: "a.volkov@example.com",
    status: "CONFIRMED",
    role: "ASSISTANT",
  },
  {
    id: "4",
    name: "Maria Rodriguez",
    email: "m.rodriguez@example.com",
    status: "PENDING",
    role: "ASSISTANT",
  },
];

export default function RefereeManagement({
  tournamentId,
}: RefereeManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteMode, setInviteMode] = useState<"CHIEF" | "ASSISTANT">(
    "ASSISTANT",
  );

  const chiefReferee = null;
  const assistantReferees = MOCK_REFEREES;

  const handleOpenInvite = (mode: "CHIEF" | "ASSISTANT") => {
    setInviteMode(mode);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Referees</h2>
          <p className="text-sm text-muted-foreground">
            Manage tournament officials and assign roles.
          </p>
          <p className="text-xs text-muted-foreground">
            Tournament #{tournamentId}
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-auth-icon-shadow"
          onClick={() => handleOpenInvite("ASSISTANT")}
        >
          <UserPlus className="mr-2 h-4 w-4" /> INVITE REFEREE
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground font-medium">
          Assign a chief referee and manage assistant referees for this
          tournament.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Medal className="h-5 w-5 text-chart-4" />
          <h3 className="text-lg font-bold text-foreground">Chief Referee</h3>
          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-bold">
            MAX 1
          </span>
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
            <p className="text-sm text-muted-foreground mt-1">
              Select a primary official to oversee tournament rules.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground">
              Assistant Referees
            </h3>
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

      <InviteRefereeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        inviteMode={inviteMode}
      />
    </div>
  );
}
