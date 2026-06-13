import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { useRole } from "@/store/useRole";
import { Trophy, Activity, ChevronRight, Target, Shield } from "lucide-react";
import lightBg from "@/assets/table_tennis_bg_light.png";
import darkBg from "@/assets/table_tennis_bg_dark.png";

interface PortalLink {
  key: string;
  label: string;
  description: string;
  path: string;
  roles: string[];
}

export default function Landing() {
  const { user, isAuthenticated } = useAuth();
  const { getRoleNames, hasAnyRole } = useRole();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col w-full">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden border-b border-border">
          {/* Background Images */}
          <div className="absolute inset-0 z-0">
            <img src={lightBg} alt="Table Tennis Background" className="block dark:hidden object-cover w-full h-full opacity-30 object-center" />
            <img src={darkBg} alt="Table Tennis Background" className="hidden dark:block object-cover w-full h-full opacity-30 object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
              <Trophy className="mr-2 h-4 w-4" />
              Vietnam's Premier Table Tennis Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 drop-shadow-sm max-w-4xl">
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Table Tennis</span> Experience
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed drop-shadow-sm">
              The ultimate hub for managing tournaments, tracking live matches, and following professional ELO ratings across the nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signin"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/tournaments"
                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-primary/20 bg-background/50 backdrop-blur-sm px-8 text-base font-bold text-foreground shadow-sm transition-all hover:bg-muted hover:border-primary/40"
              >
                Browse Tournaments
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Built for organizers, referees, and players to streamline every aspect of competitive table tennis.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/30 group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Live Match Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">Follow tournament brackets and match scores in real-time. Never miss a moment of the action.</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/30 group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Official ELO System</h3>
                <p className="text-muted-foreground leading-relaxed">Accurate and dynamic player rankings based on standardized ELO calculation formulas.</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/30 group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Seamless Organization</h3>
                <p className="text-muted-foreground leading-relaxed">Powerful tools for organizers to create brackets, schedule matches, and manage registrations effortlessly.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const userRoles = user?.roles ?? [];
  const userRoleNames = getRoleNames(userRoles);

  const portalLinks: PortalLink[] = [
    {
      key: "public",
      label: "Public & Player",
      description: "Browse tournaments, brackets, and ELO leaderboards.",
      path: "/tournaments",
      roles: ["user"],
    },
    {
      key: "organizer",
      label: "Organizer Portal",
      description: "Create and operate tournaments.",
      path: "/organizer",
      roles: ["organizer"],
    },
    {
      key: "referee",
      label: "Referee Portal",
      description: "Match control and approvals.",
      path: "/referee",
      roles: ["referee", "chief_referee"],
    },
    {
      key: "admin",
      label: "Admin Portal",
      description: "Users, roles, and notifications.",
      path: "/admin",
      roles: ["admin"],
    },
  ];

  // Determine available portals based strictly on user's roles
  const availablePortals = portalLinks.filter((portal) => {
    // If they have no roles at all, default to giving them access to the public portal
    if (portal.key === "public" && userRoleNames.length === 0) {
      return true;
    }
    return hasAnyRole(userRoleNames, portal.roles);
  });

  // If user has no specific portals available (should not happen if fallback is working), redirect to tournaments
  if (availablePortals.length === 0) {
    return <Navigate to="/tournaments" replace />;
  }

  // If user has exactly 1 role, redirect directly to that portal
  if (availablePortals.length === 1) {
    return <Navigate to={availablePortals[0].path} replace />;
  }

  // If user has 2 or more roles, show the portal chooser with only their available options
  return (
    <div className="px-6 py-12">
      <div className="max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Choose a portal</h1>
          <p className="text-muted-foreground">
            Select where you want to work today.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {availablePortals.map((portal) => (
            <Link
              key={portal.key}
              to={portal.path}
              className="rounded-lg border border-border p-5 transition hover:border-primary"
            >
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{portal.label}</h2>
                <p className="text-sm text-muted-foreground">
                  {portal.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
