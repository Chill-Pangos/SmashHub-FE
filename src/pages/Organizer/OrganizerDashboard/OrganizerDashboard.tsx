import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/store";
import { useSearchTournaments } from "@/hooks/queries/useTournamentQueries";
import { Trophy, Users, CheckCircle, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Tournament } from "@/types";

export default function OrganizerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Use search to find tournaments for this organizer
  const { data: tournaments, isLoading } = useSearchTournaments(
    { limit: 10, page: 1 },
    { enabled: !!user?.id }
  );

  const totalTournaments = tournaments?.length || 0;
  
  // Example calculation for active vs completed. Assuming status 'IN_PROGRESS' or 'PUBLISHED' means active
  const activeTournaments = tournaments?.filter((t: Tournament) => t.status === "ongoing" || t.status === "registration_open").length || 0;
  const completedTournaments = tournaments?.filter((t: Tournament) => t.status === "completed").length || 0;

  return (
    <div className="space-y-6 px-6 py-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t("organizerDashboard.title", "Organizer Dashboard")}
        </h2>
        <p className="text-muted-foreground">
          {t("organizerDashboard.description", "Manage your tournaments and check performance.")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("organizerDashboard.totalTournaments", "Total Tournaments")}
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : totalTournaments}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("organizerDashboard.created", "Created by you")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("organizerDashboard.activeTournaments", "Active Tournaments")}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : activeTournaments}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("organizerDashboard.currentlyRunning", "Currently running or published")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("organizerDashboard.completedTournaments", "Completed")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : completedTournaments}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("organizerDashboard.finished", "Successfully finished")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("organizerDashboard.totalParticipants", "Total Participants")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              {t("organizerDashboard.acrossAll", "Across all tournaments")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("organizerDashboard.quickActions", "Quick Actions")}</CardTitle>
            <CardDescription>
              {t("organizerDashboard.manageTournaments", "Manage your tournaments directly.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/organizer/tournaments/new">
                <Trophy className="mr-2 h-4 w-4" />
                {t("organizerDashboard.createTournament", "Create Tournament")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/organizer/tournaments">
                <Users className="mr-2 h-4 w-4" />
                {t("organizerDashboard.viewTournaments", "View Tournaments")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
