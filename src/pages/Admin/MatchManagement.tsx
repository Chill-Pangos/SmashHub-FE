import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Edit, MoreHorizontal } from "lucide-react";

const matches = [
  {
    id: 1,
    player1: "Alex Chen",
    player2: "Maria Rodriguez",
    score: "3-1",
    tournament: "Spring Championship",
    date: "2025-01-15",
    status: "completed",
  },
  {
    id: 2,
    player1: "David Kim",
    player2: "Sarah Johnson",
    score: "3-2",
    tournament: "Weekly League",
    date: "2025-01-14",
    status: "completed",
  },
  {
    id: 3,
    player1: "Emma Wilson",
    player2: "James Park",
    score: "TBD",
    tournament: "Spring Championship",
    date: "2025-02-01",
    status: "upcoming",
  },
];

export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Match Management
          </h1>
          <p className="text-muted-foreground">View and manage all matches</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Match
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Players</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Tournament</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="font-medium">
                    {match.player1} vs {match.player2}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {match.score}
                    </Badge>
                  </TableCell>
                  <TableCell>{match.tournament}</TableCell>
                  <TableCell>{match.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        match.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {match.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
