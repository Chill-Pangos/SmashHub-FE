import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTeamMember } from "@/hooks/queries";
import { showToast } from "@/utils";
import { Loader2 } from "lucide-react";
import type { TeamMemberRole } from "@/types";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: number;
  onSuccess?: () => void;
}

export default function AddMemberDialog({
  open,
  onOpenChange,
  teamId,
  onSuccess,
}: AddMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMemberRole>("athlete");

  const createMemberMutation = useCreateTeamMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast.error("Lỗi", "Vui lòng nhập email");
      return;
    }

    try {
      // Note: userId will be resolved by backend using email
      // We use 0 as a placeholder here
      await createMemberMutation.mutateAsync({
        teamId,
        userId: 0,
        role,
      });

      showToast.success("Thành công", "Đã thêm thành viên vào đoàn");
      setEmail("");
      setRole("athlete");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      showToast.error("Lỗi", "Không thể thêm thành viên. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm thành viên vào đoàn</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nhập email của thành viên"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={createMemberMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as TeamMemberRole)}
              disabled={createMemberMutation.isPending}
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
              disabled={createMemberMutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={createMemberMutation.isPending}>
              {createMemberMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Thêm thành viên
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
