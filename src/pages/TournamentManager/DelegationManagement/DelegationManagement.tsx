import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Upload,
  Users,
  Trophy,
  ChevronRight,
  FileSpreadsheet,
  MapPin,
  Calendar,
} from "lucide-react";
import TeamImportDialog from "@/components/custom/TeamImportDialog";
import EntryImportDialog from "@/components/custom/EntryImportDialog";
import { useTournaments, useTournament } from "@/hooks/queries";

import { showToast } from "@/utils";

export default function DelegationManagement() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<"teams" | "entries">("teams");
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null,
  );
  const [teamImportOpen, setTeamImportOpen] = useState(false);
  const [entryImportOpen, setEntryImportOpen] = useState(false);

  // React Query hooks
  const { data: tournaments = [], isLoading: isLoadingTournaments } =
    useTournaments(0, 100);
  const { data: selectedTournament, isLoading: isLoadingDetails } =
    useTournament(selectedTournamentId || 0, {
      enabled: !!selectedTournamentId,
    });

  const loading = isLoadingTournaments || isLoadingDetails;

  const handleDownloadTeamTemplate = () => {
    const link = document.createElement("a");
    link.href = "/src/assets/DangKyDanhSach.xlsx";
    link.download = "DangKyDanhSach.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success(
      t("tournamentManager.delegationManagement.templateDownloaded"),
    );
  };

  const handleDownloadEntryTemplate = (
    contentType: "single" | "double" | "team",
  ) => {
    const templates = {
      single: "/src/assets/DangKyNoiDungThiDau_Single.xlsx",
      double: "/src/assets/DangKyNoiDungThiDau_Double.xlsx",
      team: "/src/assets/DangKyNoiDungThiDau_Team.xlsx",
    };

    const link = document.createElement("a");
    link.href = templates[contentType];
    link.download = `DangKyNoiDungThiDau_${contentType}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success(
      t("tournamentManager.delegationManagement.entryTemplateDownloaded"),
    );
  };

  const getContentTypeBadge = (type: string) => {
    const variants = {
      single: { variant: "default" as const, label: t("teamManager.single") },
      double: { variant: "secondary" as const, label: t("teamManager.double") },
      team: { variant: "outline" as const, label: t("team.team") },
    };
    const config = variants[type as keyof typeof variants] || variants.single;
    return (
      <Badge variant={config.variant} className="ml-2">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {t("tournamentManager.delegationManagement.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("tournamentManager.delegationManagement.description")}
        </p>
      </div>

      {/* Tournament Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("teamManager.selectTournament")}
            </label>
            <Select
              value={selectedTournamentId?.toString() || ""}
              onValueChange={(value) =>
                setSelectedTournamentId(value ? Number(value) : null)
              }
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("teamManager.selectTournamentPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((tournament) => (
                  <SelectItem
                    key={tournament.id}
                    value={tournament.id.toString()}
                  >
                    {tournament.name} - {tournament.location} (
                    {new Date(tournament.startDate).toLocaleDateString("vi-VN")}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTournament && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("tournament.tournamentInfo")}:
                </span>
                <Badge
                  variant={
                    selectedTournament.status === "upcoming"
                      ? "default"
                      : selectedTournament.status === "ongoing"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {selectedTournament.status === "upcoming"
                    ? t("tournament.upcoming")
                    : selectedTournament.status === "ongoing"
                      ? t("tournament.ongoing")
                      : t("tournament.completed")}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {t("tournament.location")}: {selectedTournament.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {t("teamManager.time")}:{" "}
                  {new Date(selectedTournament.startDate).toLocaleDateString(
                    "vi-VN",
                  )}
                  {selectedTournament.endDate &&
                    ` - ${new Date(selectedTournament.endDate).toLocaleDateString("vi-VN")}`}
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  {t("teamManager.numberOfContents")}:{" "}
                  {selectedTournament.contents?.length || 0}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {selectedTournamentId && (
        <>
          {/* Step Navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant={activeStep === "teams" ? "default" : "outline"}
              onClick={() => setActiveStep("teams")}
              className="flex-1"
            >
              <Users className="mr-2 h-4 w-4" />
              {t("teamManager.step1RegisterDelegation")}
            </Button>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <Button
              variant={activeStep === "entries" ? "default" : "outline"}
              onClick={() => setActiveStep("entries")}
              className="flex-1"
            >
              <Trophy className="mr-2 h-4 w-4" />
              {t("teamManager.step2RegisterContents")}
            </Button>
          </div>

          {/* Step 1: Team Registration */}
          {activeStep === "teams" && (
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("tournamentManager.delegationManagement.registerTeamList")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "tournamentManager.delegationManagement.registerTeamListDescription",
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleDownloadTeamTemplate}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("teamManager.downloadTemplateFile")}
                </Button>
                <Button
                  onClick={() => setTeamImportOpen(true)}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t("teamManager.importDelegationList")}
                </Button>
              </div>

              <div className="p-4 border border-dashed rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">
                      {t("teamManager.usageGuide")}:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>{t("teamManager.instruction1")}</li>
                      <li>{t("teamManager.instruction2")}</li>
                      <li>{t("teamManager.instruction3")}</li>
                      <li>{t("teamManager.instruction4")}</li>
                      <li>{t("teamManager.instruction5")}</li>
                    </ol>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Entry Registration */}
          {activeStep === "entries" && (
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("teamManager.registerContents")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "tournamentManager.delegationManagement.selectContentAndImport",
                  )}
                </p>
              </div>

              {selectedTournament?.contents &&
              selectedTournament.contents.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t(
                        "tournamentManager.delegationManagement.selectContent",
                      )}
                    </label>
                    <Select
                      value={selectedContentId?.toString() || ""}
                      onValueChange={(value) =>
                        setSelectedContentId(value ? Number(value) : null)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t(
                            "tournamentManager.delegationManagement.selectContentPlaceholder",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTournament.contents.map((content) => (
                          <SelectItem
                            key={content.id}
                            value={content.id!.toString()}
                          >
                            <div className="flex items-center">
                              {content.name}
                              {getContentTypeBadge(content.type)}
                              <span className="ml-2 text-xs text-muted-foreground">
                                (Max: {content.maxEntries} entries)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedContentId && (
                    <>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const content = selectedTournament.contents?.find(
                              (c) => c.id === selectedContentId,
                            );
                            if (content) {
                              handleDownloadEntryTemplate(content.type);
                            }
                          }}
                          className="flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {t("teamManager.downloadTemplate")}
                        </Button>
                        <Button
                          onClick={() => setEntryImportOpen(true)}
                          className="flex-1"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {t("teamManager.importRegistration")}
                        </Button>
                      </div>

                      <div className="p-4 border border-dashed rounded-lg space-y-2">
                        <div className="flex items-start gap-2">
                          <FileSpreadsheet className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p className="font-medium text-foreground">
                              {t("teamManager.usageGuide")}:
                            </p>
                            <ol className="list-decimal list-inside space-y-1 ml-2">
                              <li>
                                {t(
                                  "tournamentManager.delegationManagement.entryInstruction1",
                                )}
                              </li>
                              <li>
                                {t(
                                  "tournamentManager.delegationManagement.entryInstruction2",
                                )}
                              </li>
                              <li>
                                {t(
                                  "tournamentManager.delegationManagement.entryInstruction3",
                                )}
                              </li>
                              <li>{t("teamManager.instruction5")}</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{t("teamManager.noContentsYet")}</p>
                </div>
              )}
            </Card>
          )}
        </>
      )}

      {/* Import Dialogs */}
      {selectedTournamentId && (
        <>
          <TeamImportDialog
            open={teamImportOpen}
            onOpenChange={setTeamImportOpen}
            tournamentId={selectedTournamentId}
            onImportSuccess={() => {
              showToast.success(
                t("tournamentManager.delegationManagement.teamImportSuccess"),
              );
              setActiveStep("entries");
            }}
          />

          {selectedContentId && (
            <EntryImportDialog
              open={entryImportOpen}
              onOpenChange={setEntryImportOpen}
              contentId={selectedContentId}
              contentType={
                selectedTournament?.contents?.find(
                  (c) => c.id === selectedContentId,
                )?.type || "single"
              }
              onImportSuccess={() => {
                showToast.success(
                  t(
                    "tournamentManager.delegationManagement.entryImportSuccess",
                  ),
                );
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
