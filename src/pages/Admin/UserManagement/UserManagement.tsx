import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, RefreshCw } from "lucide-react";
import UserBulkActions from "./components/UserBulkActions";
import UserTable from "./components/UserTable";
import UserDialog, { type UserDialogSubmitData } from "./components/UserDialog";
import UserViewDialog from "./components/UserViewDialog";
import ServerPagination from "@/components/custom/ServerPagination";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useCreateUser,
  useDeleteUser,
  useRoles,
  useSearchUsersPaginated,
  useUpdateUser,
  useUsersPaginated,
} from "@/hooks/queries";
import type { AdminUser } from "@/types";
import { showApiError, showToast } from "@/utils/toast.utils";

export default function UserManagement() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ skip: 0, limit: 20 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [usersToView, setUsersToView] = useState<AdminUser[]>([]);

  const normalizedSearch = searchQuery.trim();
  const isSearching = normalizedSearch.length > 0;

  const usersQuery = useUsersPaginated(pagination.skip, pagination.limit, {
    enabled: !isSearching,
  });
  const searchUsersQuery = useSearchUsersPaginated(
    normalizedSearch,
    pagination.skip,
    pagination.limit,
    {
      enabled: isSearching,
    },
  );
  const rolesQuery = useRoles(0, 200);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const activeUsersQuery = isSearching ? searchUsersQuery : usersQuery;

  const users = useMemo(() => {
    return (activeUsersQuery.data?.items ?? []) as AdminUser[];
  }, [activeUsersQuery.data?.items]);

  const usersMeta = activeUsersQuery.data?.meta;

  const roles = rolesQuery.data ?? [];

  const selectedUserIdSet = useMemo(
    () => new Set(selectedUserIds),
    [selectedUserIds],
  );
  const selectedUsers = useMemo(
    () => users.filter((user) => selectedUserIdSet.has(user.id)),
    [users, selectedUserIdSet],
  );

  useEffect(() => {
    const availableUserIds = new Set(users.map((user) => user.id));

    setSelectedUserIds((prev) => {
      const next = prev.filter((id) => availableUserIds.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [users]);

  const rolesById = useMemo(() => {
    return roles.reduce<Record<number, string>>((acc, role) => {
      acc[role.id] = role.name;
      return acc;
    }, {});
  }, [roles]);

  const isSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending;

  const isLoading = activeUsersQuery.isLoading;
  const isDeleting = deleteUserMutation.isPending;

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDelete = async (user: AdminUser) => {
    const confirmed = window.confirm(
      t("admin.confirmDeleteUser", { email: user.email }),
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(user.id);
      setSelectedUserIds((prev) => prev.filter((id) => id !== user.id));
      showToast.success(t("admin.userDeletedSuccess"));
    } catch (error) {
      showApiError(error, t("admin.userDeleteFailed"));
    }
  };

  const handleDeleteSelected = async () => {
    const total = selectedUserIds.length;

    if (total === 0) {
      return;
    }

    const confirmed = window.confirm(
      t("admin.confirmDeleteSelectedUsers", { count: total }),
    );

    if (!confirmed) {
      return;
    }

    let successCount = 0;
    let failedCount = 0;
    let latestError: unknown = null;

    for (const userId of selectedUserIds) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        successCount += 1;
      } catch (error) {
        failedCount += 1;
        latestError = error;
      }
    }

    if (successCount > 0) {
      showToast.success(t("admin.usersDeletedSuccess", { count: successCount }));
    }

    if (failedCount > 0) {
      if (successCount === 0 && latestError) {
        showApiError(latestError, t("admin.userDeleteFailed"));
      } else {
        showToast.warning(
          t("admin.usersDeletePartial", {
            success: successCount,
            total,
            failed: failedCount,
          }),
        );
      }
    }

    setSelectedUserIds([]);
  };

  const handleView = (user: AdminUser) => {
    setUsersToView([user]);
    setViewDialogOpen(true);
  };

  const handleViewSelected = () => {
    if (selectedUsers.length === 0) {
      return;
    }

    setUsersToView(selectedUsers);
    setViewDialogOpen(true);
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedUserIds(Array.from(new Set(ids)));
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleSubmit = async (payload: UserDialogSubmitData) => {
    try {
      const baseData = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        roles: [payload.roleId],
      };

      if (dialogMode === "create") {
        await createUserMutation.mutateAsync({
          ...baseData,
          password: payload.password,
        });
        showToast.success(t("admin.userCreatedSuccess"));
      } else if (selectedUser) {
        await updateUserMutation.mutateAsync({
          id: selectedUser.id,
          data: baseData,
        });
        showToast.success(t("admin.userUpdatedSuccess"));
      }

      setDialogOpen(false);
    } catch (error) {
      showApiError(error, t("admin.userSaveFailed"));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("admin.userManagement")}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (isSearching) {
                searchUsersQuery.refetch();
              } else {
                usersQuery.refetch();
              }
              rolesQuery.refetch();
            }}
            disabled={isLoading || rolesQuery.isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("common.refresh")}
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {t("admin.addUser")}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("admin.searchUsers")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination((prev) => ({ ...prev, skip: 0 }));
              }}
              className="pl-10"
            />
          </div>
        </div>

        <UserBulkActions
          selectedCount={selectedUserIds.length}
          isLoading={isDeleting}
          onViewSelected={handleViewSelected}
          onDeleteSelected={handleDeleteSelected}
          onClearSelection={() => setSelectedUserIds([])}
        />

        <UserTable
          users={users}
          rolesById={rolesById}
          selectedUserIds={selectedUserIds}
          isLoading={isLoading || rolesQuery.isLoading}
          onSelectionChange={handleSelectionChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {usersMeta && (
          <div className="mt-4">
            <ServerPagination
              skip={usersMeta.skip}
              limit={usersMeta.limit}
              total={usersMeta.total}
              hasNext={usersMeta.hasNext}
              hasPrevious={usersMeta.hasPrevious}
              isLoading={isLoading}
              onSkipChange={(nextSkip) =>
                setPagination((prev) => ({ ...prev, skip: nextSkip }))
              }
              onLimitChange={(nextLimit) =>
                setPagination({ skip: 0, limit: nextLimit })
              }
            />
          </div>
        )}
      </Card>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        mode={dialogMode}
        roles={roles}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <UserViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        users={usersToView}
        rolesById={rolesById}
      />
    </div>
  );
}
