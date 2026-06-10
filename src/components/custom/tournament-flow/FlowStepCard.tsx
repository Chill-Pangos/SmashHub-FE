import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import FlowEndpointList from "./FlowEndpointList";
import type { TournamentFlowStep } from "./types";

interface FlowStepCardProps {
  step: TournamentFlowStep;
  index: number;
  isHighlighted?: boolean;
  title: string;
  description: string;
  actorLabel: string;
  prerequisiteLabels: string[];
  prerequisitesTitle: string;
  autoTriggerLabels: string[];
  autoTriggersTitle: string;
  apiCountLabel: string;
  expandLabel: string;
  collapseLabel: string;
  autoBadgeLabel: string;
  tipLabel?: string;
  translateNote: (key: string) => string;
}

export default function FlowStepCard({
  step,
  index,
  isHighlighted,
  title,
  description,
  actorLabel,
  prerequisiteLabels,
  prerequisitesTitle,
  autoTriggerLabels,
  autoTriggersTitle,
  apiCountLabel,
  expandLabel,
  collapseLabel,
  autoBadgeLabel,
  tipLabel,
  translateNote,
}: FlowStepCardProps) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <article
      className={cn(
        "rounded-xl border bg-card p-4 transition-colors",
        isHighlighted && "border-primary/50",
      )}
    >
      <div className="flex items-start gap-3">
        <Badge variant="outline" className="mt-0.5">
          {index + 1}
        </Badge>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? collapseLabel : expandLabel}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {expanded ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{actorLabel}</Badge>
            <Badge variant="secondary">
              {step.endpoints.length} {apiCountLabel}
            </Badge>
          </div>

          {prerequisiteLabels.length > 0 ? (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {prerequisitesTitle}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {prerequisiteLabels.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <FlowEndpointList
            endpoints={step.endpoints}
            noteResolver={translateNote}
            autoLabel={autoBadgeLabel}
          />

          {autoTriggerLabels.length > 0 ? (
            <div className="rounded-md border border-violet-500/30 bg-violet-500/5 p-3">
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                {autoTriggersTitle}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {autoTriggerLabels.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {tipLabel ? (
            <p className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-300">
              {tipLabel}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
