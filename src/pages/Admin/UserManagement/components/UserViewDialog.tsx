import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/hooks/useTranslation";
import type { AdminUser } from "@/types";

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: AdminUser[];
  rolesById: Record<number, string>;
}

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export default function UserViewDialog({
  open,
  onOpenChange,
  users,
  rolesById,
}: UserViewDialogProps) {
  const { t } = useTranslation();
  const isMultiView = users.length > 1;

  const title = isMultiView
    ? t("admin.selectedUsersDetails", { count: users.length })
    : t("admin.userDetails");

  const description = isMultiView
    ? t("admin.selectedUsersDetailsDescription", { count: users.length })
    : t("admin.userDetailsDescription");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-3">
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("admin.noUsersFound")}</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">{t("auth.fullName")}</p>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">{t("auth.email")}</p>
                      <p className="font-medium break-all">{user.email}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">{t("admin.roles")}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(user.roles ?? []).length > 0 ? (
                          (user.roles ?? []).map((roleId) => (
                            <Badge key={`${user.id}-${roleId}`} variant="secondary">
                              {rolesById[roleId] ?? `#${roleId}`}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">{t("auth.verifyEmail")}</p>
                      {user.isEmailVerified ? (
                        <Badge className="mt-1 bg-green-500">{t("admin.verified")}</Badge>
                      ) : (
                        <Badge className="mt-1" variant="outline">
                          {t("admin.unverified")}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">{t("admin.createdAt")}</p>
                      <p className="text-sm">{formatDate(user.createdAt)}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">{t("admin.userId")}</p>
                      <p className="text-sm">#{user.id}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
