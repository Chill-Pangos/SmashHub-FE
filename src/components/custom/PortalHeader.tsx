import { User, LogOut, Key, MailCheck } from "lucide-react";
import { Fragment } from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "@/components/custom/LanguageSwitcher";
import NotificationDropdown from "@/components/custom/NotificationDropdown";
import ThemeToggle from "@/components/custom/ThemeToggle";
import { useAuth } from "@/store/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useRole } from "@/store/useRole";
import { getImageUrl } from "@/utils/api.utils";
import { ROUTE_META, PORTAL_FALLBACKS } from "@/config/headerBreadcrumbConfig";
import type { User as AuthUser } from "@/types";

type ResolvedMeta = {
  title: string;
  breadcrumbs: Array<{
    label: string;
    to?: string;
  }>;
};

function resolveRouteMeta(
  pathname: string,
  t: (key: string) => string,
): ResolvedMeta {
  const match = ROUTE_META.find((item) =>
    Boolean(matchPath({ path: item.pattern, end: true }, pathname)),
  );

  if (match) {
    return {
      title: t(match.titleKey),
      breadcrumbs: match.breadcrumbs.map((item) => ({
        label: t(item.labelKey),
        to: item.to,
      })),
    };
  }

  // Use fallback portal mapping
  const portalMatch = Object.entries(PORTAL_FALLBACKS).find(([prefix]) =>
    pathname.startsWith(prefix),
  );

  if (portalMatch) {
    const [, fallback] = portalMatch;
    return {
      title: t(fallback.title),
      breadcrumbs: [{ label: t(fallback.breadcrumb) }],
    };
  }

  return {
    title: t("nav.dashboard"),
    breadcrumbs: [{ label: t("nav.dashboard") }],
  };
}

function getUserDisplayName(authUser: AuthUser) {
  const fullName = `${authUser.firstName} ${authUser.lastName}`.trim();
  return fullName || authUser.username || authUser.email || "";
}

function getUserInitials(displayName: string) {
  return displayName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function PortalHeader() {
  const { user } = useAuth();
  const { getRoleNames, getRoleDisplayNames } = useRole();
  const { logout } = useAuthOperations();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const displayName = user ? getUserDisplayName(user) : "";
  const initials = user ? getUserInitials(displayName) : "";
  const profileLabel = user ? displayName : t("nav.profile");
  const routeMeta = resolveRouteMeta(pathname, t);

  const handleProfileClick = () => {
    if (pathname.startsWith("/organizer")) {
      navigate("/organizer/profile");
    } else if (pathname.startsWith("/admin")) {
      navigate("/admin/profile");
    } else if (pathname.startsWith("/referee")) {
      navigate("/referee/profile");
    } else {
      navigate("/profile");
    }
  };

  const roleNames = getRoleNames(user?.roles ?? []);
  const roleDisplayNames = getRoleDisplayNames(roleNames);

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border/30 bg-background/80 px-3 py-2 shadow-sm backdrop-blur">
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-foreground sm:text-lg">
          {routeMeta.title}
        </p>
        <Breadcrumb className="mt-1 hidden sm:block">
          <BreadcrumbList>
            {routeMeta.breadcrumbs.map((item, index) => {
              const isLast = index === routeMeta.breadcrumbs.length - 1;

              return (
                <Fragment key={`${item.label}-${index}`}>
                  <BreadcrumbItem>
                    {isLast || !item.to ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={item.to}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast ? <BreadcrumbSeparator /> : null}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        {user ? <NotificationDropdown /> : null}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-accent/30 bg-accent/10 text-foreground hover:bg-accent/20"
                aria-label={profileLabel}
                title={profileLabel}
              >
                <Avatar className="h-8 w-8">
                  {user?.avatarUrl ? (
                    <AvatarImage src={getImageUrl(user.avatarUrl)} alt={profileLabel} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials ? (
                      <span>{initials}</span>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {roleDisplayNames.map((roleName) => (
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
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>{t("nav.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/change-password')}>
                <Key className="mr-2 h-4 w-4" />
                <span>{t("auth.changePassword")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/verify-email')}>
                <MailCheck className="mr-2 h-4 w-4" />
                <span>{t("auth.verifyEmail")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("auth.signOut")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full border border-accent/30 bg-accent/10 text-foreground hover:bg-accent/20"
            aria-label={profileLabel}
            title={profileLabel}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      </div>
    </div>
  );
}
