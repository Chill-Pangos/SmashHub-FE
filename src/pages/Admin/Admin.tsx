"use client";

import { useState } from "react";
import DashboardOverview from "./Dashboard";
import PlayersManagement from "./UserManagerment";
import MatchesSchedule from "./ScheduleManagement";
import TournamentsManagement from "./TournamentManagement";
import Statistics from "./Statistics";
import AdminSidebar from "@/components/custom/AdminSidebar";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "players":
        return <PlayersManagement />;
      case "matches":
        return <MatchesSchedule />;
      case "tournaments":
        return <TournamentsManagement />;
      case "statistics":
        return <Statistics />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
