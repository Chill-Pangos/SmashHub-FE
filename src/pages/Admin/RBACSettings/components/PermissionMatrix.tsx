import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import ServerPagination from "@/components/custom/ServerPagination";
import {
  useCreatePermission,
  useDeletePermission,
  usePermissionsPaginated,
  useUpdatePermission,
} from "@/hooks/queries";
import type { Permission } from "@/types";
import PermissionDialog, {
  type PermissionDialogSubmitData,
} from "./PermissionDialog";
import { showApiError, showToast } from "@/utils/toast.utils";

const getPermissionGroup = (name: string) => {
  const [group] = name.includes(":") ? name.split(":") : name.split(".");
  return group || "general";
};

const formatPermissionDate = (value: string | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
};

export default function PermissionMatrix() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({ skip: 0, limit: 20 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  const permissionsQuery = usePermissionsPaginated(
    pagination.skip,
    pagination.limit,
  );
  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const deletePermissionMutation = useDeletePermission();

  const permissions = permissionsQuery.data?.items ?? [];
  const permissionsMeta = permissionsQuery.data?.meta;
  const isSubmitting =
    createPermissionMutation.isPending ||
    updatePermissionMutation.isPending ||
    deletePermissionMutation.isPending;

  const sortedPermissions = useMemo(() => {
    return [...permissions].sort((a, b) => a.name.localeCompare(b.name));
  }, [permissions]);

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedPermission(null);
    setDialogOpen(true);
  };

  const handleEdit = (permission: Permission) => {
    setDialogMode("edit");
    setSelectedPermission(permission);
    setDialogOpen(true);
  };

  const handleDelete = async (permission: Permission) => {
    const confirmed = window.confirm(
      t("admin.confirmDeletePermission", { name: permission.name }),
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePermissionMutation.mutateAsync(permission.id);
      showToast.success(t("admin.permissionDeletedSuccess"));
    } catch (error) {
      showApiError(error, t("admin.permissionDeleteFailed"));
    }
  };

  const handleSubmit = async (data: PermissionDialogSubmitData) => {
    try {
      if (dialogMode === "create") {
        await createPermissionMutation.mutateAsync({
          name: data.name,
        });
        showToast.success(t("admin.permissionCreatedSuccess"));
      } else if (selectedPermission) {
        await updatePermissionMutation.mutateAsync({
          id: selectedPermission.id,
          data: {
            name: data.name,
          },
        });
        showToast.success(t("admin.permissionUpdatedSuccess"));
      }

      setDialogOpen(false);
    } catch (error) {
      showApiError(error, t("admin.permissionSaveFailed"));
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{t("admin.permissions")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("admin.permissionsDescription")}
          </p>
        </div>
        <Button onClick={handleCreate} disabled={isSubmitting}>
          <Plus className="h-4 w-4 mr-2" />
          {t("admin.addPermission")}
        </Button>
      </div>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.permissionName")}</TableHead>
              <TableHead>{t("admin.permissionGroup")}</TableHead>
              <TableHead>{t("admin.createdAt")}</TableHead>
              <TableHead className="text-right">
                {t("common.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsQuery.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : sortedPermissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  {t("admin.noPermissionsFound")}
                </TableCell>
              </TableRow>
            ) : (
              sortedPermissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">
                    {permission.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getPermissionGroup(permission.name)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatPermissionDate(permission.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(permission)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDelete(permission)}
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

      {permissionsMeta && (
        <div className="mt-4">
          <ServerPagination
            skip={permissionsMeta.skip}
            limit={permissionsMeta.limit}
            total={permissionsMeta.total}
            hasNext={permissionsMeta.hasNext}
            hasPrevious={permissionsMeta.hasPrevious}
            isLoading={permissionsQuery.isLoading}
            onSkipChange={(nextSkip) =>
              setPagination((prev) => ({ ...prev, skip: nextSkip }))
            }
            onLimitChange={(nextLimit) =>
              setPagination({ skip: 0, limit: nextLimit })
            }
          />
        </div>
      )}

      <PermissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        permission={selectedPermission}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
