import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, Download, Upload } from "lucide-react";
import { DelegationTable, DelegationDialog, AthleteListDialog } from "./components";
import type { Delegation } from "./components";

export default function DelegationManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [athleteDialogOpen, setAthleteDialogOpen] = useState(false);
  const [selectedDelegation, setSelectedDelegation] = useState<Delegation | null>(null);
  const [selectedDelegationId, setSelectedDelegationId] = useState<number | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const handleEdit = (delegation: Delegation) => {
    setSelectedDelegation(delegation);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedDelegation(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleViewAthletes = (delegationId: number) => {
    setSelectedDelegationId(delegationId);
    setAthleteDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đoàn đăng ký</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các đoàn tham gia giải đấu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất danh sách
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Nhập từ Excel
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm đoàn
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên đoàn, mã, trưởng đoàn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <DelegationTable
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onViewAthletes={handleViewAthletes}
        />
      </Card>

      <DelegationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        delegation={selectedDelegation}
        mode={dialogMode}
      />

      <AthleteListDialog
        open={athleteDialogOpen}
        onOpenChange={setAthleteDialogOpen}
        delegationId={selectedDelegationId}
        delegationName={selectedDelegation?.name}
      />
    </div>
  );
}
