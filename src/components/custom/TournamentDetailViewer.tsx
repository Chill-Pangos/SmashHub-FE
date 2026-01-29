import { useState, useMemo, useEffect } from "react";
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
import { ArrowLeft, Trophy, Calendar, Info, AlertCircle } from "lucide-react";
import TournamentBracketViewer from "@/components/custom/TournamentBracketViewer";
import TournamentScheduleViewer from "@/components/custom/TournamentScheduleViewer";
import { useTournament } from "@/hooks/queries";
import type { Tournament } from "@/types";

interface TournamentDetailViewerProps {
  tournament: Tournament;
  onBack: () => void;
}

/**
 * Shared component để xem chi tiết tournament với bracket và schedule
 * Dùng chung cho Spectator, Athlete, Coach, TeamManager, Public
 */
export default function TournamentDetailViewer({
  tournament: initialTournament,
  onBack,
}: TournamentDetailViewerProps) {
  const [activeTab, setActiveTab] = useState("info");

  // Fetch full tournament details to get contents
  const { data: fetchedTournament, isLoading: isLoadingDetails } =
    useTournament(initialTournament.id, { enabled: initialTournament.id > 0 });

  // Use fetched tournament if available, otherwise use initial
  const tournament = fetchedTournament || initialTournament;
  const contents = tournament.contents || [];

  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null,
  );

  // Update selectedContentId when contents are loaded
  useEffect(() => {
    if (contents.length > 0 && contents[0].id && selectedContentId === null) {
      setSelectedContentId(contents[0].id);
    }
  }, [contents, selectedContentId]);

  const selectedContent = useMemo(() => {
    if (!selectedContentId || !contents.length) return null;
    return contents.find((c) => c.id === selectedContentId);
  }, [selectedContentId, contents]);

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

      {/* Loading state for contents */}
      {isLoadingDetails && (
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">
                Đang tải nội dung thi đấu...
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No contents message */}
      {!isLoadingDetails && contents.length === 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Chưa có nội dung thi đấu
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Giải đấu này chưa được thiết lập các nội dung thi đấu. Vui
                  lòng quay lại sau.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Selector */}
      {!isLoadingDetails && contents.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium">Nội dung thi đấu:</span>
              <Select
                value={selectedContentId?.toString() || ""}
                onValueChange={(value) => setSelectedContentId(Number(value))}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Chọn nội dung" />
                </SelectTrigger>
                <SelectContent>
                  {contents
                    .filter((c) => c.id !== undefined)
                    .map((content) => (
                      <SelectItem
                        key={content.id}
                        value={content.id!.toString()}
                      >
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
                        "vi-VN",
                      )}`}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Trạng thái
                  </h4>
                  {getStatusBadge(tournament.status)}
                </div>
                {contents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Số nội dung
                    </h4>
                    <p>{contents.length} nội dung thi đấu</p>
                  </div>
                )}
              </div>

              {/* Content list */}
              {contents.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Các nội dung thi đấu
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {contents
                      .filter((c) => c.id !== undefined)
                      .map((content) => (
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

              {/* Loading contents in Info tab */}
              {isLoadingDetails && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Đang tải nội dung...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bracket Tab */}
        <TabsContent value="bracket" className="mt-4">
          {isLoadingDetails ? (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span className="text-muted-foreground">Đang tải...</span>
                </div>
              </CardContent>
            </Card>
          ) : selectedContentId ? (
            <TournamentBracketViewer
              contentId={selectedContentId}
              hasGroupStage={hasGroupStage}
            />
          ) : contents.length === 0 ? (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardContent className="py-8 text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-3 text-amber-600 dark:text-amber-400" />
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Chưa có nội dung thi đấu
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  Giải đấu này chưa được thiết lập nội dung thi đấu
                </p>
              </CardContent>
            </Card>
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
          {isLoadingDetails ? (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span className="text-muted-foreground">Đang tải...</span>
                </div>
              </CardContent>
            </Card>
          ) : selectedContentId ? (
            <TournamentScheduleViewer contentId={selectedContentId} />
          ) : contents.length === 0 ? (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardContent className="py-8 text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-3 text-amber-600 dark:text-amber-400" />
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Chưa có nội dung thi đấu
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  Giải đấu này chưa được thiết lập nội dung thi đấu
                </p>
              </CardContent>
            </Card>
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
