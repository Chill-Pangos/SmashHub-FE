import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subMatchService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  AssignSubMatchPlayersRequest,
  CreateSubMatchesFromFormatRequest,
} from "@/types/subMatch.types";

export const useSubMatchesByMatch = (
  matchId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.subMatches.byMatch(matchId),
    queryFn: () => subMatchService.getSubMatchesByMatch(matchId),
    enabled: (options?.enabled ?? true) && matchId > 0,
  });
};

export const useSubMatch = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.subMatches.detail(id),
    queryFn: () => subMatchService.getSubMatchById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

export const useCreateSubMatchesFromFormat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubMatchesFromFormatRequest) =>
      subMatchService.createFromFormat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subMatches.all });
    },
  });
};

export const useStartSubMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subMatchService.startSubMatch(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subMatches.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.subMatches.all });
    },
  });
};

export const useFinalizeSubMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subMatchService.finalizeSubMatch(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subMatches.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.subMatches.all });
    },
  });
};

export const useAssignSubMatchPlayers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: AssignSubMatchPlayersRequest;
    }) => subMatchService.assignPlayers(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subMatches.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.subMatches.all });
    },
  });
};
