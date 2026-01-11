import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ComplaintFiltersProps {
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterPriority: string;
  setFilterPriority: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
}

export default function ComplaintFilters({
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterType,
  setFilterType,
}: ComplaintFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="new">Mới</SelectItem>
          <SelectItem value="processing">Đang xử lý</SelectItem>
          <SelectItem value="resolved">Đã giải quyết</SelectItem>
          <SelectItem value="rejected">Từ chối</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterPriority} onValueChange={setFilterPriority}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Ưu tiên" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả mức độ</SelectItem>
          <SelectItem value="high">Cao</SelectItem>
          <SelectItem value="medium">Trung bình</SelectItem>
          <SelectItem value="low">Thấp</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Loại khiếu nại" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="score">Điểm số</SelectItem>
          <SelectItem value="rule">Vi phạm luật</SelectItem>
          <SelectItem value="equipment">Thiết bị</SelectItem>
          <SelectItem value="behavior">Hành vi vận động viên</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline">
        <Calendar className="mr-2 h-4 w-4" />
        Chọn ngày
      </Button>
    </div>
  );
}
