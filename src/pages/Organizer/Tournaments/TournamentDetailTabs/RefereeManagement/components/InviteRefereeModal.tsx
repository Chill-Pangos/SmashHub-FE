import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useAvailableReferees, useInviteReferee } from "@/hooks/queries";

interface InviteRefereeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteMode: "chief" | "referee";
  tournamentId: number;
}

export function InviteRefereeModal({
  open,
  onOpenChange,
  inviteMode,
  tournamentId,
}: InviteRefereeModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const isChiefMode = inviteMode === "chief";

  const { data, isLoading } = useAvailableReferees(tournamentId, 1, 50, inviteMode, search, {
    enabled: open,
  });

  const availableReferees = data?.referees || [];

  const inviteMutation = useInviteReferee();

  const handleSelect = (id: number) => {
    if (isChiefMode) {
      setSelectedIds([id]);
    } else {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    }
  };

  const handleSendInvitations = async () => {
    try {
      for (const refId of selectedIds) {
        await inviteMutation.mutateAsync({
          tournamentId,
          refereeId: refId,
          role: inviteMode,
        });
      }
      onOpenChange(false);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    }
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
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-input border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {isLoading && <p className="text-center text-sm text-muted-foreground">Loading...</p>}
            {!isLoading && availableReferees.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">No available referees found.</p>
            )}
            {!isLoading && availableReferees.map((ref) => {
              const name = `${ref.firstName} ${ref.lastName}`;
              return (
                <div
                  key={ref.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => handleSelect(ref.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedIds.includes(ref.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedIds.includes(ref.id) && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                      )}
                    </div>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                        {name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ref.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {isChiefMode
              ? "Single selection required for Chief position"
              : `${selectedIds.length} Referee Selected`}
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={selectedIds.length === 0 || inviteMutation.isPending}
              onClick={handleSendInvitations}
            >
              {inviteMutation.isPending ? "Sending..." : "Send invitations"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
