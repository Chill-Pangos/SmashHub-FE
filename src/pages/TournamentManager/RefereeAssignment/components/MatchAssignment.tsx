import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { useState } from "react";

interface Match {
  id: string;
  round: string;
  category: string;
  players: string;
  time: string;
  court: string;
}

const mockMatches: Match[] = [
  {
    id: "1",
    round: "Vòng 1",
    category: "Nam đơn",
    players: "Nguyễn Tiến Minh vs Nguyễn Hải Đăng",
    time: "08:00 - 16/12/2024",
    court: "Sân 1",
  },
  {
    id: "2",
    round: "Vòng 1",
    category: "Nữ đơn",
    players: "Vũ Thị Trang vs Nguyễn Thùy Linh",
    time: "09:00 - 16/12/2024",
    court: "Sân 2",
  },
  {
    id: "3",
    round: "Vòng 2",
    category: "Nam đôi",
    players: "Đỗ Tuấn Đức/Phạm Hồng Nam vs Trần Văn A/Lê Văn B",
    time: "10:00 - 16/12/2024",
    court: "Sân 1",
  },
  {
    id: "4",
    round: "Vòng 2",
    category: "Đôi nam nữ",
    players: "Nguyễn Thành Trung/Tô Tròng Thi vs Phạm Văn C/Lê Thị D",
    time: "11:00 - 16/12/2024",
    court: "Sân 3",
  },
];

interface MatchAssignmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MatchAssignment({
  open,
  onOpenChange,
}: MatchAssignmentProps) {
  const [selectedMatch, setSelectedMatch] = useState("");
  const [selectedReferee, setSelectedReferee] = useState("");
  const [selectedLineJudge1, setSelectedLineJudge1] = useState("");
  const [selectedLineJudge2, setSelectedLineJudge2] = useState("");

  const selectedMatchData = mockMatches.find((m) => m.id === selectedMatch);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Phân công trọng tài</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Chọn trận đấu</Label>
            <Select value={selectedMatch} onValueChange={setSelectedMatch}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trận đấu cần phân công" />
              </SelectTrigger>
              <SelectContent>
                {mockMatches.map((match) => (
                  <SelectItem key={match.id} value={match.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{match.round}</Badge>
                      <span>
                        {match.category} - {match.players}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMatchData && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span className="font-medium">Nội dung:</span>
                <span>{selectedMatchData.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Thời gian:</span>
                <span>{selectedMatchData.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Địa điểm:</span>
                <span>{selectedMatchData.court}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Vận động viên:</span>
                <div className="mt-1">{selectedMatchData.players}</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Trọng tài chính</Label>
            <Select
              value={selectedReferee}
              onValueChange={setSelectedReferee}
              disabled={!selectedMatch}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trọng tài chính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="r1">
                  Trần Văn Tuấn (Quốc tế - ⭐ 4.8)
                </SelectItem>
                <SelectItem value="r2">
                  Nguyễn Thị Lan (Quốc tế - ⭐ 4.7)
                </SelectItem>
                <SelectItem value="r3">
                  Lê Hoàng Nam (Quốc gia - ⭐ 4.5)
                </SelectItem>
                <SelectItem value="r4">
                  Phạm Thị Hương (Quốc gia - ⭐ 4.4)
                </SelectItem>
                <SelectItem value="r7">
                  Đặng Quốc Huy (Quốc gia - ⭐ 4.6)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trọng tài biên 1</Label>
              <Select
                value={selectedLineJudge1}
                onValueChange={setSelectedLineJudge1}
                disabled={!selectedMatch}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trọng tài biên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lj1">Hoàng Văn Minh (Khu vực)</SelectItem>
                  <SelectItem value="lj2">Võ Thị Mai (Khu vực)</SelectItem>
                  <SelectItem value="lj3">Bùi Thị Thu (Khu vực)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trọng tài biên 2</Label>
              <Select
                value={selectedLineJudge2}
                onValueChange={setSelectedLineJudge2}
                disabled={!selectedMatch}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trọng tài biên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lj1">Hoàng Văn Minh (Khu vực)</SelectItem>
                  <SelectItem value="lj2">Võ Thị Mai (Khu vực)</SelectItem>
                  <SelectItem value="lj3">Bùi Thị Thu (Khu vực)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <p className="text-blue-700">
              💡 <strong>Gợi ý:</strong> Trọng tài Quốc tế/Quốc gia nên được ưu
              tiên cho các vòng đấu quan trọng (Bán kết, Chung kết).
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button disabled={!selectedMatch || !selectedReferee}>
            Phân công
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
