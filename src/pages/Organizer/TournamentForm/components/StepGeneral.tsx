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
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DatePicker } from "@/components/ui/date-picker";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
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
    const regStartDate = data.registrationStartDate ? new Date(data.registrationStartDate) : null;
    const regEndDate = data.registrationEndDate ? new Date(data.registrationEndDate) : null;
    const bracketDate = data.bracketGenerationDate ? new Date(data.bracketGenerationDate) : null;

    if (!data.name?.trim()) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.nameRequired"));
      return;
    }

    if (!data.location?.trim()) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.locationRequired"));
      return;
    }

    if (!Number.isInteger(data.tier) || data.tier < 1 || data.tier > 5) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.tierRangeInvalid", "Tier phải nằm trong khoảng từ 1 đến 5."));
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

    if (!regStartDate || Number.isNaN(regStartDate.getTime())) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.regStartDateRequired", "Vui lòng nhập thời gian mở đăng ký."));
      return;
    }

    if (!regEndDate || Number.isNaN(regEndDate.getTime())) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.regEndDateRequired", "Vui lòng nhập thời gian đóng đăng ký."));
      return;
    }

    if (!bracketDate || Number.isNaN(bracketDate.getTime())) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.bracketDateRequired", "Vui lòng nhập ngày chốt Bracket."));
      return;
    }

    if (regStartDate.getTime() >= regEndDate.getTime()) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.regDateOrderInvalid", "Thời gian đóng đăng ký phải sau thời gian mở."));
      return;
    }

    if (regEndDate.getTime() >= bracketDate.getTime()) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.bracketAfterReg", "Ngày chốt Bracket phải sau khi đóng đăng ký."));
      return;
    }

    if (bracketDate.getTime() >= startDate.getTime()) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.bracketBeforeStart", "Ngày chốt Bracket phải trước ngày bắt đầu giải đấu."));
      return;
    }

    const categories = data.categories || [];
    if (categories.length === 0) {
      setValidationError(t("tournamentManager.createTournamentForm.general.validation.categoryRequired", "Vui lòng thêm ít nhất một hạng mục thi đấu (Category)."));
      return;
    }

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      if (!cat.name?.trim()) {
        setValidationError(t("tournamentManager.createTournamentForm.general.validation.categoryNameEmpty", "Hạng mục #{{index}} đang để trống tên.").replace("{{index}}", (i + 1).toString()));
        return;
      }
      if (cat.maxEntries < 2) {
        setValidationError(t("tournamentManager.createTournamentForm.general.validation.categoryMinEntries", "Số lượng tham gia tối đa ở hạng mục \"{{name}}\" phải từ 2 trở lên.").replace("{{name}}", cat.name));
        return;
      }
      if (cat.type === "team" && (!cat.teamFormat?.trim())) {
        setValidationError(t("tournamentManager.createTournamentForm.general.validation.teamFormatRequired", "Vui lòng nhập định dạng đồng đội (Team Format) cho hạng mục \"{{name}}\".").replace("{{name}}", cat.name));
        return;
      }
      if (cat.type === "team" && (cat.maxMembersPerEntry === null || cat.maxMembersPerEntry < 1)) {
        setValidationError(t("tournamentManager.createTournamentForm.general.validation.maxMembersRequired", "Vui lòng nhập số thành viên tối đa cho hạng mục \"{{name}}\".").replace("{{name}}", cat.name));
        return;
      }
      // Kiểm tra min/max không bị ngược
      if (cat.minAge && cat.maxAge && cat.minAge > cat.maxAge) {
        setValidationError(t("tournamentManager.createTournamentForm.general.validation.ageMinMaxInvalid", "Độ tuổi Min không được lớn hơn Max ở hạng mục \"{{name}}\".").replace("{{name}}", cat.name));
        return;
      }
      if (cat.minElo && cat.maxElo && cat.minElo > cat.maxElo) {
        setValidationError(t("tournamentManager.createTournamentForm.general.validation.eloMinMaxInvalid", "Mức Elo Min không được lớn hơn Max ở hạng mục \"{{name}}\".").replace("{{name}}", cat.name));
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

  const handleTournamentDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      updateData({ startDate: "", endDate: "" });
      return;
    }
    updateData({
      startDate: range.from ? format(range.from, "yyyy-MM-dd") : "",
      endDate: range.to ? format(range.to, "yyyy-MM-dd") : "",
    });
  };

  const tournamentDateRange: DateRange | undefined =
    data.startDate || data.endDate
      ? {
          from: data.startDate ? new Date(data.startDate) : undefined,
          to: data.endDate ? new Date(data.endDate) : undefined,
        }
      : undefined;

  const handleRegistrationDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      updateData({ registrationStartDate: "", registrationEndDate: "" });
      return;
    }
    updateData({
      registrationStartDate: range.from ? format(range.from, "yyyy-MM-dd'T'00:00") : "",
      registrationEndDate: range.to ? format(range.to, "yyyy-MM-dd'T'23:59") : "",
    });
  };

  const registrationDateRange: DateRange | undefined =
    data.registrationStartDate || data.registrationEndDate
      ? {
          from: data.registrationStartDate ? new Date(data.registrationStartDate) : undefined,
          to: data.registrationEndDate ? new Date(data.registrationEndDate) : undefined,
        }
      : undefined;

  const bracketDate = data.bracketGenerationDate ? new Date(data.bracketGenerationDate) : undefined;
  const handleBracketDateChange = (date: Date | undefined) => {
    updateData({ bracketGenerationDate: date ? format(date, "yyyy-MM-dd") : "" });
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
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
              {t("tournamentManager.createTournamentForm.general.tournamentPeriod", "Thời gian diễn ra")}
            </Label>
            <DateRangePicker
              date={tournamentDateRange}
              setDate={handleTournamentDateRangeChange}
              placeholder={t("tournamentManager.createTournamentForm.general.selectTournamentPeriod", "Chọn ngày bắt đầu và kết thúc")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.registrationPeriod", "Thời gian đăng ký")}
            </Label>
            <DateRangePicker
              date={registrationDateRange}
              setDate={handleRegistrationDateRangeChange}
              placeholder={t("tournamentManager.createTournamentForm.general.selectRegistrationPeriod", "Chọn ngày mở và đóng đăng ký")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              {t("tournamentManager.createTournamentForm.general.bracketDate", "Ngày tạo Bracket")}
            </Label>
            <DatePicker
              date={bracketDate}
              setDate={handleBracketDateChange}
              placeholder={t("tournamentManager.createTournamentForm.general.selectBracketDate", "Chọn ngày chốt Bracket")}
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
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.categoryName", "Tên hạng mục")}</Label>
                  <Input
                    placeholder="VD: Men's Singles..."
                    value={cat.name}
                    onChange={(e) => handleUpdateCategory(index, "name", e.target.value)}
                    className="bg-background"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.categoryType", "Loại hình")}</Label>
                  <Select
                    value={cat.type}
                    onValueChange={(val) =>
                      handleUpdateCategory(index, "type", val as CategoryFormState["type"])
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={t("tournamentManager.createTournamentForm.general.selectType", "Chọn loại hình")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">{t("tournamentManager.createTournamentForm.general.single", "Đơn (Single)")}</SelectItem>
                      <SelectItem value="double">{t("tournamentManager.createTournamentForm.general.double", "Đôi (Double)")}</SelectItem>
                      <SelectItem value="team">{t("tournamentManager.createTournamentForm.general.team", "Đồng đội (Team)")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.gender", "Giới tính")}</Label>
                  <Select
                    value={cat.gender}
                    onValueChange={(val) =>
                      handleUpdateCategory(index, "gender", val as CategoryFormState["gender"])
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={t("tournamentManager.createTournamentForm.general.selectGender", "Chọn giới tính")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("tournamentManager.createTournamentForm.general.male", "Nam")}</SelectItem>
                      <SelectItem value="female">{t("tournamentManager.createTournamentForm.general.female", "Nữ")}</SelectItem>
                      <SelectItem value="mixed">{t("tournamentManager.createTournamentForm.general.mixed", "Nam Nữ")}</SelectItem>
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
                    <span className="md:hidden">{t("tournamentManager.createTournamentForm.general.delete", "Xóa")}</span>
                  </Button>
                </div>
              </div>

              {/* Row 1.5: Chỉ hiện khi Type là Team */}
              {cat.type === "team" && (
                <div className="p-4 rounded-md bg-muted/50 border border-muted-foreground/20 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-start gap-2 col-span-full text-sm text-muted-foreground mb-1">
                    <AlertCircle className="w-4 h-4 mt-0.5 text-primary" />
                    <p>{t("tournamentManager.createTournamentForm.general.teamFormatDetails", "Cấu hình chi tiết cho thể thức Đồng đội (Team).")}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.teamFormatLabel", "Team Format")}</Label>
                    <Input
                      placeholder="VD: 2 Đơn 1 Đôi..."
                      value={cat.teamFormat || ""}
                      onChange={(e) => handleUpdateCategory(index, "teamFormat", e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">
                      {t("tournamentManager.createTournamentForm.general.maxMembersPerTeam", "Số thành viên tối đa / team")}
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
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.singlesPerMatch", "Số trận Đơn / Kèo")}</Label>
                    <Input
                      type="number"
                      min={0}
                      value={cat.numberOfSingles}
                      onChange={(e) => handleUpdateCategory(index, "numberOfSingles", Math.max(0, Number(e.target.value)))}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.doublesPerMatch", "Số trận Đôi / Kèo")}</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2 border-t border-border/50">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.maxQuantity", "Số lượng tối đa")}</Label>
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
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.entryFeeVnd", "Lệ phí (VND)")}</Label>
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
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.setFormat", "Thể thức Set")}</Label>
                  <Select
                    value={cat.maxSets.toString()}
                    onValueChange={(val) => handleUpdateCategory(index, "maxSets", Number(val))}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={t("tournamentManager.createTournamentForm.general.selectSets", "Chọn số Set")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{t("tournamentManager.createTournamentForm.general.set1", "1 Set")}</SelectItem>
                      <SelectItem value="3">{t("tournamentManager.createTournamentForm.general.bo3", "BO3 (Thắng 2/3)")}</SelectItem>
                      <SelectItem value="5">{t("tournamentManager.createTournamentForm.general.bo5", "BO5 (Thắng 3/5)")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.progression", "Lộ trình")}</Label>
                  <Select
                    value={cat.isGroupStage ? "true" : "false"}
                    onValueChange={(val) => handleUpdateCategory(index, "isGroupStage", val === "true")}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={t("tournamentManager.createTournamentForm.general.progression", "Lộ trình")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">{t("tournamentManager.createTournamentForm.general.groupStage", "Có vòng bảng")}</SelectItem>
                      <SelectItem value="false">{t("tournamentManager.createTournamentForm.general.knockout", "Knockout")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Điều kiện tham gia (Age & Elo) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/50">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.ageRequirement", "Yêu cầu Độ tuổi (Min - Max)")}</Label>
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
                  <p className="text-[11px] text-muted-foreground">{t("tournamentManager.createTournamentForm.general.dragToSelectOrInput", "Kéo để chọn nhanh hoặc nhập số chính xác ở ô trên")}</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t("tournamentManager.createTournamentForm.general.eloRange", "Vùng Elo (Min - Max)")}</Label>
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
                  <p className="text-[11px] text-muted-foreground">{t("tournamentManager.createTournamentForm.general.dragToSelectElo", "Kéo để chọn nhanh mức Elo mong muốn")}</p>
                </div>
              </div>
            </div>
          ))}

          {(!data.categories || data.categories.length === 0) && (
            <div className="text-center py-10 border-2 border-dashed border-border rounded-lg text-muted-foreground">
              {t("tournamentManager.createTournamentForm.general.noCategoriesAdded", "Chưa có hạng mục nào được tạo. Vui lòng thêm hạng mục.")}
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