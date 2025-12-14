import ThemeToggle from "@/components/custom/ThemeToggle";
import {
  Trophy,
  List,
  Plus,
  Brackets,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

interface TournamentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TournamentSidebar({
  activeTab,
  setActiveTab,
}: TournamentSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: "overview", label: "Overview", icon: Trophy },
    { id: "tournaments", label: "Tournaments", icon: List },
    { id: "create", label: "Create New", icon: Plus },
    { id: "bracket", label: "Brackets", icon: Brackets },
    { id: "settings", label: "Settings", icon: Settings },
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
              <h1 className="font-bold text-lg text-card-foreground">
                TourManager
              </h1>
              <p className="text-xs text-muted-foreground">Management</p>
            </div>
            <ThemeToggle />
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
