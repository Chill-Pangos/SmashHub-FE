import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Search } from "lucide-react";
import { teamMemberService } from "@/services";
import { useAuth } from "@/store/useAuth";
import { showToast } from "@/utils";
import type { TeamMember } from "@/types";

export default function CoachAthletes() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [athletes, setAthletes] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAthletes = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Fetch teams where user is coach
      const teamsResponse = await teamMemberService.getTeamsByUserId(
        user.id,
        0,
        50,
      );
      const coachTeams = teamsResponse.filter((tm) => tm.role === "coach");

      // Fetch athletes from each team
      let allAthletes: TeamMember[] = [];
      for (const team of coachTeams) {
        if (team.team?.id) {
          try {
            const members = await teamMemberService.getMembersByTeamId(
              team.team.id,
              0,
              100,
            );
            const teamAthletes = members.filter((m) => m.role === "athlete");
            allAthletes = [...allAthletes, ...teamAthletes];
          } catch {
            // Ignore error
          }
        }
      }
      setAthletes(allAthletes);
    } catch (error) {
      console.error("Error fetching athletes:", error);
      showToast.error("Không thể tải danh sách vận động viên");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const filteredAthletes = athletes.filter((athlete) => {
    if (!searchQuery) return true;
    const name =
      (athlete.user?.firstName || "") + " " + (athlete.user?.lastName || "");
    const email = athlete.user?.email || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Vận động viên</h1>
        <p className="text-muted-foreground mt-1">
          Danh sách vận động viên bạn đang huấn luyện
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm vận động viên..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Athletes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Danh sách vận động viên ({filteredAthletes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAthletes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Không có vận động viên nào
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Đoàn</TableHead>
                  <TableHead className="text-right">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAthletes.map((athlete) => (
                  <TableRow key={athlete.id}>
                    <TableCell className="font-medium">
                      {athlete.user?.firstName} {athlete.user?.lastName}
                    </TableCell>
                    <TableCell>{athlete.user?.email}</TableCell>
                    <TableCell>{athlete.team?.name || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">Hoạt động</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
