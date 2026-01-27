import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, Plus, Calendar, Users } from "lucide-react";

export default function TrainingPlan() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kế hoạch huấn luyện</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý kế hoạch tập luyện cho vận động viên
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo kế hoạch mới
        </Button>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="py-12 text-center">
          <Clipboard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Chưa có kế hoạch nào</h3>
          <p className="text-muted-foreground mb-4">
            Bắt đầu tạo kế hoạch huấn luyện cho vận động viên của bạn
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo kế hoạch đầu tiên
          </Button>
        </CardContent>
      </Card>

      {/* Feature Preview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5" />
              Lịch tập luyện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sắp xếp lịch tập luyện hàng ngày, hàng tuần cho vận động viên
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5" />
              Phân công VĐV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Phân công vận động viên vào các buổi tập theo nhóm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clipboard className="h-5 w-5" />
              Theo dõi tiến độ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ghi chú và theo dõi tiến độ của từng vận động viên
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
