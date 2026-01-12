import type React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold text-card-foreground mb-2">
            {value}
          </p>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm ${
                trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
