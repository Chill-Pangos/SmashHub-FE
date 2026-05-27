import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eloHistoryService, eloScoreService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  CreateEloHistoryRequest,
  CreateEloScoreRequest,
} from "@/types/elo.types";

export const useEloScores = (
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.eloScores.list({ page, limit }),
    queryFn: () => eloScoreService.getAllEloScores(page, limit),
    enabled: options?.enabled ?? true,
  });
};

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

export const useEloScore = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.eloScores.detail(id),
    queryFn: () => eloScoreService.getEloScoreById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

export const useCreateEloScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEloScoreRequest) =>
      eloScoreService.createEloScore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eloScores.all });
    },
  });
};

export const useUpdateEloScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eloScoreService.updateEloScore(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.eloScores.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.eloScores.all });
    },
  });
};

export const useDeleteEloScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eloScoreService.deleteEloScore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eloScores.all });
    },
  });
};

export const useEloHistories = (
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.eloHistories.list({ page, limit }),
    queryFn: () => eloHistoryService.getAllEloHistories(page, limit),
    enabled: options?.enabled ?? true,
  });
};

export const useEloHistory = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.eloHistories.detail(id),
    queryFn: () => eloHistoryService.getEloHistoryById(id),
    enabled: (options?.enabled ?? true) && id > 0,
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

export const useCreateEloHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEloHistoryRequest) =>
      eloHistoryService.createEloHistory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eloHistories.all });
    },
  });
};

export const useDeleteEloHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eloHistoryService.deleteEloHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.eloHistories.all });
    },
  });
};
