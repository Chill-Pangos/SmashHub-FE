import { useEffect, useRef, useContext } from "react";
import { NotificationContext } from "@/store/notificationContext";
import type { MatchRealtimePayload } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export interface UseMatchRealtimeProps {
  matchId?: number;
  onUpdate?: (payload: MatchRealtimePayload) => void;
  onReconnect?: () => void;
  onError?: (error: unknown) => void;
}

export function useMatchRealtime({
  matchId,
  onUpdate,
  onReconnect,
  onError,
}: UseMatchRealtimeProps = {}) {
  const notificationCtx = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const onUpdateRef = useRef(onUpdate);
  const onReconnectRef = useRef(onReconnect);
  const onErrorRef = useRef(onError);

  // Sync refs to avoid unnecessary re-renders when callbacks change
  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onReconnectRef.current = onReconnect;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    const socket = notificationCtx?.socket;
    if (!socket || !matchId) return;

    const invalidateMatchQueries = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matches.detail(matchId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.subMatches.byMatch(matchId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.matchSets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
    };

    const handleRoomJoined = ({
      matchId: joinedMatchId,
      roomId,
    }: {
      matchId: number;
      roomId: string;
    }) => {
      if (joinedMatchId === matchId) {
        console.log(`Joined real-time room for match ${matchId} (${roomId})`);
      }
    };

    const handleRoomLeft = ({
      matchId: leftMatchId,
      roomId,
    }: {
      matchId: number;
      roomId: string;
    }) => {
      if (leftMatchId === matchId) {
        console.log(`Left real-time room for match ${matchId} (${roomId})`);
      }
    };

    const handleWatchError = (error: { matchId: number; message: string }) => {
      if (error.matchId === matchId) {
        console.error(`Error watching match ${matchId}:`, error.message);
        onErrorRef.current?.(error);
      }
    };

    const handleResultUpdated = (payload: MatchRealtimePayload | Record<string, unknown>) => {
      // payload could be from match_result_updated, score_update, or match_update
      // if it has a matchId and it matches, or subMatchId which belongs to this match, we invalidate
      const p = payload as any;
      if (p.matchId === matchId || p.data?.matchId === matchId) {
        // Auto invalidate query cache
        invalidateMatchQueries();
        onUpdateRef.current?.(payload as any);
      }
    };

    const handleConnect = () => {
      // Re-emit watch-match on reconnect
      socket.emit("watch-match", { matchId });
      // Auto invalidate query cache to sync state
      invalidateMatchQueries();
      onReconnectRef.current?.();
    };

    // Emit watch-match on mount or when matchId changes
    socket.emit("watch-match", { matchId });

    // Attach listeners
    socket.on("match_room_joined", handleRoomJoined);
    socket.on("match_watch_error", handleWatchError);
    socket.on("match_room_left", handleRoomLeft);
    socket.on("match_result_updated", handleResultUpdated);
    socket.on("score_update", handleResultUpdated);
    socket.on("match_update", handleResultUpdated);
    socket.on("connect", handleConnect);

    return () => {
      // Detach listeners
      socket.off("match_room_joined", handleRoomJoined);
      socket.off("match_watch_error", handleWatchError);
      socket.off("match_room_left", handleRoomLeft);
      socket.off("match_result_updated", handleResultUpdated);
      socket.off("score_update", handleResultUpdated);
      socket.off("match_update", handleResultUpdated);
      socket.off("connect", handleConnect);

      // Emit unwatch-match on unmount
      socket.emit("unwatch-match", { matchId });
    };
  }, [notificationCtx?.socket, matchId, queryClient]);

  return {
    isConnected: notificationCtx?.isConnected ?? false,
  };
}
