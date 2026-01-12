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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash2, Lock, Unlock } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "Admin",
    status: "active",
    createdAt: "01/01/2024",
    lastLogin: "10/01/2024 09:30",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "QLGĐ",
    status: "active",
    createdAt: "05/01/2024",
    lastLogin: "10/01/2024 08:15",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: "Tổng TT",
    status: "active",
    createdAt: "10/01/2024",
    lastLogin: "09/01/2024 16:45",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    role: "Đoàn",
    status: "inactive",
    createdAt: "15/12/2023",
    lastLogin: "05/01/2024 10:20",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    role: "QLGĐ",
    status: "active",
    createdAt: "20/12/2023",
    lastLogin: "10/01/2024 07:00",
  },
  {
    id: 6,
    name: "Vũ Thị F",
    email: "vuthif@example.com",
    role: "Đoàn",
    status: "suspended",
    createdAt: "01/11/2023",
    lastLogin: "20/12/2023 14:30",
  },
  {
    id: 7,
    name: "Đặng Văn G",
    email: "dangvang@example.com",
    role: "Tổng TT",
    status: "active",
    createdAt: "10/11/2023",
    lastLogin: "09/01/2024 11:20",
  },
  {
    id: 8,
    name: "Bùi Thị H",
    email: "buithih@example.com",
    role: "Đoàn",
    status: "active",
    createdAt: "15/10/2023",
    lastLogin: "10/01/2024 13:45",
  },
];

const getStatusBadge = (status: User["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Hoạt động</Badge>;
    case "inactive":
      return <Badge variant="secondary">Không hoạt động</Badge>;
    case "suspended":
      return <Badge variant="destructive">Đã khóa</Badge>;
  }
};

const getRoleBadge = (role: string) => {
  const colors: Record<string, string> = {
    Admin: "bg-blue-500",
    QLGĐ: "bg-green-500",
    "Tổng TT": "bg-purple-500",
    Đoàn: "bg-orange-500",
  };
  return <Badge className={colors[role] || "bg-gray-500"}>{role}</Badge>;
};

interface UserTableProps {
  searchQuery: string;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

export default function UserTable({
  searchQuery,
  onEdit,
  onDelete,
}: UserTableProps) {
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Người dùng</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Lần đăng nhập cuối</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                Không tìm thấy người dùng nào
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {user.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastLogin}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={
                        user.status === "suspended"
                          ? "text-green-500"
                          : "text-orange-500"
                      }
                    >
                      {user.status === "suspended" ? (
                        <Unlock className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => onDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export type { User };
