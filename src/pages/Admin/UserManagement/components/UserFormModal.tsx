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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUser, useUpdateUser } from "@/hooks/queries/useUserQueries";
import { toast } from "sonner";
import type { AdminUser, CreateUserRequest, UpdateUserRequest } from "@/types/user.types";
import { useTranslation } from "react-i18next";

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
}

export default function UserFormModal({ open, onOpenChange, user }: UserFormModalProps) {
  const { t } = useTranslation();
  const isEdit = !!user;
  const [formData, setFormData] = useState<CreateUserRequest | UpdateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "male",
    dob: "",
    phoneNumber: "",
  });

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: user.gender || "male",
          dob: user.dob || "",
          phoneNumber: user.phoneNumber || "",
        });
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          gender: "male",
          dob: "",
          phoneNumber: "",
        });
      }
    }
  }, [open, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && user) {
      updateUser.mutate(
        { id: user.id, data: formData as UpdateUserRequest },
        {
          onSuccess: () => {
            toast.success(t("adminPage.userFormModal.updateSuccess", "User updated successfully"));
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error(error.message || t("adminPage.userFormModal.updateError", "Failed to update user"));
          },
        }
      );
    } else {
      createUser.mutate(formData as CreateUserRequest, {
        onSuccess: () => {
          toast.success(t("adminPage.userFormModal.createSuccess", "User created successfully"));
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.message || t("adminPage.userFormModal.createError", "Failed to create user"));
        },
      });
    }
  };

  const isLoading = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? t("adminPage.userFormModal.editUser", "Edit User") : t("adminPage.userFormModal.createUser", "Create User")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                {t("adminPage.userFormModal.firstName", "First Name")}
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                {t("adminPage.userFormModal.lastName", "Last Name")}
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t("adminPage.userFormModal.email", "Email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            {!isEdit && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  {t("adminPage.userFormModal.password", "Password")}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={(formData as CreateUserRequest).password || ""}
                  onChange={handleChange}
                  className="col-span-3"
                  required={!isEdit}
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                {t("adminPage.userFormModal.phone", "Phone")}
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dob" className="text-right">
                {t("adminPage.userFormModal.dob", "Date of Birth")}
              </Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                {t("adminPage.userFormModal.gender", "Gender")}
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.gender || "male"}
                  onValueChange={(value) => handleSelectChange(value, "gender")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("adminPage.userFormModal.selectGender", "Select gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("adminPage.userFormModal.male", "Male")}</SelectItem>
                    <SelectItem value="female">{t("adminPage.userFormModal.female", "Female")}</SelectItem>
                    <SelectItem value="other">{t("adminPage.userFormModal.other", "Other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("adminPage.userFormModal.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("adminPage.userFormModal.saving", "Saving...") : t("adminPage.userFormModal.saveChanges", "Save changes")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
