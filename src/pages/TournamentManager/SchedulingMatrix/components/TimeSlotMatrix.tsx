import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";

interface TimeSlot {
  time: string;
  court1: MatchInfo | null;
  court2: MatchInfo | null;
  court3: MatchInfo | null;
  court4: MatchInfo | null;
}

interface MatchInfo {
  id: string;
  category: string;
  players: string;
  round: string;
  hasConflict?: boolean;
}

const mockTimeSlots: TimeSlot[] = [
  {
    time: "08:00",
    court1: {
      id: "1",
      category: "Nam đơn",
      players: "Nguyễn T.M vs Nguyễn H.Đ",
      round: "Vòng 1",
    },
    court2: {
      id: "2",
      category: "Nữ đơn",
      players: "Vũ T.T vs Nguyễn T.L",
      round: "Vòng 1",
    },
    court3: null,
    court4: null,
  },
  {
    time: "09:00",
    court1: {
      id: "3",
      category: "Nam đôi",
      players: "Đỗ T.Đ/Phạm H.N vs...",
      round: "Vòng 1",
    },
    court2: {
      id: "4",
      category: "Nữ đôi",
      players: "Lê T.H/Nguyễn T.A vs...",
      round: "Vòng 1",
    },
    court3: {
      id: "5",
      category: "Nam đơn",
      players: "Phạm C.C vs Lê Đ.M",
      round: "Vòng 1",
    },
    court4: null,
  },
  {
    time: "10:00",
    court1: {
      id: "6",
      category: "Nam đơn",
      players: "Nguyễn T.M vs Phạm C.C",
      round: "Vòng 2",
      hasConflict: true,
    },
    court2: {
      id: "7",
      category: "Đôi nam nữ",
      players: "Nguyễn T.T/Tô T.T vs...",
      round: "Vòng 1",
    },
    court3: {
      id: "8",
      category: "Nữ đơn",
      players: "Vũ T.T vs Bùi T.L",
      round: "Vòng 2",
    },
    court4: {
      id: "9",
      category: "Nam đôi",
      players: "Đỗ T.Đ/Phạm H.N vs...",
      round: "Vòng 2",
      hasConflict: true,
    },
  },
  {
    time: "11:00",
    court1: {
      id: "10",
      category: "Nữ đôi",
      players: "Lê T.H/Nguyễn T.A vs...",
      round: "Vòng 2",
    },
    court2: null,
    court3: {
      id: "11",
      category: "Nam đơn",
      players: "Lê Đ.M vs Trần V.A",
      round: "Vòng 2",
    },
    court4: {
      id: "12",
      category: "Đôi nam nữ",
      players: "Nguyễn T.T/Tô T.T vs...",
      round: "Vòng 2",
    },
  },
  {
    time: "14:00",
    court1: {
      id: "13",
      category: "Nam đơn",
      players: "Bán kết 1",
      round: "Bán kết",
    },
    court2: {
      id: "14",
      category: "Nữ đơn",
      players: "Bán kết 1",
      round: "Bán kết",
    },
    court3: null,
    court4: null,
  },
  {
    time: "15:00",
    court1: {
      id: "15",
      category: "Nam đơn",
      players: "Bán kết 2",
      round: "Bán kết",
    },
    court2: {
      id: "16",
      category: "Nữ đơn",
      players: "Bán kết 2",
      round: "Bán kết",
    },
    court3: null,
    court4: null,
  },
];

export default function TimeSlotMatrix() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Ma trận lịch thi đấu</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Tự động xếp lịch
          </Button>
          <Button variant="outline" size="sm">
            Xuất lịch
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-5 gap-2 mb-2">
            <div className="font-semibold text-sm">Giờ</div>
            <div className="font-semibold text-sm text-center">Sân 1</div>
            <div className="font-semibold text-sm text-center">Sân 2</div>
            <div className="font-semibold text-sm text-center">Sân 3</div>
            <div className="font-semibold text-sm text-center">Sân 4</div>
          </div>

          {mockTimeSlots.map((slot, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 mb-2">
              <div className="flex items-center">
                <Badge variant="outline" className="font-mono">
                  {slot.time}
                </Badge>
              </div>

              {[slot.court1, slot.court2, slot.court3, slot.court4].map(
                (match, courtIdx) => (
                  <div key={courtIdx}>
                    {match ? (
                      <div
                        className={`p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${
                          match.hasConflict
                            ? "bg-red-50 border-red-300"
                            : "bg-blue-50 border-blue-200 hover:border-blue-400"
                        }`}
                      >
                        {match.hasConflict && (
                          <div className="flex items-center gap-1 text-xs text-red-600 mb-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Xung đột</span>
                          </div>
                        )}
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          {match.category} - {match.round}
                        </div>
                        <div className="text-sm font-medium line-clamp-2">
                          {match.players}
                        </div>
                      </div>
                    ) : (
                      <button className="w-full p-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center group">
                        <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded"></div>
          <span>Đã xếp lịch</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-50 border-2 border-red-300 rounded"></div>
          <span>Có xung đột</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-dashed border-gray-200 rounded"></div>
          <span>Trống</span>
        </div>
      </div>
    </Card>
  );
}
