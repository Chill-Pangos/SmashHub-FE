import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Edit, Eye, Trophy } from "lucide-react";

interface Match {
  id: number;
  matchNumber: string;
  tournament: string;
  round: string;
  player1: string;
  player2: string;
  delegation1: string;
  delegation2: string;
  datetime: string;
  venue: string;
  court: string;
  referee: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  score?: string;
}

const mockMatches: Match[] = [
  {
    id: 1,
    matchNumber: "M001",
    tournament: "Giải Vô Địch Quốc Gia 2024",
    round: "Vòng 1/32",
    player1: "Nguyễn Văn A",
    player2: "Trần Văn B",
    delegation1: "Đoàn Hà Nội",
    delegation2: "Đoàn TPHCM",
    datetime: "2024-01-15 09:00",
    venue: "Sân chính",
    court: "Court 1",
    referee: "Lê Văn X",
    status: "completed",
    score: "3-1 (11-8, 11-9, 9-11, 11-7)",
  },
  {
    id: 2,
    matchNumber: "M002",
    tournament: "Giải Vô Địch Quốc Gia 2024",
    round: "Vòng 1/32",
    player1: "Phạm Thị C",
    player2: "Hoàng Thị D",
    delegation1: "Đoàn Đà Nẵng",
    delegation2: "Đoàn Hải Phòng",
    datetime: "2024-01-15 09:30",
    venue: "Sân chính",
    court: "Court 2",
    referee: "Đỗ Thị Y",
    status: "ongoing",
  },
  {
    id: 3,
    matchNumber: "M003",
    tournament: "Giải Vô Địch Quốc Gia 2024",
    round: "Vòng 1/32",
    player1: "Vũ Văn E",
    player2: "Bùi Văn F",
    delegation1: "Đoàn Cần Thơ",
    delegation2: "Đoàn Hà Nội",
    datetime: "2024-01-15 10:00",
    venue: "Sân phụ",
    court: "Court 3",
    referee: "Ngô Văn Z",
    status: "scheduled",
  },
  {
    id: 4,
    matchNumber: "M004",
    tournament: "Giải Vô Địch Quốc Gia 2024",
    round: "Vòng 1/32",
    player1: "Đặng Thị G",
    player2: "Mai Thị H",
    delegation1: "Đoàn TPHCM",
    delegation2: "Đoàn Đà Nẵng",
    datetime: "2024-01-15 10:30",
    venue: "Sân phụ",
    court: "Court 4",
    referee: "Trương Văn W",
    status: "scheduled",
  },
];

const getStatusBadge = (status: Match["status"]) => {
  switch (status) {
    case "scheduled":
      return <Badge className="bg-blue-500">Đã lên lịch</Badge>;
    case "ongoing":
      return <Badge className="bg-green-500 animate-pulse">Đang diễn ra</Badge>;
    case "completed":
      return <Badge variant="secondary">Đã kết thúc</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Đã hủy</Badge>;
  }
};

interface MatchTableProps {
  searchQuery: string;
  filterStatus?: string;
  onEdit: (match: Match) => void;
  onViewDetail: (matchId: number) => void;
}

export default function MatchTable({
  searchQuery,
  filterStatus,
  onEdit,
  onViewDetail,
}: MatchTableProps) {
  const filteredMatches = mockMatches.filter((match) => {
    const matchesSearch =
      match.matchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.player1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.player2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.delegation1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.delegation2.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      !filterStatus || filterStatus === "all" || match.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã trận</TableHead>
            <TableHead>Đối thủ</TableHead>
            <TableHead>Vòng đấu</TableHead>
            <TableHead>Thời gian & Địa điểm</TableHead>
            <TableHead>Trọng tài</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMatches.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                Không tìm thấy trận đấu nào
              </TableCell>
            </TableRow>
          ) : (
            filteredMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>
                  <div className="font-mono font-semibold">
                    {match.matchNumber}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {match.tournament}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{match.player1}</span>
                      <span className="text-xs text-muted-foreground">
                        ({match.delegation1})
                      </span>
                    </div>
                    <div className="text-muted-foreground text-sm">vs</div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-red-500" />
                      <span className="font-medium">{match.player2}</span>
                      <span className="text-xs text-muted-foreground">
                        ({match.delegation2})
                      </span>
                    </div>
                  </div>
                  {match.score && (
                    <div className="mt-2 pt-2 border-t">
                      <Trophy className="h-3 w-3 inline mr-1 text-yellow-500" />
                      <span className="text-sm font-semibold">
                        {match.score}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{match.round}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {match.datetime}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {match.venue} - {match.court}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{match.referee}</TableCell>
                <TableCell>{getStatusBadge(match.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetail(match.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(match)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export type { Match };
