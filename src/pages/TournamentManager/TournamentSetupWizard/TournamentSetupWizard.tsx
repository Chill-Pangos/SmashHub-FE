import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function TournamentSetupWizard() {
  const [step, setStep] = useState(1);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Thiết lập giải đấu</h1>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span>Thông tin cơ bản</span>
          <span>Thể thức</span>
          <span>Nội dung thi đấu</span>
          <span>Xác nhận</span>
        </div>
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
            <div>
              <Label>Tên giải đấu</Label>
              <Input placeholder="Nhập tên giải đấu" />
            </div>
            <div>
              <Label>Địa điểm</Label>
              <Input placeholder="Nhập địa điểm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ngày bắt đầu</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Ngày kết thúc</Label>
                <Input type="date" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Thể thức thi đấu</h2>
            <div className="text-muted-foreground">
              Chọn thể thức thi đấu phù hợp với giải đấu của bạn
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Nội dung thi đấu</h2>
            <div className="text-muted-foreground">
              Thêm các nội dung thi đấu và hạng mục
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Xác nhận thông tin</h2>
            <div className="text-muted-foreground">
              Kiểm tra lại thông tin trước khi tạo giải đấu
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Button onClick={() => setStep(Math.min(4, step + 1))}>
          {step === 4 ? "Hoàn thành" : "Tiếp theo"}
          {step < 4 && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
