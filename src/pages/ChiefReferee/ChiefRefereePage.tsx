import { useState } from "react";
import ChiefRefereeSidebar from "@/components/custom/ChiefRefereeSidebar";
import ChiefRefereeDashboard from "./ChiefRefereeDashboard/ChiefRefereeDashboard";
import ComplaintBoard from "./ComplaintBoard/ComplaintBoard";
import DisputeResolution from "./DisputeResolution/DisputeResolution";
import MatchSupervision from "./MatchSupervision/MatchSupervision";
import DecisionLog from "./DecisionLog/DecisionLog";

export default function ChiefRefereePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <ChiefRefereeDashboard />;
      case "complaint-board":
        return <ComplaintBoard />;
      case "dispute-resolution":
        return <DisputeResolution />;
      case "match-supervision":
        return <MatchSupervision />;
      case "decision-log":
        return <DecisionLog />;
      default:
        return <ChiefRefereeDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ChiefRefereeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
