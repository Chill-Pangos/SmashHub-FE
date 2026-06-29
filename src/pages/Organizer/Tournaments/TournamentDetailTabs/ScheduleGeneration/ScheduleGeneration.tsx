import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Save, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  useGeneratePlaceholders, 
  useSaveAssignments, 
  usePreviewKnockoutPlaceholders, 
  useSaveKnockoutAssignments, 
  useGenerateTournamentSchedule,
  usePreviewFromEntries,
  useGenerateKnockoutSchedule,
  usePreviewFillQualifiers 
} from "@/hooks/queries";
import { useTranslation } from "react-i18next";

interface ScheduleGenerationProps {
  tournamentId: number;
  categoryId?: number;
  isGroupStage?: boolean;
  hasBracket?: boolean;
}

type WizardStep = 
  | "INIT"
  // Group Flow Steps
  | "PREVIEW_GROUP"
  | "PREVIEW_KNOCKOUT_PLACEHOLDER"
  | "PREVIEW_FILL_QUALIFIERS"
  // Knockout Only Flow Steps
  | "PREVIEW_KNOCKOUT_ENTRIES"
  // Both Flows
  | "DONE";

export default function ScheduleGeneration({
  tournamentId,
  categoryId,
  isGroupStage,
  hasBracket,
}: ScheduleGenerationProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<WizardStep>("INIT");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Preview Data States
  const [groupPreview, setGroupPreview] = useState<any[]>([]);
  const [knockoutPreview, setKnockoutPreview] = useState<any>(null);

  // Mutations Group
  const genGroupPlaceholders = useGeneratePlaceholders();
  const saveGroupAssignments = useSaveAssignments();
  const previewKnockoutPlaceholders = usePreviewKnockoutPlaceholders();
  const saveKnockoutAssignments = useSaveKnockoutAssignments();
  const genTournamentSchedule = useGenerateTournamentSchedule();
  const previewFillQualifiers = usePreviewFillQualifiers();

  // Mutations Non-Group
  const previewFromEntries = usePreviewFromEntries();
  const genKnockoutSchedule = useGenerateKnockoutSchedule();

  // =====================
  // GROUP STAGE FLOW
  // =====================
  const handlePreviewGroupStage = async () => {
    if (!categoryId) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const res = await genGroupPlaceholders.mutateAsync({ categoryId });
      setGroupPreview(res.data || []);
      setStep("PREVIEW_GROUP");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || t('tournamentManager.scheduleGeneration.errPreviewGroup', 'Failed to preview group placeholders.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveGroupStage = async () => {
    if (!categoryId) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const groupAssignments = groupPreview.map((g: any) => ({
        groupName: g.groupName,
        entryIds: g.entryIds
      }));
      await saveGroupAssignments.mutateAsync({ categoryId, groupAssignments });
      
      // Immediately preview Knockout Placeholders
      const koRes = await previewKnockoutPlaceholders.mutateAsync({ categoryId });
      setKnockoutPreview(koRes.data);
      setStep("PREVIEW_KNOCKOUT_PLACEHOLDER");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || t('tournamentManager.scheduleGeneration.errSaveGroup', 'Failed to save group assignments.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveKnockoutPlaceholders = async () => {
    if (!categoryId) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      await saveKnockoutAssignments.mutateAsync({ categoryId });
      
      // Finally generate full tournament schedule
      await genTournamentSchedule.mutateAsync({ tournamentId });
      setStep("DONE");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || t('tournamentManager.scheduleGeneration.errSaveKnockoutGroupFlow', 'Failed to save knockout placeholders or generate schedule.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreviewFillQualifiers = async () => {
    if (!categoryId) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const koRes = await previewFillQualifiers.mutateAsync({ categoryId });
      setKnockoutPreview(koRes.data);
      setStep("PREVIEW_FILL_QUALIFIERS");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || t('tournamentManager.scheduleGeneration.errPreviewFill', 'Failed to preview fill qualifiers.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveFillQualifiers = async () => {
    if (!categoryId) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      await saveKnockoutAssignments.mutateAsync({ 
        categoryId,
        entryIds: knockoutPreview?.entryIds || []
      });
      await genKnockoutSchedule.mutateAsync({ categoryId });
      setStep("DONE");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || t('tournamentManager.scheduleGeneration.errSaveKnockoutFlow', 'Failed to save knockout assignments.'));
    } finally {
      setIsProcessing(false);
    }
  };

  // =====================
  // KNOCKOUT ONLY FLOW
  // =====================
  const handlePreviewKnockoutEntries = async () => {
    if (!categoryId) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const koRes = await previewFromEntries.mutateAsync({ categoryId });
      setKnockoutPreview(koRes.data);
      setStep("PREVIEW_KNOCKOUT_ENTRIES");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || t('tournamentManager.scheduleGeneration.errPreviewKnockout', 'Failed to preview knockout from entries.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveKnockoutEntries = async () => {
    if (!categoryId) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      await saveKnockoutAssignments.mutateAsync({ 
        categoryId,
        entryIds: knockoutPreview?.entryIds || []
      });
      
      // Generate knockout schedule
      await genKnockoutSchedule.mutateAsync({ categoryId });
      setStep("DONE");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || t('tournamentManager.scheduleGeneration.errSaveKnockoutFlow', 'Failed to save knockout assignments or generate schedule.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectGenerateSchedule = async () => {
    if (!categoryId) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      if (isGroupStage) {
        await genTournamentSchedule.mutateAsync({ tournamentId });
      } else {
        await genKnockoutSchedule.mutateAsync({ categoryId });
      }
      setStep("DONE");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || t('tournamentManager.scheduleGeneration.errGenerateScheduleDirect', 'Failed to generate schedule directly.'));
    } finally {
      setIsProcessing(false);
    }
  };

  // =====================
  // RENDER HELPERS
  // =====================
  const renderGroupPreview = () => {
    if (!groupPreview || groupPreview.length === 0) return <p className="text-sm text-muted-foreground">{t('tournamentManager.scheduleGeneration.noGroupData', 'No group data returned.')}</p>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 max-h-60 overflow-auto">
        {groupPreview.map((g: any, index: number) => (
          <div key={index} className="border border-border rounded-md p-3 bg-card">
            <h4 className="font-bold text-primary mb-2">{t('tournamentManager.scheduleGeneration.groupName', 'Group {{name}}').replace('{{name}}', g.groupName)}</h4>
            <ul className="text-sm space-y-1">
              {g.entryIds?.map((id: number, idx: number) => (
                <li key={idx}>{t('tournamentManager.scheduleGeneration.entryId', 'Entry #{{id}}').replace('{{id}}', id.toString())}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderKnockoutPreview = () => {
    if (!knockoutPreview) return <p className="text-sm text-muted-foreground">{t('tournamentManager.scheduleGeneration.noKnockoutData', 'No knockout data returned.')}</p>;

    return (
      <div className="border border-border rounded-md p-4 bg-card my-4">
        <h4 className="font-bold text-primary mb-2">{t('tournamentManager.scheduleGeneration.bracketOverview', 'Bracket Overview')}</h4>
        <div className="flex gap-4">
          <div><span className="text-muted-foreground text-sm">{t('tournamentManager.scheduleGeneration.totalRounds', 'Total Rounds:')}</span> <strong>{knockoutPreview.totalRounds || "-"}</strong></div>
          <div><span className="text-muted-foreground text-sm">{t('tournamentManager.scheduleGeneration.totalBrackets', 'Total Brackets:')}</span> <strong>{knockoutPreview.totalBrackets || "-"}</strong></div>
        </div>
        
        {knockoutPreview.entryIds && (
          <div className="mt-3">
            <h5 className="text-xs font-semibold text-muted-foreground mb-1">{t('tournamentManager.scheduleGeneration.assignedEntries', 'Assigned Entries')}</h5>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-auto">
              {knockoutPreview.entryIds.map((id: number, idx: number) => (
                <Badge key={idx} variant="outline">{t('tournamentManager.scheduleGeneration.entryId', 'Entry #{{id}}').replace('{{id}}', id.toString())}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const categoryLabel = categoryId ? `Category #${categoryId}` : "the selected category";

  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Schedule Generation Wizard
          <Badge variant="secondary">{isGroupStage ? "Group + Knockout" : "Knockout Only"}</Badge>
        </h3>
        <p className="text-sm text-muted-foreground">
          No schedule exists for {categoryLabel}. Follow the steps below to initialize and verify the tournament structures before finalizing schedules.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Tournament #{tournamentId}
        </p>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        {/* INIT STEP */}
        {step === "INIT" && (
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm font-medium">{t('tournamentManager.scheduleGeneration.step1Title', 'Step 1: Preview Initial Structures')}</p>
            <div className="flex flex-wrap gap-3">
              {isGroupStage ? (
                <Button onClick={handlePreviewGroupStage} disabled={isProcessing || !categoryId}>
                  <Eye className="w-4 h-4 mr-2" />
                  {isProcessing ? t('tournamentManager.scheduleGeneration.loadingPreview', 'Loading Preview...') : t('tournamentManager.scheduleGeneration.previewGroupStageLayout', 'Preview Group Stage Layout')}
                </Button>
              ) : (
                <Button onClick={handlePreviewKnockoutEntries} disabled={isProcessing || !categoryId}>
                  <Eye className="w-4 h-4 mr-2" />
                  {isProcessing ? t('tournamentManager.scheduleGeneration.loadingPreview', 'Loading Preview...') : t('tournamentManager.scheduleGeneration.previewKnockoutBracket', 'Preview Knockout Bracket')}
                </Button>
              )}
              {hasBracket && isGroupStage && (
                <Button variant="secondary" onClick={handlePreviewFillQualifiers} disabled={isProcessing || !categoryId}>
                  <Eye className="w-4 h-4 mr-2" />
                  {isProcessing ? t('tournamentManager.scheduleGeneration.loadingPreview', 'Loading Preview...') : t('tournamentManager.scheduleGeneration.previewFillQualifiers', 'Fill Qualifiers (Post-Group Stage)')}
                </Button>
              )}
              {hasBracket && (
                <Button variant="secondary" onClick={handleDirectGenerateSchedule} disabled={isProcessing || !categoryId}>
                  <Play className="w-4 h-4 mr-2" />
                  {isProcessing ? t('tournamentManager.scheduleGeneration.generating', 'Generating...') : t('tournamentManager.scheduleGeneration.generateScheduleDirect', 'Generate Schedule')}
                </Button>
              )}
            </div>
            {hasBracket && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('tournamentManager.scheduleGeneration.bracketExists', 'Bracket already exists. You can directly generate the schedule or fill qualifiers if group stage is done.')}
              </p>
            )}
          </div>
        )}

        {/* GROUP PREVIEW STEP */}
        {step === "PREVIEW_GROUP" && (
          <div className="flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <p className="text-sm font-medium text-cyan-500 mb-1">{t('tournamentManager.scheduleGeneration.step2GroupTitle', 'Step 2: Review Group Draw')}</p>
              <p className="text-xs text-muted-foreground">{t('tournamentManager.scheduleGeneration.step2GroupDesc', 'Review the generated group seeding below. If correct, save and proceed to view the knockout bracket structure.')}</p>
            </div>
            
            <div className="w-full">
              {renderGroupPreview()}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep("INIT")} variant="outline" disabled={isProcessing}>
                {t('tournamentManager.scheduleGeneration.back', 'Back')}
              </Button>
              <Button onClick={handleSaveGroupStage} disabled={isProcessing}>
                <Save className="w-4 h-4 mr-2" />
                {isProcessing ? t('tournamentManager.scheduleGeneration.saving', 'Saving...') : t('tournamentManager.scheduleGeneration.saveGroupsPreviewKnockout', 'Save Groups & Preview Knockout')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* KNOCKOUT PLACEHOLDER PREVIEW STEP (Group Flow) */}
        {step === "PREVIEW_KNOCKOUT_PLACEHOLDER" && (
          <div className="flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <p className="text-sm font-medium text-cyan-500 mb-1">{t('tournamentManager.scheduleGeneration.step3KnockoutTitle', 'Step 3: Review Knockout Placeholders')}</p>
              <p className="text-xs text-muted-foreground">{t('tournamentManager.scheduleGeneration.step3KnockoutDesc', 'The group assignments have been saved. Review the structure of the knockout bracket that will follow the group stage.')}</p>
            </div>
            
            <div className="w-full">
              {renderKnockoutPreview()}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSaveKnockoutPlaceholders} disabled={isProcessing} className="bg-primary text-primary-foreground">
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? t('tournamentManager.scheduleGeneration.finalizing', 'Finalizing...') : t('tournamentManager.scheduleGeneration.saveBracketGenerateSchedules', 'Save Bracket & Generate Final Schedules')}
              </Button>
            </div>
          </div>
        )}

        {/* KNOCKOUT FILL QUALIFIERS PREVIEW STEP (Group Flow Post-Group Stage) */}
        {step === "PREVIEW_FILL_QUALIFIERS" && (
          <div className="flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <p className="text-sm font-medium text-cyan-500 mb-1">{t('tournamentManager.scheduleGeneration.stepFillQualifiersTitle', 'Review Filled Qualifiers')}</p>
              <p className="text-xs text-muted-foreground">{t('tournamentManager.scheduleGeneration.stepFillQualifiersDesc', 'Review the knockout bracket structure filled with qualifiers from the group stage.')}</p>
            </div>
            
            <div className="w-full">
              {renderKnockoutPreview()}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep("INIT")} variant="outline" disabled={isProcessing}>
                {t('tournamentManager.scheduleGeneration.back', 'Back')}
              </Button>
              <Button onClick={handleSaveFillQualifiers} disabled={isProcessing} className="bg-primary text-primary-foreground">
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? t('tournamentManager.scheduleGeneration.finalizing', 'Finalizing...') : t('tournamentManager.scheduleGeneration.saveBracketGenerateSchedulesDirect', 'Save Bracket & Generate Schedules')}
              </Button>
            </div>
          </div>
        )}

        {/* KNOCKOUT ENTRIES PREVIEW STEP (Knockout Flow) */}
        {step === "PREVIEW_KNOCKOUT_ENTRIES" && (
          <div className="flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <p className="text-sm font-medium text-cyan-500 mb-1">{t('tournamentManager.scheduleGeneration.step2KnockoutTitle', 'Step 2: Review Knockout Bracket')}</p>
              <p className="text-xs text-muted-foreground">{t('tournamentManager.scheduleGeneration.step2KnockoutDesc', 'Review the direct knockout bracket structure filled from current entries.')}</p>
            </div>
            
            <div className="w-full">
              {renderKnockoutPreview()}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep("INIT")} variant="outline" disabled={isProcessing}>
                {t('tournamentManager.scheduleGeneration.back', 'Back')}
              </Button>
              <Button onClick={handleSaveKnockoutEntries} disabled={isProcessing} className="bg-primary text-primary-foreground">
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? t('tournamentManager.scheduleGeneration.finalizing', 'Finalizing...') : t('tournamentManager.scheduleGeneration.saveBracketGenerateSchedulesDirect', 'Save Bracket & Generate Schedules')}
              </Button>
            </div>
          </div>
        )}

        {/* DONE STEP */}
        {step === "DONE" && (
          <div className="flex flex-col items-center justify-center p-6 gap-2 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="font-bold text-lg">{t('tournamentManager.scheduleGeneration.successTitle', 'Schedules Successfully Generated!')}</p>
            <p className="text-sm text-muted-foreground">{t('tournamentManager.scheduleGeneration.successDesc', 'The schedule view should refresh automatically.')}</p>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
            <strong>{t('tournamentManager.scheduleGeneration.errorPrefix', 'Error:')}</strong> {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
