import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { useCreateRole, useUpdateRole } from "@/hooks/queries";
import type { Role } from "@/types";
import { showApiError, showToast } from "@/utils/toast.utils";

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  role?: Role | null;
}

export default function RoleDialog({
  open,
  onOpenChange,
  mode,
  role,
}: RoleDialogProps) {
  const { t } = useTranslation();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && role) {
      setName(role.name);
      setDescription(role.description ?? "");
      return;
    }

    setName("");
    setDescription("");
  }, [mode, open, role]);

  const isSubmitting =
    createRoleMutation.isPending || updateRoleMutation.isPending;

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      if (mode === "create") {
        await createRoleMutation.mutateAsync({
          name: name.trim(),
          description: description.trim() || undefined,
        });
        showToast.success(t("admin.roleCreatedSuccess"));
      } else if (role) {
        await updateRoleMutation.mutateAsync({
          id: role.id,
          data: {
            name: name.trim(),
            description: description.trim() || undefined,
          },
        });
        showToast.success(t("admin.roleUpdatedSuccess"));
      }

      onOpenChange(false);
    } catch (error) {
      showApiError(error, t("admin.roleSaveFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("admin.addRole") : t("common.edit")}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? t("admin.createRoleDescription")
              : t("admin.editRoleDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="role-name">{t("admin.roleName")}</Label>
            <Input
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("admin.roleNamePlaceholder")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role-description">
              {t("admin.roleDescription")}
            </Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("admin.roleDescriptionPlaceholder")}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting || !name.trim()}>
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
