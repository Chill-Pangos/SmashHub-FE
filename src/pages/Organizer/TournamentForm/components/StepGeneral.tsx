import React, { useState } from "react";
import type { StepProps } from "./types";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Users, Trash2 } from "lucide-react";

export const StepGeneral: React.FC<StepProps> = ({
  data,
  updateData,
  onNext,
}) => {
  const { t } = useTranslation();
  const [validationError, setValidationError] = useState<string | null>(null);

  const tierLabels = {
    pro: t("tournamentManager.createTournamentForm.general.tiers.pro"),
    challenger: t(
      "tournamentManager.createTournamentForm.general.tiers.challenger",
    ),
    local: t("tournamentManager.createTournamentForm.general.tiers.local"),
  };

  const formatLabels = {
    mens_singles: t(
      "tournamentManager.createTournamentForm.general.formats.mensSingles",
    ),
    womens_singles: t(
      "tournamentManager.createTournamentForm.general.formats.womensSingles",
    ),
    mixed_doubles: t(
      "tournamentManager.createTournamentForm.general.formats.mixedDoubles",
    ),
  };

  const pointSystemLabels = {
    standard_11: t(
      "tournamentManager.createTournamentForm.general.pointSystems.standard11",
    ),
    pro_1000: t(
      "tournamentManager.createTournamentForm.general.pointSystems.pro1000",
    ),
  };

  const handleNext = () => {
    const startDate = data.startDate ? new Date(data.startDate) : null;
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (!data.name.trim()) {
      setValidationError(
        t(
          "tournamentManager.createTournamentForm.general.validation.nameRequired",
        ),
      );
      return;
    }

    if (!data.location.trim()) {
      setValidationError(
        t(
          "tournamentManager.createTournamentForm.general.validation.locationRequired",
        ),
      );
      return;
    }

    if (!startDate || Number.isNaN(startDate.getTime())) {
      setValidationError(
        t(
          "tournamentManager.createTournamentForm.general.validation.startDateRequired",
        ),
      );
      return;
    }

    if (!endDate || Number.isNaN(endDate.getTime())) {
      setValidationError(
        t(
          "tournamentManager.createTournamentForm.general.validation.endDateRequired",
        ),
      );
      return;
    }

    if (startDate.getTime() > endDate.getTime()) {
      setValidationError(
        t(
          "tournamentManager.createTournamentForm.general.validation.dateOrderInvalid",
        ),
      );
      return;
    }

    if (data.category.maxEntries < 1) {
      setValidationError(
        t(
          "tournamentManager.createTournamentForm.general.validation.maxEntriesInvalid",
        ),
      );
      return;
    }

    setValidationError(null);
    onNext?.();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tournament Details */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Info className="w-5 h-5" />
          <h3 className="font-semibold text-lg">
            {t("tournamentManager.createTournamentForm.general.detailsTitle")}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.name")}
            </Label>
            <Input
              placeholder={t(
                "tournamentManager.createTournamentForm.general.namePlaceholder",
              )}
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="bg-input/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.tier")}
            </Label>
            <Select
              value={data.tier}
              onValueChange={(val) => updateData({ tier: val })}
            >
              <SelectTrigger className="bg-input/50">
                <SelectValue
                  placeholder={t(
                    "tournamentManager.createTournamentForm.general.tierPlaceholder",
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pro">{tierLabels.pro}</SelectItem>
                <SelectItem value="challenger">
                  {tierLabels.challenger}
                </SelectItem>
                <SelectItem value="local">{tierLabels.local}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-1">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.location")}
            </Label>
            <Input
              placeholder={t(
                "tournamentManager.createTournamentForm.general.locationPlaceholder",
              )}
              value={data.location}
              onChange={(e) => updateData({ location: e.target.value })}
              className="bg-input/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.startDate")}
            </Label>
            <Input
              type="date"
              value={data.startDate}
              onChange={(e) => updateData({ startDate: e.target.value })}
              className="bg-input/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.endDate")}
            </Label>
            <Input
              type="date"
              value={data.endDate}
              onChange={(e) => updateData({ endDate: e.target.value })}
              className="bg-input/50"
            />
          </div>
        </div>
      </section>

      {/* Category Definition */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold text-lg">
              {t(
                "tournamentManager.createTournamentForm.general.categoryTitle",
              )}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-border text-primary"
            disabled
          >
            {t("tournamentManager.createTournamentForm.general.addCategory")}
          </Button>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="space-y-2 md:col-span-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                {t("tournamentManager.createTournamentForm.general.format")}
              </Label>
              <Select
                value={data.category.format}
                onValueChange={(val) =>
                  updateData({ category: { ...data.category, format: val } })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue
                    placeholder={t(
                      "tournamentManager.createTournamentForm.general.formatPlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mens_singles">
                    {formatLabels.mens_singles}
                  </SelectItem>
                  <SelectItem value="womens_singles">
                    {formatLabels.womens_singles}
                  </SelectItem>
                  <SelectItem value="mixed_doubles">
                    {formatLabels.mixed_doubles}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                {t("tournamentManager.createTournamentForm.general.maxEntries")}
              </Label>
              <Input
                type="number"
                value={data.category.maxEntries}
                onChange={(e) =>
                  updateData({
                    category: {
                      ...data.category,
                      maxEntries: Number(e.target.value),
                    },
                  })
                }
                className="bg-background"
              />
            </div>
            <div className="space-y-2 md:col-span-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                {t(
                  "tournamentManager.createTournamentForm.general.pointSystem",
                )}
              </Label>
              <Select
                value={data.category.pointSystem}
                onValueChange={(val) =>
                  updateData({
                    category: { ...data.category, pointSystem: val },
                  })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue
                    placeholder={t(
                      "tournamentManager.createTournamentForm.general.pointSystemPlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard_11">
                    {pointSystemLabels.standard_11}
                  </SelectItem>
                  <SelectItem value="pro_1000">
                    {pointSystemLabels.pro_1000}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1 flex justify-center pb-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {validationError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p className="font-medium">
            {t(
              "tournamentManager.createTournamentForm.general.validation.title",
            )}
          </p>
          <p className="mt-1">{validationError}</p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
        >
          {t("tournamentManager.createTournamentForm.general.nextButton")}
        </Button>
      </div>
    </div>
  );
};
