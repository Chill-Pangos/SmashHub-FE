import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, /* Menu, */ Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RouteInfo {
  path: string;
  name: string;
  category: string;
}

const allRoutes: RouteInfo[] = [
  // Public Routes
  { path: "/", name: "Landing", category: "Public" },
  { path: "/signin", name: "Sign In", category: "Auth" },
  { path: "/signup", name: "Sign Up", category: "Auth" },
  { path: "/forgot-password", name: "Forgot Password", category: "Auth" },
  { path: "/verify-otp", name: "Verify OTP", category: "Auth" },
  { path: "/reset-password", name: "Reset Password", category: "Auth" },
  { path: "/verify-email", name: "Email Verification", category: "Auth" },
  { path: "/change-password", name: "Change Password", category: "Auth" },
  { path: "/tournaments", name: "Tournament Listing", category: "Public" },
  {
    path: "/tournaments/1",
    name: "Tournament Detail",
    category: "Public",
  },
  {
    path: "/tournaments/1/register",
    name: "Entry Registration",
    category: "Public",
  },
  { path: "/team", name: "Team Management", category: "Public" },
  { path: "/checkout", name: "Checkout", category: "Public" },
  { path: "/matches", name: "Match Center", category: "Public" },
  { path: "/brackets", name: "Brackets & Standings", category: "Public" },
  { path: "/elo", name: "ELO Leaderboard", category: "Public" },
  { path: "/elo/history", name: "ELO History", category: "Public" },
  { path: "/profile", name: "User Profile", category: "Public" },

  // Admin Routes
  { path: "/admin", name: "User Management", category: "Admin" },
  { path: "/admin/users", name: "User Management", category: "Admin" },
  { path: "/admin/roles", name: "Roles & Permissions", category: "Admin" },
  {
    path: "/admin/notifications",
    name: "Notification Center",
    category: "Admin",
  },

  // Organizer Routes
  { path: "/organizer", name: "Organizer Dashboard", category: "Organizer" },
  {
    path: "/organizer/tournaments/new",
    name: "Tournament Form",
    category: "Organizer",
  },
  {
    path: "/organizer/tournaments/1/edit",
    name: "Tournament Edit",
    category: "Organizer",
  },
  {
    path: "/organizer/categories",
    name: "Category Management",
    category: "Organizer",
  },
  {
    path: "/organizer/bulk-import",
    name: "Bulk Import",
    category: "Organizer",
  },
  {
    path: "/organizer/finance",
    name: "Finance & Verification",
    category: "Organizer",
  },
  {
    path: "/organizer/draw",
    name: "Group Stage Draw",
    category: "Organizer",
  },

  // Referee Routes
  { path: "/referee", name: "Invitations", category: "Referee" },
  {
    path: "/referee/invitations",
    name: "Pending Invitations",
    category: "Referee",
  },
  {
    path: "/referee/tournaments",
    name: "Referee Tournaments",
    category: "Referee",
  },
  {
    path: "/referee/tournaments/1",
    name: "Tournament Detail",
    category: "Referee",
  },
  {
    path: "/referee/notifications",
    name: "Notifications",
    category: "Referee",
  },
];

export default function DebugNavigator() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Toggle with Ctrl + Shift + D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const filteredRoutes = allRoutes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedRoutes = filteredRoutes.reduce(
    (acc, route) => {
      if (!acc[route.category]) {
        acc[route.category] = [];
      }
      acc[route.category].push(route);
      return acc;
    },
    {} as Record<string, RouteInfo[]>,
  );

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <>
      {/* Toggle Button - Fixed position */}
      {/*  {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-[9999] shadow-lg"
          size="icon"
          variant="default"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )} */}

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Debug Navigator</h2>
                <p className="text-sm text-muted-foreground">
                  Press <kbd className="px-2 py-1 bg-muted rounded">Ctrl</kbd> +{" "}
                  <kbd className="px-2 py-1 bg-muted rounded">Shift</kbd> +{" "}
                  <kbd className="px-2 py-1 bg-muted rounded">D</kbd> to toggle
                </p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Routes List */}
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-6 pb-4">
                {Object.entries(groupedRoutes).map(([category, routes]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-sm mb-2 text-primary">
                      {category} ({routes.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {routes.map((route) => (
                        <Button
                          key={route.path}
                          onClick={() => handleNavigate(route.path)}
                          variant="outline"
                          className="justify-start h-auto py-2 px-3"
                        >
                          <div className="text-left">
                            <div className="font-medium text-sm">
                              {route.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {route.path}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t text-center text-xs text-muted-foreground">
              Total: {filteredRoutes.length} routes
              {searchQuery && ` (filtered from ${allRoutes.length})`}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
