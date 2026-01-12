import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Eye, Edit } from "lucide-react";

interface Tournament {
  id: number;
  name: string;
  status: "upcoming" | "ongoing" | "completed";
  startDate: string;
  endDate: string;
  location: string;
  participants: number;
  delegations: number;
}

const mockTournaments: Tournament[] = [
  {
    id: 1,
    name: "Giải Vô Địch Quốc Gia 2024",
    status: "ongoing",
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    location: "Sân vận động Quốc gia Mỹ Đình",
    participants: 156,
    delegations: 12,
  },
  {
    id: 2,
    name: "Giải Trẻ Toàn Quốc",
    status: "upcoming",
    startDate: "2024-02-01",
    endDate: "2024-02-10",
    location: "Nhà thi đấu Trịnh Hoài Đức",
    participants: 89,
    delegations: 8,
  },
  {
    id: 3,
    name: "Giải Cúp Mùa Xuân",
    status: "completed",
    startDate: "2023-12-20",
    endDate: "2023-12-28",
    location: "Cung thể thao Quần Ngựa",
    participants: 124,
    delegations: 10,
  },
];

const getStatusBadge = (status: Tournament["status"]) => {
  switch (status) {
    case "ongoing":
      return <Badge className="bg-green-500">Đang diễn ra</Badge>;
    case "upcoming":
      return <Badge className="bg-blue-500">Sắp diễn ra</Badge>;
    case "completed":
      return <Badge variant="secondary">Đã kết thúc</Badge>;
  }
};

export default function RecentTournaments() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Giải đấu gần đây</h2>
        <Button variant="outline" size="sm">
          Xem tất cả
        </Button>
      </div>

      <div className="space-y-4">
        {mockTournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{tournament.name}</h3>
                  {getStatusBadge(tournament.status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {tournament.startDate} - {tournament.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{tournament.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-3 border-t">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-semibold">
                    {tournament.participants}
                  </span>{" "}
                  vận động viên
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-semibold">
                    {tournament.delegations}
                  </span>{" "}
                  đoàn
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
