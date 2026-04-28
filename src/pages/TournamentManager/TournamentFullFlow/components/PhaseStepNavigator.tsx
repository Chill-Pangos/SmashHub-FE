import { cn } from "@/lib/utils";

interface PhaseStepNavigatorProps {
  steps: Array<{ id: string; label: string }>;
  activeStepId: string;
  onChange: (id: string) => void;
  title: string;
}

export default function PhaseStepNavigator({
  steps,
  activeStepId,
  onChange,
  title,
}: PhaseStepNavigatorProps) {
  return (
    <aside className="rounded-xl border bg-card p-3">
      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="mt-2 space-y-1">
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onChange(step.id)}
              className={cn(
                "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent/40",
              )}
            >
              <span className="mr-2 text-xs opacity-80">{index + 1}.</span>
              {step.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
