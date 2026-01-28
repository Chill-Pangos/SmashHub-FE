import { useState } from "react";
import SpectatorSidebar from "@/components/custom/SpectatorSidebar";
import SpectatorDashboard from "./SpectatorDashboard/SpectatorDashboard";
import SpectatorTournaments from "./SpectatorTournaments/SpectatorTournaments";
import SpectatorSchedule from "./SpectatorSchedule/SpectatorSchedule";
import LiveMatches from "./LiveMatches/LiveMatches";
// import Rankings from "./Rankings/Rankings"; // COMMENTED OUT: Uses mock data

export default function SpectatorPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <SpectatorDashboard />;
      case "tournaments":
        return <SpectatorTournaments />;
      case "schedule":
        return <SpectatorSchedule />;
      case "live-matches":
        return <LiveMatches />;
      // COMMENTED OUT: Uses mock data, no ranking/leaderboard API available
      // case "rankings":
      //   return <Rankings />;
      default:
        return <SpectatorDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SpectatorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
