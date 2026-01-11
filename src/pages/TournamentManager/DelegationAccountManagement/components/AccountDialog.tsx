import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
}

export default function AccountDialog({
  open,
  onOpenChange,
  mode,
}: AccountDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    delegation: "",
    role: "",
    password: "",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo tài khoản mới" : "Chỉnh sửa tài khoản"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Họ và tên</Label>
            <Input
              placeholder="Nhập họ và tên"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Đoàn</Label>
            <Select
              value={formData.delegation}
              onValueChange={(value) =>
                setFormData({ ...formData, delegation: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn đoàn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hanoi">Đoàn Hà Nội</SelectItem>
                <SelectItem value="hcm">Đoàn TP.HCM</SelectItem>
                <SelectItem value="danang">Đoàn Đà Nẵng</SelectItem>
                <SelectItem value="haiphong">Đoàn Hải Phòng</SelectItem>
                <SelectItem value="cantho">Đoàn Cần Thơ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vai trò</Label>
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
                <SelectItem value="manager">Quản lý đoàn</SelectItem>
                <SelectItem value="coach">Huấn luyện viên</SelectItem>
                <SelectItem value="medical">Y tế</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "create" && (
            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <Input
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Mật khẩu phải có ít nhất 8 ký tự
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button>
            {mode === "create" ? "Tạo tài khoản" : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
