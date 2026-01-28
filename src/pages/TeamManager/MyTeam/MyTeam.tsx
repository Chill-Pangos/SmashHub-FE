import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, MoreVertical, Trash2, Edit, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/store/useAuth";
import { useTeamsByUser, useMembersByTeam } from "@/hooks/queries";
import type { TeamMember } from "@/types";

export default function MyTeam() {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch teams that the user manages
  const { data: allTeams = [], isLoading: isLoadingTeams } = useTeamsByUser(
    user?.id ?? 0,
    0,
    50,
    { enabled: !!user?.id },
  );

  // Filter to only teams where user is team_manager
  const myTeams = allTeams.filter((tm) => tm.role === "team_manager");

  // Auto-select first team when teams are loaded
  useEffect(() => {
    if (myTeams.length > 0 && !selectedTeam) {
      setSelectedTeam(myTeams[0]);
    }
  }, [myTeams, selectedTeam]);

  // Fetch members for selected team
  const { data: teamMembers = [] } = useMembersByTeam(
    selectedTeam?.team?.id ?? 0,
    0,
    100,
    { enabled: !!selectedTeam?.team?.id },
  );

  const isLoading = isLoadingTeams;

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      team_manager: "default",
      coach: "secondary",
      athlete: "outline",
    };
    const labels: Record<string, string> = {
      team_manager: "Trưởng đoàn",
      coach: "HLV",
      athlete: "VĐV",
    };

    return (
      <Badge variant={variants[role] || "outline"}>
        {labels[role] || role}
      </Badge>
    );
  };

  const filteredMembers = teamMembers.filter((member) => {
    if (!searchQuery) return true;
    const memberName =
      member.user?.firstName + " " + member.user?.lastName || "";
    const email = member.user?.email || "";
    return (
      memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Đoàn của tôi</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các đoàn thể thao bạn đang phụ trách
          </p>
        </div>
      </div>

      {myTeams.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Bạn chưa quản lý đoàn nào
            </h3>
            <p className="text-muted-foreground">
              Liên hệ với ban tổ chức để được phân công làm trưởng đoàn
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-4">
          {/* Team List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Danh sách đoàn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {myTeams.map((team) => (
                <Button
                  key={team.id}
                  variant={selectedTeam?.id === team.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedTeam(team)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {team.team?.name || "Đoàn không xác định"}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Team Details */}
          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {selectedTeam?.team?.name || "Chi tiết đoàn"}
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm thành viên..."
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredMembers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Không có thành viên nào
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.user?.firstName} {member.user?.lastName}
                        </TableCell>
                        <TableCell>{member.user?.email}</TableCell>
                        <TableCell>{getRoleBadge(member.role)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa khỏi đoàn
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
