import { Outlet, Navigate, useLocation } from "react-router-dom";

import PortalSidebar, {
  type PortalSidebarItem,
  type PortalSidebarSection,
} from "@/components/custom/PortalSidebar";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useAuth } from "@/store/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { proPlayerSidebarConfig } from "@/config/sidebarConfigs";
import PortalHeader from "@/components/custom/PortalHeader";

interface ProPlayerLayoutProps {
  children?: React.ReactNode;
}

export default function ProPlayerLayout({ children }: ProPlayerLayoutProps) {
  const { t } = useTranslation();
  const { logout } = useAuthOperations();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated && user) {
    const isEmailVerificationRoute = location.pathname === "/verify-email";
    const isProfileRoute = location.pathname === "/profile";
    const isChangePasswordRoute = location.pathname === "/change-password";

    // 1. Force email verification
    if (!user.isEmailVerified && !isEmailVerificationRoute && !isChangePasswordRoute) {
      return <Navigate to="/verify-email" replace />;
    }

    // 2. Force profile completion
    const isProfileComplete = user.firstName && user.lastName && user.dob;
    if (user.isEmailVerified && !isProfileComplete && !isProfileRoute && !isChangePasswordRoute) {
      return <Navigate to="/profile" state={{ requireCompletion: true }} replace />;
    }
  }

  // Get sections from config with translations
  const sections: PortalSidebarSection[] = proPlayerSidebarConfig.sections(t);

  // Get footer items from config
  const footerItems: PortalSidebarItem[] = proPlayerSidebarConfig.footerItems(
    t,
    logout,
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,_var(--primary)_8%,_transparent)_0%,_transparent_32%),linear-gradient(180deg,_var(--background)_0%,_color-mix(in_srgb,_var(--background)_92%,_var(--card)_8%)_100%)] text-foreground">
      <PortalSidebar
        brand={{
          ...proPlayerSidebarConfig.brand,
          title: "SmashHub",
        }}
        mobileTitle={"Pro Player Portal"}
        triggerLabel={"Open Sidebar"}
        sections={sections}
        footerItems={footerItems}
      />

      <main className="min-h-screen lg:pl-80">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pt-8">
          <div className="fixed top-4 left-4 right-4 z-40 lg:sticky lg:top-4 lg:left-auto lg:right-auto lg:mb-6">
            <PortalHeader />
          </div>
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
