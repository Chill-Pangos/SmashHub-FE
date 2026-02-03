import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTeamMember } from "@/hooks/queries";
import { showToast } from "@/utils";
import type { TeamMember } from "@/types";

interface DeleteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onSuccess?: () => void;
}

export default function DeleteMemberDialog({
  open,
  onOpenChange,
  member,
  onSuccess,
}: DeleteMemberDialogProps) {
  const deleteMemberMutation = useDeleteTeamMember();

  const handleDelete = async () => {
    if (!member) return;

    try {
      await deleteMemberMutation.mutateAsync(member.id);
      showToast.success("Thành công", "Đã xóa thành viên khỏi đoàn");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      showToast.error("Lỗi", "Không thể xóa thành viên. Vui lòng thử lại.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa thành viên khỏi đoàn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa{" "}
            <span className="font-medium">
              {member?.user?.firstName} {member?.user?.lastName}
            </span>{" "}
            khỏi đoàn? Thao tác này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2 justify-end pt-4">
          <AlertDialogCancel disabled={deleteMemberMutation.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMemberMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMemberMutation.isPending ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
