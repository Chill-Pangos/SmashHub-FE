"use client";

import {
  Trophy,
  Users,
  Calendar,
  Award,
  BarChart3,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: "overview", label: "Tổng quan hệ thống", icon: BarChart3 },
    { id: "users", label: "Quản lý người dùng", icon: Users },
    { id: "rbac", label: "Cài đặt phân quyền", icon: Award },
    { id: "logs", label: "Nhật ký hệ thống", icon: Calendar },
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
              <h1 className="font-bold text-lg text-card-foreground">Admin</h1>
              <p className="text-xs text-muted-foreground">Quản trị hệ thống</p>
            </div>
            <div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
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
                <span>{item.label}</span>
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
