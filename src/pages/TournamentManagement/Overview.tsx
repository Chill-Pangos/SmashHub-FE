import { Trophy, Calendar, Users, Award } from "lucide-react";

export default function TournamentOverview() {
  const stats = [
    {
      label: "Total Tournaments",
      value: "24",
      icon: Trophy,
      color: "bg-blue-500/10",
    },
    {
      label: "Active Tournaments",
      value: "5",
      icon: Calendar,
      color: "bg-green-500/10",
    },
    {
      label: "Total Participants",
      value: "342",
      icon: Users,
      color: "bg-purple-500/10",
    },
    {
      label: "Completed Events",
      value: "19",
      icon: Award,
      color: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-card-foreground">
          Tournament Management
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-card-foreground mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon size={24} className="text-card-foreground" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-card-foreground mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 pb-4 border-b border-border last:border-0"
            >
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="flex-1">
                <p className="text-card-foreground font-medium">
                  Tournament {item} started
                </p>
                <p className="text-muted-foreground text-sm">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
