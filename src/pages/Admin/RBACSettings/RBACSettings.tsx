import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Shield } from "lucide-react";

export default function RBACSettings() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Phân quyền vai trò</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm vai trò
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold">Admin</h3>
              <p className="text-sm text-muted-foreground">Quản trị hệ thống</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="font-semibold">QLGĐ</h3>
              <p className="text-sm text-muted-foreground">Quản lý giải đấu</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="font-semibold">Tổng TT</h3>
              <p className="text-sm text-muted-foreground">Tổng trọng tài</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ma trận phân quyền</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chức năng</TableHead>
              <TableHead className="text-center">Admin</TableHead>
              <TableHead className="text-center">QLGĐ</TableHead>
              <TableHead className="text-center">Tổng TT</TableHead>
              <TableHead className="text-center">Đoàn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                Chưa có dữ liệu
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
