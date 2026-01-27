import { useState } from "react";
import CoachSidebar from "@/components/custom/CoachSidebar";
import CoachDashboard from "./CoachDashboard/CoachDashboard";
import CoachAthletes from "./CoachAthletes/CoachAthletes";
import CoachTournaments from "./CoachTournaments/CoachTournaments";
import CoachSchedule from "./CoachSchedule/CoachSchedule";
import TrainingPlan from "./TrainingPlan/TrainingPlan";

export default function CoachPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <CoachDashboard onNavigateTo={setActiveTab} />;
      case "athletes":
        return <CoachAthletes />;
      case "tournaments":
        return <CoachTournaments />;
      case "schedule":
        return <CoachSchedule />;
      case "training":
        return <TrainingPlan />;
      default:
        return <CoachDashboard onNavigateTo={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CoachSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
