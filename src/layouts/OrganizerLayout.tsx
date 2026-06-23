import { Outlet } from "react-router-dom";

import PortalSidebar, {
  type PortalSidebarItem,
  type PortalSidebarSection,
} from "@/components/custom/PortalSidebar";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useNotificationConnection } from "@/hooks/useNotificationConnection";
import { useTranslation } from "@/hooks/useTranslation";
import { organizerSidebarConfig } from "@/config/sidebarConfigs";
import PortalHeader from "@/components/custom/PortalHeader";

export default function OrganizerLayout() {
  const { t } = useTranslation();
  const { logout } = useAuthOperations();
  useNotificationConnection();

  // Get sections from config with translations
  const sections: PortalSidebarSection[] = organizerSidebarConfig.sections(t);

  // Get primary action from config
  const primaryAction = organizerSidebarConfig.primaryAction?.(t);

  // Get footer items from config
  const footerItems: PortalSidebarItem[] = organizerSidebarConfig.footerItems(
    t,
    logout,
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,_var(--primary)_8%,_transparent)_0%,_transparent_32%),linear-gradient(180deg,_var(--background)_0%,_color-mix(in_srgb,_var(--background)_92%,_var(--card)_8%)_100%)] text-foreground">
      <PortalSidebar
        brand={{
          ...organizerSidebarConfig.brand,
          title: t("portal.organizer.title"),
        }}
        mobileTitle={t("portal.organizer.title")}
        triggerLabel={t("portal.organizer.openSidebar")}
        sections={sections}
        primaryAction={primaryAction}
        footerItems={footerItems}
      />

      <main className="min-h-screen lg:pl-80">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-8">
          <div className="mb-6">
            <PortalHeader />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
