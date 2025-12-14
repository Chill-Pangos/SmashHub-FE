import { useState } from "react";
import { Calendar, MapPin, Edit2, Trash2, Plus } from "lucide-react";

const initialMatches = [
  {
    id: 1,
    player1: "Alex Chen",
    player2: "Sarah Johnson",
    date: "2024-11-15",
    time: "18:00",
    venue: "Court A",
    status: "scheduled",
  },
  {
    id: 2,
    player1: "Mike Davis",
    player2: "Emily Wilson",
    date: "2024-11-16",
    time: "19:30",
    venue: "Court B",
    status: "scheduled",
  },
  {
    id: 3,
    player1: "John Lee",
    player2: "Alex Chen",
    date: "2024-11-14",
    time: "17:00",
    venue: "Court A",
    status: "completed",
  },
  {
    id: 4,
    player1: "Sarah Johnson",
    player2: "Emily Wilson",
    date: "2024-11-17",
    time: "20:00",
    venue: "Court C",
    status: "scheduled",
  },
];

export default function MatchesSchedule() {
  const [matches] = useState(initialMatches);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredMatches = matches.filter(
    (match) => filterStatus === "all" || match.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Match Schedule
          </h2>
          <p className="text-muted-foreground">
            View and manage upcoming matches
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Schedule Match
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "scheduled", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filterStatus === status
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-card-foreground hover:bg-accent/80"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-card-foreground">
                    {match.player1} vs {match.player2}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      match.status
                    )}`}
                  >
                    {match.status.charAt(0).toUpperCase() +
                      match.status.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {match.date} at {match.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {match.venue}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 hover:bg-accent rounded-lg transition-colors text-primary">
                  <Edit2 size={16} />
                </button>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors text-destructive">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
