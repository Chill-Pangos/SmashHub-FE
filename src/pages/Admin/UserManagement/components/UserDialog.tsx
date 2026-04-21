import { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import type { AdminUser, Role } from "@/types";

export interface UserDialogSubmitData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
  mode: "create" | "edit";
  roles: Role[];
  isSubmitting?: boolean;
  onSubmit: (data: UserDialogSubmitData) => Promise<void> | void;
}

export default function UserDialog({
  open,
  onOpenChange,
  user,
  mode,
  roles,
  isSubmitting,
  onSubmit,
}: UserDialogProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleId: "",
  });

  const firstUserRole = useMemo(
    () => (user?.roles?.length ? String(user.roles[0]) : ""),
    [user?.roles],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && user) {
      setFormData({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        password: "",
        roleId: firstUserRole,
      });
      return;
    }

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleId: "",
    });
  }, [firstUserRole, mode, open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roleId) {
      return;
    }

    await onSubmit({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      roleId: Number(formData.roleId),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("admin.createUser") : t("admin.editUser")}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? t("admin.createUserDescription")
              : t("admin.editUserDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="firstName">{t("admin.firstName")}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder={t("auth.fullName")}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">{t("admin.lastName")}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  placeholder={t("auth.fullName")}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="example@email.com"
                required
              />
            </div>

            {mode === "create" && (
              <div className="grid gap-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder={t("admin.passwordPlaceholder")}
                  required
                  minLength={6}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="role">{t("admin.roles")}</Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, roleId: value }))
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder={t("admin.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit" disabled={isSubmitting || roles.length === 0}>
              {mode === "create" ? t("admin.createUser") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
