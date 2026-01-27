import { useState } from "react";
import RefereeSidebar from "@/components/custom/RefereeSidebar";
import RefereeDashboard from "./RefereeDashboard/RefereeDashboard";
import MatchHistory from "./MatchHistory/MatchHistory";

export default function RefereePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <RefereeDashboard />;
      case "history":
        return <MatchHistory />;
      default:
        return <RefereeDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <RefereeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
