interface ScheduleGenerationProps {
  tournamentId: number;
  categoryId?: number;
}

export default function ScheduleGeneration({
  tournamentId,
  categoryId,
}: ScheduleGenerationProps) {
  const categoryLabel = categoryId
    ? `Category #${categoryId}`
    : "the selected category";

  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 space-y-2">
      <h3 className="text-lg font-semibold">Schedule Generation</h3>
      <p className="text-sm text-muted-foreground">
        No schedule exists for {categoryLabel}. Generate a schedule to continue.
      </p>
      <p className="text-xs text-muted-foreground">
        Tournament #{tournamentId}
      </p>
    </div>
  );
}
