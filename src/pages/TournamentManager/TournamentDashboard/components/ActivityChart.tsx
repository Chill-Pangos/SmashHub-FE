import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Activity {
  date: string;
  matches: number;
  participants: number;
}

const mockActivityData: Activity[] = [
  { date: "T2", matches: 12, participants: 48 },
  { date: "T3", matches: 18, participants: 72 },
  { date: "T4", matches: 15, participants: 60 },
  { date: "T5", matches: 24, participants: 96 },
  { date: "T6", matches: 21, participants: 84 },
  { date: "T7", matches: 28, participants: 112 },
  { date: "CN", matches: 32, participants: 128 },
];

export default function ActivityChart() {
  const maxMatches = Math.max(...mockActivityData.map((d) => d.matches));
  const currentMatches = mockActivityData[mockActivityData.length - 1].matches;
  const previousMatches = mockActivityData[mockActivityData.length - 2].matches;
  const growth = (
    ((currentMatches - previousMatches) / previousMatches) *
    100
  ).toFixed(1);
  const isGrowthPositive = parseFloat(growth) > 0;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold">Hoạt động trong tuần</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Số trận đấu & vận động viên
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isGrowthPositive ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
          <span
            className={`text-sm font-semibold ${
              isGrowthPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {growth}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-48 flex items-end justify-between gap-2">
          {mockActivityData.map((data, index) => {
            const matchHeight = (data.matches / maxMatches) * 100;

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full flex items-end justify-center gap-1 h-40">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600 cursor-pointer relative group"
                    style={{ height: `${matchHeight}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap">
                      {data.matches} trận
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {data.date}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-muted-foreground">Trận đấu tuần này:</span>
            <span className="font-semibold">
              {mockActivityData.reduce((acc, d) => acc + d.matches, 0)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Vận động viên:</span>
            <span className="font-semibold">
              {mockActivityData.reduce((acc, d) => acc + d.participants, 0)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
