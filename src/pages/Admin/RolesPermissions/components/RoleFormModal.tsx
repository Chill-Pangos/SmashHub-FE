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
import { Textarea } from "@/components/ui/textarea";
import { useCreateRole, useUpdateRole } from "@/hooks/queries/useRoleQueries";
import { toast } from "sonner";
import type { Role, CreateRoleRequest, UpdateRoleRequest } from "@/types/role.types";
import { useTranslation } from "react-i18next";

interface RoleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
}

export default function RoleFormModal({ open, onOpenChange, role }: RoleFormModalProps) {
  const { t } = useTranslation();
  const isEdit = !!role;
  const [formData, setFormData] = useState<CreateRoleRequest | UpdateRoleRequest>({
    name: "",
    description: "",
  });

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  useEffect(() => {
    if (open) {
      if (role) {
        setFormData({
          name: role.name,
          description: role.description || "",
        });
      } else {
        setFormData({
          name: "",
          description: "",
        });
      }
    }
  }, [open, role]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && role) {
      updateRole.mutate(
        { id: role.id, data: formData as UpdateRoleRequest },
        {
          onSuccess: () => {
            toast.success(t("adminRoles.roleUpdated", "Role updated successfully"));
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error(error.message || t("adminRoles.updateRoleError", "Failed to update role"));
          },
        }
      );
    } else {
      createRole.mutate(formData as CreateRoleRequest, {
        onSuccess: () => {
          toast.success(t("adminRoles.roleCreated", "Role created successfully"));
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.message || t("adminRoles.createRoleError", "Failed to create role"));
        },
      });
    }
  };

  const isLoading = createRole.isPending || updateRole.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? t("adminRoles.editRole", "Edit Role") : t("adminRoles.createRole", "Create Role")}</DialogTitle>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t("adminRoles.desc", "Description")}
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
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
