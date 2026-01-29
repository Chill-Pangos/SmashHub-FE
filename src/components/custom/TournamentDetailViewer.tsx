import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Trophy, Calendar, Info } from "lucide-react";
import TournamentBracketViewer from "@/components/custom/TournamentBracketViewer";
import TournamentScheduleViewer from "@/components/custom/TournamentScheduleViewer";
import type { Tournament } from "@/types";

interface TournamentDetailViewerProps {
  tournament: Tournament;
  onBack: () => void;
}

/**
 * Shared component để xem chi tiết tournament với bracket và schedule
 * Dùng chung cho Spectator, Athlete, Coach, TeamManager
 */
export default function TournamentDetailViewer({
  tournament,
  onBack,
}: TournamentDetailViewerProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    tournament.contents && tournament.contents.length > 0 && tournament.contents[0].id
      ? tournament.contents[0].id
      : null
  );

  const selectedContent = useMemo(() => {
    if (!selectedContentId || !tournament.contents) return null;
    return tournament.contents.find((c) => c.id === selectedContentId);
  }, [selectedContentId, tournament.contents]);

  const hasGroupStage = selectedContent?.isGroupStage ?? true;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{tournament.name}</h1>
            {getStatusBadge(tournament.status)}
          </div>
          <p className="text-muted-foreground">
            {tournament.location} •{" "}
            {new Date(tournament.startDate).toLocaleDateString("vi-VN")}
            {tournament.endDate &&
              ` - ${new Date(tournament.endDate).toLocaleDateString("vi-VN")}`}
          </p>
        </div>
      </div>

      {/* Content Selector */}
      {tournament.contents && tournament.contents.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Nội dung thi đấu:</span>
              <Select
                value={selectedContentId?.toString() || ""}
                onValueChange={(value) => setSelectedContentId(Number(value))}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Chọn nội dung" />
                </SelectTrigger>
                <SelectContent>
                  {tournament.contents.filter(c => c.id !== undefined).map((content) => (
                    <SelectItem key={content.id} value={content.id!.toString()}>
                      {content.name || content.type}
                      {content.gender && ` - ${content.gender}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedContent && (
                <Badge variant="outline">
                  {hasGroupStage ? "Có vòng bảng" : "Knockout"}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="bracket" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Bảng đấu
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Lịch thi đấu
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giải đấu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Địa điểm
                  </h4>
                  <p>{tournament.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Thời gian
                  </h4>
                  <p>
                    {new Date(tournament.startDate).toLocaleDateString("vi-VN")}
                    {tournament.endDate &&
                      ` - ${new Date(tournament.endDate).toLocaleDateString(
                        "vi-VN"
                      )}`}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Trạng thái
                  </h4>
                  {getStatusBadge(tournament.status)}
                </div>
                {tournament.contents && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Số nội dung
                    </h4>
                    <p>{tournament.contents.length} nội dung thi đấu</p>
                  </div>
                )}
              </div>

              {/* Content list */}
              {tournament.contents && tournament.contents.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Các nội dung thi đấu
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tournament.contents.filter(c => c.id !== undefined).map((content) => (
                      <Badge
                        key={content.id}
                        variant={
                          content.id === selectedContentId
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => {
                          if (content.id !== undefined) {
                            setSelectedContentId(content.id);
                            setActiveTab("bracket");
                          }
                        }}
                      >
                        {content.name || content.type}
                        {content.gender && ` - ${content.gender}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bracket Tab */}
        <TabsContent value="bracket" className="mt-4">
          {selectedContentId ? (
            <TournamentBracketViewer
              contentId={selectedContentId}
              hasGroupStage={hasGroupStage}
            />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Vui lòng chọn nội dung thi đấu để xem bảng đấu
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="mt-4">
          {selectedContentId ? (
            <TournamentScheduleViewer contentId={selectedContentId} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Vui lòng chọn nội dung thi đấu để xem lịch thi đấu
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
