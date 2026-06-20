import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteUser } from "@/hooks/queries/useUserQueries";
import { showToast, showApiError } from "@/utils/toast.utils";
import type { AdminUser } from "@/types/user.types";
import { useTranslation } from "react-i18next";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
}

export default function DeleteUserDialog({
  open,
  onOpenChange,
  user,
}: DeleteUserDialogProps) {
  const { t } = useTranslation();
  const deleteUser = useDeleteUser();

  const handleDelete = () => {
    if (!user) return;
    deleteUser.mutate(user.id, {
      onSuccess: () => {
        showToast.success(t("adminPage.deleteUserDialog.success", "User deleted successfully"));
        onOpenChange(false);
      },
      onError: (error: any) => {
        showApiError(error, t("adminPage.deleteUserDialog.error", "Failed to delete user"));
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("adminPage.deleteUserDialog.title", "Are you absolutely sure?")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("adminPage.deleteUserDialog.desc1", "This action cannot be undone. This will permanently delete the user")}{" "}
            <span className="font-semibold text-foreground">
              {user?.firstName} {user?.lastName}
            </span>{" "}
            {t("adminPage.deleteUserDialog.desc2", "and remove their data from our servers.")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUser.isPending}>
            {t("adminPage.deleteUserDialog.cancel", "Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteUser.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteUser.isPending ? t("adminPage.deleteUserDialog.deleting", "Deleting...") : t("adminPage.deleteUserDialog.delete", "Delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
