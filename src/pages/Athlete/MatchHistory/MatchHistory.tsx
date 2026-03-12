import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History, Trophy, Calendar } from "lucide-react";
import type { Match } from "@/types";
import { useMatchesByStatus } from "@/hooks/queries";

export default function MatchHistory() {
  const { t } = useTranslation();

  // Fetch completed matches
  const { data, isLoading } = useMatchesByStatus("completed", 0, 100);

  const completedMatches: Match[] = useMemo(() => {
    return Array.isArray(data) ? data : data?.data || [];
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("match.matchHistory")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("athlete.viewCompletedMatches")}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{completedMatches.length}</p>
            <p className="text-sm text-muted-foreground">
              {t("athlete.totalMatches")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {completedMatches.filter((m) => m.winnerEntryId !== null).length}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("athlete.winsCount")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">
              {completedMatches.length > 0
                ? new Date(completedMatches[0].updatedAt).toLocaleDateString(
                    "vi-VN",
                  )
                : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("athlete.latestMatch")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Match History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t("athlete.matchList")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedMatches.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t("athlete.noCompletedMatches")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("match.match")}</TableHead>
                  <TableHead>{t("schedule.date")}</TableHead>
                  <TableHead>{t("match.matchResults")}</TableHead>
                  <TableHead className="text-right">
                    {t("common.status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedMatches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell className="font-medium">
                      Entry {match.entryAId} vs Entry {match.entryBId}
                    </TableCell>
                    <TableCell>
                      {new Date(match.updatedAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {match.winnerEntryId
                        ? `Entry ${match.winnerEntryId} ${t("athlete.wins")}`
                        : t("athlete.noResult")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {t("athlete.completed")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
