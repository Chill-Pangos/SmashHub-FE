import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tournamentCategoryService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  CreateTournamentCategoryRequest,
  UpdateTournamentCategoryRequest,
} from "@/types";

// ==================== Query Hooks ====================

export const useTournamentCategories = (skip = 0, limit = 10) => {
  const page = Math.floor(skip / limit) + 1;

  return useQuery({
    queryKey: queryKeys.tournamentCategories.list({ page, limit }),
    queryFn: () =>
      tournamentCategoryService.getAllTournamentCategories(page, limit),
  });
};

export const useTournamentCategory = (
  id: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.tournamentCategories.detail(id),
    queryFn: () => tournamentCategoryService.getTournamentCategoryById(id),
    enabled: (options?.enabled ?? true) && id > 0,
  });
};

export const useTournamentCategoriesByTournament = (
  tournamentId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.tournamentCategories.byTournament(tournamentId, {
      page,
      limit,
    }),
    queryFn: () =>
      tournamentCategoryService.getCategoriesByTournament(
        tournamentId,
        page,
        limit,
      ),
    enabled: (options?.enabled ?? true) && tournamentId > 0,
  });
};

// ==================== Mutation Hooks ====================

export const useCreateTournamentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTournamentCategoryRequest) =>
      tournamentCategoryService.createTournamentCategory(data),
    onSuccess: (_result, data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentCategories.byTournament(
          data.tournamentId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentCategories.lists(),
      });
    },
  });
};

export const useUpdateTournamentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateTournamentCategoryRequest;
    }) => tournamentCategoryService.updateTournamentCategory(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentCategories.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentCategories.lists(),
      });
    },
  });
};

export const useDeleteTournamentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      tournamentCategoryService.deleteTournamentCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournamentCategories.all,
      });
    },
  });
};
