import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, Download, Upload } from "lucide-react";
import UserTable, { type User } from "./components/UserTable";
import UserDialog from "./components/UserDialog";
import UserFilters from "./components/UserFilters";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDelete = (userId: number) => {
    console.log("Delete user:", userId);
    // Show confirmation dialog
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Nhập Excel
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      <UserFilters onFilterChange={(filters) => console.log(filters)} />

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email, vai trò..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <UserTable
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        mode={dialogMode}
      />
    </div>
  );
}
