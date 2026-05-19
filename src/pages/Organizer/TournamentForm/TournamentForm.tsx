import { useState } from "react";
import { StepGeneral, StepSchedule, StepReview,type TournamentData } from "./components";

const INITIAL_DATA: TournamentData = {
  name: "",
  tier: "pro",
  location: "",
  startDate: "",
  endDate: "",
  category: {
    format: "mens_singles",
    maxEntries: 32,
    pointSystem: "standard_11",
  },
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<TournamentData>(INITIAL_DATA);

  const updateData = (fields: Partial<TournamentData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3) as 1 | 2 | 3);
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1) as 1 | 2 | 3);

  // Stepper UI Texts
  const stepTitles = {
    1: "General Info & Categories",
    2: "Schedule Configuration",
    3: "Final Review",
  };
  const stepSubtitles = {
    1: "Basic tournament details and formats",
    2: "Define Match Logistics",
    3: "Verify all tournament parameters before initialization",
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header & Stepper */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
                STEP {currentStep} OF 3
              </p>
              <h1 className="text-3xl font-bold">{stepTitles[currentStep]}</h1>
              <p className="text-muted-foreground text-sm mt-1">{stepSubtitles[currentStep]}</p>
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
            <StepGeneral data={formData} updateData={updateData} onNext={nextStep} />
          )}
          {currentStep === 2 && (
            <StepSchedule data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />
          )}
          {currentStep === 3 && (
            <StepReview data={formData} updateData={updateData} onBack={prevStep} />
          )}
        </div>
      </div>
    </div>
  );
};
export default TournamentForm;