"use client";

import {
  Trophy,
  Users,
  Calendar,
  UserPlus,
  CalendarCheck,
  // Edit, // COMMENTED OUT: Menu item hidden
  // FileText, // COMMENTED OUT: Menu item hidden
  Key,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  List,
  ChevronDown,
  ChevronRight,
  Folder,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuthOperations } from "@/hooks/useAuthOperations";

interface TournamentManagerSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  items: Array<{ id: string; label: string; icon: LucideIcon }>;
}

export default function TournamentManagerSidebar({
  activeTab,
  setActiveTab,
}: TournamentManagerSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "tournament",
    "management",
    "competition",
  ]);
  const navigate = useNavigate();
  const { logout } = useAuthOperations();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const menuGroups: MenuGroup[] = [
    {
      id: "tournament",
      label: "Giải đấu",
      icon: Trophy,
      items: [
        { id: "setup-wizard", label: "Thiết lập giải đấu", icon: Trophy },
        { id: "tournament-list", label: "Danh sách giải đấu", icon: List },
      ],
    },
    {
      id: "management",
      label: "Quản lý",
      icon: Folder,
      items: [
        { id: "delegations", label: "Quản lý đoàn", icon: Users },
        { id: "referees", label: "Phân công trọng tài", icon: UserPlus },
        { id: "accounts", label: "Tài khoản đoàn", icon: Key },
      ],
    },
    {
      id: "competition",
      label: "Thi đấu",
      icon: ClipboardList,
      items: [
        { id: "scheduling", label: "Ma trận lịch thi đấu", icon: Calendar },
        { id: "matches", label: "Quản lý trận đấu", icon: CalendarCheck },
        // COMMENTED OUT: Uses mock data, no result correction API
        // { id: "results", label: "Điều chỉnh kết quả", icon: Edit },
      ],
    },
  ];

  const singleItems = [
    { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    // COMMENTED OUT: Uses mock data, no reports/export API
    // { id: "reports", label: "Trung tâm báo cáo", icon: FileText },
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
                  <Trophy className="text-primary-foreground" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-bold text-lg text-card-foreground truncate">
                    QLGĐ
                  </h1>
                  <p className="text-xs text-muted-foreground truncate">
                    Quản lý giải đấu
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <ThemeToggle />
                </div>
              </>
            )}
          </div>
        </div>

        <nav className="p-2 space-y-2 flex-1 overflow-y-auto">
          {/* Single menu items */}
          {singleItems.map((item) => {
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
                {isOpen && (
                  <span className="text-sm truncate">{item.label}</span>
                )}
              </button>
            );
          })}

          {/* Grouped menu items */}
          {isOpen &&
            menuGroups.map((group) => {
              const GroupIcon = group.icon;
              const isExpanded = expandedGroups.includes(group.id);
              const hasActiveItem = group.items.some(
                (item) => item.id === activeTab,
              );

              return (
                <div key={group.id} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                      hasActiveItem
                        ? "bg-accent text-accent-foreground"
                        : "text-card-foreground hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <GroupIcon size={20} className="flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {group.label}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown size={16} className="flex-shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-6 space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                              isActive
                                ? "bg-primary text-primary-foreground font-medium"
                                : "text-muted-foreground hover:text-card-foreground hover:bg-accent"
                            }`}
                          >
                            <Icon size={18} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </nav>

        <div className="p-2 border-t border-border flex-shrink-0 space-y-2">
          <button
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-card-foreground hover:bg-accent transition-colors ${!isOpen && "justify-center"}`}
            title={!isOpen ? "Cài đặt" : undefined}
          >
            <Settings size={20} className="flex-shrink-0" />
            {isOpen && <span>Cài đặt</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors ${!isOpen && "justify-center"}`}
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
