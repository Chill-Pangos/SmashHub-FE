import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import type {
  TournamentContentFormData,
  ValidationErrors,
} from "@/utils/validation.utils";
import { validateTournamentContentForm } from "@/utils/validation.utils";
import type { TournamentContentType, Gender } from "@/types";

interface TournamentContentFormProps {
  onSave: (content: TournamentContentFormData) => void;
  onCancel: () => void;
  initialData?: TournamentContentFormData;
}

const MAX_ENTRIES_OPTIONS = [2, 4, 8, 16, 32, 64, 128, 256];
const MAX_SETS_OPTIONS = [1, 3, 5, 7];

export default function TournamentContentForm({
  onSave,
  onCancel,
  initialData,
}: TournamentContentFormProps) {
  const [formData, setFormData] = useState<TournamentContentFormData>(
    initialData || {
      name: "",
      type: "single",
      maxEntries: 32,
      maxSets: 3,
      racketCheck: false,
      numberOfSingles: null,
      numberOfDoubles: null,
      minAge: null,
      maxAge: null,
      minElo: null,
      maxElo: null,
      gender: null,
      isGroupStage: false,
    }
  );

  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (
    field: keyof TournamentContentFormData,
    value: string | number | boolean | null
  ) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateTournamentContentForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? "Chỉnh sửa nội dung thi đấu" : "Thêm nội dung thi đấu"}
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Tên nội dung *</Label>
          <Input
            placeholder="VD: Nam đơn, Nữ đôi, Đồng đội nam"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Loại hình thi đấu *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                handleChange("type", value as TournamentContentType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Đơn (Single)</SelectItem>
                <SelectItem value="double">Đôi (Double)</SelectItem>
                <SelectItem value="team">Đồng đội (Team)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Giới tính</Label>
            <Select
              value={formData.gender || "mixed"}
              onValueChange={(value) =>
                handleChange("gender", value === "mixed" ? null : (value as Gender))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
                <SelectItem value="mixed">Tất cả</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Số lượng tối đa *</Label>
            <Select
              value={formData.maxEntries.toString()}
              onValueChange={(value) =>
                handleChange("maxEntries", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAX_ENTRIES_OPTIONS.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {formData.type === "team" ? "đội" : "người/cặp"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.maxEntries && (
              <p className="text-sm text-red-500">{errors.maxEntries}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Số set tối đa *</Label>
            <Select
              value={formData.maxSets.toString()}
              onValueChange={(value) =>
                handleChange("maxSets", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAX_SETS_OPTIONS.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} set
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.maxSets && (
              <p className="text-sm text-red-500">{errors.maxSets}</p>
            )}
          </div>
        </div>

        {/* Team format fields - only show for team type */}
        {formData.type === "team" && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="space-y-2">
              <Label>Số trận đơn *</Label>
              <Input
                type="number"
                min="0"
                value={formData.numberOfSingles ?? ""}
                onChange={(e) =>
                  handleChange(
                    "numberOfSingles",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className={errors.numberOfSingles ? "border-red-500" : ""}
              />
              {errors.numberOfSingles && (
                <p className="text-sm text-red-500">{errors.numberOfSingles}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Số trận đôi *</Label>
              <Input
                type="number"
                min="0"
                value={formData.numberOfDoubles ?? ""}
                onChange={(e) =>
                  handleChange(
                    "numberOfDoubles",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className={errors.numberOfDoubles ? "border-red-500" : ""}
              />
              {errors.numberOfDoubles && (
                <p className="text-sm text-red-500">{errors.numberOfDoubles}</p>
              )}
            </div>
            {errors.teamTotal && (
              <p className="text-sm text-red-500 col-span-2">
                {errors.teamTotal}
              </p>
            )}
          </div>
        )}

        {/* Age restrictions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tuổi tối thiểu</Label>
            <Input
              type="number"
              min="5"
              max="100"
              placeholder="VD: 18"
              value={formData.minAge ?? ""}
              onChange={(e) =>
                handleChange(
                  "minAge",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className={errors.minAge ? "border-red-500" : ""}
            />
            {errors.minAge && (
              <p className="text-sm text-red-500">{errors.minAge}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tuổi tối đa</Label>
            <Input
              type="number"
              min="5"
              max="100"
              placeholder="VD: 35"
              value={formData.maxAge ?? ""}
              onChange={(e) =>
                handleChange(
                  "maxAge",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className={errors.maxAge ? "border-red-500" : ""}
            />
            {errors.maxAge && (
              <p className="text-sm text-red-500">{errors.maxAge}</p>
            )}
          </div>
        </div>

        {/* ELO restrictions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ELO tối thiểu</Label>
            <Input
              type="number"
              min="0"
              max="3000"
              placeholder="VD: 1200"
              value={formData.minElo ?? ""}
              onChange={(e) =>
                handleChange(
                  "minElo",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className={errors.minElo ? "border-red-500" : ""}
            />
            {errors.minElo && (
              <p className="text-sm text-red-500">{errors.minElo}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>ELO tối đa</Label>
            <Input
              type="number"
              min="0"
              max="3000"
              placeholder="VD: 2000"
              value={formData.maxElo ?? ""}
              onChange={(e) =>
                handleChange(
                  "maxElo",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className={errors.maxElo ? "border-red-500" : ""}
            />
            {errors.maxElo && (
              <p className="text-sm text-red-500">{errors.maxElo}</p>
            )}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="racketCheck"
            checked={formData.racketCheck}
            onCheckedChange={(checked: boolean) =>
              handleChange("racketCheck", checked === true)
            }
          />
          <Label htmlFor="racketCheck" className="cursor-pointer">
            Kiểm tra vợt
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isGroupStage"
            checked={formData.isGroupStage}
            onCheckedChange={(checked: boolean) =>
              handleChange("isGroupStage", checked === true)
            }
          />
          <Label htmlFor="isGroupStage" className="cursor-pointer">
            Có vòng bảng
          </Label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? "Cập nhật" : "Thêm"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
