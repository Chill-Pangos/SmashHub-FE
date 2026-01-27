import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveMatches, IncidentReport, PendingMatchReview } from "./components";
import { Eye, ClipboardCheck, AlertTriangle } from "lucide-react";

const mockLiveMatches = [
  {
    id: 1,
    court: "Sân 1",
    match: "Nam Đơn - Bán kết A",
    player1: "Nguyễn Văn A (Hà Nội)",
    player2: "Trần Văn B (TP.HCM)",
    score: "21-18, 15-12",
    referee: "Lê Văn C",
    status: "Đang thi đấu",
    time: "35 phút",
  },
  {
    id: 2,
    court: "Sân 2",
    match: "Nữ Đôi - Chung kết",
    player1: "Đội Đà Nẵng",
    player2: "Đội Hải Phòng",
    score: "18-21, 21-19, 8-5",
    referee: "Phạm Thị D",
    status: "Đang thi đấu",
    time: "52 phút",
  },
  {
    id: 3,
    court: "Sân 3",
    match: "Nam Đôi - Vòng loại",
    player1: "Đội Cần Thơ",
    player2: "Đội Huế",
    score: "12-8",
    referee: "Hoàng Văn E",
    status: "Đang thi đấu",
    time: "18 phút",
  },
];

export default function MatchSupervision() {
  const [activeTab, setActiveTab] = useState("live");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Giám sát trận đấu</h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi và duyệt kết quả trận đấu
          </p>
        </div>
        <Button>
          <span className="mr-2">📹</span>
          Xem Camera
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Đang diễn ra
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Chờ duyệt
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Sự cố
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6 mt-6">
          <LiveMatches matches={mockLiveMatches} />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <PendingMatchReview />
        </TabsContent>

        <TabsContent value="incidents" className="mt-6">
          <IncidentReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
