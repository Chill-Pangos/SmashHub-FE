import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import RoleCards from "./components/RoleCards";
import PermissionMatrix from "./components/PermissionMatrix";
import RoleDialog from "./components/RoleDialog";
import ServerPagination from "@/components/custom/ServerPagination";
import { useTranslation } from "@/hooks/useTranslation";
import { useRolesPaginated, useUsers } from "@/hooks/queries";
import type { Role } from "@/types";

export default function RBACSettings() {
  const { t } = useTranslation();
  const [rolePagination, setRolePagination] = useState({ skip: 0, limit: 8 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const rolesQuery = useRolesPaginated(
    rolePagination.skip,
    rolePagination.limit,
  );
  const usersQuery = useUsers(0, 1000);

  const roles = rolesQuery.data?.items ?? [];
  const rolesMeta = rolesQuery.data?.meta;

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setDialogOpen(true);
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.rbacSettingsTitle")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.rbacSettingsDescription")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateRole}>
            <Plus className="mr-2 h-4 w-4" />
            {t("admin.addRole")}
          </Button>
        </div>
      </div>

      <RoleCards
        roles={roles}
        users={usersQuery.data ?? []}
        isLoading={rolesQuery.isLoading || usersQuery.isLoading}
        onEdit={handleEditRole}
      />

      {rolesMeta && (
        <ServerPagination
          skip={rolesMeta.skip}
          limit={rolesMeta.limit}
          total={rolesMeta.total}
          hasNext={rolesMeta.hasNext}
          hasPrevious={rolesMeta.hasPrevious}
          isLoading={rolesQuery.isLoading}
          onSkipChange={(nextSkip) =>
            setRolePagination((prev) => ({ ...prev, skip: nextSkip }))
          }
          onLimitChange={(nextLimit) =>
            setRolePagination({ skip: 0, limit: nextLimit })
          }
        />
      )}

      <PermissionMatrix />

      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={selectedRole ? "edit" : "create"}
        role={selectedRole}
      />
    </div>
  );
}
