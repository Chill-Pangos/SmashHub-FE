import { useState } from "react";
import ChiefRefereeSidebar from "@/components/custom/ChiefRefereeSidebar";
// import ChiefRefereeDashboard from "./ChiefRefereeDashboard/ChiefRefereeDashboard"; // COMMENTED OUT: Uses mock data
// import ComplaintBoard from "./ComplaintBoard/ComplaintBoard"; // COMMENTED OUT: Uses mock data
// import DisputeResolution from "./DisputeResolution/DisputeResolution"; // COMMENTED OUT: Uses mock data
import MatchSupervision from "./MatchSupervision/MatchSupervision";
// import DecisionLog from "./DecisionLog/DecisionLog"; // COMMENTED OUT: Uses mock data

export default function ChiefRefereePage() {
  const [activeTab, setActiveTab] = useState("match-supervision"); // Default to match-supervision

  const renderContent = () => {
    switch (activeTab) {
      // COMMENTED OUT: These features use mock data, no API available
      // case "dashboard":
      //   return <ChiefRefereeDashboard />;
      // case "complaint-board":
      //   return <ComplaintBoard />;
      // case "dispute-resolution":
      //   return <DisputeResolution />;
      case "match-supervision":
        return <MatchSupervision />;
      // case "decision-log":
      //   return <DecisionLog />;
      default:
        return <MatchSupervision />; // Default to working feature
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChiefRefereeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
