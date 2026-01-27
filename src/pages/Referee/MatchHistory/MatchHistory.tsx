import { useState, useEffect } from "react";
import { showToast } from "@/utils/toast.utils";
import { matchService } from "@/services";
import type { Match } from "@/types";
import { MatchHistoryList } from "./components";

export default function MatchHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await matchService.getMatchesByStatus(
          "completed",
          0,
          50,
        );
        const completedMatches = Array.isArray(response)
          ? response
          : response.data || [];
        setMatches(completedMatches);
      } catch (error) {
        console.error("Error fetching match history:", error);
        showToast.error("Lỗi", "Không thể tải lịch sử trận đấu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lịch sử trận đấu</h1>
        <p className="text-muted-foreground">
          Xem lại các trận đấu đã hoàn thành
        </p>
      </div>

      <MatchHistoryList matches={matches} isLoading={isLoading} />
    </div>
  );
}
