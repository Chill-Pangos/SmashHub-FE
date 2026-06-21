import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/store";
import { usePendingMatches } from "@/hooks/queries/useMatchQueries";
import { ClipboardList, AlertCircle, CheckSquare, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RefereeDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Using usePendingMatches for Chief Referee, standard referee might need a different hook or filter
  const { data: pendingMatches, isLoading } = usePendingMatches(0, 1, 10, { enabled: !!user?.id });

  const pendingMatchesCount = pendingMatches?.pagination?.total || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t("referee.dashboard.title", "Referee Dashboard")}
        </h2>
        <p className="text-muted-foreground">
          {t("referee.dashboard.description", "Manage your assigned matches and approvals.")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("referee.dashboard.pendingApprovals", "Pending Approvals")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : pendingMatchesCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("referee.dashboard.needsReview", "Matches needing your review")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("referee.dashboard.assignedMatches", "Assigned Matches")}
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              {t("referee.dashboard.totalAssigned", "Total assigned to you")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("referee.dashboard.completedMatches", "Completed")}
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              {t("referee.dashboard.successfullyRefereed", "Successfully refereed")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("referee.dashboard.disputes", "Disputes")}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {t("referee.dashboard.activeDisputes", "Active disputes to resolve")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("referee.dashboard.quickActions", "Quick Actions")}</CardTitle>
            <CardDescription>
              {t("referee.dashboard.manageDuties", "Manage referee duties directly.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/referee/pending-matches">
                <Clock className="mr-2 h-4 w-4" />
                {t("referee.dashboard.viewPendingApprovals", "View Pending Approvals")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/referee/invitations">
                <ClipboardList className="mr-2 h-4 w-4" />
                {t("referee.dashboard.viewInvitations", "View Invitations")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
