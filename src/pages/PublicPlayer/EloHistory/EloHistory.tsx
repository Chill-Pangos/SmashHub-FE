import { useState } from "react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCurrentUser } from "@/hooks/queries/useAuthQueries";
import {
  useEloHistoriesByUser,
  useEloHistoriesByMatch,
} from "@/hooks/queries/useEloQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EloHistory } from "@/types/elo.types";

export default function EloHistoryPage() {
  const { data: userResp } = useCurrentUser();
  const userId = userResp?.data?.id || 0;

  const { data: historyResp, isLoading } = useEloHistoriesByUser(userId, 1, 50);
  const histories = historyResp?.data?.items || [];

  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  // Prepare data for chart (reverse to show chronological order left to right)
  const chartData = [...histories].reverse().map((h) => ({
    date: format(new Date(h.createdAt as string), "dd/MM"),
    score: h.scoreAfter,
    delta: h.delta,
  }));

  return (
    <div className="px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">ELO History</h1>

      <Card>
        <CardHeader>
          <CardTitle>Rating Progression</CardTitle>
          <CardDescription>Your ELO score over time</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading chart...</p>
          ) : chartData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis domain={["dataMin - 100", "dataMax + 100"]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground">No history available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Match ID</TableHead>
                <TableHead>Before</TableHead>
                <TableHead>Delta</TableHead>
                <TableHead>After</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {histories.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>
                    {format(new Date(h.createdAt as string), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{h.matchId}</TableCell>
                  <TableCell>{h.scoreBefore}</TableCell>
                  <TableCell
                    className={
                      (h.delta ?? 0) > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {(h.delta ?? 0) > 0 ? "+" : ""}
                    {h.delta}
                  </TableCell>
                  <TableCell className="font-semibold">{h.scoreAfter}</TableCell>
                  <TableCell>
                    {h.matchId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMatchId(h.matchId!)}
                      >
                        Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {histories.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Match Details Dialog */}
      <MatchEloDetailsDialog
        matchId={selectedMatchId}
        onClose={() => setSelectedMatchId(null)}
      />
    </div>
  );
}

function MatchEloDetailsDialog({
  matchId,
  onClose,
}: {
  matchId: number | null;
  onClose: () => void;
}) {
  const { data, isLoading } = useEloHistoriesByMatch(matchId || 0, 1, 50, {
    enabled: !!matchId,
  });

  const histories = data?.data?.items || [];

  return (
    <Dialog open={!!matchId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Match ELO Details (Match #{matchId})</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Before</TableHead>
                  <TableHead>Delta</TableHead>
                  <TableHead>After</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {histories.map((h: EloHistory) => (
                  <TableRow key={h.id}>
                    <TableCell>{h.userId}</TableCell>
                    <TableCell>{h.scoreBefore}</TableCell>
                    <TableCell
                      className={
                        (h.delta ?? 0) > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {(h.delta ?? 0) > 0 ? "+" : ""}
                      {h.delta}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {h.scoreAfter}
                    </TableCell>
                  </TableRow>
                ))}
                {histories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
