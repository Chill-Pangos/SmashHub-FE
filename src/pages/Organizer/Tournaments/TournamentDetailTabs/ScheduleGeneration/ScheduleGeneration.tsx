import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
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

export default function ScheduleGeneration({
  tournamentId,
  categoryId,
  isGroupStage,
}: ScheduleGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<string>("");

  // Mutations Group
  const genGroupPlaceholders = useGeneratePlaceholders();
  const saveGroupAssignments = useSaveAssignments();
  const previewKnockoutPlaceholders = usePreviewKnockoutPlaceholders();
  const saveKnockoutAssignments = useSaveKnockoutAssignments();
  const genTournamentSchedule = useGenerateTournamentSchedule();

  // Mutations Non-Group
  const previewFromEntries = usePreviewFromEntries();
  const genKnockoutSchedule = useGenerateKnockoutSchedule();

  const handleGenerate = async () => {
    if (!categoryId) return;
    setIsGenerating(true);

    try {
      if (isGroupStage) {
        // Step 1
        setStep("Generating Group Placeholders...");
        const groupRes = await genGroupPlaceholders.mutateAsync({ categoryId });
        
        // Step 2
        setStep("Saving Group Assignments...");
        const groupAssignments = groupRes.data.map((g: any) => ({
          groupName: g.groupName,
          entryIds: g.entryIds
        }));
        await saveGroupAssignments.mutateAsync({ categoryId, groupAssignments });

        // Step 3
        setStep("Generating Knockout Placeholders...");
        await previewKnockoutPlaceholders.mutateAsync({ categoryId });

        // Step 4
        setStep("Saving Knockout Assignments...");
        await saveKnockoutAssignments.mutateAsync({ categoryId });

        // Step 5
        setStep("Generating Final Schedule...");
        await genTournamentSchedule.mutateAsync({ categoryId });

      } else {
        // Step 1
        setStep("Previewing Knockout Bracket from Entries...");
        const koRes = await previewFromEntries.mutateAsync({ categoryId });

        // Step 2
        setStep("Saving Knockout Assignments...");
        await saveKnockoutAssignments.mutateAsync({ 
          categoryId,
          entryIds: koRes.data.entryIds
        });

        // Step 3
        setStep("Generating Schedule...");
        await genKnockoutSchedule.mutateAsync({ categoryId });
      }

      setStep("Done! Schedule generated.");
    } catch (error) {
      console.error(error);
      setStep("Error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const categoryLabel = categoryId
    ? `Category #${categoryId}`
    : "the selected category";

  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Schedule Generation</h3>
        <p className="text-sm text-muted-foreground">
          No schedule exists for {categoryLabel}. Generate a schedule to continue.
        </p>
        <p className="text-xs text-muted-foreground">
          Tournament #{tournamentId} | {isGroupStage ? "Group Stage Enabled" : "Knockout Only"}
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 mt-4">
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !categoryId}
          className="bg-primary text-primary-foreground font-bold"
        >
          <Play className="w-4 h-4 mr-2" />
          {isGenerating ? "Processing..." : "Generate Full Schedule"}
        </Button>
        {step && (
          <p className={`text-sm font-medium ${step.includes("Error") ? "text-destructive" : "text-primary"}`}>
            Status: {step}
          </p>
        )}
      </div>
    </div>
  );
}
