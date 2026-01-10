import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface LogsFilterProps {
  onFilterChange: (filters: {
    level: string;
    dateFrom: string;
    dateTo: string;
  }) => void;
}

export default function LogsFilter({ onFilterChange }: LogsFilterProps) {
  const handleReset = () => {
    onFilterChange({ level: "all", dateFrom: "", dateTo: "" });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Bộ lọc:</span>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="level-filter" className="text-sm whitespace-nowrap">
            Mức độ
          </Label>
          <Select defaultValue="all" onValueChange={() => {}}>
            <SelectTrigger id="level-filter" className="w-[150px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="success">Thành công</SelectItem>
              <SelectItem value="info">Thông tin</SelectItem>
              <SelectItem value="warning">Cảnh báo</SelectItem>
              <SelectItem value="error">Lỗi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="date-from" className="text-sm whitespace-nowrap">
            Từ ngày
          </Label>
          <div className="relative">
            <Input
              id="date-from"
              type="date"
              className="w-[150px]"
              onChange={() => {}}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="date-to" className="text-sm whitespace-nowrap">
            Đến ngày
          </Label>
          <div className="relative">
            <Input
              id="date-to"
              type="date"
              className="w-[150px]"
              onChange={() => {}}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="action-filter" className="text-sm whitespace-nowrap">
            Hành động
          </Label>
          <Select defaultValue="all" onValueChange={() => {}}>
            <SelectTrigger id="action-filter" className="w-[150px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="login">Đăng nhập</SelectItem>
              <SelectItem value="create">Tạo mới</SelectItem>
              <SelectItem value="update">Cập nhật</SelectItem>
              <SelectItem value="delete">Xóa</SelectItem>
              <SelectItem value="permission">Phân quyền</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="h-4 w-4 mr-1" />
          Xóa bộ lọc
        </Button>
      </div>
    </Card>
  );
}
