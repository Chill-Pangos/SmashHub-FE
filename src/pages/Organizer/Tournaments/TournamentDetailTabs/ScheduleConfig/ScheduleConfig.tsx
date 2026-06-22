import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import scheduleConfigService from "@/services/scheduleConfig.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings2, Clock, Coffee, Monitor, Hourglass, Calendar } from "lucide-react";
import { ValidationStats } from "./components/ValidationStats";
import { useTranslation } from "react-i18next";
import { usePreviewUpdateScheduleConfig, useUpdateScheduleConfig } from "@/hooks/queries";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { showToast, showApiError } from "@/utils/toast.utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ScheduleConfigProps {
  tournamentId: number;
}

// Type map từ Backend
export interface ScheduleConfigData {
  id?: number;
  tournamentId: number;
  startDate?: string;
  endDate?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  bracketGenerationDate?: string;
  numberOfTables: number;
  matchDurationMinutes: number;
  breakDurationMinutes: number;
  dailyStartHour: number;
  dailyStartMinute: number;
  dailyEndHour: number;
  dailyEndMinute: number;
  lunchBreakStartHour?: number | null;
  lunchBreakStartMinute?: number | null;
  lunchBreakEndHour?: number | null;
  lunchBreakEndMinute?: number | null;
  lunchBreakDurationMinutes?: number | null;
  notes?: string | null;
  regenerateSchedule?: boolean;
  regenerationKey?: string;
}

