import { Button } from "@/components/ui/button";
import { LiveMatches, IncidentReport } from "./components";

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
    time: "35 phút"
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
    time: "52 phút"
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
    time: "18 phút"
  }
];

export default function MatchSupervision() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Giám sát trận đấu</h2>
          <p className="text-sm text-muted-foreground">Theo dõi các trận đấu đang diễn ra</p>
        </div>
        <Button>
          <span className="mr-2">📹</span>
          Xem Camera
        </Button>
      </div>

      <LiveMatches matches={mockLiveMatches} />
      <IncidentReport />
    </div>
  );
}
