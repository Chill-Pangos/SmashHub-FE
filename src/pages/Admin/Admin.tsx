"use client";

import { useState } from "react";
import SystemDashboard from "./SystemDashboard/SystemDashboard";
import UserManagement from "./UserManagement/UserManagement";
import RBACSettings from "./RBACSettings/RBACSettings";
import SystemLogs from "./SystemLogs/SystemLogs";
import AdminSidebar from "@/components/custom/AdminSidebar";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <SystemDashboard />;
      case "users":
        return <UserManagement />;
      case "rbac":
        return <RBACSettings />;
      case "logs":
        return <SystemLogs />;
      default:
        return <SystemDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