export default function ScheduleConfig({ tournamentId }: ScheduleConfigProps) {
  const { t } = useTranslation();
  const { data: configData } = useQuery({
    queryKey: ['schedule-config', tournamentId],
    queryFn: () => scheduleConfigService.getScheduleConfigByTournament(tournamentId),
  });

  const previewMutation = usePreviewUpdateScheduleConfig();
  const updateMutation = useUpdateScheduleConfig();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [affectedCount, setAffectedCount] = useState<number>(0);
  const [regenerationKey, setRegenerationKey] = useState<string>("");
  const [pendingPayload, setPendingPayload] = useState<Omit<ScheduleConfigData, 'id' | 'tournamentId'> | null>(null);

  // State quản lý Form
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [registrationStartDate, setRegistrationStartDate] = useState<Date | undefined>();
  const [registrationEndDate, setRegistrationEndDate] = useState<Date | undefined>();
  const [bracketGenerationDate, setBracketGenerationDate] = useState<Date | undefined>();
  const [totalMatches, setTotalMatches] = useState<number | undefined>();
  const [tables, setTables] = useState(12);
  const [matchDuration, setMatchDuration] = useState(45);
  
  // Thời gian mở/đóng cửa (dạng string HH:mm AM/PM cho Input type="time" hoặc text)
  const [facilityOpen, setFacilityOpen] = useState("08:00"); // 8 AM
  const [facilityClose, setFacilityClose] = useState("22:00"); // 10 PM
  
  // Trạng thái giờ nghỉ
  const [hasBreaks, setHasBreaks] = useState(true);
  const [breakStartTime, setBreakStartTime] = useState("13:00"); // 1 PM
  const [breakDuration, setBreakDuration] = useState(60);

  useEffect(() => {
    if (configData) {
      const data = configData as unknown as ScheduleConfigData;
      if (data.numberOfTables !== undefined) {
        setTables(data.numberOfTables);
      }
      if (data.matchDurationMinutes !== undefined) {
        setMatchDuration(data.matchDurationMinutes);
      }

      if (data.startDate) setStartDate(new Date(data.startDate));
      if (data.endDate) setEndDate(new Date(data.endDate));
      if (data.registrationStartDate) setRegistrationStartDate(new Date(data.registrationStartDate));
      if (data.registrationEndDate) setRegistrationEndDate(new Date(data.registrationEndDate));
      if (data.bracketGenerationDate) setBracketGenerationDate(new Date(data.bracketGenerationDate));
      
      const formatTime = (hour: number, min: number) => {
        return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      };
      
      if (data.dailyStartHour !== undefined && data.dailyStartMinute !== undefined) {
        setFacilityOpen(formatTime(data.dailyStartHour, data.dailyStartMinute));
      }
      
      if (data.dailyEndHour !== undefined && data.dailyEndMinute !== undefined) {
        setFacilityClose(formatTime(data.dailyEndHour, data.dailyEndMinute));
      }
      
      if (data.lunchBreakStartHour != null && data.lunchBreakStartMinute != null && data.lunchBreakDurationMinutes != null) {
        setHasBreaks(true);
        setBreakStartTime(formatTime(data.lunchBreakStartHour as number, data.lunchBreakStartMinute as number));
        setBreakDuration(data.lunchBreakDurationMinutes);
      } else {
        setHasBreaks(false);
      }
    }
  }, [configData]);

  // Parse time ra số giờ để truyền vào ValidationStats tính toán
  const openHour = parseInt(facilityOpen.split(":")[0]) || 8;
  const closeHour = parseInt(facilityClose.split(":")[0]) || 22;

  const handleSave = () => {
    let endHour = null;
    let endMinute = null;
    let startHour = null;
    let startMinute = null;

    if (hasBreaks) {
      startHour = parseInt(breakStartTime.split(":")[0]) || 0;
      startMinute = parseInt(breakStartTime.split(":")[1]) || 0;
      
      const totalStartMinutes = startHour * 60 + startMinute;
      const totalEndMinutes = totalStartMinutes + breakDuration;
      
      endHour = Math.floor(totalEndMinutes / 60) % 24;
      endMinute = totalEndMinutes % 60;
    }

    const payload: Omit<ScheduleConfigData, 'id' | 'tournamentId'> = {
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      registrationStartDate: registrationStartDate ? registrationStartDate.toISOString() : undefined,
      registrationEndDate: registrationEndDate ? registrationEndDate.toISOString() : undefined,
      bracketGenerationDate: bracketGenerationDate ? bracketGenerationDate.toISOString() : undefined,
      numberOfTables: tables,
      matchDurationMinutes: matchDuration,
      breakDurationMinutes: 10, // Default break between matches
      dailyStartHour: openHour,
      dailyStartMinute: parseInt(facilityOpen.split(":")[1]) || 0,
      dailyEndHour: closeHour,
      dailyEndMinute: parseInt(facilityClose.split(":")[1]) || 0,
      lunchBreakStartHour: startHour,
      lunchBreakStartMinute: startMinute,
      lunchBreakEndHour: endHour,
      lunchBreakEndMinute: endMinute,
      lunchBreakDurationMinutes: hasBreaks ? breakDuration : null,
    };
    
    const previewPayload = {
      ...payload,
      totalMatches: totalMatches,
    };

    previewMutation.mutate(
      { tournamentId, data: previewPayload },
      {
        onSuccess: (res) => {
          if (res.requiresRegeneration) {
            setAffectedCount(res.affectedScheduleCount || 0);
            setRegenerationKey(res.regenerationKey || "");
            setPendingPayload(payload);
            setIsConfirmOpen(true);
          } else {
            updateMutation.mutate({ tournamentId, data: payload }, {
              onSuccess: () => showToast.success(t("tournamentManager.scheduleConfig.saveSuccess", "Schedule config saved successfully")),
              onError: (err: any) => showApiError(err, t("tournamentManager.scheduleConfig.saveError", "Failed to save config")),
            });
          }
        },
        onError: (err: any) => {
          console.error("Preview failed:", err);
          showApiError(err, t("tournamentManager.scheduleConfig.previewError", "Failed to preview changes"));
        },
      }
    );
  };

  const handleConfirmRegenerate = () => {
    if (pendingPayload && regenerationKey) {
      updateMutation.mutate(
        {
          tournamentId,
          data: {
            ...pendingPayload,
            regenerateSchedule: true,
            regenerationKey,
          },
        },
        {
          onSuccess: () => {
            setIsConfirmOpen(false);
            setPendingPayload(null);
            setRegenerationKey("");
            showToast.success(t("tournamentManager.scheduleConfig.saveSuccess", "Schedule config saved successfully"));
          },
          onError: (err: any) => showApiError(err, t("tournamentManager.scheduleConfig.saveError", "Failed to save config")),
        }
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('tournamentManager.scheduleConfig.title', 'Schedule Configuration')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('tournamentManager.scheduleConfig.subtitle', 'Manage global timing parameters and table allocations.')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
            {t('tournamentManager.scheduleConfig.resetToDefaults', 'Reset to Defaults')}
          </Button>
          <Button 
            className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-auth-primary-glow"
            onClick={handleSave}
            disabled={previewMutation.isPending || updateMutation.isPending}
          >
            {previewMutation.isPending || updateMutation.isPending ? t('common.saving', 'Saving...') : t('tournamentManager.scheduleConfig.saveConfiguration', 'Save Configuration')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-6">

          {/* 0. Tournament Dates */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">{t('tournamentManager.scheduleConfig.tournamentDates', 'Tournament Dates')}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.startDate', 'Start Date')}</label>
                <DateTimePicker 
                  date={startDate}
                  setDate={setStartDate}
                  placeholder={t('tournamentManager.scheduleConfig.startDate', 'Start Date')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.endDate', 'End Date')}</label>
                <DateTimePicker 
                  date={endDate}
                  setDate={setEndDate}
                  placeholder={t('tournamentManager.scheduleConfig.endDate', 'End Date')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.registrationStart', 'Registration Start')}</label>
                <DateTimePicker 
                  date={registrationStartDate}
                  setDate={setRegistrationStartDate}
                  placeholder={t('tournamentManager.scheduleConfig.registrationStart', 'Registration Start')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.registrationEnd', 'Registration End')}</label>
                <DateTimePicker 
                  date={registrationEndDate}
                  setDate={setRegistrationEndDate}
                  placeholder={t('tournamentManager.scheduleConfig.registrationEnd', 'Registration End')}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.bracketGeneration', 'Bracket Generation Date')}</label>
                <DateTimePicker 
                  date={bracketGenerationDate}
                  setDate={setBracketGenerationDate}
                  placeholder={t('tournamentManager.scheduleConfig.bracketGeneration', 'Bracket Generation Date')}
                />
              </div>
            </div>
          </div>
          
          {/* 1. Global Parameters */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">{t('tournamentManager.scheduleConfig.globalParameters', 'Global Parameters')}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.totalMatches', 'Total Matches')}</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={totalMatches || ""}
                    onChange={(e) => setTotalMatches(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Auto (Optional)"
                    className="bg-input border-border focus-visible:ring-primary text-foreground" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.numberOfTables', 'Number of Tables')}</label>
                <div className="relative">
                  <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    value={tables}
                    onChange={(e) => setTables(Number(e.target.value))}
                    className="pl-9 bg-input border-border focus-visible:ring-primary text-foreground" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.baseMatchDuration', 'Base Match Duration (mins)')}</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    value={matchDuration}
                    onChange={(e) => setMatchDuration(Number(e.target.value))}
                    className="pl-9 bg-input border-border focus-visible:ring-primary text-foreground" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Operating Hours */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">{t('tournamentManager.scheduleConfig.operatingHours', 'Operating Hours')}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.facilityOpen', 'Facility Open')}</label>
                <TimePicker 
                  value={facilityOpen}
                  onChange={setFacilityOpen}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.facilityClose', 'Facility Close')}</label>
                <TimePicker 
                  value={facilityClose}
                  onChange={setFacilityClose}
                />
              </div>
            </div>
          </div>

          {/* 3. Scheduled Breaks */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">{t('tournamentManager.scheduleConfig.scheduledBreaks', 'Scheduled Breaks')}</h3>
              </div>
              <Switch 
                checked={hasBreaks} 
                onCheckedChange={setHasBreaks}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-opacity duration-300 ${hasBreaks ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.startTime', 'Start Time')}</label>
                <TimePicker 
                  value={breakStartTime}
                  onChange={setBreakStartTime}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('tournamentManager.scheduleConfig.durationMins', 'Duration (mins)')}</label>
                <div className="relative">
                  <Hourglass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    className="pl-9 bg-input border-border focus-visible:ring-primary text-foreground" 
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Validation Stats */}
        <div>
          <ValidationStats 
            tables={tables}
            matchDuration={matchDuration}
            openHour={openHour}
            closeHour={closeHour}
            hasBreaks={hasBreaks}
            breakDuration={breakDuration}
          />
        </div>

      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('tournamentManager.scheduleConfig.regenerateTitle', 'Regenerate Schedule?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('tournamentManager.scheduleConfig.regenerateWarning', {
                defaultValue: `Thay đổi này sẽ tạo lại {{count}} lịch thi đấu. Bạn có chắc chắn muốn tiếp tục?`,
                count: affectedCount
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateMutation.isPending}>
              {t('common.cancel', 'Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmRegenerate();
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? t('common.saving', 'Saving...') : t('common.confirm', 'Confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}