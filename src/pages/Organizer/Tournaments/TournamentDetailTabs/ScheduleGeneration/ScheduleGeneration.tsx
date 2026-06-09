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
  useGenerateKnockoutSchedule 
} from "@/hooks/queries";

interface ScheduleGenerationProps {
  tournamentId: number;
  categoryId?: number;
  isGroupStage?: boolean;
}

type WizardStep = 
  | "INIT"
  // Group Flow Steps
  | "PREVIEW_GROUP"
  | "PREVIEW_KNOCKOUT_PLACEHOLDER"
  // Knockout Only Flow Steps
  | "PREVIEW_KNOCKOUT_ENTRIES"
  // Both Flows
  | "DONE";

export default function ScheduleGeneration({
  tournamentId,
  categoryId,
  isGroupStage,
}: ScheduleGenerationProps) {
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
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || "Failed to preview group placeholders.");
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
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || "Failed to save group assignments.");
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
      await genTournamentSchedule.mutateAsync({ categoryId });
      setStep("DONE");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || "Failed to save knockout placeholders or generate schedule.");
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
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || "Failed to preview knockout from entries.");
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
      setErrorMsg(err?.response?.data?.error?.message || err?.response?.data?.message || "Failed to save knockout assignments or generate schedule.");
    } finally {
      setIsProcessing(false);
    }
  };

  // =====================
  // RENDER HELPERS
  // =====================
  const renderGroupPreview = () => {
    if (!groupPreview || groupPreview.length === 0) return <p className="text-sm text-muted-foreground">No group data returned.</p>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 max-h-60 overflow-auto">
        {groupPreview.map((g: any, index: number) => (
          <div key={index} className="border border-border rounded-md p-3 bg-card">
            <h4 className="font-bold text-primary mb-2">Group {g.groupName}</h4>
            <ul className="text-sm space-y-1">
              {g.entryIds?.map((id: number, idx: number) => (
                <li key={idx}>Entry #{id}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderKnockoutPreview = () => {
    if (!knockoutPreview) return <p className="text-sm text-muted-foreground">No knockout data returned.</p>;

    return (
      <div className="border border-border rounded-md p-4 bg-card my-4">
        <h4 className="font-bold text-primary mb-2">Bracket Overview</h4>
        <div className="flex gap-4">
          <div><span className="text-muted-foreground text-sm">Total Rounds:</span> <strong>{knockoutPreview.totalRounds || "-"}</strong></div>
          <div><span className="text-muted-foreground text-sm">Total Brackets:</span> <strong>{knockoutPreview.totalBrackets || "-"}</strong></div>
        </div>
        
        {knockoutPreview.entryIds && (
          <div className="mt-3">
            <h5 className="text-xs font-semibold text-muted-foreground mb-1">Assigned Entries</h5>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-auto">
              {knockoutPreview.entryIds.map((id: number, idx: number) => (
                <Badge key={idx} variant="outline">Entry #{id}</Badge>
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
            <p className="text-sm font-medium">Step 1: Preview Initial Structures</p>
            {isGroupStage ? (
              <Button onClick={handlePreviewGroupStage} disabled={isProcessing || !categoryId}>
                <Eye className="w-4 h-4 mr-2" />
                {isProcessing ? "Loading Preview..." : "Preview Group Stage Layout"}
              </Button>
            ) : (
              <Button onClick={handlePreviewKnockoutEntries} disabled={isProcessing || !categoryId}>
                <Eye className="w-4 h-4 mr-2" />
                {isProcessing ? "Loading Preview..." : "Preview Knockout Bracket"}
              </Button>
            )}
          </div>
        )}

        {/* GROUP PREVIEW STEP */}
        {step === "PREVIEW_GROUP" && (
          <div className="flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <p className="text-sm font-medium text-cyan-500 mb-1">Step 2: Review Group Draw</p>
              <p className="text-xs text-muted-foreground">Review the generated group seeding below. If correct, save and proceed to view the knockout bracket structure.</p>
            </div>
            
            <div className="w-full">
              {renderGroupPreview()}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep("INIT")} variant="outline" disabled={isProcessing}>
                Back
              </Button>
              <Button onClick={handleSaveGroupStage} disabled={isProcessing}>
                <Save className="w-4 h-4 mr-2" />
                {isProcessing ? "Saving..." : "Save Groups & Preview Knockout"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* KNOCKOUT PLACEHOLDER PREVIEW STEP (Group Flow) */}
        {step === "PREVIEW_KNOCKOUT_PLACEHOLDER" && (
          <div className="flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <p className="text-sm font-medium text-cyan-500 mb-1">Step 3: Review Knockout Placeholders</p>
              <p className="text-xs text-muted-foreground">The group assignments have been saved. Review the structure of the knockout bracket that will follow the group stage.</p>
            </div>
            
            <div className="w-full">
              {renderKnockoutPreview()}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSaveKnockoutPlaceholders} disabled={isProcessing} className="bg-primary text-primary-foreground">
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? "Finalizing..." : "Save Bracket & Generate Final Schedules"}
              </Button>
            </div>
          </div>
        )}

        {/* KNOCKOUT ENTRIES PREVIEW STEP (Knockout Flow) */}
        {step === "PREVIEW_KNOCKOUT_ENTRIES" && (
          <div className="flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <p className="text-sm font-medium text-cyan-500 mb-1">Step 2: Review Knockout Bracket</p>
              <p className="text-xs text-muted-foreground">Review the direct knockout bracket structure filled from current entries.</p>
            </div>
            
            <div className="w-full">
              {renderKnockoutPreview()}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep("INIT")} variant="outline" disabled={isProcessing}>
                Back
              </Button>
              <Button onClick={handleSaveKnockoutEntries} disabled={isProcessing} className="bg-primary text-primary-foreground">
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? "Finalizing..." : "Save Bracket & Generate Schedules"}
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
            <p className="font-bold text-lg">Schedules Successfully Generated!</p>
            <p className="text-sm text-muted-foreground">The schedule view should refresh automatically.</p>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
