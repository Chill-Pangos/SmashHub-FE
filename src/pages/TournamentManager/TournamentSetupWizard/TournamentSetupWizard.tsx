import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  StepIndicator,
  BasicInfoForm,
  CategorySettings,
  DelegationSelection,
  ConfirmationSummary
} from "./components";

export default function TournamentSetupWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    venue: "",
    address: "",
    description: "",
    type: "",
    level: ""
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDelegations, setSelectedDelegations] = useState<string[]>([]);

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.startDate && formData.endDate && 
               formData.venue && formData.type && formData.level;
      case 2:
        return selectedCategories.length > 0;
      case 3:
        return selectedDelegations.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Thiết lập giải đấu mới</h1>

      <StepIndicator currentStep={step} />

      <div className="mb-8">
        {step === 1 && (
          <BasicInfoForm formData={formData} onChange={handleFormChange} />
        )}
        {step === 2 && (
          <CategorySettings 
            selectedCategories={selectedCategories}
            onChange={setSelectedCategories}
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
              selectedCategories={selectedCategories}
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
            <h2 className="text-2xl font-bold mb-2">Tạo giải đấu thành công!</h2>
            <p className="text-muted-foreground mb-6">
              Giải đấu đã được tạo và sẵn sàng để bắt đầu.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline">Quay lại danh sách</Button>
              <Button>Xem chi tiết giải đấu</Button>
            </div>
          </div>
        )}
      </div>

      {step < 5 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            {step === 4 ? "Hoàn tất" : "Tiếp theo"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
