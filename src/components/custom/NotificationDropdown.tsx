import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  BellRing,
  Check,
  Trash2,
  Trophy,
  Calendar,
  AlertCircle,
  Megaphone,
  Users,
} from "lucide-react";
import { useNotification } from "@/store";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useTranslation } from "@/hooks/useTranslation";
import i18n from "@/locales/i18n";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "match_update":
      return <Trophy className="h-4 w-4 text-blue-500" />;
    case "tournament_start":
    case "tournament_end":
      return <Trophy className="h-4 w-4 text-purple-500" />;
    case "schedule_change":
      return <Calendar className="h-4 w-4 text-orange-500" />;
    case "referee_assigned":
      return <Users className="h-4 w-4 text-green-500" />;
    case "reminder":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "announcement":
      return <Megaphone className="h-4 w-4 text-red-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    isConnected,
  } = useNotification();
  const [open, setOpen] = useState(false);
  const dateLocale = i18n.language === "vi" ? vi : enUS;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && unreadCount > 0) {
      // Mark all as read when opening
      markAsRead();
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          {/* Connection indicator */}
          <span
            className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t("components.notificationDropdown.notifications")}</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={clearNotifications}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {t("components.notificationDropdown.clearAll")}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {t("components.notificationDropdown.noNotifications")}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <DropdownMenuGroup>
              {notifications.map((notification, index) => (
                <DropdownMenuItem
                  key={index}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                >
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm leading-tight">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                        locale: dateLocale,
                      })}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              <Check className="h-4 w-4 mr-2" />
              {t("components.notificationDropdown.markAllAsRead")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
