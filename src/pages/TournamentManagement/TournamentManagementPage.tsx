import { useState } from "react";
import TournamentSidebar from "./Sidebar";
import TournamentOverview from "./Overview";
import TournamentsList from "./List";
import TournamentCreate from "./Create";
import TournamentBracket from "./Bracket";
import TournamentSettings from "./Settings";

export default function TournamentManagementPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen bg-background">
      <TournamentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {activeTab === "overview" && <TournamentOverview />}
          {activeTab === "tournaments" && <TournamentsList />}
          {activeTab === "create" && <TournamentCreate />}
          {activeTab === "bracket" && <TournamentBracket />}
          {activeTab === "settings" && <TournamentSettings />}
        </div>
      </main>
    </div>
  );
}
