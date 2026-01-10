import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Target, Award, Zap } from "lucide-react";

const playerStatsData = [
  { name: "Alex Chen", wins: 42, losses: 3 },
  { name: "Sarah Johnson", wins: 28, losses: 4 },
  { name: "Emily Wilson", wins: 38, losses: 14 },
  { name: "Mike Davis", wins: 12, losses: 3 },
  { name: "John Lee", wins: 20, losses: 8 },
];

const winRateData = [
  { name: "90-100%", value: 8, color: "var(--chart-1)" },
  { name: "80-89%", value: 15, color: "var(--chart-2)" },
  { name: "70-79%", value: 28, color: "var(--chart-3)" },
  { name: "60-69%", value: 45, color: "var(--chart-4)" },
  { name: "<60%", value: 28, color: "var(--chart-5)" },
];

const trendData = [
  { month: "Jan", matches: 120, tournaments: 2 },
  { month: "Feb", matches: 135, tournaments: 2 },
  { month: "Mar", matches: 155, tournaments: 3 },
  { month: "Apr", matches: 148, tournaments: 2 },
  { month: "May", matches: 165, tournaments: 3 },
  { month: "Jun", matches: 178, tournaments: 4 },
];

export default function StatisticsCharts() {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Matches</p>
              <p className="text-2xl font-bold text-card-foreground">1,204</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Award className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tournaments Held</p>
              <p className="text-2xl font-bold text-card-foreground">24</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Win Rate</p>
              <p className="text-2xl font-bold text-card-foreground">68%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Top Player Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={playerStatsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              />
              <Bar dataKey="wins" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              <Bar
                dataKey="losses"
                fill="var(--chart-5)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-lg border border-border p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 w-full">
            Win Rate Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={winRateData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {winRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Activity Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            />
            <Line
              type="monotone"
              dataKey="matches"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="tournaments"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
