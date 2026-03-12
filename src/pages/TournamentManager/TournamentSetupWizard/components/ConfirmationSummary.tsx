import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import type {
  TournamentFormData,
  TournamentContentFormData,
} from "@/utils/validation.utils";
import { useTranslation } from "@/hooks/useTranslation";

interface ConfirmationSummaryProps {
  formData: TournamentFormData;
  tournamentContents: TournamentContentFormData[];
  selectedDelegations: string[];
}

export default function ConfirmationSummary({
  formData,
  tournamentContents,
  selectedDelegations,
}: ConfirmationSummaryProps) {
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      upcoming: t("tournamentManager.setupWizardPage.upcoming"),
      ongoing: t("tournamentManager.setupWizardPage.ongoing"),
      completed: t("tournamentManager.setupWizardPage.completed"),
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      single: t("tournamentManager.setupWizardPage.single"),
      double: t("tournamentManager.setupWizardPage.double"),
      team: t("tournamentManager.setupWizardPage.team"),
    };
    return labels[type] || type;
  };

  const getGenderLabel = (gender?: string | null) => {
    if (!gender) return t("tournamentManager.setupWizardPage.all");
    const labels: Record<string, string> = {
      male: t("tournamentManager.setupWizardPage.male"),
      female: t("tournamentManager.setupWizardPage.female"),
      mixed: t("tournamentManager.setupWizardPage.mixed"),
    };
    return labels[gender] || gender;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {t("tournamentManager.setupWizardPage.confirmInfo")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("tournamentManager.setupWizardPage.confirmInfoDesc")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Badge>1</Badge>
            {t("tournamentManager.setupWizardPage.basicInfoSection")}
          </h3>
          <div className="pl-8 space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">
                {t("tournamentManager.setupWizardPage.tournamentNameLabel")}
              </span>
              <span className="col-span-2 font-medium">
                {formData.name || "-"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">
                {t("tournamentManager.setupWizardPage.locationLabelSummary")}
              </span>
              <span className="col-span-2">{formData.location || "-"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">
                {t("tournamentManager.setupWizardPage.startTimeLabel")}
              </span>
              <span className="col-span-2">
                {formatDate(formData.startDate)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">
                {t("tournamentManager.setupWizardPage.endTimeLabel")}
              </span>
              <span className="col-span-2">{formatDate(formData.endDate)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">
                {t("tournamentManager.setupWizardPage.statusLabelSummary")}
              </span>
              <span className="col-span-2">
                {getStatusLabel(formData.status || "upcoming")}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">
                {t("tournamentManager.setupWizardPage.tablesLabel")}
              </span>
              <span className="col-span-2 font-medium">
                {formData.numberOfTables || 1}{" "}
                {t("tournamentManager.setupWizardPage.tablesUnit")}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Badge>2</Badge>
            {t("tournamentManager.setupWizardPage.tournamentContentSection")}
            <Badge variant="secondary">{tournamentContents.length}</Badge>
          </h3>
          {tournamentContents.length === 0 ? (
            <p className="pl-8 text-sm text-muted-foreground">
              {t("tournamentManager.setupWizardPage.noTournamentContent")}
            </p>
          ) : (
            <div className="pl-8 space-y-3">
              {tournamentContents.map((content, index) => (
                <Card key={index} className="p-3">
                  <div className="font-medium mb-1">{content.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      {t("tournamentManager.setupWizardPage.typeLabel")}{" "}
                      <strong>{getTypeLabel(content.type)}</strong>
                    </div>
                    <div>
                      {t("tournamentManager.setupWizardPage.genderLabel")}{" "}
                      <strong>{getGenderLabel(content.gender)}</strong>
                    </div>
                    <div>
                      {t("tournamentManager.setupWizardPage.quantityLabel")}{" "}
                      <strong>{content.maxEntries}</strong>
                    </div>
                    <div>
                      {t("tournamentManager.setupWizardPage.setsLabel")}{" "}
                      <strong>{content.maxSets}</strong>
                    </div>

                    {content.type === "team" && (
                      <>
                        <div>
                          {t(
                            "tournamentManager.setupWizardPage.singlesMatchLabel",
                          )}{" "}
                          <strong>{content.numberOfSingles ?? 0}</strong>
                        </div>
                        <div>
                          {t(
                            "tournamentManager.setupWizardPage.doublesMatchLabel",
                          )}{" "}
                          <strong>{content.numberOfDoubles ?? 0}</strong>
                        </div>
                      </>
                    )}

                    {(content.minAge || content.maxAge) && (
                      <div className="col-span-2">
                        {t("tournamentManager.setupWizardPage.ageLabel")}{" "}
                        <strong>
                          {content.minAge ?? "?"} - {content.maxAge ?? "?"}
                        </strong>
                      </div>
                    )}

                    {(content.minElo || content.maxElo) && (
                      <div className="col-span-2">
                        {t("tournamentManager.setupWizardPage.eloLabel")}{" "}
                        <strong>
                          {content.minElo ?? "?"} - {content.maxElo ?? "?"}
                        </strong>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {selectedDelegations.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Badge>3</Badge>
              {t("tournamentManager.setupWizardPage.delegationsSection")}
              <Badge variant="secondary">{selectedDelegations.length}</Badge>
            </h3>
            <div className="pl-8 text-sm text-muted-foreground">
              {t(
                "tournamentManager.setupWizardPage.delegationsSelectedCount",
              ).replace("{{count}}", selectedDelegations.length.toString())}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>{t("common.warning")}:</strong>{" "}
          {t("tournamentManager.setupWizardPage.confirmNote")}
        </p>
      </div>
    </Card>
  );
}
