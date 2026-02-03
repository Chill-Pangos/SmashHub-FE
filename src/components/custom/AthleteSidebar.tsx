import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  History,
  // TrendingUp, // COMMENTED OUT: Menu item hidden
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

interface AthleteSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AthleteSidebar({
  activeTab,
  setActiveTab,
}: AthleteSidebarProps) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuthOperations();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
    },
    {
      id: "profile",
      label: t("athlete.athleteProfile"),
      icon: User,
    },
    {
      id: "tournaments",
      label: t("tournament.tournaments"),
      icon: Trophy,
    },
    {
      id: "schedule",
      label: t("schedule.schedule"),
      icon: Calendar,
    },
    {
      id: "match-history",
      label: t("match.matchHistory"),
      icon: History,
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            <span className="font-semibold">{t("athlete.athlete")}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <NotificationDropdown />
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center px-2",
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className={cn("h-5 w-5", !collapsed && "mr-2")} />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-2 space-y-1">
        <ThemeToggle />
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed && "justify-center px-2",
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-5 w-5", !collapsed && "mr-2")} />
          {!collapsed && <span>{t("auth.signOut")}</span>}
        </Button>
      </div>
    </div>
  );
}
