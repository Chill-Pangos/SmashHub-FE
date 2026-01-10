import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, RefreshCw } from "lucide-react";

export default function SchedulingMatrix() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Xếp lịch thi đấu</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tự động xếp lịch
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Lưu lịch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Tổng trận đấu
          </h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Đã xếp lịch
          </h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Chưa xếp lịch
          </h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Xung đột
          </h3>
          <p className="text-2xl font-bold mt-2 text-red-500">0</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ma trận lịch thi đấu</h2>
        <div className="h-96 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-2" />
            <p>Kéo thả để xếp lịch thi đấu</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
