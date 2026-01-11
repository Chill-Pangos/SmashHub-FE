import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, Clock, MapPin } from "lucide-react";

interface Conflict {
  id: string;
  type: "player" | "referee" | "venue" | "time";
  severity: "high" | "medium" | "low";
  description: string;
  affectedMatches: {
    matchId: string;
    match: string;
    time: string;
    court: string;
  }[];
  suggestions: string[];
}

const mockConflicts: Conflict[] = [
  {
    id: "1",
    type: "player",
    severity: "high",
    description: "VĐV Nguyễn Tiến Minh bị trùng lịch thi đấu",
    affectedMatches: [
      {
        matchId: "1",
        match: "Nam đơn - Vòng 2",
        time: "10:00 - 16/12/2024",
        court: "Sân 1",
      },
      {
        matchId: "2",
        match: "Nam đôi - Vòng 2",
        time: "10:00 - 16/12/2024",
        court: "Sân 4",
      },
    ],
    suggestions: [
      "Dời trận nam đôi sang 11:00",
      "Chuyển trận nam đơn sang sân 2 lúc 10:30",
    ],
  },
  {
    id: "2",
    type: "referee",
    severity: "medium",
    description:
      "Trọng tài Trần Văn Tuấn được phân công quá nhiều trận liên tiếp",
    affectedMatches: [
      {
        matchId: "3",
        match: "Nam đơn - Bán kết",
        time: "14:00 - 16/12/2024",
        court: "Sân 1",
      },
      {
        matchId: "4",
        match: "Nam đơn - Chung kết",
        time: "15:00 - 16/12/2024",
        court: "Sân 1",
      },
    ],
    suggestions: [
      "Phân công trọng tài khác cho trận chung kết",
      "Tăng thời gian nghỉ giữa các trận",
    ],
  },
  {
    id: "3",
    type: "venue",
    severity: "high",
    description: "Sân 1 bị trùng lặp thời gian",
    affectedMatches: [
      {
        matchId: "5",
        match: "Nữ đơn - Vòng 1",
        time: "09:00 - 16/12/2024",
        court: "Sân 1",
      },
      {
        matchId: "6",
        match: "Đôi nam nữ - Vòng 1",
        time: "09:00 - 16/12/2024",
        court: "Sân 1",
      },
    ],
    suggestions: [
      "Chuyển trận đôi nam nữ sang sân 2",
      "Dời trận đôi nam nữ sang 10:00",
    ],
  },
  {
    id: "4",
    type: "time",
    severity: "low",
    description: "Thời gian nghỉ giữa các trận quá ngắn",
    affectedMatches: [
      {
        matchId: "7",
        match: "Nữ đôi - Vòng 2",
        time: "11:00 - 16/12/2024",
        court: "Sân 2",
      },
      {
        matchId: "8",
        match: "Nữ đôi - Bán kết",
        time: "11:30 - 16/12/2024",
        court: "Sân 2",
      },
    ],
    suggestions: [
      "Tăng thời gian nghỉ lên ít nhất 45 phút",
      "Dời trận bán kết sang 12:00",
    ],
  },
];

const getTypeIcon = (type: Conflict["type"]) => {
  const icons = {
    player: <Users className="h-4 w-4" />,
    referee: <Users className="h-4 w-4" />,
    venue: <MapPin className="h-4 w-4" />,
    time: <Clock className="h-4 w-4" />,
  };
  return icons[type];
};

const getTypeLabel = (type: Conflict["type"]) => {
  const labels = {
    player: "VĐV",
    referee: "Trọng tài",
    venue: "Địa điểm",
    time: "Thời gian",
  };
  return labels[type];
};

const getSeverityColor = (severity: Conflict["severity"]) => {
  const colors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-orange-100 text-orange-700",
    low: "bg-yellow-100 text-yellow-700",
  };
  return colors[severity];
};

const getSeverityLabel = (severity: Conflict["severity"]) => {
  const labels = {
    high: "Nghiêm trọng",
    medium: "Trung bình",
    low: "Thấp",
  };
  return labels[severity];
};

export default function ConflictDetector() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Phát hiện xung đột
        </h2>
        <Badge variant="secondary">{mockConflicts.length} xung đột</Badge>
      </div>

      <div className="space-y-4">
        {mockConflicts.map((conflict) => (
          <div key={conflict.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-muted rounded-lg">
                  {getTypeIcon(conflict.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">
                      {getTypeLabel(conflict.type)}
                    </Badge>
                    <Badge className={getSeverityColor(conflict.severity)}>
                      {getSeverityLabel(conflict.severity)}
                    </Badge>
                  </div>
                  <p className="font-medium">{conflict.description}</p>
                </div>
              </div>
            </div>

            <div className="ml-11 space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Các trận bị ảnh hưởng:
                </p>
                <div className="space-y-1">
                  {conflict.affectedMatches.map((match) => (
                    <div
                      key={match.matchId}
                      className="text-sm p-2 bg-muted rounded"
                    >
                      <span className="font-medium">{match.match}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        • {match.time} • {match.court}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Đề xuất giải quyết:
                </p>
                <div className="space-y-1">
                  {conflict.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline">
                  Bỏ qua
                </Button>
                <Button size="sm">Áp dụng đề xuất</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockConflicts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-green-500" />
          <p className="font-medium">Không phát hiện xung đột nào</p>
          <p className="text-sm">Lịch thi đấu hiện tại không có vấn đề</p>
        </div>
      )}
    </Card>
  );
}
