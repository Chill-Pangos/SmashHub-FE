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
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();
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
      label: t("tournament.tournament"),
      icon: Trophy,
      items: [
        {
          id: "setup-wizard",
          label: t("tournament.tournamentSetup"),
          icon: Trophy,
        },
        {
          id: "tournament-list",
          label: t("tournament.tournamentList"),
          icon: List,
        },
      ],
    },
    {
      id: "management",
      label: t("tournamentManager.delegationManagement"),
      icon: Folder,
      items: [
        { id: "delegations", label: t("team.delegations"), icon: Users },
        {
          id: "referees",
          label: t("referee.refereeAssignment"),
          icon: UserPlus,
        },
        {
          id: "accounts",
          label: t("tournamentManager.delegationAccounts"),
          icon: Key,
        },
      ],
    },
    {
      id: "competition",
      label: t("match.matches"),
      icon: ClipboardList,
      items: [
        {
          id: "scheduling",
          label: t("schedule.scheduleGenerator"),
          icon: Calendar,
        },
        {
          id: "matches",
          label: t("tournamentManager.matchManagement"),
          icon: CalendarCheck,
        },
      ],
    },
  ];

  const singleItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
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
              title={isOpen ? t("common.close") : t("common.open")}
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
                    {t("tournamentManager.tournamentManager")}
                  </h1>
                  <p className="text-xs text-muted-foreground truncate">
                    {t("tournament.tournament")}
                  </p>
                </div>
                <div className="flex-shrink-0 flex gap-1">
                  <LanguageSwitcher />
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
            title={!isOpen ? t("nav.settings") : undefined}
          >
            <Settings size={20} className="flex-shrink-0" />
            {isOpen && <span>{t("nav.settings")}</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors ${!isOpen && "justify-center"}`}
            title={!isOpen ? t("auth.signOut") : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isOpen && <span>{t("auth.signOut")}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
