import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TournamentDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tổng quan giải đấu</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo giải đấu mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Tổng giải đấu
          </h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Đang diễn ra
          </h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Sắp diễn ra
          </h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Đã kết thúc
          </h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Giải đấu gần đây</h2>
        <div className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Chưa có giải đấu nào
          </div>
        </div>
      </Card>
    </div>
  );
}
