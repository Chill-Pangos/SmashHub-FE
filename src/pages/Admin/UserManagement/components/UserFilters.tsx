import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface UserFiltersProps {
  onFilterChange: (filters: { role: string; status: string }) => void;
}

export default function UserFilters({ onFilterChange }: UserFiltersProps) {
  const handleReset = () => {
    onFilterChange({ role: "all", status: "all" });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Bộ lọc:</span>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="role-filter" className="text-sm">
            Vai trò
          </Label>
          <Select defaultValue="all" onValueChange={() => {}}>
            <SelectTrigger id="role-filter" className="w-[180px]">
              <SelectValue placeholder="Tất cả vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="QLGĐ">QLGĐ</SelectItem>
              <SelectItem value="Tổng TT">Tổng TT</SelectItem>
              <SelectItem value="Đoàn">Đoàn</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="text-sm">
            Trạng thái
          </Label>
          <Select defaultValue="all" onValueChange={() => {}}>
            <SelectTrigger id="status-filter" className="w-[180px]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="suspended">Đã khóa</SelectItem>
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
