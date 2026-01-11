import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, Calendar } from "lucide-react";

export default function MatchFilters() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Bộ lọc:</span>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">
            Trạng thái
          </Label>
          <Select defaultValue="all" onValueChange={() => {}}>
            <SelectTrigger id="status-filter" className="w-[150px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="scheduled">Đã lên lịch</SelectItem>
              <SelectItem value="ongoing">Đang diễn ra</SelectItem>
              <SelectItem value="completed">Đã kết thúc</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="round-filter" className="text-sm whitespace-nowrap">
            Vòng đấu
          </Label>
          <Select defaultValue="all" onValueChange={() => {}}>
            <SelectTrigger id="round-filter" className="w-[150px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vòng</SelectItem>
              <SelectItem value="1/32">Vòng 1/32</SelectItem>
              <SelectItem value="1/16">Vòng 1/16</SelectItem>
              <SelectItem value="1/8">Vòng 1/8</SelectItem>
              <SelectItem value="1/4">Tứ kết</SelectItem>
              <SelectItem value="1/2">Bán kết</SelectItem>
              <SelectItem value="final">Chung kết</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="date-filter" className="text-sm whitespace-nowrap">
            Ngày thi đấu
          </Label>
          <Select defaultValue="today" onValueChange={() => {}}>
            <SelectTrigger id="date-filter" className="w-[150px]">
              <SelectValue placeholder="Hôm nay" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="tomorrow">Ngày mai</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="all">Tất cả</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="sm">
          Xóa bộ lọc
        </Button>
      </div>
    </Card>
  );
}
