import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  Users,
  CheckCircle,
  UserX,
  RefreshCw,
  ShieldCheck,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefereeList, AssignRefereeDialog } from "./components";
import { useTournaments, useRefereesByTournament } from "@/hooks/queries";

export default function RefereeAssignment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [assignRefereeDialogOpen, setAssignRefereeDialogOpen] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");

  // React Query hooks
  const { data: tournaments = [] } = useTournaments(0, 100);

  const tournamentIdNumber = selectedTournamentId
    ? parseInt(selectedTournamentId)
    : 0;
  const {
    data: refereesResponse,
    isLoading,
    refetch: refetchReferees,
  } = useRefereesByTournament(tournamentIdNumber, 0, 100, {
    enabled: tournamentIdNumber > 0,
  });

  const tournamentReferees = refereesResponse?.data || [];

  // Auto-select first tournament when loaded
  useMemo(() => {
    if (tournaments.length > 0 && !selectedTournamentId) {
      setSelectedTournamentId(tournaments[0].id.toString());
    }
  }, [tournaments, selectedTournamentId]);

  // Stats
  const totalReferees = tournamentReferees.length;
  const mainReferees = tournamentReferees.filter(
    (r) => r.role === "main",
  ).length;
  const assistantReferees = tournamentReferees.filter(
    (r) => r.role === "assistant",
  ).length;
  const availableReferees = tournamentReferees.filter(
    (r) => r.isAvailable,
  ).length;
  const unavailableReferees = totalReferees - availableReferees;

  const handleRefreshData = useCallback(() => {
    if (selectedTournamentId) {
      refetchReferees();
    }
  }, [selectedTournamentId, refetchReferees]);

  const selectedTournament = tournaments.find(
    (t) => t.id.toString() === selectedTournamentId,
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý trọng tài</h1>
          <p className="text-muted-foreground mt-1">
            Phân công trọng tài vào giải đấu để họ có thể tham gia điều khiển
            trận đấu
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
          <Button onClick={() => setAssignRefereeDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Thêm trọng tài
          </Button>
        </div>
      </div>

      {/* Tournament Select */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium whitespace-nowrap">
            Giải đấu:
          </label>
          <Select
            value={selectedTournamentId}
            onValueChange={setSelectedTournamentId}
          >
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Chọn giải đấu" />
            </SelectTrigger>
            <SelectContent>
              {tournaments.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTournament && (
            <span className="text-sm text-muted-foreground">
              Trạng thái: {selectedTournament.status}
            </span>
          )}
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tổng trọng tài</p>
              <p className="text-xl font-bold">
                {isLoading ? "..." : totalReferees}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trọng tài chính</p>
              <p className="text-xl font-bold">
                {isLoading ? "..." : mainReferees}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trợ lý trọng tài</p>
              <p className="text-xl font-bold">
                {isLoading ? "..." : assistantReferees}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sẵn sàng</p>
              <p className="text-xl font-bold">
                {isLoading ? "..." : availableReferees}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <UserX className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Không khả dụng</p>
              <p className="text-xl font-bold">
                {isLoading ? "..." : unavailableReferees}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm trọng tài theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Referee List */}
      <RefereeList
        referees={tournamentReferees}
        isLoading={isLoading}
        onRefresh={handleRefreshData}
        searchQuery={searchQuery}
      />

      {/* Add Referee Dialog */}
      <AssignRefereeDialog
        open={assignRefereeDialogOpen}
        onOpenChange={setAssignRefereeDialogOpen}
        onAssigned={handleRefreshData}
      />
    </div>
  );
}
