import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usePermissionsPaginated } from "@/hooks/queries/usePermissionQueries";
import {
  usePermissionsByRole,
  useAssignPermissionToRole,
  useRemovePermissionFromRole,
} from "@/hooks/queries/useRolePermissionQueries";
import { toast } from "sonner";
import type { Role } from "@/types/role.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AssignPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
}

export default function AssignPermissionsModal({
  open,
  onOpenChange,
  role,
}: AssignPermissionsModalProps) {
  const { t } = useTranslation();
  // Fetch all permissions
  const { data: permissionsData, isLoading: isLoadingAll } = usePermissionsPaginated(1, 100);
  const allPermissions = permissionsData?.items || [];

  // Fetch permissions for the specific role
  const { data: rolePermissionsData, isLoading: isLoadingRolePerms } = usePermissionsByRole(
    role?.id || 0,
    1,
    100,
    { enabled: !!role && open }
  );
  const rolePermissions = rolePermissionsData?.items || [];
  
  // Create a set of permission IDs assigned to this role for O(1) lookup
  const assignedPermissionIds = new Set(rolePermissions.map((rp) => rp.permissionId));

  const assignPermission = useAssignPermissionToRole();
  const removePermission = useRemovePermissionFromRole();

  const handleToggle = (permissionId: number, isAssigned: boolean) => {
    if (!role) return;

    if (isAssigned) {
      removePermission.mutate(
        { roleId: role.id, permissionId },
        {
          onError: (err: any) => toast.error(err.message || t("adminRoles.removePermissionError", "Failed to remove permission")),
        }
      );
    } else {
      assignPermission.mutate(
        { roleId: role.id, permissionId },
        {
          onError: (err: any) => toast.error(err.message || t("adminRoles.assignPermissionError", "Failed to assign permission")),
        }
      );
    }
  };

  const isLoading = isLoadingAll || isLoadingRolePerms;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("adminRoles.assignPermissionsTitle", { name: role?.name, defaultValue: `Assign Permissions: ${role?.name}` })}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : allPermissions.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              {t("adminRoles.noPermissionsSystem", "No permissions found in the system.")}
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {allPermissions.map((permission) => {
                  const isAssigned = assignedPermissionIds.has(permission.id);
                  const isPending =
                    (assignPermission.isPending && assignPermission.variables?.permissionId === permission.id) ||
                    (removePermission.isPending && removePermission.variables?.permissionId === permission.id);

                  return (
                    <div key={permission.id} className="flex items-start space-x-3 rounded-md border p-3">
                      <Checkbox
                        id={`perm-${permission.id}`}
                        checked={isAssigned}
                        disabled={isPending}
                        onCheckedChange={() => handleToggle(permission.id, isAssigned)}
                        className="mt-1"
                      />
                      <div className="space-y-1 leading-none">
                        <Label
                          htmlFor={`perm-${permission.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          ID: {permission.id}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {t("adminRoles.close", "Close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
