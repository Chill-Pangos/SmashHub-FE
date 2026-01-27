import { useState } from "react";
import AthleteSidebar from "@/components/custom/AthleteSidebar";
import AthleteDashboard from "./AthleteDashboard/AthleteDashboard";
import AthleteProfile from "./AthleteProfile/AthleteProfile";
import AthleteTournaments from "./AthleteTournaments/AthleteTournaments";
import AthleteSchedule from "./AthleteSchedule/AthleteSchedule";
import MatchHistory from "./MatchHistory/MatchHistory";
import EloStats from "./EloStats/EloStats";

export default function AthletePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AthleteDashboard onNavigateTo={setActiveTab} />;
      case "profile":
        return <AthleteProfile />;
      case "tournaments":
        return <AthleteTournaments />;
      case "schedule":
        return <AthleteSchedule />;
      case "match-history":
        return <MatchHistory />;
      case "elo-stats":
        return <EloStats />;
      default:
        return <AthleteDashboard onNavigateTo={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AthleteSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
