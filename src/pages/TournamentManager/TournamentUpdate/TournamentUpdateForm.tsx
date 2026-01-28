import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, X } from "lucide-react";
import { useTournament, useUpdateTournament } from "@/hooks/queries";
import { showToast } from "@/utils/toast.utils";
import {
  validateTournamentForm,
  type TournamentFormData,
  type ValidationErrors,
} from "@/utils/validation.utils";
import type {
  Tournament,
  TournamentStatus,
  UpdateTournamentRequest,
} from "@/types";

interface TournamentUpdateFormProps {
  tournamentId: number;
  onSuccess?: (tournament: Tournament) => void;
  onCancel?: () => void;
}

export default function TournamentUpdateForm({
  tournamentId,
  onSuccess,
  onCancel,
}: TournamentUpdateFormProps) {
  const [formData, setFormData] = useState<TournamentFormData>({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    status: "upcoming",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  // React Query hooks
  const { data: tournament, isLoading } = useTournament(tournamentId);
  const updateMutation = useUpdateTournament();

  // Populate form when tournament data is loaded
  useEffect(() => {
    if (tournament) {
      // Format dates for datetime-local input
      const startDate = new Date(tournament.startDate)
        .toISOString()
        .slice(0, 16);
      const endDate = tournament.endDate
        ? new Date(tournament.endDate).toISOString().slice(0, 16)
        : "";

      setFormData({
        name: tournament.name,
        startDate,
        endDate,
        location: tournament.location,
        status: tournament.status,
      });
    }
  }, [tournament]);

  const handleChange = (field: keyof TournamentFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear validation error
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    // Validate
    const errors = validateTournamentForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    const updateData: UpdateTournamentRequest = {
      name: formData.name,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : null,
      location: formData.location,
      status: formData.status,
    };

    updateMutation.mutate(
      { id: tournamentId, data: updateData },
      {
        onSuccess: (updatedTournament) => {
          showToast.success("Cập nhật giải đấu thành công!");
          onSuccess?.(updatedTournament);
        },
        onError: (error) => {
          console.error("Error updating tournament:", error);
          showToast.error(
            "Không thể cập nhật giải đấu",
            error instanceof Error ? error.message : "Vui lòng thử lại",
          );
        },
      },
    );
  };

  const isSaving = updateMutation.isPending;

  if (isLoading) {
    return (
      <Card className="p-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Chỉnh sửa giải đấu</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Tên giải đấu *</Label>
          <Input
            placeholder="VD: Giải vô địch Quốc gia 2024"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={validationErrors.name ? "border-red-500" : ""}
          />
          {validationErrors.name && (
            <p className="text-sm text-red-500">{validationErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Địa điểm tổ chức *</Label>
          <Input
            placeholder="VD: Sân vận động Quốc gia Mỹ Đình"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={validationErrors.location ? "border-red-500" : ""}
          />
          {validationErrors.location && (
            <p className="text-sm text-red-500">{validationErrors.location}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ngày bắt đầu *</Label>
            <Input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className={validationErrors.startDate ? "border-red-500" : ""}
            />
            {validationErrors.startDate && (
              <p className="text-sm text-red-500">
                {validationErrors.startDate}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Ngày kết thúc</Label>
            <Input
              type="datetime-local"
              value={formData.endDate || ""}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className={validationErrors.endDate ? "border-red-500" : ""}
            />
            {validationErrors.endDate && (
              <p className="text-sm text-red-500">{validationErrors.endDate}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              handleChange("status", value as TournamentStatus)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
              <SelectItem value="ongoing">Đang diễn ra</SelectItem>
              <SelectItem value="completed">Đã kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Lưu ý:</strong> Việc thay đổi nội dung thi đấu (contents)
            cần được thực hiện riêng. Form này chỉ cập nhật thông tin cơ bản của
            giải đấu.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isSaving}>
              <X className="mr-2 h-4 w-4" />
              Hủy
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </Card>
  );
}
