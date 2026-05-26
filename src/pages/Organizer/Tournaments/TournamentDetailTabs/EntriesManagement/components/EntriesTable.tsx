import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, CheckCircle, Trash2, CreditCard } from "lucide-react";
import type { Entry } from "./types"; // Import type đã tạo
import { ActionModal } from "./ActionModal";

interface EntriesTableProps {
  entries: Entry[];
  selectedIds: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: number, checked: boolean) => void;
}

export function EntriesTable({ entries, selectedIds, onSelectAll, onSelectRow }: EntriesTableProps) {
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: "delete" | "approve"; entryId: number | null }>({
    isOpen: false,
    type: "approve",
    entryId: null
  });

  // 👉 CALL REACT QUERY: const updateEntryMutation = useMutation({ mutationFn: updateEntryStatus... })

  const handleActionConfirm = () => {
    if (modalState.type === "delete") {
      console.log("Deleting entry:", modalState.entryId);
      // updateEntryMutation.mutate(...)
    } else {
      console.log("Approving entry:", modalState.entryId);
    }
  };

  return (
    <>
      <div className="w-full bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-background border-b border-border">
            <tr>
              <th className="p-4 w-12">
                <Checkbox 
                  className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  checked={entries.length > 0 && selectedIds.length === entries.length}
                  onCheckedChange={(c) => onSelectAll(!!c)}
                />
              </th>
              <th className="py-4 font-semibold uppercase tracking-wider">Entry Name</th>
              <th className="py-4 font-semibold uppercase tracking-wider">Members</th>
              <th className="py-4 font-semibold uppercase tracking-wider">Category</th>
              <th className="py-4 font-semibold uppercase tracking-wider text-center">Lineup Status</th>
              <th className="py-4 font-semibold uppercase tracking-wider text-center">Payment Status</th>
              <th className="py-4 font-semibold uppercase tracking-wider text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <Checkbox 
                    className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    checked={selectedIds.includes(entry.id)}
                    onCheckedChange={(c) => onSelectRow(entry.id, !!c)}
                  />
                </td>
                
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border rounded-lg shadow-auth-icon-shadow">
                      <AvatarImage src={entry.avatarUrl} />
                      <AvatarFallback className="bg-muted text-muted-foreground rounded-lg">
                        {entry.name === "N/A" ? "NA" : entry.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {entry.entryIdString}</p>
                    </div>
                  </div>
                </td>

                <td className="py-3">
                  <div className="flex items-center">
                    {entry.members.slice(0, 2).map((member, idx) => (
                      <Avatar key={member.id} className={`h-8 w-8 border-2 border-card ${idx !== 0 ? '-ml-2' : ''}`}>
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="bg-secondary text-[10px] text-secondary-foreground">M</AvatarFallback>
                      </Avatar>
                    ))}
                    {entry.requiredMemberCount > entry.currentMemberCount && (
                      <div className="h-8 w-8 rounded-full border-2 border-card bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold -ml-2 z-10">
                        +{entry.requiredMemberCount - entry.currentMemberCount}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3 text-muted-foreground font-medium">
                  {entry.categoryName}
                </td>

                <td className="py-3 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold tracking-wide
                    ${entry.lineupStatus === 'CONFIRMED' ? 'border-primary/50 text-primary bg-primary/10' : 'border-chart-4/50 text-chart-4 bg-chart-4/10'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${entry.lineupStatus === 'CONFIRMED' ? 'bg-primary' : 'bg-chart-4'}`} />
                    {entry.lineupStatus}
                  </div>
                </td>

                <td className="py-3 text-center">
                  <div className={`inline-flex px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider
                    ${entry.paymentStatus === 'PAID' ? 'border-border text-muted-foreground bg-background' : 'border-destructive/30 text-destructive bg-destructive/10'}`}>
                    {entry.paymentStatus}
                  </div>
                </td>

                <td className="py-3 text-right pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem onClick={() => setModalState({ isOpen: true, type: "approve", entryId: entry.id })} className="cursor-pointer">
                        <CheckCircle className="mr-2 h-4 w-4 text-primary" /> Approve Lineup
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" /> Mark as Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setModalState({ isOpen: true, type: "delete", entryId: entry.id })}
                        className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Entry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ActionModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        title={modalState.type === "delete" ? "Delete Entry?" : "Approve Lineup?"}
        description={modalState.type === "delete" ? "This action cannot be undone. This will permanently remove the entry from the tournament." : "Are you sure you want to confirm this lineup? They will be locked for the brackets."}
        actionType={modalState.type === "delete" ? "destructive" : "primary"}
        onConfirm={handleActionConfirm}
      />
    </>
  );
}