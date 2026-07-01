import { useEffect } from "react";
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
import { showToast, showApiError } from "@/utils/toast.utils";
import type { AdminUser, CreateUserRequest, UpdateUserRequest } from "@/types/user.types";
import { useTranslation } from "react-i18next";
import { useZodForm } from "@/hooks/useZodForm";
import { getAdminUserSchema } from "@/schemas/admin.schema";
import { z } from "zod";

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
}

export default function UserFormModal({ open, onOpenChange, user }: UserFormModalProps) {
  const { t } = useTranslation();
  const isEdit = !!user;
  const form = useZodForm({
    schema: getAdminUserSchema(t, isEdit),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      gender: "male",
      dob: "",
      phoneNumber: "",
    },
  });

  const { errors } = form.formState;

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: user.gender || "male",
          dob: user.dob || "",
          phoneNumber: user.phoneNumber || "",
        });
      } else {
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          gender: "male",
          dob: "",
          phoneNumber: "",
        });
      }
    } else {
      form.reset();
    }
  }, [open, user, form]);

  type AdminUserFormValues = z.infer<ReturnType<typeof getAdminUserSchema>>;

  const onSubmit = (data: AdminUserFormValues) => {
    if (isEdit && user) {
      updateUser.mutate(
        { id: user.id, data: data as UpdateUserRequest },
        {
          onSuccess: () => {
            showToast.success(t("adminPage.userFormModal.updateSuccess", "User updated successfully"));
            onOpenChange(false);
          },
          onError: (error: any) => {
            showApiError(error, t("adminPage.userFormModal.updateError", "Failed to update user"));
          },
        }
      );
    } else {
      createUser.mutate(data as CreateUserRequest, {
        onSuccess: () => {
          showToast.success(t("adminPage.userFormModal.createSuccess", "User created successfully"));
          onOpenChange(false);
        },
        onError: (error: any) => {
          showApiError(error, t("adminPage.userFormModal.createError", "Failed to create user"));
        },
      });
    }
  };

  const isSubmitting = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("adminPage.userFormModal.editUser", "Edit User") : t("adminPage.userFormModal.addUser", "Add New User")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("adminPage.userFormModal.firstName", "First Name")}</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...form.register("firstName")}
              />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("adminPage.userFormModal.lastName", "Last Name")}</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...form.register("lastName")}
              />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message as string}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("adminPage.userFormModal.email", "Email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...form.register("email")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message as string}</p>}
          </div>
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">{t("adminPage.userFormModal.password", "Password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message as string}</p>}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{t("adminPage.userFormModal.phoneNumber", "Phone Number")}</Label>
            <Input
              id="phoneNumber"
              placeholder="+1234567890"
              {...form.register("phoneNumber")}
            />
            {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber.message as string}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">{t("adminPage.userFormModal.gender", "Gender")}</Label>
              <Select
                value={form.watch("gender")}
                onValueChange={(value) => form.setValue("gender", value, { shouldValidate: true })}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder={t("adminPage.userFormModal.selectGender", "Select gender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("profile.male", "Male")}</SelectItem>
                  <SelectItem value="female">{t("profile.female", "Female")}</SelectItem>
                  <SelectItem value="other">{t("profile.other", "Other")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs text-destructive">{errors.gender.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">{t("adminPage.userFormModal.dob", "Date of Birth")}</Label>
              <Input
                id="dob"
                type="date"
                {...form.register("dob")}
              />
              {errors.dob && <p className="text-xs text-destructive">{errors.dob.message as string}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              {t("adminPage.userFormModal.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("adminPage.userFormModal.saving", "Saving...") : t("adminPage.userFormModal.save", "Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
