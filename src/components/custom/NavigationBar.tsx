import { LogIn, Trophy, UserPlus, User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ThemeToggle from "./ThemeToggle";
import useScrollHide from "@/hooks/useScrollHide";
import { useAuth } from "@/store/useAuth";
import { useRole } from "@/store/useRole";
import { useAuthOperations } from "@/hooks/useAuthOperations";

const navItems = [
  { name: "Home", to: "/" },
  { name: "Rankings", to: "/rankings" },
  { name: "Tournaments", to: "/tournaments" },
  { name: "Players", to: "/players" },
];

const NavigationBar = () => {
  const isVisible = useScrollHide();
  const { user, isAuthenticated } = useAuth();
  const { getDefaultRouteForRoles, getRoleNames } = useRole();
  const { logout } = useAuthOperations();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const handleDashboard = () => {
    if (user) {
      const dashboardRoute = getDefaultRouteForRoles(user.roles);
      navigate(dashboardRoute);
    }
  };

  const getUserInitials = (username: string) => {
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">SmashHub</span>
          </NavLink>

          {/* Navigation links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-primary",
                    ].join(" ")
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Auth links */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {getRoleNames(user.roles).map((roleName) => (
                          <span
                            key={roleName}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                          >
                            {roleName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboard}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/change-password")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Đổi mật khẩu</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <NavLink to="/signin">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </NavLink>
                </Button>
                <Button size="sm" asChild>
                  <NavLink to="/signup">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </NavLink>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
