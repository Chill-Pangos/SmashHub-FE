import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Trophy,
} from "lucide-react";
import { tournamentService } from "@/services";
import { showToast } from "@/utils/toast.utils";
import type { Tournament, TournamentContent } from "@/types";

interface TournamentDetailProps {
  tournamentId: number;
  onBack?: () => void;
  onEdit?: (tournamentId: number) => void;
  onDelete?: (tournamentId: number) => void;
}

export default function TournamentDetail({
  tournamentId,
  onBack,
  onEdit,
  onDelete,
}: TournamentDetailProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTournament = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await tournamentService.getTournamentById(tournamentId);
      setTournament(data);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      showToast.error(
        "Không thể tải thông tin giải đấu",
        error instanceof Error ? error.message : "Vui lòng thử lại"
      );
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchTournament();
  }, [fetchTournament]);

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa giải đấu này?")) {
      return;
    }

    try {
      await tournamentService.deleteTournament(tournamentId);
      showToast.success("Đã xóa giải đấu");
      onDelete?.(tournamentId);
    } catch (error) {
      console.error("Error deleting tournament:", error);
      showToast.error(
        "Không thể xóa giải đấu",
        error instanceof Error ? error.message : "Vui lòng thử lại"
      );
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: Tournament["status"]) => {
    switch (status) {
      case "ongoing":
        return <Badge className="bg-green-500 text-white">Đang diễn ra</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500 text-white">Sắp diễn ra</Badge>;
      case "completed":
        return <Badge variant="secondary">Đã kết thúc</Badge>;
    }
  };

  const getTypeBadge = (type: TournamentContent["type"]) => {
    switch (type) {
      case "single":
        return <Badge variant="outline">Đơn</Badge>;
      case "double":
        return <Badge variant="outline">Đôi</Badge>;
      case "team":
        return <Badge variant="outline">Đồng đội</Badge>;
    }
  };

  const getGenderBadge = (gender?: TournamentContent["gender"]) => {
    if (!gender) return null;
    switch (gender) {
      case "male":
        return <Badge className="bg-blue-500 text-white">Nam</Badge>;
      case "female":
        return <Badge className="bg-pink-500 text-white">Nữ</Badge>;
      case "mixed":
        return <Badge className="bg-purple-500 text-white">Hỗn hợp</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!tournament) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          Không tìm thấy giải đấu
        </div>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit?.(tournamentId)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Tournament Info */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{tournament.name}</h1>
              <div className="mt-2">{getStatusBadge(tournament.status)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Thời gian
              </h3>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm">
                    <strong>Bắt đầu:</strong> {formatDate(tournament.startDate)}
                  </p>
                  {tournament.endDate && (
                    <p className="text-sm mt-1">
                      <strong>Kết thúc:</strong>{" "}
                      {formatDate(tournament.endDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Địa điểm
              </h3>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{tournament.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Thông tin khác
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>ID:</strong> {tournament.id}
                </p>
                <p>
                  <strong>Người tạo:</strong> {tournament.createdBy}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(tournament.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <p>
                  <strong>Cập nhật lần cuối:</strong>{" "}
                  {new Date(tournament.updatedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tournament Contents */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Nội dung thi đấu
          </h2>
          <Badge variant="secondary">
            {tournament.contents?.length || 0} nội dung
          </Badge>
        </div>

        {!tournament.contents || tournament.contents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Chưa có nội dung thi đấu
          </div>
        ) : (
          <div className="space-y-4">
            {tournament.contents.map((content, index) => (
              <Card key={content.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge>{index + 1}</Badge>
                    <h3 className="font-semibold text-lg">{content.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    {getTypeBadge(content.type)}
                    {getGenderBadge(content.gender)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Số lượng:</span>
                    <p className="font-semibold">{content.maxEntries}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Số set:</span>
                    <p className="font-semibold">{content.maxSets}</p>
                  </div>

                  {content.type === "team" && (
                    <>
                      {content.numberOfSingles !== null && (
                        <div>
                          <span className="text-muted-foreground">Đơn:</span>
                          <p className="font-semibold">
                            {content.numberOfSingles}
                          </p>
                        </div>
                      )}
                      {content.numberOfDoubles !== null && (
                        <div>
                          <span className="text-muted-foreground">Đôi:</span>
                          <p className="font-semibold">
                            {content.numberOfDoubles}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {(content.minAge !== null || content.maxAge !== null) && (
                    <div>
                      <span className="text-muted-foreground">Tuổi:</span>
                      <p className="font-semibold">
                        {content.minAge || ""}
                        {content.minAge && content.maxAge && " - "}
                        {content.maxAge || ""}
                      </p>
                    </div>
                  )}

                  {(content.minElo !== null || content.maxElo !== null) && (
                    <div>
                      <span className="text-muted-foreground">ELO:</span>
                      <p className="font-semibold">
                        {content.minElo || ""}
                        {content.minElo && content.maxElo && " - "}
                        {content.maxElo || ""}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-3 pt-3 border-t">
                  {content.isGroupStage && (
                    <Badge variant="outline">Có vòng bảng</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
