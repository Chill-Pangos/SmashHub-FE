import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Plus,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/useAuth";
import { useTeamsByUser, useMembersByTeam, useTeam } from "@/hooks/queries";
import type { TeamMember } from "@/types";
import { TeamDetails } from "./components/TeamDetails";
import AddMemberDialog from "./components/AddMemberDialog";
import EditMemberDialog from "./components/EditMemberDialog";
import DeleteMemberDialog from "./components/DeleteMemberDialog";

export default function MyTeam() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [deleteMemberOpen, setDeleteMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberDetails, setMemberDetails] = useState<Map<number, TeamMember>>(
    new Map(),
  );
  const [loadingMembers, setLoadingMembers] = useState<Set<number>>(new Set());

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
  const {
    data: teamMembers = [],
    refetch: refetchMembers,
    isLoading: isLoadingTeamMembers,
  } = useMembersByTeam(selectedTeam?.teamId ?? 0, 0, 100, {
    enabled: !!selectedTeam?.teamId,
  });

  // Fetch team details to get team name and description
  const { data: teamDetails } = useTeam(selectedTeam?.teamId ?? 0, {
    enabled: !!selectedTeam?.teamId,
  });

  // Fetch detailed member info for each member
  useEffect(() => {
    const fetchMemberDetails = async () => {
      const newMemberDetails = new Map(memberDetails);

      for (const member of teamMembers) {
        // Skip if already fetched
        if (newMemberDetails.has(member.id)) continue;

        setLoadingMembers((prev) => new Set(prev).add(member.id));

        try {
          // Use the useTeamMember hook - but we need to fetch it manually here
          // We'll use the teamMemberService directly
          const { teamMemberService } = await import("@/services");
          const detailedMember = await teamMemberService.getTeamMemberById(
            member.id,
          );
          newMemberDetails.set(member.id, detailedMember);
        } catch (error) {
          console.error(`Failed to fetch member ${member.id}:`, error);
        } finally {
          setLoadingMembers((prev) => {
            const updated = new Set(prev);
            updated.delete(member.id);
            return updated;
          });
        }
      }

      setMemberDetails(newMemberDetails);
    };

    if (teamMembers.length > 0) {
      fetchMemberDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamMembers]);

  const isLoading = isLoadingTeams || isLoadingTeamMembers;

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      team_manager: "default",
      coach: "secondary",
      athlete: "outline",
    };
    const labels: Record<string, string> = {
      team_manager: t("team.teamManager"),
      coach: t("team.coach"),
      athlete: t("team.athlete"),
    };

    return (
      <Badge variant={variants[role] || "outline"}>
        {labels[role] || role}
      </Badge>
    );
  };

  const filteredMembers = teamMembers.filter((member) => {
    if (!searchQuery) return true;

    // Check in detailed member info first
    const detailedMember = memberDetails.get(member.id);
    if (detailedMember?.user) {
      const memberName =
        (detailedMember.user.firstName || "") +
        " " +
        (detailedMember.user.lastName || "");
      const email = detailedMember.user.email || "";
      return (
        memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Fallback to userId and role search
    const userId = member.userId.toString();
    const role = member.role;
    return (
      userId.includes(searchQuery.toLowerCase()) ||
      role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setEditMemberOpen(true);
  };

  const handleDeleteMember = (member: TeamMember) => {
    setSelectedMember(member);
    setDeleteMemberOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {t("teamManager.myDelegation")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("teamManager.manageDelegationsDescription")}
          </p>
        </div>
      </div>

      {myTeams.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t("teamManager.noDelegationsManaging")}
            </h3>
            <p className="text-muted-foreground">
              {t("teamManager.contactOrganizerForAssignment")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-4">
          {/* Team List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("teamManager.delegationList")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {myTeams.map((team) => {
                // For display, we need to fetch the team name separately
                // since TeamMember might not have team details populated
                return (
                  <Button
                    key={team.id}
                    variant={
                      selectedTeam?.id === team.id ? "secondary" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => setSelectedTeam(team)}
                    title={`Team ID: ${team.teamId}`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    <span className="truncate">
                      {team.team?.name ||
                        `${t("team.delegation")} #${team.teamId}`}
                    </span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Team Details and Members */}
          <div className="md:col-span-3 space-y-6">
            {/* Team Details */}
            {selectedTeam?.teamId && teamDetails && (
              <TeamDetails team={teamDetails} />
            )}

            {/* Team Members */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{t("teamManager.memberList")}</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("teamManager.searchMembers")}
                        className="pl-9 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={() => setAddMemberOpen(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {t("team.addMember")}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredMembers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {t("teamManager.noMembers")}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {filteredMembers.map((member) => {
                      const detailedMember = memberDetails.get(member.id);
                      const isLoadingDetail = loadingMembers.has(member.id);
                      const hasUserInfo = detailedMember?.user;

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            {isLoadingDetail ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <p className="text-sm text-muted-foreground">
                                  {t("common.loading")}
                                </p>
                              </div>
                            ) : hasUserInfo ? (
                              <>
                                <p className="font-medium">
                                  {detailedMember.user?.firstName}{" "}
                                  {detailedMember.user?.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {detailedMember.user?.email}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="font-medium">
                                  User ID: {member.userId}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t("teamManager.addedOn")}:{" "}
                                  {new Date(
                                    member.createdAt,
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {getRoleBadge(member.role)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditMember(member)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  {t("teamManager.editRole")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteMember(member)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {t("teamManager.removeFromDelegation")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Add Member Dialog */}
      {selectedTeam && (
        <AddMemberDialog
          open={addMemberOpen}
          onOpenChange={setAddMemberOpen}
          teamId={selectedTeam.team?.id ?? 0}
          onSuccess={() => refetchMembers()}
        />
      )}

      {/* Edit Member Dialog */}
      <EditMemberDialog
        open={editMemberOpen}
        onOpenChange={setEditMemberOpen}
        member={selectedMember}
        onSuccess={() => refetchMembers()}
      />

      {/* Delete Member Dialog */}
      <DeleteMemberDialog
        open={deleteMemberOpen}
        onOpenChange={setDeleteMemberOpen}
        member={selectedMember}
        onSuccess={() => refetchMembers()}
      />
    </div>
  );
}
