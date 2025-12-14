import { useState } from "react";
import { Trophy, Users, Calendar, Edit2, Trash2, Plus } from "lucide-react";

const initialTournaments = [
  {
    id: 1,
    name: "Spring Championship 2024",
    startDate: "2024-12-01",
    endDate: "2024-12-15",
    participants: 32,
    status: "upcoming",
    category: "Singles",
  },
  {
    id: 2,
    name: "Beginners Cup",
    startDate: "2024-11-20",
    endDate: "2024-11-22",
    participants: 16,
    status: "ongoing",
    category: "Singles",
  },
  {
    id: 3,
    name: "Doubles League",
    startDate: "2024-10-01",
    endDate: "2024-10-30",
    participants: 24,
    status: "completed",
    category: "Doubles",
  },
];

export default function TournamentsManagement() {
  const [tournaments] = useState(initialTournaments);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
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
            Tournaments
          </h2>
          <p className="text-muted-foreground">
            Manage and organize tournaments
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          New Tournament
        </button>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  {tournament.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                    tournament.status
                  )}`}
                >
                  {tournament.status.charAt(0).toUpperCase() +
                    tournament.status.slice(1)}
                </span>
              </div>
              <Trophy className="text-primary" size={24} />
            </div>

            <div className="space-y-3 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {tournament.startDate} to {tournament.endDate}
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                {tournament.participants} participants
              </div>
              <div className="text-card-foreground">
                Category: {tournament.category}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-primary hover:bg-accent rounded transition-colors text-sm">
                <Edit2 size={16} />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-destructive hover:bg-accent rounded transition-colors text-sm">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
