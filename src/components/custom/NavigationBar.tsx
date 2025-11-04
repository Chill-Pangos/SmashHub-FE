import React from "react";
import { LogIn, Trophy, UserPlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { name: "Home", to: "/" },
  { name: "Rankings", to: "/rankings" },
  { name: "Tournaments", to: "/tournaments" },
  { name: "Players", to: "/players" },
];

const NavigationBar = () => {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <ThemeToggle></ThemeToggle>
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
