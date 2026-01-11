import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, title: "Thông tin cơ bản", description: "Tên, thời gian, địa điểm" },
  { id: 2, title: "Nội dung thi đấu", description: "Các môn và hạng mục" },
  { id: 3, title: "Đoàn tham gia", description: "Danh sách đoàn VĐV" },
  { id: 4, title: "Trọng tài", description: "Phân công trọng tài" },
  { id: 5, title: "Xác nhận", description: "Kiểm tra và hoàn tất" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
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
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
