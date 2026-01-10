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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "./UserTable";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  mode: "create" | "edit";
}

export default function UserDialog({
  open,
  onOpenChange,
  user,
  mode,
}: UserDialogProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "Đoàn",
    status: user?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Tạo tài khoản người dùng mới trong hệ thống"
              : "Cập nhật thông tin người dùng"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Họ và tên *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Vai trò *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="QLGĐ">QLGĐ - Quản lý giải đấu</SelectItem>
                  <SelectItem value="Tổng TT">
                    Tổng TT - Tổng trọng tài
                  </SelectItem>
                  <SelectItem value="Đoàn">Đoàn - Quản lý đoàn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {mode === "edit" && (
              <div className="grid gap-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as User["status"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="suspended">Đã khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {mode === "create" && (
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {mode === "create" ? "Tạo tài khoản" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
