import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import RoleCards from "./components/RoleCards";
import PermissionMatrix from "./components/PermissionMatrix";
import RoleDialog from "./components/RoleDialog";

export default function RBACSettings() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>();

  const handleEditRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Phân quyền vai trò</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý vai trò và phân quyền chi tiết cho từng chức năng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất cấu hình
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Nhập cấu hình
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm vai trò
          </Button>
        </div>
      </div>

      <RoleCards onEdit={handleEditRole} />

      <PermissionMatrix />

      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        roleId={selectedRoleId}
      />
    </div>
  );
}
