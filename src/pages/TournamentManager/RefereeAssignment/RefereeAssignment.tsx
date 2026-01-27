import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  UserPlus,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefereeList,
  MatchAssignment,
  AssignmentMatrix,
  AssignRefereeDialog,
} from "./components";
import { tournamentRefereeService, tournamentService } from "@/services";
import type { Tournament, TournamentReferee } from "@/types";

export default function RefereeAssignment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [assignRefereeDialogOpen, setAssignRefereeDialogOpen] = useState(false);

  // Stats state
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [tournamentReferees, setTournamentReferees] = useState<
    TournamentReferee[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Stats
  const totalReferees = tournamentReferees.length;
  const mainReferees = tournamentReferees.filter(
    (r) => r.role === "main",
  ).length;
  const assistantReferees = tournamentReferees.filter(
    (r) => r.role === "assistant",
  ).length;

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournamentId) {
      fetchTournamentReferees(parseInt(selectedTournamentId));
    }
  }, [selectedTournamentId]);

  const fetchTournaments = async () => {
    try {
      const list = await tournamentService.getAllTournaments(0, 100);
      setTournaments(list);
      if (list.length > 0) {
        setSelectedTournamentId(list[0].id.toString());
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const fetchTournamentReferees = async (tournamentId: number) => {
    try {
      setIsLoading(true);
      const response = await tournamentRefereeService.getRefereesByTournament(
        tournamentId,
        0,
        100,
      );
      setTournamentReferees(response.data || []);
    } catch (error) {
      console.error("Error fetching referees:", error);
      setTournamentReferees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = () => {
    if (selectedTournamentId) {
      fetchTournamentReferees(parseInt(selectedTournamentId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Phân công trọng tài</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setAssignRefereeDialogOpen(true)}
          >
            <Users className="mr-2 h-4 w-4" />
            Thêm trọng tài vào giải
          </Button>
          <Button onClick={() => setAssignmentDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Phân công trận đấu
          </Button>
        </div>
      </div>

      {/* Tournament Select */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Giải đấu:</label>
          <Select
            value={selectedTournamentId}
            onValueChange={setSelectedTournamentId}
          >
            <SelectTrigger className="w-64">
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
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng trọng tài</p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : totalReferees}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trọng tài chính</p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : mainReferees}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trọng tài phụ</p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : assistantReferees}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đánh giá TB</p>
              <p className="text-2xl font-bold">4.4</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm trọng tài..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả cấp độ</SelectItem>
                  <SelectItem value="international">Quốc tế</SelectItem>
                  <SelectItem value="national">Quốc gia</SelectItem>
                  <SelectItem value="regional">Khu vực</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterAvailability}
                onValueChange={setFilterAvailability}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="available">Sẵn sàng</SelectItem>
                  <SelectItem value="busy">Đang bận</SelectItem>
                  <SelectItem value="unavailable">Không khả dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <RefereeList />
        </div>

        <div>
          <AssignmentMatrix />
        </div>
      </div>

      <MatchAssignment
        open={assignmentDialogOpen}
        onOpenChange={setAssignmentDialogOpen}
      />

      <AssignRefereeDialog
        open={assignRefereeDialogOpen}
        onOpenChange={setAssignRefereeDialogOpen}
        onAssigned={handleRefreshData}
      />
    </div>
  );
}
