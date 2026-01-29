import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useSchedulesByContent } from "@/hooks/queries";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { Schedule, ScheduleStage } from "@/types";

interface TournamentScheduleViewerProps {
  contentId: number;
  stage?: ScheduleStage;
  limit?: number;
}

/**
 * Shared component để xem lịch thi đấu theo content ID
 * Dùng chung cho Spectator, Athlete, Coach, TeamManager
 */
export default function TournamentScheduleViewer({
  contentId,
  stage,
  limit = 50,
}: TournamentScheduleViewerProps) {
  const {
    data: schedulesData,
    isLoading,
    error,
  } = useSchedulesByContent(contentId, {
    stage,
    limit,
    enabled: contentId > 0,
  });

  // Group schedules by date
  const schedulesByDate = useMemo(() => {
    const schedules = schedulesData?.data || [];
    const grouped: Record<string, Schedule[]> = {};

    schedules.forEach((schedule) => {
      const dateStr = schedule.scheduledAt || schedule.matchTime;
      if (!dateStr) return;

      const date = format(new Date(dateStr), "yyyy-MM-dd");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });

    // Sort each day's schedules by time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => {
        const timeA = new Date(a.scheduledAt || a.matchTime || 0).getTime();
        const timeB = new Date(b.scheduledAt || b.matchTime || 0).getTime();
        return timeA - timeB;
      });
    });

    return grouped;
  }, [schedulesData]);

  const formatTime = (dateStr: string | undefined) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "HH:mm");
    } catch {
      return "-";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "EEEE, dd/MM/yyyy", { locale: vi });
    } catch {
      return dateStr;
    }
  };

  const getStageBadge = (schedule: Schedule) => {
    if (schedule.stage === "knockout") {
      return (
        <Badge variant="default">{schedule.knockoutRound || "Knockout"}</Badge>
      );
    }
    if (schedule.stage === "group") {
      return (
        <Badge variant="secondary">{schedule.groupName || "Vòng bảng"}</Badge>
      );
    }
    return <Badge variant="outline">-</Badge>;
  };

  const getMatchStatusBadge = (schedule: Schedule) => {
    if (!schedule.match) return null;

    switch (schedule.match.status) {
      case "completed":
        return <Badge variant="default">Hoàn thành</Badge>;
      case "in_progress":
        return <Badge variant="destructive">Đang đấu</Badge>;
      case "cancelled":
        return <Badge variant="outline">Hủy</Badge>;
      default:
        return <Badge variant="outline">Sắp diễn ra</Badge>;
    }
  };

  if (contentId <= 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Vui lòng chọn nội dung thi đấu để xem lịch
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 w-full bg-muted animate-pulse rounded-md"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-destructive">
          Không thể tải lịch thi đấu
        </CardContent>
      </Card>
    );
  }

  if (Object.keys(schedulesByDate).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lịch thi đấu
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          Chưa có lịch thi đấu cho nội dung này
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Lịch thi đấu
          {stage && (
            <Badge variant="outline" className="ml-2">
              {stage === "group" ? "Vòng bảng" : "Knockout"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(schedulesByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, daySchedules]) => (
              <div key={date}>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                  <Calendar className="h-4 w-4" />
                  {formatDate(date)}
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Giờ
                        </TableHead>
                        <TableHead className="w-20">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          Bàn
                        </TableHead>
                        <TableHead>Vòng đấu</TableHead>
                        <TableHead>Trận đấu</TableHead>
                        <TableHead className="text-right">Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {daySchedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">
                            {formatTime(
                              schedule.scheduledAt || schedule.matchTime,
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              #{schedule.tableNumber}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStageBadge(schedule)}</TableCell>
                          <TableCell>
                            {schedule.match ? (
                              <span className="text-sm">
                                {schedule.match.entryA?.team?.name ||
                                  `Entry ${schedule.match.entryAId}`}{" "}
                                <span className="text-muted-foreground">
                                  vs
                                </span>{" "}
                                {schedule.match.entryB?.team?.name ||
                                  `Entry ${schedule.match.entryBId}`}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                Match #{schedule.matchId || "TBD"}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {getMatchStatusBadge(schedule)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
