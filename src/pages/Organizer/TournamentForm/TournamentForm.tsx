import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useTournament, useScheduleConfigByTournament } from "@/hooks/queries";
import { Loader2 } from "lucide-react";
import {
  StepGeneral,
  StepSchedule,
  StepReview,
  type TournamentData,
} from "./components";

const INITIAL_DATA: TournamentData = {
  name: "",
  tier: 3, 
  location: "",
  startDate: "",
  endDate: "",
  registrationStartDate: "",
  registrationEndDate: "",
  bracketGenerationDate: "",
  categories: [],
  schedule: {
    activeTables: 12,
    matchDurationMinutes: 45,
    dailyStartTime: "08:00",
    dailyEndTime: "22:00",
    hasBreak: true,
    breakStartTime: "12:30",
    breakDurationMinutes: 60,
    notes: "",
  },
};

const safeFormatDate = (dateStr?: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

const TournamentForm = () => {
  const { t } = useTranslation();
  const { tournamentId } = useParams();
  const id = tournamentId ? parseInt(tournamentId, 10) : 0;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<TournamentData>(INITIAL_DATA);
  const [isDataLoaded, setIsDataLoaded] = useState(!id);

  // Fetch data if editing
  const { data: tournament } = useTournament(id, { enabled: !!id });
  const { data: scheduleConfig } = useScheduleConfigByTournament(id, { enabled: !!id });

  useEffect(() => {
    if (id && tournament && scheduleConfig) {
      setFormData({
        name: tournament.name,
        tier: tournament.tier || 3,
        location: tournament.location,
        startDate: safeFormatDate(tournament.startDate),
        endDate: safeFormatDate(tournament.endDate),
        registrationStartDate: safeFormatDate(tournament.registrationStartDate),
        registrationEndDate: safeFormatDate(tournament.registrationEndDate),
        bracketGenerationDate: safeFormatDate(tournament.bracketGenerationDate),
        categories: tournament.categories?.map(c => ({
          name: c.name,
          type: c.type,
          maxEntries: c.maxEntries,
          maxSets: c.maxSets,
          teamFormat: c.teamFormat || null,
          minAge: c.minAge || null,
          maxAge: c.maxAge || null,
          minElo: c.minElo || null,
          maxElo: c.maxElo || null,
          maxMembersPerEntry: 0, // This might need adjustment if present in TournamentCategory
          gender: c.gender || "mixed",
          isGroupStage: c.isGroupStage ?? false,
          entryFee: c.entryFee || 0,
          numberOfSingles: c.numberOfSingles || 0,
          numberOfDoubles: c.numberOfDoubles || 0,
        })) || [],
        schedule: {
          activeTables: scheduleConfig.numberOfTables || 12,
          matchDurationMinutes: scheduleConfig.matchDurationMinutes || 45,
          dailyStartTime: `${String(scheduleConfig.dailyStartHour || 8).padStart(2, '0')}:${String(scheduleConfig.dailyStartMinute || 0).padStart(2, '0')}`,
          dailyEndTime: `${String(scheduleConfig.dailyEndHour || 22).padStart(2, '0')}:${String(scheduleConfig.dailyEndMinute || 0).padStart(2, '0')}`,
          hasBreak: scheduleConfig.lunchBreakDurationMinutes != null,
          breakStartTime: scheduleConfig.lunchBreakStartHour != null 
            ? `${String(scheduleConfig.lunchBreakStartHour).padStart(2, '0')}:${String(scheduleConfig.lunchBreakStartMinute || 0).padStart(2, '0')}` 
            : "12:30",
          breakDurationMinutes: scheduleConfig.lunchBreakDurationMinutes || 60,
          notes: scheduleConfig.notes || "",
        },
      });
      setIsDataLoaded(true);
    }
  }, [id, tournament, scheduleConfig]);

  const updateData = (fields: Partial<TournamentData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, 3) as 1 | 2 | 3);
  const prevStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 1) as 1 | 2 | 3);

  // Stepper UI Texts
  const stepTitles = {
    1: t("tournamentManager.createTournamentForm.stepTitles.general"),
    2: t("tournamentManager.createTournamentForm.stepTitles.schedule"),
    3: t("tournamentManager.createTournamentForm.stepTitles.review"),
  };
  const stepSubtitles = {
    1: t("tournamentManager.createTournamentForm.stepSubtitles.general"),
    2: t("tournamentManager.createTournamentForm.stepSubtitles.schedule"),
    3: t("tournamentManager.createTournamentForm.stepSubtitles.review"),
  };

  if (!isDataLoaded && id) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">
            {t("tournamentManager.createTournamentForm.loading", "Loading tournament data...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header & Stepper */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
                {t("tournamentManager.createTournamentForm.stepIndicator", {
                  currentStep,
                })}
              </p>
              <h1 className="text-3xl font-bold">{stepTitles[currentStep]}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {stepSubtitles[currentStep]}
              </p>
            </div>

            {/* Progress Indicators */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${
                    step === currentStep
                      ? "bg-primary"
                      : step < currentStep
                        ? "bg-primary/40"
                        : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
          {currentStep === 1 && (
            <StepGeneral
              data={formData}
              updateData={updateData}
              onNext={nextStep}
            />
          )}
          {currentStep === 2 && (
            <StepSchedule
              data={formData}
              updateData={updateData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && (
            <StepReview
              data={formData}
              updateData={updateData}
              onBack={prevStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentForm;