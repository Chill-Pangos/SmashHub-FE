import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/utils/toast.utils";
import { matchService, matchSetService } from "@/services";
import type { Match, MatchSet } from "@/types";
import { RefereeStats, ActiveMatch, UpcomingMatches } from "./components";

interface UpcomingMatch {
  match: Match;
  entryAName?: string;
  entryBName?: string;
  contentName?: string;
}

export default function RefereeDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatch[]>([]);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [matchSets, setMatchSets] = useState<MatchSet[]>([]);
  const [isAddingScore, setIsAddingScore] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalMatches: 0,
    completedMatches: 0,
    pendingMatches: 0,
    upcomingMatches: 0,
  });

  // Fetch matches assigned to this referee
  const fetchMatches = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get scheduled matches (upcoming)
      const scheduledResponse = await matchService.getMatchesByStatus(
        "scheduled",
        0,
        50,
      );
      const scheduledMatches = Array.isArray(scheduledResponse)
        ? scheduledResponse
        : scheduledResponse.data || [];

      // Get in_progress matches (active)
      const inProgressResponse = await matchService.getMatchesByStatus(
        "in_progress",
        0,
        50,
      );
      const inProgressMatches = Array.isArray(inProgressResponse)
        ? inProgressResponse
        : inProgressResponse.data || [];

      // Get completed matches
      const completedResponse = await matchService.getMatchesByStatus(
        "completed",
        0,
        50,
      );
      const completedMatches = Array.isArray(completedResponse)
        ? completedResponse
        : completedResponse.data || [];

      // Set upcoming matches
      setUpcomingMatches(
        scheduledMatches.map((match: Match) => ({
          match,
          entryAName: `Entry ${match.entryAId}`,
          entryBName: `Entry ${match.entryBId}`,
        })),
      );

      // Set active match (first in_progress match)
      if (inProgressMatches.length > 0) {
        const active = inProgressMatches[0];
        setActiveMatch(active);

        // Fetch match sets for active match
        try {
          const setsResponse = await matchSetService.getMatchSetsByMatch(
            active.id,
            0,
            10,
          );
          const sets = Array.isArray(setsResponse)
            ? setsResponse
            : setsResponse.data || [];
          setMatchSets(sets);
        } catch {
          setMatchSets([]);
        }
      } else {
        setActiveMatch(null);
        setMatchSets([]);
      }

      // Calculate stats
      setStats({
        totalMatches:
          scheduledMatches.length +
          inProgressMatches.length +
          completedMatches.length,
        completedMatches: completedMatches.length,
        pendingMatches: completedMatches.filter(
          (m: Match) => m.resultStatus === "pending",
        ).length,
        upcomingMatches: scheduledMatches.length,
      });
    } catch (error) {
      console.error("Error fetching matches:", error);
      showToast.error("Lỗi", "Không thể tải danh sách trận đấu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Start a match
  const handleStartMatch = async (matchId: number) => {
    try {
      const response = await matchService.startMatch(matchId);
      const startedMatch =
        "data" in response && response.data
          ? response.data
          : (response as unknown as Match);

      setActiveMatch(startedMatch);
      setMatchSets([]);

      // Remove from upcoming
      setUpcomingMatches((prev) =>
        prev.filter((um) => um.match.id !== matchId),
      );

      showToast.success("Thành công", "Trận đấu đã bắt đầu");
    } catch (error) {
      console.error("Error starting match:", error);
      showToast.error("Lỗi", "Không thể bắt đầu trận đấu");
    }
  };

  // Add score for a set
  const handleAddScore = async (entryAScore: number, entryBScore: number) => {
    if (!activeMatch) return;

    try {
      setIsAddingScore(true);

      const response = await matchSetService.createMatchSetWithScore({
        matchId: activeMatch.id,
        entryAScore,
        entryBScore,
      });

      const newSet: MatchSet =
        "data" in response && response.data
          ? response.data
          : (response as unknown as MatchSet);
      setMatchSets((prev) => [...prev, newSet]);

      showToast.success(
        "Thành công",
        `Đã ghi nhận điểm Set ${newSet.setNumber}`,
      );
    } catch (error) {
      console.error("Error adding score:", error);
      showToast.error("Lỗi", "Không thể ghi nhận điểm");
    } finally {
      setIsAddingScore(false);
    }
  };

  // Finalize match
  const handleFinalizeMatch = async () => {
    if (!activeMatch) return;

    try {
      setIsFinalizing(true);

      await matchService.finalizeMatch(activeMatch.id);

      setActiveMatch(null);
      setMatchSets([]);

      showToast.success(
        "Thành công",
        "Trận đấu đã kết thúc và đang chờ Tổng trọng tài phê duyệt",
      );

      // Refresh matches
      fetchMatches();
    } catch (error) {
      console.error("Error finalizing match:", error);
      showToast.error("Lỗi", "Không thể kết thúc trận đấu");
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bảng điều khiển trọng tài</h1>
          <p className="text-muted-foreground">
            Quản lý và điều khiển các trận đấu được phân công
          </p>
        </div>
      </div>

      <RefereeStats {...stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveMatch
          match={activeMatch}
          matchSets={matchSets}
          entryAName={activeMatch ? `Entry ${activeMatch.entryAId}` : undefined}
          entryBName={activeMatch ? `Entry ${activeMatch.entryBId}` : undefined}
          maxSets={3}
          onAddScore={handleAddScore}
          onFinalize={handleFinalizeMatch}
          isAddingScore={isAddingScore}
          isFinalizing={isFinalizing}
        />

        <UpcomingMatches
          matches={upcomingMatches}
          onStartMatch={handleStartMatch}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
