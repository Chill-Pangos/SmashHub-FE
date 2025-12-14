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
import StatCard from "./StatCard";
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react";

const performanceData = [
  { month: "Jan", matches: 24, wins: 16 },
  { month: "Feb", matches: 28, wins: 18 },
  { month: "Mar", matches: 32, wins: 24 },
  { month: "Apr", matches: 26, wins: 19 },
  { month: "May", matches: 30, wins: 23 },
  { month: "Jun", matches: 28, wins: 21 },
];

const skillLevelData = [
  { name: "Beginner", value: 45, color: "var(--chart-1)" },
  { name: "Intermediate", value: 38, color: "var(--chart-2)" },
  { name: "Advanced", value: 12, color: "var(--chart-3)" },
  { name: "Professional", value: 5, color: "var(--chart-4)" },
];

export default function DashboardOverview() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Table Tennis Management System Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="text-primary" size={24} />}
          label="Active Players"
          value="247"
          trend="+12%"
          trendUp
        />
        <StatCard
          icon={<Trophy className="text-primary" size={24} />}
          label="Tournaments"
          value="8"
          trend="+2"
          trendUp
        />
        <StatCard
          icon={<Calendar className="text-primary" size={24} />}
          label="Matches This Month"
          value="156"
          trend="+18%"
          trendUp
        />
        <StatCard
          icon={<TrendingUp className="text-primary" size={24} />}
          label="Avg Win Rate"
          value="62%"
          trend="+4%"
          trendUp
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Match Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
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
                dataKey="wins"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-lg border border-border p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 w-full">
            Player Skill Levels
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={skillLevelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {skillLevelData.map((entry, index) => (
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

      {/* Bar Chart */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Monthly Statistics
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            />
            <Bar
              dataKey="matches"
              fill="var(--primary)"
              radius={[8, 8, 0, 0]}
            />
            <Bar dataKey="wins" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
