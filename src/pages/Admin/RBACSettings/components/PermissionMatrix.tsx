import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Minus } from "lucide-react";

interface Permission {
  category: string;
  permissions: {
    name: string;
    admin: "full" | "partial" | "none";
    tournamentManager: "full" | "partial" | "none";
    chiefReferee: "full" | "partial" | "none";
    delegation: "full" | "partial" | "none";
  }[];
}

const mockPermissions: Permission[] = [
  {
    category: "Quản lý người dùng",
    permissions: [
      {
        name: "Xem danh sách người dùng",
        admin: "full",
        tournamentManager: "partial",
        chiefReferee: "partial",
        delegation: "none",
      },
      {
        name: "Tạo/Sửa/Xóa người dùng",
        admin: "full",
        tournamentManager: "none",
        chiefReferee: "none",
        delegation: "none",
      },
      {
        name: "Phân quyền người dùng",
        admin: "full",
        tournamentManager: "none",
        chiefReferee: "none",
        delegation: "none",
      },
    ],
  },
  {
    category: "Quản lý giải đấu",
    permissions: [
      {
        name: "Xem thông tin giải đấu",
        admin: "full",
        tournamentManager: "full",
        chiefReferee: "full",
        delegation: "partial",
      },
      {
        name: "Tạo/Sửa giải đấu",
        admin: "full",
        tournamentManager: "full",
        chiefReferee: "none",
        delegation: "none",
      },
      {
        name: "Xóa giải đấu",
        admin: "full",
        tournamentManager: "none",
        chiefReferee: "none",
        delegation: "none",
      },
    ],
  },
  {
    category: "Quản lý trận đấu",
    permissions: [
      {
        name: "Xem lịch thi đấu",
        admin: "full",
        tournamentManager: "full",
        chiefReferee: "full",
        delegation: "full",
      },
      {
        name: "Tạo/Sửa lịch thi đấu",
        admin: "full",
        tournamentManager: "full",
        chiefReferee: "partial",
        delegation: "none",
      },
      {
        name: "Nhập kết quả",
        admin: "full",
        tournamentManager: "none",
        chiefReferee: "full",
        delegation: "none",
      },
    ],
  },
  {
    category: "Quản lý đoàn",
    permissions: [
      {
        name: "Xem danh sách đoàn",
        admin: "full",
        tournamentManager: "full",
        chiefReferee: "full",
        delegation: "partial",
      },
      {
        name: "Tạo/Sửa thông tin đoàn",
        admin: "full",
        tournamentManager: "full",
        chiefReferee: "none",
        delegation: "partial",
      },
      {
        name: "Quản lý VĐV trong đoàn",
        admin: "full",
        tournamentManager: "partial",
        chiefReferee: "none",
        delegation: "full",
      },
    ],
  },
  {
    category: "Báo cáo & Thống kê",
    permissions: [
      {
        name: "Xem báo cáo",
        admin: "full",
        tournamentManager: "full",
        chiefReferee: "full",
        delegation: "partial",
      },
      {
        name: "Xuất báo cáo",
        admin: "full",
        tournamentManager: "full",
        chiefReferee: "partial",
        delegation: "none",
      },
    ],
  },
];

const PermissionIcon = ({ level }: { level: "full" | "partial" | "none" }) => {
  switch (level) {
    case "full":
      return (
        <div className="flex items-center justify-center">
          <Check className="h-5 w-5 text-green-500" />
        </div>
      );
    case "partial":
      return (
        <div className="flex items-center justify-center">
          <Minus className="h-5 w-5 text-yellow-500" />
        </div>
      );
    case "none":
      return (
        <div className="flex items-center justify-center">
          <X className="h-5 w-5 text-red-500" />
        </div>
      );
  }
};

export default function PermissionMatrix() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Ma trận phân quyền</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quyền hạn chi tiết của từng vai trò
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Toàn quyền</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="h-4 w-4 text-yellow-500" />
            <span>Một phần</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-500" />
            <span>Không có</span>
          </div>
        </div>
      </div>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Chức năng</TableHead>
              <TableHead className="text-center">Admin</TableHead>
              <TableHead className="text-center">QLGĐ</TableHead>
              <TableHead className="text-center">Tổng TT</TableHead>
              <TableHead className="text-center">Đoàn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPermissions.map((category, catIndex) => (
              <>
                <TableRow key={`category-${catIndex}`} className="bg-muted/50">
                  <TableCell colSpan={5} className="font-semibold">
                    {category.category}
                  </TableCell>
                </TableRow>
                {category.permissions.map((perm, permIndex) => (
                  <TableRow key={`perm-${catIndex}-${permIndex}`}>
                    <TableCell className="pl-8">{perm.name}</TableCell>
                    <TableCell className="text-center">
                      <PermissionIcon level={perm.admin} />
                    </TableCell>
                    <TableCell className="text-center">
                      <PermissionIcon level={perm.tournamentManager} />
                    </TableCell>
                    <TableCell className="text-center">
                      <PermissionIcon level={perm.chiefReferee} />
                    </TableCell>
                    <TableCell className="text-center">
                      <PermissionIcon level={perm.delegation} />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
