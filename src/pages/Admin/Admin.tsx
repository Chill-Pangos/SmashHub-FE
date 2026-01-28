"use client";

import { useState } from "react";
import SystemDashboard from "./SystemDashboard/SystemDashboard";
// import UserManagement from "./UserManagement/UserManagement"; // COMMENTED OUT: Uses mock data
// import RBACSettings from "./RBACSettings/RBACSettings"; // COMMENTED OUT: Uses mock data
// import SystemLogs from "./SystemLogs/SystemLogs"; // COMMENTED OUT: Uses mock data
import AdminSidebar from "@/components/custom/AdminSidebar";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <SystemDashboard />;
      // COMMENTED OUT: These screens use mock data, no API available
      // case "users":
      //   return <UserManagement />;
      // case "rbac":
      //   return <RBACSettings />;
      // case "logs":
      //   return <SystemLogs />;
      default:
        return <SystemDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
