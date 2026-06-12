import { useTranslation } from "@/hooks/useTranslation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/store";
import { useAthleteUpcomingMatches, useAthleteMatchHistory } from "@/hooks/queries/useMatchQueries";
import { Trophy, Calendar, History, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function UserDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const { data: upcomingMatchesData, isLoading: isLoadingUpcoming } = useAthleteUpcomingMatches(user?.id || 0, 1, 5, { enabled: !!user?.id });
  const { data: historyMatchesData, isLoading: isLoadingHistory } = useAthleteMatchHistory(user?.id || 0, 1, 5, { enabled: !!user?.id });

  const upcomingMatchesCount = upcomingMatchesData?.count || 0;
  const historyMatchesCount = historyMatchesData?.count || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t("user.dashboard.title", "My Dashboard")}
        </h2>
        <p className="text-muted-foreground">
          {t("user.dashboard.description", "Welcome back, ")} {user?.firstName} {user?.lastName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("user.dashboard.eloRating", "Current ELO")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.eloScore || 1200}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("user.dashboard.rankingPoints", "Ranking points")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("user.dashboard.upcomingMatches", "Upcoming Matches")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingUpcoming ? "..." : upcomingMatchesCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("user.dashboard.scheduledMatches", "Matches scheduled")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("user.dashboard.matchesPlayed", "Matches Played")}
            </CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingHistory ? "..." : historyMatchesCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("user.dashboard.totalHistorical", "Total matches finished")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("user.dashboard.winRate", "Win Rate")}
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--%</div>
            <p className="text-xs text-muted-foreground">
              {t("user.dashboard.performance", "Overall performance")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("user.dashboard.quickActions", "Quick Actions")}</CardTitle>
            <CardDescription>
              {t("user.dashboard.accessFeatures", "Quickly access main features.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/tournaments">
                <Trophy className="mr-2 h-4 w-4" />
                {t("user.dashboard.findTournaments", "Find Tournaments")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/profile">
                <TrendingUp className="mr-2 h-4 w-4" />
                {t("user.dashboard.viewProfile", "View Profile")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
