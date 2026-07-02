import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
const logoSvg = "/smashhub_logo.svg";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type {
  PortalSidebarItem,
  PortalSidebarSection,
  PortalBrand,
} from "@/config/sidebarConfigs";

// Re-export types for backward compatibility
export type {
  PortalSidebarItem,
  PortalSidebarSection,
  PortalBrand,
} from "@/config/sidebarConfigs";

type PortalSidebarProps = {
  brand: PortalBrand;
  sections: PortalSidebarSection[];
  primaryAction?: PortalSidebarItem;
  footerItems?: PortalSidebarItem[];
  className?: string;
  mobileTitle?: string;
  triggerLabel?: string;
};

function getSectionKey(section: PortalSidebarSection, index: number) {
  return section.items[0]?.key ?? section.title ?? `section-${index}`;
}

function SidebarItemView({
  item,
  mobile,
  isPrimary = false,
}: {
  item: PortalSidebarItem;
  mobile?: boolean;
  isPrimary?: boolean;
}) {
  // Bỏ màu tĩnh nếu là isPrimary để icon kế thừa màu text-primary-foreground
  const iconClassName = cn(
    "h-5 w-5 shrink-0",
    item.danger && !isPrimary ? "text-destructive" : "",
  );

  const itemClassName = cn(
    "group flex min-h-[48px] w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
    mobile && "min-h-[56px] px-4 py-4 text-base",
    item.disabled && "pointer-events-none opacity-50",
    // Nếu là nút Quick Action thì luôn hiển thị màu Primary
    isPrimary
      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
      : item.danger
        ? "text-destructive hover:bg-destructive/10"
        : "text-foreground hover:bg-accent/10 hover:text-foreground",
  );

  const badgeClassName = cn(
    "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
    isPrimary
      ? "bg-primary-foreground/20 text-primary-foreground"
      : "bg-accent/20 text-foreground/70",
  );

  if (item.to) {
    return (
      <NavLink
        to={item.to}
        end={item.end}
        aria-disabled={item.disabled}
        tabIndex={item.disabled ? -1 : undefined}
        className={({ isActive }) =>
          cn(
            itemClassName,
            // Trạng thái isActive chỉ làm đổi màu nếu ĐÓ KHÔNG PHẢI là nút Primary
            !isPrimary &&
            isActive &&
            (item.danger
              ? "bg-destructive/10 text-destructive"
              : "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"),
          )
        }
      >
        {item.icon ? <item.icon className={iconClassName} /> : null}
        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
        {item.badge ? (
          <span className={badgeClassName}>{item.badge}</span>
        ) : null}
        {/* Chỉ hiện mũi tên hover cho các mục menu thường, ẩn đi cho nút Primary */}
        {!isPrimary && (
          <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      disabled={item.disabled}
      onClick={item.onClick}
      className={itemClassName}
    >
      {item.icon ? <item.icon className={iconClassName} /> : null}
      <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
      {item.badge ? <span className={badgeClassName}>{item.badge}</span> : null}
    </button>
  );
}

function LogoutAction({
  item,
  onConfirm,
}: {
  item: PortalSidebarItem;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="group flex min-h-[48px] w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          {item.icon ? <item.icon className="h-5 w-5 shrink-0" /> : null}
          <span className="min-w-0 flex-1 truncate text-left">
            {item.label}
          </span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-border bg-background text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>{item.label}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("auth.signOutConfirm")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("common.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SidebarSectionView({
  section,
  mobile,
  isCollapsed,
  onToggle,
}: {
  section: PortalSidebarSection;
  mobile?: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/30 bg-accent/5 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          mobile && "px-4 py-5 text-base",
        )}
        aria-expanded={!isCollapsed}
      >
        <span className="min-w-0 flex-1 truncate">{section.title ?? ""}</span>
        <span className="flex items-center gap-2 text-foreground/60">
          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-semibold">
            {section.items.length}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isCollapsed && "rotate-180",
            )}
          />
        </span>
      </button>

      {!isCollapsed ? (
        <div className="space-y-1.5 border-t border-border/20 p-2">
          {section.items.map((item) => (
            <SidebarItemView key={item.key} item={item} mobile={mobile} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SidebarContent({
  brand,
  sections,
  primaryAction,
  footerItems,
  mobile = false,
}: {
  brand: PortalBrand;
  sections: PortalSidebarSection[];
  primaryAction?: PortalSidebarItem;
  footerItems?: PortalSidebarItem[];
  mobile?: boolean;
}) {
  const [collapsedSectionKeys, setCollapsedSectionKeys] = useState<string[]>(
    [],
  );

  const toggleSection = (sectionKey: string) => {
    setCollapsedSectionKeys((current) =>
      current.includes(sectionKey)
        ? current.filter((key) => key !== sectionKey)
        : [...current, sectionKey],
    );
  };

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <div className="space-y-4 px-5 pt-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 dark:bg-gradient-to-br dark:from-white/20 dark:to-white/5 dark:backdrop-blur-xl ring-1 ring-primary/20 dark:ring-white/20 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden">
            <img src={logoSvg} alt="SmashHub Logo" className="h-12 w-12 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            {brand.subtitle ? (
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground/60">
                {brand.subtitle}
              </p>
            ) : null}
            <h2 className="mt-1 truncate text-lg font-semibold leading-tight text-foreground">
              {brand.title}
            </h2>
          </div>
        </div>

        {primaryAction ? (
          <div className="pt-2 pb-1">
            {/* Truyền prop isPrimary vào đây */}
            <SidebarItemView item={primaryAction} mobile={mobile} isPrimary />
          </div>
        ) : null}
      </div>

      <ScrollArea className="mt-4 flex-1 px-3">
        <div className="space-y-4 pb-5 pr-2">
          {sections.map((section, index) => {
            const sectionKey = getSectionKey(section, index);
            const isCollapsed = collapsedSectionKeys.includes(sectionKey);

            return (
              <SidebarSectionView
                key={sectionKey}
                section={section}
                mobile={mobile}
                isCollapsed={isCollapsed}
                onToggle={() => toggleSection(sectionKey)}
              />
            );
          })}
        </div>
      </ScrollArea>

      <div className="space-y-4 px-5 pb-5 pt-2">
        <Separator className="bg-border/30" />

        {footerItems && footerItems.length > 0 ? (
          <div className="space-y-1.5">
            {footerItems.map((item) =>
              item.key === "logout" && item.onClick ? (
                <LogoutAction
                  key={item.key}
                  item={item}
                  onConfirm={item.onClick}
                />
              ) : (
                <SidebarItemView key={item.key} item={item} mobile={mobile} />
              ),
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function PortalSidebar({
  brand,
  sections,
  primaryAction,
  footerItems,
  className,
  mobileTitle,
  triggerLabel = "Open sidebar",
}: PortalSidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "hidden h-screen w-80 shrink-0 border-r border-border bg-background lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col",
          className,
        )}
      >
        <SidebarContent
          brand={brand}
          sections={sections}
          primaryAction={primaryAction}
          footerItems={footerItems}
        />
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed left-7 top-7 z-50 h-8 w-8 text-foreground/80 hover:bg-accent/20 hover:text-foreground"
              aria-label={triggerLabel}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[86vw] border-border p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>{mobileTitle ?? brand.title}</SheetTitle>
            </SheetHeader>
            <SidebarContent
              brand={brand}
              sections={sections}
              primaryAction={primaryAction}
              footerItems={footerItems}
              mobile
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
