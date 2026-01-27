import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Shield,
  ShieldCheck,
  UserMinus,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import { tournamentRefereeService } from "@/services";
import { showToast } from "@/utils/toast.utils";
import type { TournamentReferee } from "@/types";

interface RefereeListProps {
  referees: TournamentReferee[];
  isLoading: boolean;
  onRefresh: () => void;
  searchQuery?: string;
}

export default function RefereeList({
  referees,
  isLoading,
  onRefresh,
  searchQuery = "",
}: RefereeListProps) {
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReferee, setSelectedReferee] =
    useState<TournamentReferee | null>(null);

  // Filter referees by search query
  const filteredReferees = referees.filter((ref) => {
    if (!searchQuery) return true;
    const name = ref.referee?.fullName || ref.referee?.username || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleToggleRole = async (referee: TournamentReferee) => {
    try {
      setIsUpdating(referee.id);
      const newRole = referee.role === "main" ? "assistant" : "main";
      await tournamentRefereeService.updateTournamentReferee(referee.id, {
        role: newRole,
      });
      showToast.success(
        "Thành công",
        `Đã cập nhật vai trò thành ${newRole === "main" ? "Trọng tài chính" : "Trợ lý"}`,
      );
      onRefresh();
    } catch (error) {
      console.error("Error updating role:", error);
      showToast.error("Lỗi", "Không thể cập nhật vai trò");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleToggleAvailability = async (referee: TournamentReferee) => {
    try {
      setIsUpdating(referee.id);
      await tournamentRefereeService.updateAvailability(referee.id, {
        isAvailable: !referee.isAvailable,
      });
      showToast.success(
        "Thành công",
        `Đã cập nhật trạng thái thành ${!referee.isAvailable ? "Sẵn sàng" : "Không khả dụng"}`,
      );
      onRefresh();
    } catch (error) {
      console.error("Error updating availability:", error);
      showToast.error("Lỗi", "Không thể cập nhật trạng thái");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteClick = (referee: TournamentReferee) => {
    setSelectedReferee(referee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedReferee) return;

    try {
      setIsUpdating(selectedReferee.id);
      await tournamentRefereeService.deleteTournamentReferee(
        selectedReferee.id,
      );
      showToast.success("Thành công", "Đã xóa trọng tài khỏi giải đấu");
      onRefresh();
    } catch (error) {
      console.error("Error deleting referee:", error);
      showToast.error("Lỗi", "Không thể xóa trọng tài");
    } finally {
      setIsUpdating(null);
      setDeleteDialogOpen(false);
      setSelectedReferee(null);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "main") {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <ShieldCheck className="h-3 w-3 mr-1" />
          Trọng tài chính
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Shield className="h-3 w-3 mr-1" />
        Trợ lý
      </Badge>
    );
  };

  const getAvailabilityBadge = (isAvailable: boolean) => {
    if (isAvailable) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Sẵn sàng
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-500">
        Không khả dụng
      </Badge>
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Đang tải danh sách trọng tài...
          </span>
        </div>
      </Card>
    );
  }

  if (filteredReferees.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          {searchQuery
            ? "Không tìm thấy trọng tài phù hợp"
            : "Chưa có trọng tài nào được phân công vào giải đấu này"}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Danh sách trọng tài ({filteredReferees.length})
        </h2>

        <div className="space-y-3">
          {filteredReferees.map((referee) => (
            <div
              key={referee.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(
                      referee.referee?.fullName || referee.referee?.username,
                    )}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="font-medium">
                    {referee.referee?.fullName ||
                      referee.referee?.username ||
                      `Referee #${referee.refereeId}`}
                  </div>
                  {referee.referee?.email && (
                    <div className="text-sm text-muted-foreground">
                      {referee.referee.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getRoleBadge(referee.role)}
                {getAvailabilityBadge(referee.isAvailable)}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isUpdating === referee.id}
                    >
                      {isUpdating === referee.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleToggleRole(referee)}>
                      {referee.role === "main" ? (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Chuyển thành Trợ lý
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Chuyển thành Trọng tài chính
                        </>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleToggleAvailability(referee)}
                    >
                      {referee.isAvailable ? (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-2" />
                          Đánh dấu không khả dụng
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-4 w-4 mr-2" />
                          Đánh dấu sẵn sàng
                        </>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteClick(referee)}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Xóa khỏi giải đấu
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa trọng tài</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa{" "}
              <strong>
                {selectedReferee?.referee?.fullName ||
                  selectedReferee?.referee?.username}
              </strong>{" "}
              khỏi giải đấu này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
