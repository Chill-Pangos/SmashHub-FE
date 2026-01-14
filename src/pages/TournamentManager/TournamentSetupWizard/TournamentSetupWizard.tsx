import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import {
  StepIndicator,
  BasicInfoForm,
  CategorySettings,
  DelegationSelection,
  ConfirmationSummary,
} from "./components";
import { tournamentService } from "@/services";
import { showToast } from "@/utils/toast.utils";
import {
  validateTournamentForm,
  validateTournamentContentForm,
  type TournamentFormData,
  type TournamentContentFormData,
  type ValidationErrors,
} from "@/utils/validation.utils";
import type {
  CreateTournamentRequest,
  CreateTournamentContentRequest,
  Tournament,
} from "@/types";

export default function TournamentSetupWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTournament, setCreatedTournament] = useState<Tournament | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [formData, setFormData] = useState<TournamentFormData>({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    status: "upcoming",
  });

  const [tournamentContents, setTournamentContents] = useState<
    TournamentContentFormData[]
  >([]);
  const [selectedDelegations, setSelectedDelegations] = useState<string[]>([]);

  const handleFormChange = (field: keyof TournamentFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear validation error for this field
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  const handleAddContent = (content: TournamentContentFormData) => {
    setTournamentContents([...tournamentContents, content]);
  };

  const handleRemoveContent = (index: number) => {
    setTournamentContents(tournamentContents.filter((_, i) => i !== index));
  };

  const handleUpdateContent = (
    index: number,
    content: TournamentContentFormData
  ) => {
    const updated = [...tournamentContents];
    updated[index] = content;
    setTournamentContents(updated);
  };

  const validateCurrentStep = (): boolean => {
    if (step === 1) {
      const errors = validateTournamentForm(formData);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        showToast.error("Vui lòng kiểm tra lại thông tin", "Có lỗi trong form");
        return false;
      }
    }
    return true;
  };

  const handleCreateTournament = async () => {
    // Final validation before submission
    const tournamentErrors = validateTournamentForm(formData);
    if (Object.keys(tournamentErrors).length > 0) {
      setValidationErrors(tournamentErrors);
      showToast.error("Vui lòng kiểm tra lại thông tin giải đấu");
      setStep(1);
      return;
    }

    // Validate all contents
    const contentErrors = tournamentContents.map((content) =>
      validateTournamentContentForm(content)
    );
    const hasContentErrors = contentErrors.some(
      (errors) => Object.keys(errors).length > 0
    );
    if (hasContentErrors) {
      showToast.error("Vui lòng kiểm tra lại thông tin nội dung thi đấu");
      setStep(2);
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare request data
      const contents: CreateTournamentContentRequest[] = tournamentContents.map(
        (content) => ({
          name: content.name,
          type: content.type,
          maxEntries: content.maxEntries,
          maxSets: content.maxSets,
          racketCheck: content.racketCheck,
          numberOfSingles: content.numberOfSingles,
          numberOfDoubles: content.numberOfDoubles,
          minAge: content.minAge,
          maxAge: content.maxAge,
          minElo: content.minElo,
          maxElo: content.maxElo,
          gender: content.gender,
          isGroupStage: content.isGroupStage,
        })
      );

      const requestData: CreateTournamentRequest = {
        name: formData.name,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null,
        location: formData.location,
        status: formData.status || "upcoming",
        contents,
      };

      const response = await tournamentService.createTournament(requestData);

      if (response.success && response.data) {
        setCreatedTournament(response.data);
        showToast.success("Tạo giải đấu thành công!", response.message);
        setStep(5); // Move to success step
      } else {
        showToast.error("Không thể tạo giải đấu", "Vui lòng thử lại");
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
      showToast.error(
        "Đã có lỗi xảy ra khi tạo giải đấu",
        error instanceof Error ? error.message : "Vui lòng thử lại"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.startDate && formData.location;
      case 2:
        return tournamentContents.length > 0;
      case 3:
        return selectedDelegations.length >= 0; // Optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (step === 4) {
      handleCreateTournament();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Thiết lập giải đấu mới</h1>

      <StepIndicator currentStep={step} />

      <div className="mb-8">
        {step === 1 && (
          <BasicInfoForm
            formData={formData}
            onChange={handleFormChange}
            errors={validationErrors}
          />
        )}
        {step === 2 && (
          <CategorySettings
            tournamentContents={tournamentContents}
            onAdd={handleAddContent}
            onRemove={handleRemoveContent}
            onUpdate={handleUpdateContent}
          />
        )}
        {step === 3 && (
          <DelegationSelection
            selectedDelegations={selectedDelegations}
            onChange={setSelectedDelegations}
          />
        )}
        {step === 4 && (
          <div className="space-y-6">
            <ConfirmationSummary
              formData={formData}
              tournamentContents={tournamentContents}
              selectedDelegations={selectedDelegations}
            />
          </div>
        )}
        {step === 5 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Tạo giải đấu thành công!
            </h2>
            <p className="text-muted-foreground mb-2">
              Giải đấu <strong>{createdTournament?.name}</strong> đã được tạo và
              sẵn sàng để bắt đầu.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              ID: {createdTournament?.id}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  // Reset form
                  setStep(1);
                  setFormData({
                    name: "",
                    startDate: "",
                    endDate: "",
                    location: "",
                    status: "upcoming",
                  });
                  setTournamentContents([]);
                  setSelectedDelegations([]);
                  setCreatedTournament(null);
                  setValidationErrors({});
                }}
              >
                Tạo giải đấu mới
              </Button>
              <Button
                onClick={() =>
                  console.log("View tournament:", createdTournament?.id)
                }
              >
                Xem chi tiết giải đấu
              </Button>
            </div>
          </div>
        )}
      </div>

      {step < 5 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button onClick={handleNext} disabled={!canProceed() || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {step === 4 ? "Hoàn tất" : "Tiếp theo"}
            {!isSubmitting && step < 4 && (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
