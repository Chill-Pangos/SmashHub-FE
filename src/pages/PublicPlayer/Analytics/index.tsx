import {
  Trophy,
  TrendingUp,
  Activity,
  Award,
  Medal,
  Flame,
  CheckCircle2,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

const radarData = [
  { subject: "Aggression", A: 85, fullMark: 100 },
  { subject: "Edge Guard", A: 70, fullMark: 100 },
  { subject: "Defense", A: 65, fullMark: 100 },
  { subject: "Recovery", A: 80, fullMark: 100 },
  { subject: "Combos", A: 90, fullMark: 100 },
];

// Generate mock heatmap data
const generateHeatmapData = () => {
  const days = 7;
  const weeks = 20;
  const data = [];
  for (let d = 0; d < days; d++) {
    const row = [];
    for (let w = 0; w < weeks; w++) {
      // 0 to 4 for intensity
      row.push(Math.floor(Math.random() * 5));
    }
    data.push(row);
  }
  return data;
};

const heatmapData = generateHeatmapData();

export default function Analytics() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("publicPlayer.analytics.personalAnalytics")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("publicPlayer.analytics.seasonPerformance")}
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tournaments */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("publicPlayer.analytics.totalTournaments")}
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">42</span>
            <span className="text-sm text-primary font-medium mb-1">
              +3 this month
            </span>
          </div>
        </div>

        {/* Win/Loss Ratio */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("publicPlayer.analytics.winLossRatio")}
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">2.4</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Rate</span>
              <span className="text-xs text-primary">68% Win</span>
            </div>
          </div>
        </div>

        {/* Peak ELO */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("publicPlayer.analytics.peakElo")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold">2150</span>
            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded">
              PRO
            </span>
          </div>
        </div>

        {/* Podium Finishes */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("publicPlayer.analytics.podiumFinishes")}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-yellow-500">1st</span>
              <span className="text-xl font-bold">8</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-zinc-300">2nd</span>
              <span className="text-xl font-bold">12</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-amber-600">3rd</span>
              <span className="text-xl font-bold">5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win Rate by Category (Radar Chart) */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">{t("publicPlayer.analytics.winRateByCategory")}</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Player"
                  dataKey="A"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Match Volume Heatmap */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">{t("publicPlayer.analytics.matchVolumeHeatmap")}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{t("publicPlayer.analytics.less")}</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-border"></div>
                <div className="w-3 h-3 rounded-sm bg-cyan-950"></div>
                <div className="w-3 h-3 rounded-sm bg-cyan-800"></div>
                <div className="w-3 h-3 rounded-sm bg-cyan-600"></div>
                <div className="w-3 h-3 rounded-sm bg-cyan-400"></div>
              </div>
              <span>{t("publicPlayer.analytics.more")}</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center overflow-x-auto pb-2">
            <div className="flex gap-1">
              <div className="flex flex-col justify-between text-[10px] text-muted-foreground py-1 pr-2">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              <div className="flex flex-col gap-1">
                {heatmapData.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                    {row.map((val, colIndex) => {
                      let bgColor = "bg-border";
                      if (val === 1) bgColor = "bg-cyan-950";
                      else if (val === 2) bgColor = "bg-cyan-800";
                      else if (val === 3) bgColor = "bg-cyan-600";
                      else if (val === 4) bgColor = "bg-cyan-400";
                      
                      return (
                        <div
                          key={colIndex}
                          className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${bgColor}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Milestones */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t("publicPlayer.analytics.recentMilestones")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50">
            <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-full">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">10 {t("publicPlayer.analytics.winstreak")}</h4>
              <p className="text-xs text-muted-foreground">
                {t("publicPlayer.analytics.achievedRanked")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50">
            <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-full">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{t("publicPlayer.analytics.proTierReached")}</h4>
              <p className="text-xs text-muted-foreground">
                {t("publicPlayer.analytics.crossedEloThreshold").replace("ELO", "2100 ELO")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50">
            <div className="p-3 bg-zinc-500/10 text-zinc-400 rounded-full">
              <Medal className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{t("publicPlayer.analytics.regionalFinalist")}</h4>
              <p className="text-xs text-muted-foreground">
                NA East Winter Circuit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
