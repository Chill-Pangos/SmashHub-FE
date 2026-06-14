import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchUsersPaginated, useUsersPaginated } from "@/hooks/queries/useUserQueries";
import UserFormModal from "./components/UserFormModal";
import DeleteUserDialog from "./components/DeleteUserDialog";
import type { AdminUser } from "@/types/user.types";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export default function UserManagement() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const { data: listData, isLoading: isListLoading } = useUsersPaginated(
    page,
    limit,
    { enabled: !debouncedQuery }
  );

  const { data: searchData, isLoading: isSearchLoading } = useSearchUsersPaginated(
    debouncedQuery,
    page,
    limit,
    { enabled: !!debouncedQuery }
  );

  const data = debouncedQuery ? searchData : listData;
  const isLoading = debouncedQuery ? isSearchLoading : isListLoading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
    setPage(1);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const openDeleteDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  // The service layer's parsePaginatedResponse transforms the raw API {users, pagination} into {items, meta}
  const users = data?.items || [];
  const pagination = data?.meta;

  return (
    <div className="p-6 h-full w-full flex-1 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("adminPage.userManagement.title", "User Management")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("adminPage.userManagement.description", "Manage system users, their profiles, and statuses.")}
          </p>
        </div>
        <Button onClick={openCreateModal} className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          {t("adminPage.userManagement.addUser", "Add User")}
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between gap-4 bg-muted/20">
          <form onSubmit={handleSearch} className="flex flex-1 max-w-sm gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("adminPage.userManagement.searchUsers", "Search users...")}
                className="pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">
              {t("adminPage.userManagement.search", "Search")}
            </Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>{t("adminPage.userManagement.user", "User")}</TableHead>
                <TableHead>{t("adminPage.userManagement.contact", "Contact")}</TableHead>
                <TableHead>{t("adminPage.userManagement.roles", "Roles")}</TableHead>
                <TableHead>{t("adminPage.userManagement.status", "Status")}</TableHead>
                <TableHead className="text-right">{t("adminPage.userManagement.actions", "Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {t("adminPage.userManagement.loading", "Loading users...")}
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {t("adminPage.userManagement.noUsers", "No users found.")}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: AdminUser) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {user.gender || t("adminPage.userManagement.unknown", "Unknown")} • {user.dob || t("adminPage.userManagement.na", "N/A")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.phoneNumber || t("adminPage.userManagement.noPhone", "No phone")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role: any) => (
                            <Badge key={typeof role === 'number' ? role : role.id} variant="secondary" className="text-xs">
                              {typeof role === 'number' ? t("adminPage.userManagement.roleId", { id: role, defaultValue: `Role ID: ${role}` }) : role.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">{t("adminPage.userManagement.noRoles", "No roles")}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isEmailVerified ? (
                        <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">
                          {t("adminPage.userManagement.verified", "Verified")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          {t("adminPage.userManagement.unverified", "Unverified")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">{t("adminPage.userManagement.edit", "Edit")}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t("adminPage.userManagement.delete", "Delete")}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && pagination.totalPages > 0 && (
          <div className="p-4 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground whitespace-nowrap">{t("adminPage.userManagement.rowsPerPage", "Rows per page:")}</p>
              <Select
                value={limit.toString()}
                onValueChange={(val) => {
                  setLimit(Number(val));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                {t("adminPage.userManagement.showing", {
                  start: (page - 1) * limit + 1,
                  end: Math.min(page * limit, pagination.total),
                  total: pagination.total,
                  defaultValue: `Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, pagination.total)} of ${pagination.total} users`
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage(p => p - 1)}
              >
                {t("adminPage.userManagement.previous", "Previous")}
              </Button>
              
              <div className="flex items-center gap-1 hidden sm:flex">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum = page - 2 + i;
                  if (page < 3) pageNum = i + 1;
                  else if (page > pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                  
                  if (pageNum > 0 && pageNum <= pagination.totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage(p => p + 1)}
              >
                {t("adminPage.userManagement.next", "Next")}
              </Button>

              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">{t("adminPage.userManagement.goTo", "Go to:")}</span>
                <Input
                  type="number"
                  min={1}
                  max={pagination.totalPages}
                  className="h-8 w-16"
                  defaultValue={page}
                  key={page}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = Number((e.currentTarget as HTMLInputElement).value);
                      if (val >= 1 && val <= pagination.totalPages) {
                        setPage(val);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const val = Number(e.currentTarget.value);
                    if (val >= 1 && val <= pagination.totalPages) {
                      setPage(val);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <UserFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        user={selectedUser}
      />
      
      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
      />
    </div>
  );
}
