import { useState, useEffect, useCallback } from "react";
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
import { Search, Users, UserPlus } from "lucide-react";
import { showToast } from "@/utils/toast.utils";
import {
  tournamentRefereeService,
  tournamentService,
  roleService,
} from "@/services";
import type { Tournament, TournamentReferee } from "@/types";

interface User {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [selectedRefereeIds, setSelectedRefereeIds] = useState<number[]>([]);

  // Data
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [referees, setReferees] = useState<User[]>([]);
  const [assignedReferees, setAssignedReferees] = useState<TournamentReferee[]>(
    [],
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch tournaments
      const tournamentsResponse = await tournamentService.getAllTournaments(
        0,
        100,
      );
      const tournamentsList = Array.isArray(tournamentsResponse)
        ? tournamentsResponse
        : (tournamentsResponse as { data?: Tournament[] }).data || [];
      setTournaments(tournamentsList);

      // Fetch users with referee role
      // Note: This is a placeholder - you might need to implement a user service
      // For now, we'll use mock data or fetch from role service
      try {
        const rolesResponse = await roleService.getAllRoles(0, 100);
        const roles = Array.isArray(rolesResponse)
          ? rolesResponse
          : (rolesResponse as { data?: { name: string }[] }).data || [];
        const refereeRole = roles.find(
          (r: { name: string }) => r.name === "referee",
        );

        if (refereeRole) {
          // Placeholder: In real app, fetch users with this role
          // For now, set empty array - users should be fetched from user service
          setReferees([]);
        }
      } catch {
        // Mock referees for demonstration
        setReferees([
          { id: 1, username: "referee1", fullName: "Trần Văn Tuấn" },
          { id: 2, username: "referee2", fullName: "Nguyễn Thị Lan" },
          { id: 3, username: "referee3", fullName: "Lê Hoàng Nam" },
          { id: 4, username: "referee4", fullName: "Phạm Thị Hương" },
          { id: 5, username: "referee5", fullName: "Hoàng Văn Minh" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast.error("Lỗi", "Không thể tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tournaments and referees
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  // Fetch assigned referees when tournament changes
  useEffect(() => {
    if (selectedTournamentId) {
      fetchAssignedReferees(parseInt(selectedTournamentId));
    }
  }, [selectedTournamentId]);

  const fetchAssignedReferees = async (tournamentId: number) => {
    try {
      const response = await tournamentRefereeService.getRefereesByTournament(
        tournamentId,
        0,
        100,
      );
      const assigned = response.data || [];
      setAssignedReferees(assigned);

      // Clear selected referees that are already assigned
      setSelectedRefereeIds((prev) =>
        prev.filter(
          (id) => !assigned.some((a: TournamentReferee) => a.refereeId === id),
        ),
      );
    } catch (error) {
      console.error("Error fetching assigned referees:", error);
    }
  };

  const handleToggleReferee = (refereeId: number) => {
    setSelectedRefereeIds((prev) =>
      prev.includes(refereeId)
        ? prev.filter((id) => id !== refereeId)
        : [...prev, refereeId],
    );
  };

  const handleAssign = async () => {
    if (!selectedTournamentId || selectedRefereeIds.length === 0) {
      showToast.error("Lỗi", "Vui lòng chọn giải đấu và ít nhất một trọng tài");
      return;
    }

    try {
      setIsAssigning(true);

      await tournamentRefereeService.assignReferees({
        tournamentId: parseInt(selectedTournamentId),
        refereeIds: selectedRefereeIds,
      });

      showToast.success(
        "Thành công",
        `Đã phân công ${selectedRefereeIds.length} trọng tài vào giải đấu`,
      );

      setSelectedRefereeIds([]);
      onOpenChange(false);
      onAssigned?.();
    } catch (error) {
      console.error("Error assigning referees:", error);
      showToast.error("Lỗi", "Không thể phân công trọng tài");
    } finally {
      setIsAssigning(false);
    }
  };

  // Filter referees
  const filteredReferees = referees.filter((referee) => {
    const matchesSearch =
      referee.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referee.username.toLowerCase().includes(searchQuery.toLowerCase());

    const notAlreadyAssigned = !assignedReferees.some(
      (a) => a.refereeId === referee.id,
    );

    return matchesSearch && notAlreadyAssigned;
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
            </label>
            <ScrollArea className="h-64 border rounded-lg">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredReferees.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {referees.length === 0
                    ? "Không có trọng tài nào"
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
