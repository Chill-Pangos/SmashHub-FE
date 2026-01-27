import { useState } from "react";
import TeamManagerSidebar from "@/components/custom/TeamManagerSidebar";
import TeamManagerDashboard from "./TeamManagerDashboard/TeamManagerDashboard";
import MyTeam from "./MyTeam/MyTeam";
import TeamRegistration from "./TeamRegistration/TeamRegistration";
import TeamTournaments from "./TeamTournaments/TeamTournaments";
import TeamSchedule from "./TeamSchedule/TeamSchedule";

export default function TeamManagerPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <TeamManagerDashboard onNavigateTo={setActiveTab} />;
      case "my-team":
        return <MyTeam />;
      case "registration":
        return <TeamRegistration />;
      case "tournaments":
        return <TeamTournaments />;
      case "schedule":
        return <TeamSchedule />;
      default:
        return <TeamManagerDashboard onNavigateTo={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <TeamManagerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
