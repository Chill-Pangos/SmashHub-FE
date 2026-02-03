import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, ChevronRight, Medal } from "lucide-react";
import {
  useGroupStandingsByContent,
  useKnockoutBracketsByContent,
} from "@/hooks/queries";
import type { GroupStanding, KnockoutBracket } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface TournamentBracketViewerProps {
  contentId: number;
  hasGroupStage?: boolean;
}

/**
 * Shared component để xem group standings và knockout brackets
 * Dùng chung cho Spectator, Athlete, Coach, TeamManager
 */
export default function TournamentBracketViewer({
  contentId,
  hasGroupStage = true,
}: TournamentBracketViewerProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(
    hasGroupStage ? "groups" : "knockout",
  );

  const {
    data: groupStandingsData,
    isLoading: isLoadingGroups,
    error: groupError,
  } = useGroupStandingsByContent(contentId, {
    enabled: hasGroupStage && contentId > 0,
  });

  const {
    data: knockoutData,
    isLoading: isLoadingKnockout,
    error: knockoutError,
  } = useKnockoutBracketsByContent(contentId, {
    enabled: contentId > 0,
  });

  // Group standings by group name
  const groupedStandings = useMemo(() => {
    const groupStandings = groupStandingsData?.data || [];
    const groups: Record<string, GroupStanding[]> = {};
    groupStandings.forEach((standing) => {
      if (!groups[standing.groupName]) {
        groups[standing.groupName] = [];
      }
      groups[standing.groupName].push(standing);
    });
    // Sort each group by position
    Object.keys(groups).forEach((groupName) => {
      groups[groupName].sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
    });
    return groups;
  }, [groupStandingsData]);

  // Group knockout brackets by round
  const bracketsByRound = useMemo(() => {
    const knockoutBrackets = knockoutData?.data || [];
    const rounds: Record<string, KnockoutBracket[]> = {};
    knockoutBrackets.forEach((bracket) => {
      const roundKey =
        bracket.roundName ||
        t("components.tournamentBracketViewer.round", {
          number: bracket.roundNumber,
        });
      if (!rounds[roundKey]) {
        rounds[roundKey] = [];
      }
      rounds[roundKey].push(bracket);
    });
    // Sort each round by bracket position
    Object.keys(rounds).forEach((roundName) => {
      rounds[roundName].sort((a, b) => a.bracketPosition - b.bracketPosition);
    });
    return rounds;
  }, [knockoutData, t]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default">
            {t("components.tournamentBracketViewer.completed")}
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary">
            {t("components.tournamentBracketViewer.inProgress")}
          </Badge>
        );
      case "ready":
        return (
          <Badge variant="outline">
            {t("components.tournamentBracketViewer.ready")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t("components.tournamentBracketViewer.waiting")}
          </Badge>
        );
    }
  };

  if (contentId <= 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {t("components.tournamentBracketViewer.selectContentToView")}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {t("components.tournamentBracketViewer.bracketAndRounds")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            {hasGroupStage && (
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t("components.tournamentBracketViewer.groupStage")}
              </TabsTrigger>
            )}
            <TabsTrigger value="knockout" className="flex items-center gap-2">
              <Medal className="h-4 w-4" />
              {t("components.tournamentBracketViewer.knockoutStage")}
            </TabsTrigger>
          </TabsList>

          {/* Group Stage Tab */}
          {hasGroupStage && (
            <TabsContent value="groups" className="mt-4">
              {isLoadingGroups ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-48 w-full bg-muted animate-pulse rounded-md"
                    />
                  ))}
                </div>
              ) : groupError ? (
                <div className="text-center text-destructive py-8">
                  {t("components.tournamentBracketViewer.cannotLoadGroupData")}
                </div>
              ) : Object.keys(groupedStandings).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {t("components.tournamentBracketViewer.noGroupData")}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(groupedStandings).map(
                    ([groupName, standings]) => (
                      <Card key={groupName}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-lg">{groupName}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>
                                  {t("components.tournamentBracketViewer.team")}
                                </TableHead>
                                <TableHead className="text-center w-12">
                                  {t(
                                    "components.tournamentBracketViewer.played",
                                  )}
                                </TableHead>
                                <TableHead className="text-center w-12">
                                  {t("components.tournamentBracketViewer.won")}
                                </TableHead>
                                <TableHead className="text-center w-12">
                                  {t("components.tournamentBracketViewer.lost")}
                                </TableHead>
                                <TableHead className="text-center w-16">
                                  {t(
                                    "components.tournamentBracketViewer.setDiff",
                                  )}
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {standings.map((standing) => (
                                <TableRow
                                  key={standing.id}
                                  className={
                                    standing.position && standing.position <= 2
                                      ? "bg-primary/5"
                                      : ""
                                  }
                                >
                                  <TableCell className="font-medium">
                                    {standing.position ?? "-"}
                                  </TableCell>
                                  <TableCell>
                                    {standing.entry?.team?.name ||
                                      `Entry ${standing.entryId}`}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {standing.matchesPlayed}
                                  </TableCell>
                                  <TableCell className="text-center text-green-600">
                                    {standing.matchesWon}
                                  </TableCell>
                                  <TableCell className="text-center text-red-600">
                                    {standing.matchesLost}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <span
                                      className={
                                        standing.setsDiff > 0
                                          ? "text-green-600"
                                          : standing.setsDiff < 0
                                            ? "text-red-600"
                                            : ""
                                      }
                                    >
                                      {standing.setsDiff > 0 ? "+" : ""}
                                      {standing.setsDiff}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              )}
            </TabsContent>
          )}

          {/* Knockout Stage Tab */}
          <TabsContent value="knockout" className="mt-4">
            {isLoadingKnockout ? (
              <div className="space-y-4">
                <div className="h-64 w-full bg-muted animate-pulse rounded-md" />
              </div>
            ) : knockoutError ? (
              <div className="text-center text-destructive py-8">
                {t("components.tournamentBracketViewer.cannotLoadKnockoutData")}
              </div>
            ) : Object.keys(bracketsByRound).length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {t("components.tournamentBracketViewer.noKnockoutData")}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(bracketsByRound)
                  .sort(
                    ([, a], [, b]) =>
                      (b[0]?.roundNumber || 0) - (a[0]?.roundNumber || 0),
                  )
                  .map(([roundName, brackets]) => (
                    <div key={roundName}>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        {roundName}
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        {brackets.map((bracket) => (
                          <Card
                            key={bracket.id}
                            className={`${
                              bracket.status === "completed"
                                ? "border-green-200"
                                : ""
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                {/* Entry A */}
                                <div
                                  className={`flex items-center justify-between p-2 rounded ${
                                    bracket.winnerEntryId === bracket.entryAId
                                      ? "bg-green-100 dark:bg-green-900/20"
                                      : "bg-muted/50"
                                  }`}
                                >
                                  <span className="text-sm">
                                    {bracket.entryAId
                                      ? `Entry ${bracket.entryAId}`
                                      : "TBD"}
                                  </span>
                                  {bracket.seedA && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      #{bracket.seedA}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center justify-center">
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>

                                {/* Entry B */}
                                <div
                                  className={`flex items-center justify-between p-2 rounded ${
                                    bracket.winnerEntryId === bracket.entryBId
                                      ? "bg-green-100 dark:bg-green-900/20"
                                      : "bg-muted/50"
                                  }`}
                                >
                                  <span className="text-sm">
                                    {bracket.entryBId
                                      ? `Entry ${bracket.entryBId}`
                                      : "TBD"}
                                  </span>
                                  {bracket.seedB && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      #{bracket.seedB}
                                    </Badge>
                                  )}
                                </div>

                                {/* Status */}
                                <div className="flex justify-center pt-2">
                                  {bracket.isByeMatch ? (
                                    <Badge variant="secondary">
                                      {t(
                                        "components.tournamentBracketViewer.bye",
                                      )}
                                    </Badge>
                                  ) : (
                                    getStatusBadge(bracket.status)
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
