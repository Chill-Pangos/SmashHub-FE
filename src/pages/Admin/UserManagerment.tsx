import { useState } from "react";
import { Search, Edit2, Trash2, Plus } from "lucide-react";

const initialPlayers = [
  {
    id: 1,
    name: "Alex Chen",
    email: "alex@club.com",
    skillLevel: "Advanced",
    rating: 2100,
    matchesPlayed: 45,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@club.com",
    skillLevel: "Intermediate",
    rating: 1650,
    matchesPlayed: 32,
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike@club.com",
    skillLevel: "Beginner",
    rating: 1200,
    matchesPlayed: 15,
  },
  {
    id: 4,
    name: "Emily Wilson",
    email: "emily@club.com",
    skillLevel: "Advanced",
    rating: 2050,
    matchesPlayed: 52,
  },
  {
    id: 5,
    name: "John Lee",
    email: "john@club.com",
    skillLevel: "Intermediate",
    rating: 1750,
    matchesPlayed: 28,
  },
];

export default function PlayersManagement() {
  const [players, setPlayers] = useState(initialPlayers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-blue-100 text-blue-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-green-100 text-green-800";
      case "Professional":
        return "bg-purple-100 text-purple-800";
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
            Players Management
          </h2>
          <p className="text-muted-foreground">
            Manage and track player profiles and ratings
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Add Player
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Player Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Skill Level
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Rating
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Matches Played
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr
                key={player.id}
                className="border-b border-border hover:bg-accent/30 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-card-foreground font-medium">
                  {player.name}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {player.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(
                      player.skillLevel
                    )}`}
                  >
                    {player.skillLevel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {player.rating}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {player.matchesPlayed}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors text-primary">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors text-destructive">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
