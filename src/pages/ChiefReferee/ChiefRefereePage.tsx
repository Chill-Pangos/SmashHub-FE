import { useState } from "react";
import ChiefRefereeSidebar from "@/components/custom/ChiefRefereeSidebar";
import ComplaintBoard from "./ComplaintBoard/ComplaintBoard";
import DisputeResolution from "./DisputeResolution/DisputeResolution";

export default function ChiefRefereePage() {
  const [activeTab, setActiveTab] = useState("complaint-board");

  const renderContent = () => {
    switch (activeTab) {
      case "complaint-board":
        return <ComplaintBoard />;
      case "dispute-resolution":
        return <DisputeResolution />;
      default:
        return <ComplaintBoard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ChiefRefereeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
