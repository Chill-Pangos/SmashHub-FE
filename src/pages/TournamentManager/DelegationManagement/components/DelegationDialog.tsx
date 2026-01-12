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
import type { Delegation } from "./DelegationTable";

interface DelegationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delegation?: Delegation | null;
  mode: "create" | "edit";
}

export default function DelegationDialog({
  open,
  onOpenChange,
  delegation,
  mode,
}: DelegationDialogProps) {
  const [formData, setFormData] = useState({
    name: delegation?.name || "",
    code: delegation?.code || "",
    leader: delegation?.leader || "",
    leaderPhone: delegation?.leaderPhone || "",
    leaderEmail: "",
    address: "",
    status: delegation?.status || "pending",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm đoàn mới" : "Chỉnh sửa thông tin đoàn"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Đăng ký đoàn tham gia giải đấu"
              : "Cập nhật thông tin đoàn thi đấu"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên đoàn *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Đoàn Hà Nội"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Mã đoàn *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="VD: HN"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="leader">Họ tên trưởng đoàn *</Label>
              <Input
                id="leader"
                value={formData.leader}
                onChange={(e) =>
                  setFormData({ ...formData, leader: e.target.value })
                }
                placeholder="Nhập họ tên"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="leaderPhone">Số điện thoại *</Label>
                <Input
                  id="leaderPhone"
                  type="tel"
                  value={formData.leaderPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, leaderPhone: e.target.value })
                  }
                  placeholder="0912345678"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="leaderEmail">Email</Label>
                <Input
                  id="leaderEmail"
                  type="email"
                  value={formData.leaderEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, leaderEmail: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Nhập địa chỉ đoàn"
              />
            </div>

            {mode === "edit" && (
              <div className="grid gap-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Delegation["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đã duyệt</SelectItem>
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
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
              {mode === "create" ? "Thêm đoàn" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
