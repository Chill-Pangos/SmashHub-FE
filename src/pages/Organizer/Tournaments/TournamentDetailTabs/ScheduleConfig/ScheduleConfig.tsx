interface ScheduleConfigProps {
  tournamentId: number;
}

export default function ScheduleConfig({ tournamentId }: ScheduleConfigProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Schedule Config</h2>
        <p className="text-sm text-muted-foreground">
          Tournament #{tournamentId}
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
        Placeholder for the Schedule Config tab.
      </div>
    </div>
  );
}
