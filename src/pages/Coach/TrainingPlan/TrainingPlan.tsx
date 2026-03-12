import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, Plus, Calendar, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function TrainingPlan() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("coach.trainingPlan")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("coach.performanceAnalysis")}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("coach.createPlan")}
        </Button>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="py-12 text-center">
          <Clipboard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("common.noData")}</h3>
          <p className="text-muted-foreground mb-4">{t("coach.createPlan")}</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("coach.createPlan")}
          </Button>
        </CardContent>
      </Card>

      {/* Feature Preview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5" />
              {t("schedule.schedule")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("coach.trainingPlan")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5" />
              {t("coach.myAthletes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("coach.athleteEvaluation")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clipboard className="h-5 w-5" />
              {t("coach.performanceAnalysis")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("coach.tacticalReport")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
