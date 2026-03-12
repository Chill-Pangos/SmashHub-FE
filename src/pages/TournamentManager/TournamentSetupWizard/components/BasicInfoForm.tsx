import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  TournamentFormData,
  ValidationErrors,
} from "@/utils/validation.utils";
import type { TournamentStatus } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface BasicInfoFormProps {
  formData: TournamentFormData;
  onChange: (field: keyof TournamentFormData, value: string) => void;
  errors?: ValidationErrors;
}

export default function BasicInfoForm({
  formData,
  onChange,
  errors = {},
}: BasicInfoFormProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        {t("tournamentManager.setupWizardPage.basicInfoTitle")}
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>
            {t("tournamentManager.setupWizardPage.tournamentName")} *
          </Label>
          <Input
            placeholder={t(
              "tournamentManager.setupWizardPage.tournamentNamePlaceholder",
            )}
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label>
            {t("tournamentManager.setupWizardPage.locationLabel")} *
          </Label>
          <Input
            placeholder={t(
              "tournamentManager.setupWizardPage.locationPlaceholder",
            )}
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t("tournamentManager.setupWizardPage.startDate")} *</Label>
            <Input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("tournamentManager.setupWizardPage.endDate")} *</Label>
            <Input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
              className={errors.endDate ? "border-red-500" : ""}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("tournamentManager.setupWizardPage.statusLabel")}</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              onChange("status", value as TournamentStatus)
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "tournamentManager.setupWizardPage.selectStatus",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">
                {t("tournamentManager.setupWizardPage.upcoming")}
              </SelectItem>
              <SelectItem value="ongoing">
                {t("tournamentManager.setupWizardPage.ongoing")}
              </SelectItem>
              <SelectItem value="completed">
                {t("tournamentManager.setupWizardPage.completed")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("tournamentManager.setupWizardPage.numberOfTables")}</Label>
          <Input
            type="number"
            min="1"
            max="100"
            placeholder={t(
              "tournamentManager.setupWizardPage.numberOfTablesDefault",
            )}
            value={formData.numberOfTables || 1}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : 1;
              onChange("numberOfTables", value.toString());
            }}
            className={errors.numberOfTables ? "border-red-500" : ""}
          />
          {errors.numberOfTables && (
            <p className="text-sm text-red-500">{errors.numberOfTables}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {t("tournamentManager.setupWizardPage.numberOfTablesDesc")}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>{t("common.warning")}:</strong>{" "}
            {t("tournamentManager.setupWizardPage.basicInfoNote")}
          </p>
        </div>
      </div>
    </Card>
  );
}
