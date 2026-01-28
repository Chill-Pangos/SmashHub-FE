import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users, UserPlus, Loader2 } from "lucide-react";
import { showToast } from "@/utils/toast.utils";
import {
  useTournaments,
  useRefereesByTournament,
  useAvailableReferees,
  useAssignReferees,
} from "@/hooks/queries";

interface AssignRefereeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssigned?: () => void;
}

export default function AssignRefereeDialog({
  open,
  onOpenChange,
  onAssigned,
}: AssignRefereeDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [selectedRefereeIds, setSelectedRefereeIds] = useState<number[]>([]);

  // React Query hooks
  const { data: tournaments = [] } = useTournaments(0, 100);

  const tournamentIdNumber = selectedTournamentId
    ? parseInt(selectedTournamentId)
    : 0;

  // Fetch already assigned referees for the tournament
  const { data: assignedRefereesResponse } = useRefereesByTournament(
    tournamentIdNumber,
    0,
    100,
    { enabled: tournamentIdNumber > 0 },
  );

  const assignedReferees = useMemo(
    () => assignedRefereesResponse?.data || [],
    [assignedRefereesResponse],
  );

  // Get already assigned referee IDs to exclude from available list
  const excludeRefereeIds = useMemo(
    () => assignedReferees.map((r) => r.refereeId),
    [assignedReferees],
  );

  // Fetch available referees for the tournament (excluding already assigned ones)
  const { data: availableRefereesResponse, isLoading: isLoadingReferees } =
    useAvailableReferees(tournamentIdNumber, excludeRefereeIds, {
      enabled: tournamentIdNumber > 0 && open,
    });

  // Transform available referees data for display
  const availableReferees = useMemo(() => {
    const referees = availableRefereesResponse?.data || [];
    return referees.map((tr) => ({
      id: tr.refereeId,
      username: tr.referee?.username || `user_${tr.refereeId}`,
      fullName: tr.referee?.fullName,
      email: tr.referee?.email,
    }));
  }, [availableRefereesResponse]);

  const assignMutation = useAssignReferees();

  // Clear selected referees when tournament changes
  useEffect(() => {
    setSelectedRefereeIds([]);
  }, [selectedTournamentId]);

  const handleToggleReferee = (refereeId: number) => {
    setSelectedRefereeIds((prev) =>
      prev.includes(refereeId)
        ? prev.filter((id) => id !== refereeId)
        : [...prev, refereeId],
    );
  };

  const handleAssign = () => {
    if (!selectedTournamentId || selectedRefereeIds.length === 0) {
      showToast.error("Lỗi", "Vui lòng chọn giải đấu và ít nhất một trọng tài");
      return;
    }

    assignMutation.mutate(
      {
        tournamentId: parseInt(selectedTournamentId),
        refereeIds: selectedRefereeIds,
      },
      {
        onSuccess: () => {
          showToast.success(
            "Thành công",
            `Đã phân công ${selectedRefereeIds.length} trọng tài vào giải đấu`,
          );
          setSelectedRefereeIds([]);
          onOpenChange(false);
          onAssigned?.();
        },
        onError: (error) => {
          console.error("Error assigning referees:", error);
          showToast.error("Lỗi", "Không thể phân công trọng tài");
        },
      },
    );
  };

  const isAssigning = assignMutation.isPending;

  // Filter referees by search query
  const filteredReferees = availableReferees.filter((referee) => {
    if (!searchQuery) return true;
    const matchesSearch =
      referee.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referee.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Phân công trọng tài vào giải đấu
          </DialogTitle>
          <DialogDescription>
            Chọn giải đấu và các trọng tài để phân công. Trọng tài sẽ được thêm
            với vai trò trợ lý (assistant).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tournament Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Giải đấu</label>
            <Select
              value={selectedTournamentId}
              onValueChange={setSelectedTournamentId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giải đấu" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((tournament) => (
                  <SelectItem
                    key={tournament.id}
                    value={tournament.id.toString()}
                  >
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assigned Referees */}
          {selectedTournamentId && assignedReferees.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Trọng tài đã phân công ({assignedReferees.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {assignedReferees.map((tr) => (
                  <Badge key={tr.id} variant="secondary">
                    <Users className="mr-1 h-3 w-3" />
                    {tr.referee?.fullName || `Referee ${tr.refereeId}`}
                    <span className="ml-1 text-xs opacity-70">
                      ({tr.role === "main" ? "Chính" : "Phụ"})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm trọng tài..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Referee List */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Chọn trọng tài ({selectedRefereeIds.length} đã chọn)
              {availableRefereesResponse?.availableCount !== undefined && (
                <span className="text-muted-foreground ml-2">
                  - {availableRefereesResponse.availableCount} trọng tài sẵn
                  sàng
                </span>
              )}
            </label>
            <ScrollArea className="h-64 border rounded-lg">
              {!selectedTournamentId ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Vui lòng chọn giải đấu để xem danh sách trọng tài
                </div>
              ) : isLoadingReferees ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredReferees.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {availableReferees.length === 0
                    ? "Không có trọng tài sẵn sàng"
                    : "Không tìm thấy trọng tài phù hợp"}
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {filteredReferees.map((referee) => (
                    <div
                      key={referee.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => handleToggleReferee(referee.id)}
                    >
                      <Checkbox
                        checked={selectedRefereeIds.includes(referee.id)}
                        onCheckedChange={() => handleToggleReferee(referee.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">
                          {referee.fullName || referee.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{referee.username}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={
              isAssigning ||
              !selectedTournamentId ||
              selectedRefereeIds.length === 0
            }
          >
            {isAssigning ? (
              "Đang phân công..."
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Phân công ({selectedRefereeIds.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
