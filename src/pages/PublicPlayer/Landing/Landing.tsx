import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { useRole } from "@/store/useRole";

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
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Welcome to SmashHub
            </h1>
            <p className="text-lg text-muted-foreground">
              Your ultimate platform for managing tournaments, tracking matches, and following ELO ratings. 
              Sign in to access your dashboard and participate in events.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Link
              to="/signin"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Sign In
            </Link>
          </div>
        </div>
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
