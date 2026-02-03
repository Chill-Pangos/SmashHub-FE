import { Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface Step {
  id: number;
  titleKey: string;
  descriptionKey: string;
}

const steps: Step[] = [
  {
    id: 1,
    titleKey: "tournamentManager.setupWizardPage.steps.basicInfo",
    descriptionKey: "tournamentManager.setupWizardPage.steps.basicInfoDesc",
  },
  {
    id: 2,
    titleKey: "tournamentManager.setupWizardPage.steps.tournamentContent",
    descriptionKey:
      "tournamentManager.setupWizardPage.steps.tournamentContentDesc",
  },
  {
    id: 3,
    titleKey: "tournamentManager.setupWizardPage.steps.delegations",
    descriptionKey: "tournamentManager.setupWizardPage.steps.delegationsDesc",
  },
  {
    id: 4,
    titleKey: "tournamentManager.setupWizardPage.steps.referees",
    descriptionKey: "tournamentManager.setupWizardPage.steps.refereesDesc",
  },
  {
    id: 5,
    titleKey: "tournamentManager.setupWizardPage.steps.confirmation",
    descriptionKey: "tournamentManager.setupWizardPage.steps.confirmationDesc",
  },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    step.id < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : step.id === currentStep
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      step.id < currentStep
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    step.id === currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {t(step.titleKey)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(step.descriptionKey)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
