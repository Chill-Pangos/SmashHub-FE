import { useQuery } from "@tanstack/react-query";
import { eloHistoryService, eloScoreService } from "@/services";
import { queryKeys } from "./queryKeys";


export const useEloLeaderboard = (
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.eloScores.leaderboard({ page, limit }),
    queryFn: () => eloScoreService.getLeaderboard(page, limit),
    enabled: options?.enabled ?? true,
  });
};


export const useEloHistoriesByUser = (
  userId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.eloHistories.byUser(userId, { page, limit }),
    queryFn: () => eloHistoryService.getEloHistoryByUser(userId, page, limit),
    enabled: (options?.enabled ?? true) && userId > 0,
  });
};

export const useEloHistoriesByMatch = (
  matchId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.eloHistories.byMatch(matchId, { page, limit }),
    queryFn: () => eloHistoryService.getEloHistoryByMatch(matchId, page, limit),
    enabled: (options?.enabled ?? true) && matchId > 0,
  });
};

