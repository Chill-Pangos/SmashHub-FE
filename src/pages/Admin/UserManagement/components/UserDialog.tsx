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
  password?: string;
  roleId?: number;
  avatarUrl?: string;
  dob?: string;
  phoneNumber?: string;
  gender?: string;
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
    avatarUrl: "",
    dob: "",
    phoneNumber: "",
    gender: "",
  });

  const firstUserRole = useMemo(
    () => (user?.roles?.length ? String(user.roles[0]) : ""),
    [user?.roles],
  );
  const userDob = useMemo(
    () => (user?.dob ? String(user.dob).slice(0, 10) : ""),
    [user?.dob],
  );
  const userGender = useMemo(() => {
    return user?.gender === "male" || user?.gender === "female"
      ? user.gender
      : "";
  }, [user?.gender]);

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
        avatarUrl: user.avatarUrl ?? "",
        dob: userDob,
        phoneNumber: user.phoneNumber ?? "",
        gender: userGender,
      });
      return;
    }

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleId: "",
      avatarUrl: "",
      dob: "",
      phoneNumber: "",
      gender: "",
    });
  }, [firstUserRole, mode, open, user, userDob, userGender]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create" && !formData.roleId) {
      return;
    }

    await onSubmit({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password.trim() || undefined,
      roleId: formData.roleId ? Number(formData.roleId) : undefined,
      avatarUrl: formData.avatarUrl.trim() || "",
      dob: formData.dob,
      phoneNumber: formData.phoneNumber.trim() || "",
      gender: formData.gender || "",
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
                placeholder={
                  mode === "create"
                    ? t("admin.passwordPlaceholder")
                    : t("admin.passwordOptionalPlaceholder")
                }
                required={mode === "create"}
                minLength={mode === "create" ? 6 : undefined}
              />
            </div>

            {mode === "create" && (
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
            )}

            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">{t("admin.avatarUrl")}</Label>
              <Input
                id="avatarUrl"
                value={formData.avatarUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    avatarUrl: e.target.value,
                  }))
                }
                placeholder={t("admin.avatarUrlPlaceholder")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="dob">{t("athlete.dateOfBirth")}</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gender">{t("athlete.gender")}</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder={t("admin.selectGender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("athlete.male")}</SelectItem>
                    <SelectItem value="female">
                      {t("athlete.female")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">{t("auth.phoneNumber")}</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                placeholder={t("auth.phoneNumber")}
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
            <Button
              type="submit"
              disabled={
                isSubmitting || (mode === "create" && roles.length === 0)
              }
            >
              {mode === "create" ? t("admin.createUser") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
