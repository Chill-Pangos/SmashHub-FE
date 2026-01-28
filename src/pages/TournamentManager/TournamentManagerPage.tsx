import { useState } from "react";
import TournamentManagerSidebar from "@/components/custom/TournamentManagerSidebar";
import TournamentDashboard from "./TournamentDashboard/TournamentDashboard";
import TournamentSetupWizard from "./TournamentSetupWizard/TournamentSetupWizard";
import TournamentList from "./TournamentList/TournamentList";
import DelegationManagement from "./DelegationManagement/DelegationManagement";
import RefereeAssignment from "./RefereeAssignment/RefereeAssignment";
import ScheduleGenerator from "./SchedulingGenerator/ScheduleGenerator";
import MatchManagement from "./MatchManagement/MatchManagement";
// import ResultCorrection from "./ResultCorrection/ResultCorrection"; // COMMENTED OUT: Uses mock data
// import ReportsCenter from "./ReportsCenter/ReportsCenter"; // COMMENTED OUT: Uses mock data
import DelegationAccountManagement from "./DelegationAccountManagement/DelegationAccountManagement";

export default function TournamentManagerPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <TournamentDashboard onNavigateTo={setActiveTab} />;
      case "setup-wizard":
        return <TournamentSetupWizard />;
      case "tournament-list":
        return <TournamentList />;
      case "delegations":
        return <DelegationManagement />;
      case "referees":
        return <RefereeAssignment />;
      case "scheduling":
        return <ScheduleGenerator />;
      case "matches":
        return <MatchManagement />;
      // COMMENTED OUT: These features use mock data, no API available
      // case "results":
      //   return <ResultCorrection />;
      // case "reports":
      //   return <ReportsCenter />;
      case "accounts":
        return <DelegationAccountManagement />;
      default:
        return <TournamentDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <TournamentManagerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
