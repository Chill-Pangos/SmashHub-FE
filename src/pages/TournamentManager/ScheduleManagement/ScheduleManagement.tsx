import { useState } from "react";
import { Calendar, MapPin, Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export default function ScheduleManagement() {
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
            View and manage match schedules
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Match
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
        >
          All
        </Button>
        <Button
          variant={filterStatus === "scheduled" ? "default" : "outline"}
          onClick={() => setFilterStatus("scheduled")}
        >
          Scheduled
        </Button>
        <Button
          variant={filterStatus === "completed" ? "default" : "outline"}
          onClick={() => setFilterStatus("completed")}
        >
          Completed
        </Button>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map((match) => (
          <Card key={match.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  {match.player1} vs {match.player2}
                </h3>
                <Badge className={getStatusColor(match.status)}>
                  {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {match.date} at {match.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                {match.venue}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
