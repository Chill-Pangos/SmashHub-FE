"use client";

import {
  Trophy,
  Users,
  Calendar,
  UserPlus,
  CalendarCheck,
  Edit,
  FileText,
  Key,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  List,
} from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

interface TournamentManagerSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TournamentManagerSidebar({
  activeTab,
  setActiveTab,
}: TournamentManagerSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { id: "setup-wizard", label: "Thiết lập giải đấu", icon: Trophy },
    { id: "tournament-list", label: "Danh sách giải đấu", icon: List },
    { id: "delegations", label: "Quản lý đoàn", icon: Users },
    { id: "referees", label: "Phân công trọng tài", icon: UserPlus },
    { id: "scheduling", label: "Ma trận lịch thi đấu", icon: Calendar },
    { id: "matches", label: "Quản lý trận đấu", icon: CalendarCheck },
    { id: "results", label: "Điều chỉnh kết quả", icon: Edit },
    { id: "reports", label: "Trung tâm báo cáo", icon: FileText },
    { id: "accounts", label: "Tài khoản đoàn", icon: Key },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-0"
        } transition-all duration-300 border-r border-border bg-card overflow-hidden md:w-64 md:overflow-visible`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Trophy className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-card-foreground">QLGĐ</h1>
              <p className="text-xs text-muted-foreground">
                Quản lý giải đấu
              </p>
            </div>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-card-foreground hover:bg-accent"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-card-foreground hover:bg-accent transition-colors">
            <Settings size={20} />
            <span>Cài đặt</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}
