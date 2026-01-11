import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: "athletes" | "schedule" | "results" | "reports" | "system";
}

const permissions: Permission[] = [
  {
    id: "view_athletes",
    name: "Xem danh sách VĐV",
    description: "Xem thông tin VĐV của đoàn",
    category: "athletes",
  },
  {
    id: "edit_athletes",
    name: "Chỉnh sửa VĐV",
    description: "Thêm, sửa, xóa thông tin VĐV",
    category: "athletes",
  },
  {
    id: "view_schedule",
    name: "Xem lịch thi đấu",
    description: "Xem lịch thi đấu của đoàn",
    category: "schedule",
  },
  {
    id: "edit_schedule",
    name: "Đề xuất lịch",
    description: "Đề xuất thay đổi lịch thi đấu",
    category: "schedule",
  },
  {
    id: "view_results",
    name: "Xem kết quả",
    description: "Xem kết quả thi đấu",
    category: "results",
  },
  {
    id: "submit_results",
    name: "Gửi kết quả",
    description: "Gửi kết quả và khiếu nại",
    category: "results",
  },
  {
    id: "view_reports",
    name: "Xem báo cáo",
    description: "Xem các báo cáo thống kê",
    category: "reports",
  },
  {
    id: "export_reports",
    name: "Xuất báo cáo",
    description: "Xuất báo cáo về máy",
    category: "reports",
  },
  {
    id: "medical_reports",
    name: "Báo cáo y tế",
    description: "Quản lý báo cáo y tế VĐV",
    category: "athletes",
  },
  {
    id: "change_password",
    name: "Đổi mật khẩu",
    description: "Thay đổi mật khẩu cá nhân",
    category: "system",
  },
];

const getCategoryLabel = (category: Permission["category"]) => {
  const labels = {
    athletes: "VĐV",
    schedule: "Lịch thi đấu",
    results: "Kết quả",
    reports: "Báo cáo",
    system: "Hệ thống",
  };
  return labels[category];
};

const getCategoryColor = (category: Permission["category"]) => {
  const colors = {
    athletes: "bg-blue-100 text-blue-700",
    schedule: "bg-green-100 text-green-700",
    results: "bg-purple-100 text-purple-700",
    reports: "bg-orange-100 text-orange-700",
    system: "bg-gray-100 text-gray-700",
  };
  return colors[category];
};

export default function PermissionManager() {
  const categories = [
    "athletes",
    "schedule",
    "results",
    "reports",
    "system",
  ] as const;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quản lý quyền truy cập</h2>
        <Button variant="outline" size="sm">
          Áp dụng mẫu có sẵn
        </Button>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const categoryPermissions = permissions.filter(
            (p) => p.category === category
          );
          return (
            <div key={category}>
              <Badge className={`${getCategoryColor(category)} mb-3`}>
                {getCategoryLabel(category)}
              </Badge>
              <div className="space-y-3 pl-4">
                {categoryPermissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 rounded"
                      defaultChecked={[
                        "view_athletes",
                        "view_schedule",
                        "view_results",
                        "change_password",
                      ].includes(permission.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {permission.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {permission.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
        <Button variant="outline">Đặt lại</Button>
        <Button>Lưu quyền</Button>
      </div>
    </Card>
  );
}
