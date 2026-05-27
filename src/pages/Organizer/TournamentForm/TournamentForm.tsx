import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  StepGeneral,
  StepSchedule,
  StepReview,
  type TournamentData,
} from "./components";

const INITIAL_DATA: TournamentData = {
  name: "",
  tier: 3, // Mặc định là Local (3) thay vì "pro"
  location: "",
  startDate: "",
  endDate: "",
  categories: [], // Khởi tạo mảng rỗng, StepGeneral sẽ xử lý thêm mới
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

const TournamentForm = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<TournamentData>(INITIAL_DATA);

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