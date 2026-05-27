import React, { useState } from "react";
import type { CategoryFormState, StepProps } from "./types";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Users, Trash2, Plus, AlertCircle } from "lucide-react";

const DEFAULT_CATEGORY: CategoryFormState = {
  name: "",
  type: "single",
  gender: "male",
  maxEntries: 32,
  maxSets: 3,
  isGroupStage: false,
  teamFormat: null,
  numberOfSingles: 1,
  numberOfDoubles: 0,
  minAge: null,
  maxAge: null,
  minElo: null,
  maxElo: null,
  maxMembersPerEntry: null,
  entryFee: 0,
};

export const StepGeneral: React.FC<StepProps> = ({
  data,
  updateData,
  onNext,
}) => {
  const { t } = useTranslation();
  const [validationError, setValidationError] = useState<string | null>(null);

  const tierLabels = {
    1: t("tournamentManager.createTournamentForm.general.tiers.pro"),
    2: t("tournamentManager.createTournamentForm.general.tiers.challenger"),
    3: t("tournamentManager.createTournamentForm.general.tiers.local"),
    4: "Tier 4",
    5: "Tier 5",
  };

  const handleNext = () => {
    const startDate = data.startDate ? new Date(data.startDate) : null;
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (!data.name?.trim()) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.nameRequired"));
      return;
    }

    if (!data.location?.trim()) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.locationRequired"));
      return;
    }

    if (!Number.isInteger(data.tier) || data.tier < 1 || data.tier > 5) {
      setValidationError("Tier phải nằm trong khoảng từ 1 đến 5.");
      return;
    }

    if (!startDate || Number.isNaN(startDate.getTime())) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.startDateRequired"));
      return;
    }

    if (!endDate || Number.isNaN(endDate.getTime())) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.endDateRequired"));
      return;
    }

    if (startDate.getTime() > endDate.getTime()) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.dateOrderInvalid"));
      return;
    }

    const categories = data.categories || [];
    if (categories.length === 0) {
      setValidationError("Vui lòng thêm ít nhất một hạng mục thi đấu (Category).");
      return;
    }

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      if (!cat.name?.trim()) {
        setValidationError(`Hạng mục #${i + 1} đang để trống tên.`);
        return;
      }
      if (cat.maxEntries < 2) {
        setValidationError(`Số lượng tham gia tối đa ở hạng mục "${cat.name}" phải từ 2 trở lên.`);
        return;
      }
      if (cat.type === "team" && (!cat.teamFormat?.trim())) {
        setValidationError(`Vui lòng nhập định dạng đồng đội (Team Format) cho hạng mục "${cat.name}".`);
        return;
      }
      if (cat.type === "team" && (cat.maxMembersPerEntry === null || cat.maxMembersPerEntry < 1)) {
        setValidationError(`Vui lòng nhập số thành viên tối đa cho hạng mục "${cat.name}".`);
        return;
      }
      // Kiểm tra min/max không bị ngược
      if (cat.minAge && cat.maxAge && cat.minAge > cat.maxAge) {
        setValidationError(`Độ tuổi Min không được lớn hơn Max ở hạng mục "${cat.name}".`);
        return;
      }
      if (cat.minElo && cat.maxElo && cat.minElo > cat.maxElo) {
        setValidationError(`Mức Elo Min không được lớn hơn Max ở hạng mục "${cat.name}".`);
        return;
      }
    }

    setValidationError(null);
    onNext?.();
  };

  // --- Category Handlers ---
  const handleAddCategory = () => {
    const currentCategories = data.categories || [];
    updateData({ categories: [...currentCategories, { ...DEFAULT_CATEGORY }] });
  };

  const handleRemoveCategory = (index: number) => {
    const currentCategories = [...(data.categories || [])];
    currentCategories.splice(index, 1);
    updateData({ categories: currentCategories });
  };

  const handleUpdateCategory = <K extends keyof CategoryFormState>(
    index: number,
    field: K,
    value: CategoryFormState[K],
  ) => {
    const currentCategories = [...(data.categories || [])];
    if (field === "type") {
      const nextType = value as CategoryFormState["type"];
      if (nextType !== "team") {
        currentCategories[index] = {
          ...currentCategories[index],
          type: nextType,
          numberOfSingles: nextType === "single" ? 1 : 0,
          numberOfDoubles: nextType === "double" ? 1 : 0,
          teamFormat: null,
          maxMembersPerEntry: null,
        };
      } else {
        currentCategories[index] = {
          ...currentCategories[index],
          type: nextType,
        };
      }
      updateData({ categories: currentCategories });
      return;
    }
    currentCategories[index] = { ...currentCategories[index], [field]: value };
    updateData({ categories: currentCategories });
  };

  // Hàm helper để update nhiều field cùng lúc (Dành cho Range Sliders: Min/Max)
  const handleUpdateCategoryFields = (index: number, fields: Partial<CategoryFormState>) => {
    const currentCategories = [...(data.categories || [])];
    currentCategories[index] = { ...currentCategories[index], ...fields };
    updateData({ categories: currentCategories });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tournament Details */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Info className="w-5 h-5" />
          <h3 className="font-semibold text-lg">
            {t("tournamentManager.createTournamentForm.general.detailsTitle")}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.name")}
            </Label>
            <Input
              placeholder={t("tournamentManager.createTournamentForm.general.namePlaceholder")}
              value={data.name || ""}
              onChange={(e) => updateData({ name: e.target.value })}
              className="bg-input/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.tier")}
            </Label>
            <Select
              value={data.tier?.toString()}
              onValueChange={(val) => updateData({ tier: Number(val) })}
            >
              <SelectTrigger className="bg-input/50">
                <SelectValue placeholder={t("tournamentManager.createTournamentForm.general.tierPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{tierLabels[1]}</SelectItem>
                <SelectItem value="2">{tierLabels[2]}</SelectItem>
                <SelectItem value="3">{tierLabels[3]}</SelectItem>
                <SelectItem value="4">{tierLabels[4]}</SelectItem>
                <SelectItem value="5">{tierLabels[5]}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-1">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.location")}
            </Label>
            <Input
              placeholder={t("tournamentManager.createTournamentForm.general.locationPlaceholder")}
              value={data.location || ""}
              onChange={(e) => updateData({ location: e.target.value })}
              className="bg-input/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.startDate")}
            </Label>
            <Input
              type="date"
              value={data.startDate || ""}
              onChange={(e) => updateData({ startDate: e.target.value })}
              className="bg-input/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.endDate")}
            </Label>
            <Input
              type="date"
              value={data.endDate || ""}
              onChange={(e) => updateData({ endDate: e.target.value })}
              className="bg-input/50"
            />
          </div>
        </div>
      </section>

      {/* Category Definition */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold text-lg">
              {t("tournamentManager.createTournamentForm.general.categoryTitle")}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-border text-primary"
            onClick={handleAddCategory}
          >
            <Plus className="w-4 h-4 mr-1" />
            {t("tournamentManager.createTournamentForm.general.addCategory")}
          </Button>
        </div>

        <div className="space-y-4">
          {(data.categories || []).map((cat, index) => (
            <div key={index} className="p-5 rounded-lg border border-border bg-card space-y-5 relative group shadow-sm">
              
              {/* Row 1: Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="space-y-2 md:col-span-4">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Tên hạng mục</Label>
                  <Input
                    placeholder="VD: Men's Singles..."
                    value={cat.name}
                    onChange={(e) => handleUpdateCategory(index, "name", e.target.value)}
                    className="bg-background"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Loại hình</Label>
                  <Select
                    value={cat.type}
                    onValueChange={(val) =>
                      handleUpdateCategory(index, "type", val as CategoryFormState["type"])
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Đơn (Single)</SelectItem>
                      <SelectItem value="double">Đôi (Double)</SelectItem>
                      <SelectItem value="team">Đồng đội (Team)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Giới tính</Label>
                  <Select
                    value={cat.gender}
                    onValueChange={(val) =>
                      handleUpdateCategory(index, "gender", val as CategoryFormState["gender"])
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="mixed">Nam Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Delete Button */}
                <div className="md:col-span-2 flex justify-end items-end pb-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCategory(index)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full md:w-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2 md:mr-0" />
                    <span className="md:hidden">Xóa</span>
                  </Button>
                </div>
              </div>

              {/* Row 1.5: Chỉ hiện khi Type là Team */}
              {cat.type === "team" && (
                <div className="p-4 rounded-md bg-muted/50 border border-muted-foreground/20 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-start gap-2 col-span-full text-sm text-muted-foreground mb-1">
                    <AlertCircle className="w-4 h-4 mt-0.5 text-primary" />
                    <p>Cấu hình chi tiết cho thể thức Đồng đội (Team).</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Team Format</Label>
                    <Input
                      placeholder="VD: 2 Đơn 1 Đôi..."
                      value={cat.teamFormat || ""}
                      onChange={(e) => handleUpdateCategory(index, "teamFormat", e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">
                      Số thành viên tối đa / team
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="VD: 3"
                      value={cat.maxMembersPerEntry ?? ""}
                      onChange={(e) =>
                        handleUpdateCategory(
                          index,
                          "maxMembersPerEntry",
                          e.target.value ? Math.max(1, Number(e.target.value)) : null,
                        )
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Số trận Đơn / Kèo</Label>
                    <Input
                      type="number"
                      min={0}
                      value={cat.numberOfSingles}
                      onChange={(e) => handleUpdateCategory(index, "numberOfSingles", Math.max(0, Number(e.target.value)))}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Số trận Đôi / Kèo</Label>
                    <Input
                      type="number"
                      min={0}
                      value={cat.numberOfDoubles}
                      onChange={(e) => handleUpdateCategory(index, "numberOfDoubles", Math.max(0, Number(e.target.value)))}
                      className="bg-background"
                    />
                  </div>
                </div>
              )}

              {/* Row 2: Sets, Lộ trình, Số lượng, Lệ phí */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2 border-t border-border/50">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Số lượng tối đa</Label>
                  <Input
                    type="number"
                    min={2}
                    value={cat.maxEntries}
                    onChange={(e) => handleUpdateCategory(index, "maxEntries", Math.max(2, Number(e.target.value)))}
                    className="bg-background"
                  />
                  <Slider
                    min={2}
                    max={128}
                    step={2}
                    value={[cat.maxEntries || 2]}
                    onValueChange={([val]) => handleUpdateCategory(index, "maxEntries", val)}
                    className="py-1 cursor-grab"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Lệ phí (VND)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={cat.entryFee ?? ""}
                    onChange={(e) => handleUpdateCategory(index, "entryFee", Math.max(0, Number(e.target.value)))}
                    className="bg-background"
                  />
                  <Slider
                    min={0}
                    max={2000000} // Cấu hình Max cho lệ phí (2tr VNĐ)
                    step={50000} // Snap mỗi 50k VNĐ
                    value={[Number(cat.entryFee) || 0]}
                    onValueChange={([val]) => handleUpdateCategory(index, "entryFee", val)}
                    className="py-1 cursor-grab"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Thể thức Set</Label>
                  <Select
                    value={cat.maxSets.toString()}
                    onValueChange={(val) => handleUpdateCategory(index, "maxSets", Number(val))}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Chọn số Set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Set</SelectItem>
                      <SelectItem value="3">BO3 (Thắng 2/3)</SelectItem>
                      <SelectItem value="5">BO5 (Thắng 3/5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Lộ trình</Label>
                  <Select
                    value={cat.isGroupStage ? "true" : "false"}
                    onValueChange={(val) => handleUpdateCategory(index, "isGroupStage", val === "true")}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Lộ trình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Có vòng bảng</SelectItem>
                      <SelectItem value="false">Knockout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Điều kiện tham gia (Age & Elo) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/50">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Yêu cầu Độ tuổi (Min - Max)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Min"
                      value={cat.minAge === null ? "" : cat.minAge}
                      onChange={(e) => handleUpdateCategory(index, "minAge", e.target.value ? Math.max(0, Number(e.target.value)) : null)}
                      className="bg-background px-3"
                    />
                    <span className="text-muted-foreground font-medium">-</span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Max"
                      value={cat.maxAge === null ? "" : cat.maxAge}
                      onChange={(e) => handleUpdateCategory(index, "maxAge", e.target.value ? Math.max(0, Number(e.target.value)) : null)}
                      className="bg-background px-3"
                    />
                  </div>
                  {/* Thanh kéo hai đầu (Dual Thumb) */}
                  <Slider
                    min={0}
                    max={100}
                    step={10} // Snap nhảy mốc chục tuổi
                    value={[cat.minAge ?? 0, cat.maxAge ?? 100]}
                    onValueChange={([min, max]) =>
                      handleUpdateCategoryFields(index, {
                        minAge: Math.min(min, max),
                        maxAge: Math.max(min, max),
                      })
                    }
                    className="py-2 cursor-grab"
                  />
                  <p className="text-[11px] text-muted-foreground">Kéo để chọn nhanh hoặc nhập số chính xác ở ô trên</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Vùng Elo (Min - Max)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Min"
                      value={cat.minElo === null ? "" : cat.minElo}
                      onChange={(e) => handleUpdateCategory(index, "minElo", e.target.value ? Math.max(0, Number(e.target.value)) : null)}
                      className="bg-background px-3"
                    />
                    <span className="text-muted-foreground font-medium">-</span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Max"
                      value={cat.maxElo === null ? "" : cat.maxElo}
                      onChange={(e) => handleUpdateCategory(index, "maxElo", e.target.value ? Math.max(0, Number(e.target.value)) : null)}
                      className="bg-background px-3"
                    />
                  </div>
                  {/* Thanh kéo hai đầu (Dual Thumb) */}
                  <Slider
                    min={0}
                    max={3000}
                    step={100} // Snap nhảy mỗi 100 Elo
                    value={[cat.minElo ?? 0, cat.maxElo ?? 3000]}
                    onValueChange={([min, max]) =>
                      handleUpdateCategoryFields(index, {
                        minElo: Math.min(min, max),
                        maxElo: Math.max(min, max),
                      })
                    }
                    className="py-2 cursor-grab"
                  />
                  <p className="text-[11px] text-muted-foreground">Kéo để chọn nhanh mức Elo mong muốn</p>
                </div>
              </div>
            </div>
          ))}

          {(!data.categories || data.categories.length === 0) && (
            <div className="text-center py-10 border-2 border-dashed border-border rounded-lg text-muted-foreground">
              Chưa có hạng mục nào được tạo. Vui lòng thêm hạng mục.
            </div>
          )}
        </div>
      </section>

      {validationError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p className="font-medium">
            {t("tournamentManager.createTournamentForm.general.validation.title")}
          </p>
          <p className="mt-1">{validationError}</p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
        >
          {t("tournamentManager.createTournamentForm.general.nextButton")}
        </Button>
      </div>
    </div>
  );
};