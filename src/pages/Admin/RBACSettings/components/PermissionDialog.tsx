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
import { useTranslation } from "@/hooks/useTranslation";
import type { Permission } from "@/types";

export interface PermissionDialogSubmitData {
  name: string;
}

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  permission?: Permission | null;
  isSubmitting?: boolean;
  onSubmit: (data: PermissionDialogSubmitData) => Promise<void> | void;
}

export default function PermissionDialog({
  open,
  onOpenChange,
  mode,
  permission,
  isSubmitting,
  onSubmit,
}: PermissionDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(mode === "edit" && permission ? permission.name : "");
  }, [mode, open, permission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    await onSubmit({
      name: name.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? t("admin.addPermission")
              : t("admin.editPermission")}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? t("admin.createPermissionDescription")
              : t("admin.editPermissionDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 py-2">
            <Label htmlFor="permission-name">{t("admin.permissionName")}</Label>
            <Input
              id="permission-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("admin.permissionNamePlaceholder")}
              required
            />
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
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
