import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { TimeSlotMatrix, VenueSelector, ConflictDetector } from "./components";

export default function SchedulingMatrix() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ma trận xếp lịch</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tự động xếp lịch
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Lưu và xuất bản
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng trận đấu</p>
              <p className="text-2xl font-bold">62</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đã xếp lịch</p>
              <p className="text-2xl font-bold">46</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chưa xếp</p>
              <p className="text-2xl font-bold">16</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Xung đột</p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimeSlotMatrix />
        </div>

        <div className="space-y-6">
          <VenueSelector />
        </div>
      </div>

      <ConflictDetector />
    </div>
  );
}
