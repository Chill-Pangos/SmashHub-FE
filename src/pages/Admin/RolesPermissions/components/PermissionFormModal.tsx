import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreatePermission, useUpdatePermission } from "@/hooks/queries/usePermissionQueries";
import { toast } from "sonner";
import type { Permission, CreatePermissionRequest, UpdatePermissionRequest } from "@/types/permission.types";
import { useTranslation } from "react-i18next";

interface PermissionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission?: Permission | null;
}

export default function PermissionFormModal({ open, onOpenChange, permission }: PermissionFormModalProps) {
  const { t } = useTranslation();
  const isEdit = !!permission;
  const [formData, setFormData] = useState<CreatePermissionRequest | UpdatePermissionRequest>({
    name: "",
  });

  const createPermission = useCreatePermission();
  const updatePermission = useUpdatePermission();

  useEffect(() => {
    if (open) {
      if (permission) {
        setFormData({
          name: permission.name,
        });
      } else {
        setFormData({
          name: "",
        });
      }
    }
  }, [open, permission]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && permission) {
      updatePermission.mutate(
        { id: permission.id, data: formData as UpdatePermissionRequest },
        {
          onSuccess: () => {
            toast.success(t("adminRoles.permissionUpdated", "Permission updated successfully"));
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error(error.message || t("adminRoles.updatePermissionError", "Failed to update permission"));
          },
        }
      );
    } else {
      createPermission.mutate(formData as CreatePermissionRequest, {
        onSuccess: () => {
          toast.success(t("adminRoles.permissionCreated", "Permission created successfully"));
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.message || t("adminRoles.createPermissionError", "Failed to create permission"));
        },
      });
    }
  };

  const isLoading = createPermission.isPending || updatePermission.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? t("adminRoles.editPermission", "Edit Permission") : t("adminRoles.createPermission", "Create Permission")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("adminRoles.name", "Name")}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("adminRoles.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("adminRoles.saving", "Saving...") : t("adminRoles.saveChanges", "Save changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
