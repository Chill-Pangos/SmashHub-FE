import { Link } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { useRole } from "@/store/useRole";

interface PortalLink {
  key: string;
  label: string;
  description: string;
  path: string;
  visible: boolean;
}

export default function Landing() {
  const { user, isAuthenticated } = useAuth();
  const { getRoleNames, hasAnyRole } = useRole();

  const userRoles = user?.roles ?? [];
  const userRoleNames = getRoleNames(userRoles);

  const portalLinks: PortalLink[] = [
    {
      key: "public",
      label: "Public & Player",
      description: "Browse tournaments, brackets, and ELO leaderboards.",
      path: "/tournaments",
      visible: true,
    },
    {
      key: "organizer",
      label: "Organizer Portal",
      description: "Create and operate tournaments.",
      path: "/organizer",
      visible: isAuthenticated && hasAnyRole(userRoleNames, ["organizer"]),
    },
    {
      key: "referee",
      label: "Referee Portal",
      description: "Match control and approvals.",
      path: "/referee",
      visible:
        isAuthenticated &&
        hasAnyRole(userRoleNames, ["referee", "chief_referee"]),
    },
    {
      key: "admin",
      label: "Admin Portal",
      description: "Users, roles, and notifications.",
      path: "/admin",
      visible: isAuthenticated && hasAnyRole(userRoleNames, ["admin"]),
    },
  ];

  const visiblePortals = portalLinks;

  // TODO: Restore auth gating once portal access is locked by role.
  /*
  const visiblePortals = portalLinks.filter((portal) => portal.visible);

  if (!isAuthenticated) {
    return (
      <div className="px-6 py-12">
        <div className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Welcome to SmashHub</h1>
            <p className="text-muted-foreground">
              Manage tournaments, track matches, and follow ELO ratings in one
              place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/signin"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium"
            >
              Create account
            </Link>
            <Link
              to="/tournaments"
              className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium"
            >
              Browse tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }
  */

  return (
    <div className="px-6 py-12">
      <div className="max-w-4xl space-y-8">
        {!isAuthenticated && (
          <div className="max-w-2xl space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold">Welcome to SmashHub</h1>
              <p className="text-muted-foreground">
                Manage tournaments, track matches, and follow ELO ratings in one
                place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signin"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium"
              >
                Create account
              </Link>
              <Link
                to="/tournaments"
                className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium"
              >
                Browse tournaments
              </Link>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Choose a portal</h1>
          <p className="text-muted-foreground">
            Select where you want to work today.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {visiblePortals.map((portal) => (
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
