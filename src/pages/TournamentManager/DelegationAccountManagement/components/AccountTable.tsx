import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Lock, Unlock } from "lucide-react";

interface DelegationAccount {
  id: string;
  name: string;
  email: string;
  delegation: string;
  role: "manager" | "coach" | "medical";
  status: "active" | "inactive" | "locked";
  lastLogin: string;
  permissions: string[];
}

const mockAccounts: DelegationAccount[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@hanoi.vn",
    delegation: "Đoàn Hà Nội",
    role: "manager",
    status: "active",
    lastLogin: "2024-12-15 14:30",
    permissions: [
      "view_athletes",
      "edit_athletes",
      "view_schedule",
      "submit_results",
    ],
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@hanoi.vn",
    delegation: "Đoàn Hà Nội",
    role: "coach",
    status: "active",
    lastLogin: "2024-12-15 10:15",
    permissions: ["view_athletes", "view_schedule"],
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@hcm.vn",
    delegation: "Đoàn TP.HCM",
    role: "manager",
    status: "active",
    lastLogin: "2024-12-14 16:45",
    permissions: [
      "view_athletes",
      "edit_athletes",
      "view_schedule",
      "submit_results",
    ],
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@hcm.vn",
    delegation: "Đoàn TP.HCM",
    role: "medical",
    status: "active",
    lastLogin: "2024-12-14 09:20",
    permissions: ["view_athletes", "medical_reports"],
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoangvane@danang.vn",
    delegation: "Đoàn Đà Nẵng",
    role: "manager",
    status: "locked",
    lastLogin: "2024-12-10 11:30",
    permissions: ["view_athletes", "edit_athletes", "view_schedule"],
  },
  {
    id: "6",
    name: "Võ Thị F",
    email: "vothif@danang.vn",
    delegation: "Đoàn Đà Nẵng",
    role: "coach",
    status: "inactive",
    lastLogin: "2024-12-05 15:00",
    permissions: ["view_athletes", "view_schedule"],
  },
];

const getRoleLabel = (role: DelegationAccount["role"]) => {
  const labels = {
    manager: "Quản lý đoàn",
    coach: "Huấn luyện viên",
    medical: "Y tế",
  };
  return labels[role];
};

const getStatusColor = (status: DelegationAccount["status"]) => {
  const colors = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
    locked: "bg-red-100 text-red-700",
  };
  return colors[status];
};

const getStatusLabel = (status: DelegationAccount["status"]) => {
  const labels = {
    active: "Hoạt động",
    inactive: "Không hoạt động",
    locked: "Đã khóa",
  };
  return labels[status];
};

export default function AccountTable() {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tài khoản</TableHead>
            <TableHead>Đoàn</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Đăng nhập gần đây</TableHead>
            <TableHead>Số quyền</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAccounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account.email}`}
                    />
                    <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{account.delegation}</TableCell>
              <TableCell>
                <Badge variant="outline">{getRoleLabel(account.role)}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(account.status)}>
                  {getStatusLabel(account.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">{account.lastLogin}</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {account.permissions.length} quyền
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    {account.status === "locked" ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
