import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Edit, Users } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  userCount: number;
}

const mockRoles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Quản trị hệ thống - Toàn quyền",
    color: "text-blue-500",
    userCount: 3,
  },
  {
    id: "tournament-manager",
    name: "QLGĐ",
    description: "Quản lý giải đấu",
    color: "text-green-500",
    userCount: 12,
  },
  {
    id: "chief-referee",
    name: "Tổng TT",
    description: "Tổng trọng tài",
    color: "text-purple-500",
    userCount: 5,
  },
  {
    id: "delegation",
    name: "Đoàn",
    description: "Quản lý đoàn thể thao",
    color: "text-orange-500",
    userCount: 45,
  },
];

interface RoleCardsProps {
  onEdit: (roleId: string) => void;
}

export default function RoleCards({ onEdit }: RoleCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockRoles.map((role) => (
        <Card key={role.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${role.color} bg-opacity-10`}>
                <Shield className={`h-6 w-6 ${role.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{role.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {role.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Users className="h-4 w-4" />
            <span>{role.userCount} người dùng</span>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onEdit(role.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa quyền
          </Button>
        </Card>
      ))}
    </div>
  );
}
