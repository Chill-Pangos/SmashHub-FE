import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import TournamentContentForm from "./TournamentContentForm";
import type { TournamentContentFormData } from "@/utils/validation.utils";
import { useTranslation } from "@/hooks/useTranslation";

interface CategorySettingsProps {
  tournamentContents: TournamentContentFormData[];
  onAdd: (content: TournamentContentFormData) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, content: TournamentContentFormData) => void;
}

export default function CategorySettings({
  tournamentContents,
  onAdd,
  onRemove,
  onUpdate,
}: CategorySettingsProps) {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSave = (content: TournamentContentFormData) => {
    if (editingIndex !== null) {
      onUpdate(editingIndex, content);
      setEditingIndex(null);
    } else {
      onAdd(content);
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
  };

  const getTypeBadge = (type: TournamentContentFormData["type"]) => {
    const colors = {
      single: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      double:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      team: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    };
    const labels = {
      single: t("tournamentManager.setupWizardPage.single"),
      double: t("tournamentManager.setupWizardPage.double"),
      team: t("tournamentManager.setupWizardPage.team"),
    };
    return <Badge className={colors[type]}>{labels[type]}</Badge>;
  };

  const getGenderBadge = (gender?: string | null) => {
    if (!gender) return null;
    const colors = {
      male: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      female: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
      mixed:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    };
    const labels = {
      male: t("tournamentManager.setupWizardPage.male"),
      female: t("tournamentManager.setupWizardPage.female"),
      mixed: t("tournamentManager.setupWizardPage.mixed"),
    };
    return (
      <Badge className={colors[gender as keyof typeof colors]}>
        {labels[gender as keyof typeof labels]}
      </Badge>
    );
  };

  if (isAdding || editingIndex !== null) {
    return (
      <TournamentContentForm
        onSave={handleSave}
        onCancel={handleCancel}
        initialData={
          editingIndex !== null ? tournamentContents[editingIndex] : undefined
        }
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {t("tournamentManager.setupWizardPage.tournamentContentTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("tournamentManager.setupWizardPage.tournamentContentDesc")}
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("tournamentManager.setupWizardPage.addContent")}
        </Button>
      </div>

      {tournamentContents.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            {t("tournamentManager.setupWizardPage.noContentYet")}
          </p>
          <Button variant="outline" onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("tournamentManager.setupWizardPage.addFirstContent")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tournamentContents.map((content, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{content.name}</h3>
                    {getTypeBadge(content.type)}
                    {getGenderBadge(content.gender)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>
                      {t("tournamentManager.setupWizardPage.maxEntries")}:{" "}
                      <strong>{content.maxEntries}</strong>
                    </div>
                    <div>
                      {t("tournamentManager.setupWizardPage.maxSets")}:{" "}
                      <strong>{content.maxSets}</strong>
                    </div>

                    {content.type === "team" && (
                      <>
                        <div>
                          {t(
                            "tournamentManager.setupWizardPage.numberOfSingles",
                          )}
                          : <strong>{content.numberOfSingles ?? 0}</strong>
                        </div>
                        <div>
                          {t(
                            "tournamentManager.setupWizardPage.numberOfDoubles",
                          )}
                          : <strong>{content.numberOfDoubles ?? 0}</strong>
                        </div>
                      </>
                    )}

                    {(content.minAge || content.maxAge) && (
                      <div>
                        {t("athlete.dateOfBirth").replace(
                          "Ngày sinh",
                          t(
                            "tournamentManager.setupWizardPage.ageLabel",
                          ).replace(":", ""),
                        )}
                        :{" "}
                        <strong>
                          {content.minAge ?? "?"} - {content.maxAge ?? "?"}
                        </strong>
                      </div>
                    )}

                    {(content.minElo || content.maxElo) && (
                      <div>
                        ELO:{" "}
                        <strong>
                          {content.minElo ?? "?"} - {content.maxElo ?? "?"}
                        </strong>
                      </div>
                    )}

                    <div>
                      {t("tournamentManager.setupWizardPage.racketCheck")}:{" "}
                      <strong>
                        {content.racketCheck
                          ? t("tournamentManager.setupWizardPage.yes")
                          : t("tournamentManager.setupWizardPage.no")}
                      </strong>
                    </div>

                    <div>
                      {t("tournamentManager.setupWizardPage.hasGroupStage")}:{" "}
                      <strong>
                        {content.isGroupStage
                          ? t("tournamentManager.setupWizardPage.yes")
                          : t("tournamentManager.setupWizardPage.no")}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingIndex(index)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tournamentContents.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>
              {t("tournamentManager.setupWizardPage.totalContents")}:
            </strong>{" "}
            {tournamentContents.length} {t("tournament.contents").toLowerCase()}
          </p>
        </div>
      )}
    </Card>
  );
}
