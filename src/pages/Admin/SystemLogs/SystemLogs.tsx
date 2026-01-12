import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Download, RefreshCw } from "lucide-react";
import LogsTable from "./components/LogsTable";
import LogsFilter from "./components/LogsFilter";
import LogDetailDialog from "./components/LogDetailDialog";

export default function SystemLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    level: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);

  const handleViewDetail = (logId: number) => {
    setSelectedLogId(logId);
    setDetailDialogOpen(true);
  };

  const handleExport = () => {
    console.log("Exporting logs...");
    // Implement export functionality
  };

  const handleRefresh = () => {
    console.log("Refreshing logs...");
    // Implement refresh functionality
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Nhật ký hệ thống</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi và kiểm tra các hoạt động trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      <LogsFilter onFilterChange={setFilters} />

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo người dùng, hành động, mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <LogsTable
          searchQuery={searchQuery}
          filters={filters}
          onViewDetail={handleViewDetail}
        />
      </Card>

      <LogDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        logId={selectedLogId}
      />
    </div>
  );
}
