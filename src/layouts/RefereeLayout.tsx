import { Outlet } from "react-router-dom";

import PortalSidebar, {
  type PortalSidebarItem,
  type PortalSidebarSection,
} from "@/components/custom/PortalSidebar";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useTranslation } from "@/hooks/useTranslation";
import { refereeSidebarConfig } from "@/config/sidebarConfigs";

export default function RefereeLayout() {
  const { t } = useTranslation();
  const { logout } = useAuthOperations();

  // Get sections from config with translations
  const sections: PortalSidebarSection[] = refereeSidebarConfig.sections(t);

  // Get footer items from config
  const footerItems: PortalSidebarItem[] = refereeSidebarConfig.footerItems(
    t,
    logout,
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,_var(--primary)_8%,_transparent)_0%,_transparent_32%),linear-gradient(180deg,_var(--background)_0%,_color-mix(in_srgb,_var(--background)_92%,_var(--card)_8%)_100%)] text-foreground">
      <PortalSidebar
        brand={{
          ...refereeSidebarConfig.brand,
          title: t("portal.referee.title"),
        }}
        mobileTitle={t("portal.referee.title")}
        triggerLabel={t("portal.referee.openSidebar")}
        sections={sections}
        footerItems={footerItems}
      />

      <main className="min-h-screen lg:pl-80">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
