import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
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
import { useAuth } from "@/store/useAuth";
import { useTeamsByUser, queryKeys } from "@/hooks/queries";
import { useQueries } from "@tanstack/react-query";
import type { TeamMember } from "@/types";

export default function CoachAthletes() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch teams where user is coach
  const { data: teamsData = [], isLoading: isLoadingTeams } = useTeamsByUser(
    user?.id ?? 0,
    0,
    50,
    { enabled: !!user?.id },
  );

  const coachTeams = useMemo(
    () => teamsData.filter((tm) => tm.role === "coach"),
    [teamsData],
  );

  // Fetch athletes from each team using useQueries
  const teamIds = useMemo(
    () => coachTeams.map((t) => t.team?.id).filter((id): id is number => !!id),
    [coachTeams],
  );

  const athleteQueries = useQueries({
    queries: teamIds.map((teamId) => ({
      queryKey: queryKeys.teamMembers.byTeam(teamId),
      queryFn: async () => {
        const { teamMemberService } = await import("@/services");
        return teamMemberService.getMembersByTeamId(teamId, 0, 100);
      },
      enabled: teamId > 0,
    })),
  });

  const athletes = useMemo(() => {
    const allAthletes: TeamMember[] = [];
    athleteQueries.forEach((query) => {
      if (query.data) {
        const teamAthletes = query.data.filter((m) => m.role === "athlete");
        allAthletes.push(...teamAthletes);
      }
    });
    return allAthletes;
  }, [athleteQueries]);

  const isLoading = isLoadingTeams || athleteQueries.some((q) => q.isLoading);

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
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("coach.myAthletes")}</h1>
        <p className="text-muted-foreground mt-1">{t("athlete.athleteList")}</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("placeholder.searchByName")}
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
            {t("athlete.athleteList")} ({filteredAthletes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAthletes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t("message.noResultsFound")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("auth.fullName")}</TableHead>
                  <TableHead>{t("auth.email")}</TableHead>
                  <TableHead>{t("team.delegation")}</TableHead>
                  <TableHead className="text-right">
                    {t("common.status")}
                  </TableHead>
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
                      <Badge variant="outline">{t("common.status")}</Badge>
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
