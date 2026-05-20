import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";
import { EntriesTable } from "./components/EntriesTable";
import type { Entry } from "./components/types";

// Mock Data khớp với hình ảnh
const MOCK_ENTRIES: Entry[] = [
  {
    id: 1, entryIdString: "#ENT-0942", name: "Cybernetics Prime", categoryId: 1, categoryName: "Pro Men's Open",
    captainId: 101, isAcceptingMembers: false, requiredMemberCount: 2, currentMemberCount: 2,
    lineupStatus: "CONFIRMED", paymentStatus: "PAID", createdAt: "", updatedAt: "",
    members: [{ id: 1, entryId: 1, userId: 101, eloAtEntry: 1500 }, { id: 2, entryId: 1, userId: 102, eloAtEntry: 1450 }]
  },
  {
    id: 2, entryIdString: "#ENT-0943", name: "N/A", categoryId: 2, categoryName: "Pro Women's Open",
    captainId: 201, isAcceptingMembers: true, requiredMemberCount: 2, currentMemberCount: 1,
    lineupStatus: "PENDING", paymentStatus: "PAID", createdAt: "", updatedAt: "",
    members: [{ id: 3, entryId: 2, userId: 201, eloAtEntry: 1400 }]
  },
  {
    id: 3, entryIdString: "#ENT-0945", name: "Quantum Strikers", categoryId: 3, categoryName: "Mixed Doubles Elite",
    captainId: 301, isAcceptingMembers: false, requiredMemberCount: 2, currentMemberCount: 2,
    lineupStatus: "CONFIRMED", paymentStatus: "UNPAID", createdAt: "", updatedAt: "",
    members: [{ id: 4, entryId: 3, userId: 301, eloAtEntry: 1600 }, { id: 5, entryId: 3, userId: 302, eloAtEntry: 1550 }]
  }
];

interface EntriesManagementProps {
  tournamentId: number;
}

export default function EntriesManagement({ tournamentId }: EntriesManagementProps) {
  // 👉 CALL REACT QUERY HERE: 
  // const { data: entriesData, isLoading } = useQuery(['entries', tournamentId, filters], fetchEntries);
  // const { data: categories } = useQuery(['tournament-categories', tournamentId], fetchCategories);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(MOCK_ENTRIES.map(e => e.id));
    else setSelectedIds([]);
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) setSelectedIds(prev => [...prev, id]);
    else setSelectedIds(prev => prev.filter(item => item !== id));
  };

  return (
    <div className="space-y-6 text-foreground font-sans bg-background min-h-screen p-6">
      
      {/* Header & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl">
        <div className="flex gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Category</label>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-input border-border text-foreground">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pro-men">Pro Men's Open</SelectItem>
                <SelectItem value="pro-women">Pro Women's Open</SelectItem>
                <SelectItem value="mixed">Mixed Doubles Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Lineup Status</label>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-input border-border text-foreground">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8 px-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Entries</p>
            <p className="text-2xl font-bold text-foreground">142</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Confirmed Payments</p>
            <p className="text-2xl font-bold text-primary drop-shadow-auth-primary-glow">128</p>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (Hiển thị khi có dòng được chọn) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <CheckSquare className="w-4 h-4" />
            Selected {selectedIds.length} entries
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-muted">
              Approve Selected
            </Button>
            <Button size="sm" variant="destructive">
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table Section */}
      <EntriesTable 
        entries={MOCK_ENTRIES} 
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing 1 to 10 of 142 entries</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="bg-transparent border-border h-8 px-3 hover:bg-muted" disabled>
            Prev
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground border-primary h-8 w-8 p-0 hover:bg-primary/90">
            1
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent border-border h-8 w-8 p-0 hover:bg-muted text-foreground">
            2
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent border-border h-8 w-8 p-0 hover:bg-muted text-foreground">
            3
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent border-border h-8 px-3 hover:bg-muted text-foreground">
            Next
          </Button>
        </div>
      </div>

    </div>
  );
}