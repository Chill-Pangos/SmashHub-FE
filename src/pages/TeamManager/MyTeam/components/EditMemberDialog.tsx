import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUpdateTeamMember } from "@/hooks/queries";
import { showToast } from "@/utils";
import { Loader2 } from "lucide-react";
import type { TeamMember, TeamMemberRole } from "@/types";
import { useState, useEffect } from "react";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onSuccess?: () => void;
}

export default function EditMemberDialog({
  open,
  onOpenChange,
  member,
  onSuccess,
}: EditMemberDialogProps) {
  const [role, setRole] = useState<TeamMemberRole>("athlete");
  const updateMemberMutation = useUpdateTeamMember();

  useEffect(() => {
    if (member) {
      setRole(member.role as TeamMemberRole);
    }
  }, [member, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member) return;

    try {
      await updateMemberMutation.mutateAsync({
        id: member.id,
        data: {
          role,
        },
      });

      showToast.success("Thành công", "Đã cập nhật thông tin thành viên");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      showToast.error(
        "Lỗi",
        "Không thể cập nhật thành viên. Vui lòng thử lại.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thành viên</DialogTitle>
        </DialogHeader>

        {member && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Tên thành viên</Label>
              <div className="p-2 bg-muted rounded text-sm">
                {member.user?.firstName} {member.user?.lastName}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="p-2 bg-muted rounded text-sm">
                {member.user?.email}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as TeamMemberRole)}
                disabled={updateMemberMutation.isPending}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team_manager">Trưởng đoàn</SelectItem>
                  <SelectItem value="coach">Huấn luyện viên</SelectItem>
                  <SelectItem value="athlete">Vận động viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMemberMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateMemberMutation.isPending}>
                {updateMemberMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
