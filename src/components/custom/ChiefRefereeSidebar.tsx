"use client";

import {
  LayoutDashboard,
  AlertCircle,
  FileCheck,
  Monitor,
  ScrollText,
  Shield,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import NotificationDropdown from "./NotificationDropdown";
import { useAuthOperations } from "@/hooks/useAuthOperations";

interface ChiefRefereeSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ChiefRefereeSidebar({
  activeTab,
  setActiveTab,
}: ChiefRefereeSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuthOperations();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const menuItems = [
    { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { id: "complaint-board", label: "Theo dõi khiếu nại", icon: AlertCircle },
    { id: "dispute-resolution", label: "Xử lý chi tiết", icon: FileCheck },
    { id: "match-supervision", label: "Giám sát trận đấu", icon: Monitor },
    { id: "decision-log", label: "Nhật ký quyết định", icon: ScrollText },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-16"
        } transition-all duration-300 border-r border-border bg-card flex flex-col h-full`}
      >
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
              title={isOpen ? "Thu gọn" : "Mở rộng"}
            >
              <Menu size={20} />
            </button>

            {isOpen && (
              <>
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Shield className="text-primary-foreground" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-bold text-lg text-card-foreground truncate">
                    Tổng TT
                  </h1>
                  <p className="text-xs text-muted-foreground truncate">
                    Tổng trọng tài
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1">
                  <NotificationDropdown />
                  <ThemeToggle />
                </div>
              </>
            )}
          </div>
        </div>

        <nav className="p-2 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-card-foreground hover:bg-accent"
                } ${!isOpen && "justify-center"}`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border flex-shrink-0 space-y-2">
          <button
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-card-foreground hover:bg-accent transition-colors ${
              !isOpen && "justify-center"
            }`}
            title={!isOpen ? "Cài đặt" : undefined}
          >
            <Settings size={20} className="flex-shrink-0" />
            {isOpen && <span>Cài đặt</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors ${
              !isOpen && "justify-center"
            }`}
            title={!isOpen ? "Đăng xuất" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
