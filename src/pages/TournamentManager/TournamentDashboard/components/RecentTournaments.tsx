import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Eye, Edit, Loader2 } from "lucide-react";
import { tournamentService } from "@/services";
import { showToast } from "@/utils/toast.utils";
import type { Tournament } from "@/types";

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

interface RecentTournamentsProps {
  onEditTournament?: (tournamentId: number) => void;
  onNavigateToList?: () => void;
}

export default function RecentTournaments({
  onEditTournament,
  onNavigateToList,
}: RecentTournamentsProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      const data = await tournamentService.getAllTournaments(0, 5);
      setTournaments(data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      showToast.error(
        "Không thể tải danh sách giải đấu",
        error instanceof Error ? error.message : "Vui lòng thử lại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Giải đấu gần đây</h2>
        <div className="flex gap-2">
          {onNavigateToList && (
            <Button variant="outline" size="sm" onClick={onNavigateToList}>
              Xem tất cả
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={fetchTournaments}>
            Làm mới
          </Button>
        </div>
      </div>

      {tournaments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Chưa có giải đấu nào
        </div>
      ) : (
        <div className="space-y-4">
          {tournaments.map((tournament) => (
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
                        {formatDate(tournament.startDate)}
                        {tournament.endDate && ` - ${formatDate(tournament.endDate)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{tournament.location}</span>
                    </div>
                    {tournament.contents && tournament.contents.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{tournament.contents.length} nội dung thi đấu</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => console.log("View tournament:", tournament.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      onEditTournament
                        ? onEditTournament(tournament.id)
                        : console.log("Edit tournament:", tournament.id)
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
