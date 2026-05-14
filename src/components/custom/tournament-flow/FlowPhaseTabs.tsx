import { cn } from "@/lib/utils";

export interface FlowPhaseTabItem {
  id: string;
  label: string;
  description: string;
  stepCount: number;
  accentClass?: string;
}

interface FlowPhaseTabsProps {
  phases: FlowPhaseTabItem[];
  activePhaseId: string;
  onChange: (phaseId: string) => void;
}

export default function FlowPhaseTabs({
  phases,
  activePhaseId,
  onChange,
}: FlowPhaseTabsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {phases.map((phase) => {
        const isActive = phase.id === activePhaseId;

        return (
          <button
            key={phase.id}
            type="button"
            onClick={() => onChange(phase.id)}
            className={cn(
              "rounded-lg border bg-card p-4 text-left transition-all",
              "hover:border-primary/40 hover:bg-accent/20",
              isActive &&
                "border-primary/60 bg-primary/5 ring-1 ring-primary/30",
            )}
          >
            <p className={cn("text-sm font-semibold", phase.accentClass)}>
              {phase.label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {phase.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {phase.stepCount}
            </p>
          </button>
        );
      })}
    </div>
  );
}
