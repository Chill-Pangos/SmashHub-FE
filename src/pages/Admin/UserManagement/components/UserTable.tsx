import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { AdminUser } from "@/types";

interface UserTableProps {
  users: AdminUser[];
  rolesById: Record<number, string>;
  selectedUserIds: number[];
  isLoading?: boolean;
  onSelectionChange: (ids: number[]) => void;
  onView: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
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

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`
    .toUpperCase()
    .slice(0, 2);
};

export default function UserTable({
  users,
  rolesById,
  selectedUserIds,
  isLoading,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
}: UserTableProps) {
  const { t } = useTranslation();
  const selectedUserIdSet = useMemo(
    () => new Set(selectedUserIds),
    [selectedUserIds],
  );

  const allSelected =
    users.length > 0 && users.every((user) => selectedUserIdSet.has(user.id));
  const someSelected =
    users.some((user) => selectedUserIdSet.has(user.id)) && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(users.map((user) => user.id));
      return;
    }

    onSelectionChange([]);
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange(Array.from(new Set([...selectedUserIds, userId])));
      return;
    }

    onSelectionChange(selectedUserIds.filter((id) => id !== userId));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={
                  allSelected ? true : someSelected ? "indeterminate" : false
                }
                onCheckedChange={(checked) => handleSelectAll(checked === true)}
                disabled={isLoading || users.length === 0}
                aria-label={t("common.selectAll")}
              />
            </TableHead>
            <TableHead>{t("admin.users")}</TableHead>
            <TableHead>{t("auth.email")}</TableHead>
            <TableHead>{t("admin.roles")}</TableHead>
            <TableHead>{t("auth.verifyEmail")}</TableHead>
            <TableHead>{t("admin.createdAt")}</TableHead>
            <TableHead className="text-right">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                {t("common.loading")}
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                {t("admin.noUsersFound")}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUserIdSet.has(user.id)}
                    onCheckedChange={(checked) =>
                      handleSelectUser(user.id, checked === true)
                    }
                    aria-label={`${t("common.select")}: ${user.email}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {user.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(user.roles ?? []).length > 0 ? (
                      (user.roles ?? []).map((roleId) => (
                        <Badge key={`${user.id}-${roleId}`} variant="secondary">
                          {rolesById[roleId] ?? `#${roleId}`}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {user.isEmailVerified ? (
                    <Badge className="bg-green-500">
                      {t("admin.verified")}
                    </Badge>
                  ) : (
                    <Badge variant="outline">{t("admin.unverified")}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("common.view")}
                      onClick={() => onView(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("common.edit")}
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("common.delete")}
                      className="text-red-500"
                      onClick={() => onDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
