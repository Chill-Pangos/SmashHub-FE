import { BarChart2, CheckCircle } from "lucide-react";

interface ValidationStatsProps {
  tables: number;
  matchDuration: number;
  openHour: number; // 0-23
  closeHour: number; // 0-23
  hasBreaks: boolean;
  breakDuration: number;
}

export function ValidationStats({
  tables,
  matchDuration,
  openHour,
  closeHour,
  hasBreaks,
  breakDuration,
}: ValidationStatsProps) {
  // Logic tính toán tương tự hệ thống thực
  const totalGrossHours = Math.max(0, closeHour - openHour);
  const totalGrossMins = totalGrossHours * 60;
  const netAvailableMins = totalGrossMins - (hasBreaks ? breakDuration : 0);
  
  const maxMatchesPerTable = matchDuration > 0 ? Math.floor(netAvailableMins / matchDuration) : 0;
  const totalCapacity = maxMatchesPerTable * tables;

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Validation Stats</h3>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Total Available Time
          </p>
          <p className="text-3xl font-bold text-primary drop-shadow-auth-primary-glow">
            {totalGrossHours}h 00m
          </p>
        </div>

        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Max Matches per Table
          </p>
          <p className="text-2xl font-bold text-foreground">{maxMatchesPerTable}</p>
        </div>

        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Total Tournament Capacity
          </p>
          <p className="text-3xl font-bold text-foreground">
            {totalCapacity} <span className="text-lg text-muted-foreground font-medium">Matches</span>
          </p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Current configuration supports registered participants with a 15% buffer margin.
          </p>
        </div>
      </div>
    </div>
  );
}