import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Star } from "lucide-react";

// Mock data cho danh sách trọng tài có thể mời
const AVAILABLE_REFEREES = [
  { id: "REF-9920", name: "David Chen", tier: "Tier 1", rating: 4.8, available: true, avatar: "" },
  { id: "REF-4412", name: "Sarah Jenkins", tier: "Tier 2", rating: 4.5, available: true, avatar: "" },
  { id: "REF-1089", name: "Michael Rossi", tier: "Tier 1", rating: 4.9, available: true, avatar: "" },
];

interface InviteRefereeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteMode: "CHIEF" | "ASSISTANT";
}

export function InviteRefereeModal({ open, onOpenChange, inviteMode }: InviteRefereeModalProps) {
  // 👉 CALL REACT QUERY: useQuery(['available-referees', tournamentId], fetchAvailableReferees) để thay thế mock data.

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isChiefMode = inviteMode === "CHIEF";

  // 👉 CALL REACT QUERY: const inviteMutation = useMutation({ mutationFn: inviteRefereesApi, onSuccess: () => { ... } })

  const handleSelect = (id: string) => {
    if (isChiefMode) {
      setSelectedIds([id]); // Chỉ cho phép chọn 1
    } else {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const handleSendInvitations = () => {
    // inviteMutation.mutate({ refereeIds: selectedIds, role: inviteMode });
    console.log("Inviting:", selectedIds, "as", inviteMode);
    onOpenChange(false);
    setSelectedIds([]); // reset
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border shadow-auth-surface-shadow">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {isChiefMode ? "Invite Chief Referee" : "Invite Referees"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isChiefMode
              ? "Select a high-clearance official to lead the tournament."
              : "Select personnel to send tournament invitations."}
          </p>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or tier..."
              className="pl-9 bg-input border-border focus-visible:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer">Tier 1 ×</Badge>
            <Badge variant="outline" className="text-muted-foreground hover:text-foreground cursor-pointer">General</Badge>
            <Badge variant="outline" className="text-muted-foreground hover:text-foreground cursor-pointer">Available Only</Badge>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {AVAILABLE_REFEREES.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => handleSelect(ref.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedIds.includes(ref.id) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                    {selectedIds.includes(ref.id) && <div className="w-2 h-2 bg-primary-foreground rounded-sm" />}
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                      {ref.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{ref.name}</p>
                    <p className="text-xs text-muted-foreground">{ref.tier} • {ref.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-chart-4 justify-end font-medium">
                    <Star className="h-3 w-3 fill-current" /> {ref.rating}
                  </div>
                  <p className="text-[10px] text-primary mt-1 font-semibold uppercase tracking-wider">
                    {ref.available ? "Available" : "Busy"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {isChiefMode 
              ? "Single selection required for Chief position" 
              : `${selectedIds.length} Referee Selected`}
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground">
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={selectedIds.length === 0}
              onClick={handleSendInvitations}
            >
              Send invitations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}