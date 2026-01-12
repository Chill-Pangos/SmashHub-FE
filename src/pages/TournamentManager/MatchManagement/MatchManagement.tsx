import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Calendar as CalendarIcon } from "lucide-react";
import { MatchTable, MatchFilters } from "./components";
import type { Match } from "./components";

export default function MatchManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (match: Match) => {
    console.log("Edit match:", match);
  };

  const handleViewDetail = (matchId: number) => {
    console.log("View match detail:", matchId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý trận đấu</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi và quản lý tất cả trận đấu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Xem lịch
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất lịch thi đấu
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo trận đấu
          </Button>
        </div>
      </div>

      <MatchFilters />

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã trận, vận động viên, đoàn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <MatchTable
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onViewDetail={handleViewDetail}
        />
      </Card>
    </div>
  );
}
