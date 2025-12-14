import { useState } from "react";
import { Search, Edit, Trash2, Eye } from "lucide-react";

export default function TournamentsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const tournaments = [
    {
      id: 1,
      name: "Spring Championship 2024",
      status: "ongoing",
      participants: 32,
      startDate: "2024-03-15",
      location: "City Arena",
    },
    {
      id: 2,
      name: "Regional Qualifier",
      status: "completed",
      participants: 24,
      startDate: "2024-02-28",
      location: "District Hall",
    },
    {
      id: 3,
      name: "Youth Summer Cup",
      status: "upcoming",
      participants: 48,
      startDate: "2024-06-01",
      location: "Youth Center",
    },
    {
      id: 4,
      name: "Masters Invitational",
      status: "ongoing",
      participants: 16,
      startDate: "2024-03-20",
      location: "Premier Club",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500/10 text-green-700";
      case "completed":
        return "bg-gray-500/10 text-gray-700";
      case "upcoming":
        return "bg-blue-500/10 text-blue-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-card-foreground">
          All Tournaments
        </h2>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-3 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search tournaments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground"
        />
      </div>

      {/* Tournaments Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                Tournament Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tournaments.map((tournament) => (
              <tr
                key={tournament.id}
                className="hover:bg-accent/50 transition-colors"
              >
                <td className="px-6 py-4 text-card-foreground font-medium">
                  {tournament.name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                      tournament.status
                    )}`}
                  >
                    {tournament.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-card-foreground">
                  {tournament.participants}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {tournament.startDate}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {tournament.location}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-accent transition-colors text-card-foreground">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-accent transition-colors text-card-foreground">
                    <Edit size={18} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
