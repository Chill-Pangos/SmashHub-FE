import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Plus, ShieldCheck } from "lucide-react";
import { useRolesPaginated, useDeleteRole } from "@/hooks/queries/useRoleQueries";
import { usePermissionsPaginated, useDeletePermission } from "@/hooks/queries/usePermissionQueries";
import RoleFormModal from "./components/RoleFormModal";
import PermissionFormModal from "./components/PermissionFormModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import AssignPermissionsModal from "./components/AssignPermissionsModal";
import type { Role } from "@/types/role.types";
import type { Permission } from "@/types/permission.types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function RolesPermissions() {
  const { t } = useTranslation();
  const [rolePage, setRolePage] = useState(1);
  const [permissionPage, setPermissionPage] = useState(1);
  const limit = 10;

  // Role Modals
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [roleDeleteOpen, setRoleDeleteOpen] = useState(false);
  const [assignPermsOpen, setAssignPermsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Permission Modals
  const [permFormOpen, setPermFormOpen] = useState(false);
  const [permDeleteOpen, setPermDeleteOpen] = useState(false);
  const [selectedPerm, setSelectedPerm] = useState<Permission | null>(null);

  // Queries
  const rolesQuery = useRolesPaginated(rolePage, limit);
  const permsQuery = usePermissionsPaginated(permissionPage, limit);

  // Mutations
  const deleteRole = useDeleteRole();
  const deletePermission = useDeletePermission();

  const handleCreateRole = () => {
    setSelectedRole(null);
    setRoleFormOpen(true);
  };

  const handleCreatePermission = () => {
    setSelectedPerm(null);
    setPermFormOpen(true);
  };

  const confirmDeleteRole = () => {
    if (!selectedRole) return;
    deleteRole.mutate(selectedRole.id, {
      onSuccess: () => {
        toast.success(t("adminRoles.roleDeleted", "Role deleted"));
        setRoleDeleteOpen(false);
      },
      onError: (err: any) => toast.error(err.message || t("adminRoles.deleteRoleError", "Failed to delete role")),
    });
  };

  const confirmDeletePerm = () => {
    if (!selectedPerm) return;
    deletePermission.mutate(selectedPerm.id, {
      onSuccess: () => {
        toast.success(t("adminRoles.permissionDeleted", "Permission deleted"));
        setPermDeleteOpen(false);
      },
      onError: (err: any) => toast.error(err.message || t("adminRoles.deletePermissionError", "Failed to delete permission")),
    });
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("adminRoles.title", "Roles & Permissions")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("adminRoles.description", "Manage system roles and assign fine-grained permissions.")}
        </p>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">{t("adminRoles.rolesTab", "Roles")}</TabsTrigger>
          <TabsTrigger value="permissions">{t("adminRoles.permissionsTab", "Permissions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleCreateRole}>
              <Plus className="mr-2 h-4 w-4" /> {t("adminRoles.addRole", "Add Role")}
            </Button>
          </div>
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>{t("adminRoles.id", "ID")}</TableHead>
                  <TableHead>{t("adminRoles.name", "Name")}</TableHead>
                  <TableHead>{t("adminRoles.desc", "Description")}</TableHead>
                  <TableHead className="text-right">{t("adminRoles.actions", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolesQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">{t("adminRoles.loading", "Loading...")}</TableCell>
                  </TableRow>
                ) : rolesQuery.data?.roles?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">{t("adminRoles.noRoles", "No roles found.")}</TableCell>
                  </TableRow>
                ) : (
                  rolesQuery.data?.roles?.map((role: Role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.id}</TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell className="text-muted-foreground">{role.description || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t("adminRoles.assignPermissions", "Assign Permissions")}
                            onClick={() => {
                              setSelectedRole(role);
                              setAssignPermsOpen(true);
                            }}
                          >
                            <ShieldCheck className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedRole(role);
                              setRoleFormOpen(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => {
                              setSelectedRole(role);
                              setRoleDeleteOpen(true);
                            }}
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
            {rolesQuery.data?.pagination && rolesQuery.data.pagination.totalPages > 1 && (
              <div className="p-4 border-t flex items-center justify-end gap-2 bg-muted/20">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!rolesQuery.data.pagination.hasPrevPage}
                  onClick={() => setRolePage(p => p - 1)}
                >
                  {t("adminRoles.prev", "Prev")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!rolesQuery.data.pagination.hasNextPage}
                  onClick={() => setRolePage(p => p + 1)}
                >
                  {t("adminRoles.next", "Next")}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleCreatePermission}>
              <Plus className="mr-2 h-4 w-4" /> {t("adminRoles.addPermission", "Add Permission")}
            </Button>
          </div>
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>{t("adminRoles.id", "ID")}</TableHead>
                  <TableHead>{t("adminRoles.name", "Name")}</TableHead>
                  <TableHead className="text-right">{t("adminRoles.actions", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permsQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">{t("adminRoles.loading", "Loading...")}</TableCell>
                  </TableRow>
                ) : permsQuery.data?.items?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">{t("adminRoles.noPermissions", "No permissions found.")}</TableCell>
                  </TableRow>
                ) : (
                  permsQuery.data?.items?.map((perm: Permission) => (
                    <TableRow key={perm.id}>
                      <TableCell className="font-medium">{perm.id}</TableCell>
                      <TableCell>{perm.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedPerm(perm);
                              setPermFormOpen(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => {
                              setSelectedPerm(perm);
                              setPermDeleteOpen(true);
                            }}
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
            {permsQuery.data?.meta && permsQuery.data.meta.totalPages > 1 && (
              <div className="p-4 border-t flex items-center justify-end gap-2 bg-muted/20">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!permsQuery.data.meta.hasPrevPage}
                  onClick={() => setPermissionPage(p => p - 1)}
                >
                  {t("adminRoles.prev", "Prev")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!permsQuery.data.meta.hasNextPage}
                  onClick={() => setPermissionPage(p => p + 1)}
                >
                  {t("adminRoles.next", "Next")}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Role Modals */}
      <RoleFormModal open={roleFormOpen} onOpenChange={setRoleFormOpen} role={selectedRole} />
      <DeleteConfirmDialog
        open={roleDeleteOpen}
        onOpenChange={setRoleDeleteOpen}
        title={t("adminRoles.deleteRole", "Delete Role")}
        description={t("adminRoles.deleteRoleDesc", { name: selectedRole?.name, defaultValue: `Are you sure you want to delete role "${selectedRole?.name}"?` })}
        onConfirm={confirmDeleteRole}
        isLoading={deleteRole.isPending}
      />
      <AssignPermissionsModal open={assignPermsOpen} onOpenChange={setAssignPermsOpen} role={selectedRole} />

      {/* Permission Modals */}
      <PermissionFormModal open={permFormOpen} onOpenChange={setPermFormOpen} permission={selectedPerm} />
      <DeleteConfirmDialog
        open={permDeleteOpen}
        onOpenChange={setPermDeleteOpen}
        title={t("adminRoles.deletePermission", "Delete Permission")}
        description={t("adminRoles.deletePermissionDesc", { name: selectedPerm?.name, defaultValue: `Are you sure you want to delete permission "${selectedPerm?.name}"?` })}
        onConfirm={confirmDeletePerm}
        isLoading={deletePermission.isPending}
      />
    </div>
  );
}
