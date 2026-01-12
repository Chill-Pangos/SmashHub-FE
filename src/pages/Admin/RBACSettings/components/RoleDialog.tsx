import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId?: string;
}

interface PermissionItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const mockPermissionsByRole: Record<string, PermissionItem[]> = {
  admin: [
    {
      id: "user_view",
      name: "Xem người dùng",
      description: "Xem danh sách và chi tiết người dùng",
      enabled: true,
    },
    {
      id: "user_manage",
      name: "Quản lý người dùng",
      description: "Tạo, sửa, xóa người dùng",
      enabled: true,
    },
    {
      id: "role_manage",
      name: "Phân quyền",
      description: "Quản lý vai trò và phân quyền",
      enabled: true,
    },
    {
      id: "tournament_view",
      name: "Xem giải đấu",
      description: "Xem thông tin giải đấu",
      enabled: true,
    },
    {
      id: "tournament_manage",
      name: "Quản lý giải đấu",
      description: "Tạo, sửa, xóa giải đấu",
      enabled: true,
    },
    {
      id: "system_config",
      name: "Cấu hình hệ thống",
      description: "Thay đổi cấu hình hệ thống",
      enabled: true,
    },
  ],
  "tournament-manager": [
    {
      id: "user_view",
      name: "Xem người dùng",
      description: "Xem danh sách người dùng trong giải đấu",
      enabled: true,
    },
    {
      id: "tournament_view",
      name: "Xem giải đấu",
      description: "Xem thông tin giải đấu",
      enabled: true,
    },
    {
      id: "tournament_manage",
      name: "Quản lý giải đấu",
      description: "Tạo, sửa giải đấu được phân công",
      enabled: true,
    },
    {
      id: "match_manage",
      name: "Quản lý trận đấu",
      description: "Tạo và sắp xếp lịch thi đấu",
      enabled: true,
    },
    {
      id: "referee_assign",
      name: "Phân công trọng tài",
      description: "Phân công trọng tài cho trận đấu",
      enabled: true,
    },
    {
      id: "delegation_view",
      name: "Xem đoàn",
      description: "Xem thông tin đoàn tham gia",
      enabled: true,
    },
  ],
  "chief-referee": [
    {
      id: "tournament_view",
      name: "Xem giải đấu",
      description: "Xem thông tin giải đấu",
      enabled: true,
    },
    {
      id: "match_view",
      name: "Xem trận đấu",
      description: "Xem lịch thi đấu",
      enabled: true,
    },
    {
      id: "result_input",
      name: "Nhập kết quả",
      description: "Nhập và xác nhận kết quả thi đấu",
      enabled: true,
    },
    {
      id: "complaint_handle",
      name: "Xử lý khiếu nại",
      description: "Xem và giải quyết khiếu nại",
      enabled: true,
    },
    {
      id: "referee_view",
      name: "Xem trọng tài",
      description: "Xem danh sách trọng tài",
      enabled: true,
    },
  ],
  delegation: [
    {
      id: "tournament_view",
      name: "Xem giải đấu",
      description: "Xem thông tin giải đấu tham gia",
      enabled: true,
    },
    {
      id: "match_view",
      name: "Xem trận đấu",
      description: "Xem lịch thi đấu của đoàn",
      enabled: true,
    },
    {
      id: "athlete_manage",
      name: "Quản lý VĐV",
      description: "Quản lý vận động viên của đoàn",
      enabled: true,
    },
    {
      id: "registration",
      name: "Đăng ký thi đấu",
      description: "Đăng ký VĐV tham gia giải đấu",
      enabled: true,
    },
    {
      id: "result_view",
      name: "Xem kết quả",
      description: "Xem kết quả thi đấu",
      enabled: false,
    },
  ],
};

export default function RoleDialog({
  open,
  onOpenChange,
  roleId = "admin",
}: RoleDialogProps) {
  const [permissions, setPermissions] = useState<PermissionItem[]>(
    mockPermissionsByRole[roleId] || []
  );

  const togglePermission = (permId: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === permId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSave = () => {
    console.log("Saving permissions:", permissions);
    onOpenChange(false);
  };

  const roleNames: Record<string, string> = {
    admin: "Admin",
    "tournament-manager": "QLGĐ",
    "chief-referee": "Tổng TT",
    delegation: "Đoàn",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa quyền - {roleNames[roleId]}</DialogTitle>
          <DialogDescription>
            Chọn các quyền hạn cho vai trò này
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-3">
            {permissions.map((perm) => (
              <div
                key={perm.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => togglePermission(perm.id)}
              >
                <div
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    perm.enabled
                      ? "bg-primary border-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {perm.enabled && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{perm.name}</p>
                    {perm.enabled && (
                      <Badge variant="outline" className="text-xs">
                        Đã bật
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {perm.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
