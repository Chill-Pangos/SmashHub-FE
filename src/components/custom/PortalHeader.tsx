import { User } from "lucide-react";
import { Fragment } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";

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
import LanguageSwitcher from "@/components/custom/LanguageSwitcher";
import ThemeToggle from "@/components/custom/ThemeToggle";
import { useAuth } from "@/store/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
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
    title: t("portal.organizer.title"),
    breadcrumbs: [{ label: t("portal.organizer.title") }],
  };
}

function getUserDisplayName(authUser: AuthUser) {
  const fullName = `${authUser.firstName} ${authUser.lastName}`.trim();
  return fullName || authUser.username || authUser.email;
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
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const displayName = user ? getUserDisplayName(user) : "";
  const initials = user ? getUserInitials(displayName) : "";
  const profileLabel = user ? displayName : t("nav.profile");
  const routeMeta = resolveRouteMeta(pathname, t);

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
              <AvatarImage src={user.avatarUrl} alt={profileLabel} />
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
      </div>
    </div>
  );
}
