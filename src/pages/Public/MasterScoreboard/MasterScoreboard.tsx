import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

export default function MasterScoreboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Bảng tổng sắp huy chương</h1>
        <p className="text-muted-foreground">Cập nhật theo thời gian thực</p>
        <Badge variant="outline" className="mt-2">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          LIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Huy chương Vàng
              </p>
              <p className="text-3xl font-bold mt-1">0</p>
            </div>
            <Trophy className="h-12 w-12 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Huy chương Bạc
              </p>
              <p className="text-3xl font-bold mt-1">0</p>
            </div>
            <Medal className="h-12 w-12 text-gray-400" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Huy chương Đồng
              </p>
              <p className="text-3xl font-bold mt-1">0</p>
            </div>
            <Award className="h-12 w-12 text-orange-600" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b">
            <span className="font-semibold">Hạng</span>
            <span className="font-semibold flex-1 ml-8">Đoàn</span>
            <div className="flex gap-8 font-semibold">
              <span className="w-12 text-center">
                <Trophy className="h-4 w-4 inline text-yellow-500" />
              </span>
              <span className="w-12 text-center">
                <Medal className="h-4 w-4 inline text-gray-400" />
              </span>
              <span className="w-12 text-center">
                <Award className="h-4 w-4 inline text-orange-600" />
              </span>
              <span className="w-12 text-center">Tổng</span>
            </div>
          </div>

          <div className="text-center text-muted-foreground py-12">
            Chưa có dữ liệu bảng xếp hạng
          </div>
        </div>
      </Card>
    </div>
  );
}
