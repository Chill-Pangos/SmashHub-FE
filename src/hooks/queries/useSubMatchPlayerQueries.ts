import { useQuery } from "@tanstack/react-query";
import { subMatchPlayerService } from "@/services";
import { queryKeys } from "./queryKeys";

export const useSubMatchPlayers = (
  subMatchId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.subMatchPlayers.bySubMatch(subMatchId), { page, limit }],
    queryFn: () => subMatchPlayerService.getPlayersBySubMatch(subMatchId, page, limit),
    enabled: (options?.enabled ?? true) && subMatchId > 0,
  });
};

export const useSubMatchPlayersByTeam = (
  subMatchId: number,
  team: string,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...queryKeys.subMatchPlayers.bySubMatchTeam(subMatchId, team), { page, limit }],
    queryFn: () =>
      subMatchPlayerService.getPlayersBySubMatchTeam(subMatchId, team, page, limit),
    enabled: (options?.enabled ?? true) && subMatchId > 0 && !!team,
  });
};

export const useSubMatchHistoryByEntryMember = (
  entryMemberId: number,
  page = 1,
  limit = 10,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.subMatchPlayers.byEntryMember(entryMemberId, {
      page,
      limit,
    }),
    queryFn: () =>
      subMatchPlayerService.getHistoryByEntryMember(entryMemberId, page, limit),
    enabled: (options?.enabled ?? true) && entryMemberId > 0,
  });
};
