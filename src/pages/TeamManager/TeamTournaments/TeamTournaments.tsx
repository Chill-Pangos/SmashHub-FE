import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin, Users } from "lucide-react";
import { tournamentService } from "@/services";
import { showToast } from "@/utils";
import type { Tournament } from "@/types";

export default function TeamTournaments() {
  const [isLoading, setIsLoading] = useState(true);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "ongoing" | "completed"
  >("all");

  const fetchTournaments = useCallback(async () => {
    try {
      setIsLoading(true);
      let response: Tournament[];

      if (filter === "all") {
        response = await tournamentService.getAllTournaments(0, 50);
      } else {
        response = await tournamentService.getTournamentsByStatus(
          filter,
          0,
          50,
        );
      }

      setTournaments(response);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      showToast.error("Không thể tải danh sách giải đấu");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "outline" | "destructive"
    > = {
      upcoming: "outline",
      ongoing: "default",
      completed: "secondary",
    };
    const labels: Record<string, string> = {
      upcoming: "Sắp diễn ra",
      ongoing: "Đang diễn ra",
      completed: "Đã kết thúc",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Giải đấu</h1>
        <p className="text-muted-foreground mt-1">
          Danh sách các giải đấu có thể tham gia
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { value: "all", label: "Tất cả" },
          { value: "upcoming", label: "Sắp diễn ra" },
          { value: "ongoing", label: "Đang diễn ra" },
          { value: "completed", label: "Đã kết thúc" },
        ].map((tab) => (
          <Badge
            key={tab.value}
            variant={filter === tab.value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter(tab.value as typeof filter)}
          >
            {tab.label}
          </Badge>
        ))}
      </div>

      {/* Tournaments Grid */}
      {tournaments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Không có giải đấu nào</h3>
            <p className="text-muted-foreground">
              Không tìm thấy giải đấu phù hợp với bộ lọc
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  {getStatusBadge(tournament.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(tournament.startDate).toLocaleDateString(
                        "vi-VN",
                      )}
                      {tournament.endDate && (
                        <>
                          {" "}
                          -{" "}
                          {new Date(tournament.endDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{tournament.location}</span>
                  </div>
                  {tournament.contents && tournament.contents.length > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{tournament.contents.length} nội dung thi đấu</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
