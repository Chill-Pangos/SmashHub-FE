import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { ReportList, ReportGenerator, ExportOptions } from "./components";

export default function ReportsCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trung tâm báo cáo</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm báo cáo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="tournament">Giải đấu</SelectItem>
                <SelectItem value="delegation">Đoàn</SelectItem>
                <SelectItem value="match">Trận đấu</SelectItem>
                <SelectItem value="statistics">Thống kê</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ReportList />
        </div>

        <div className="space-y-6">
          <ReportGenerator />
          <ExportOptions />
        </div>
      </div>
    </div>
  );
}
