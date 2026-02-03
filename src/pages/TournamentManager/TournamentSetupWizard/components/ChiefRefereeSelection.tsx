import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ShieldCheck, Check, X, Loader2 } from "lucide-react";
import { showToast } from "@/utils/toast.utils";
import { useAvailableChiefReferees, useCreateTournamentReferee } from "@/hooks/queries";

interface ChiefRefereeSelectionProps {
  tournamentId: number;
  selectedRefereeId: number | null;
  onSelect: (refereeId: number | null) => void;
}

export default function ChiefRefereeSelection({
  tournamentId,
  selectedRefereeId,
  onSelect,
}: ChiefRefereeSelectionProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingRefereeId, setPendingRefereeId] = useState<number | null>(null);

  // Fetch available chief referees
  const { data: chiefRefereesResponse, isLoading: isLoadingReferees } =
    useAvailableChiefReferees({ enabled: tournamentId > 0 });

  const availableReferees = chiefRefereesResponse?.data || [];

  // Create tournament referee mutation
  const createReferee = useCreateTournamentReferee();

  const selectedReferee = availableReferees.find(
    (ref) => ref.id === selectedRefereeId,
  );

  const handleSelectReferee = (refereeId: number) => {
    setPendingRefereeId(refereeId);
    setShowConfirmDialog(true);
  };

  const handleConfirmSelection = () => {
    if (!pendingRefereeId) return;

    createReferee.mutate(
      {
        tournamentId,
        refereeId: pendingRefereeId,
        role: "main",
      },
      {
        onSuccess: () => {
          onSelect(pendingRefereeId);
          showToast.success("Thành công", "Đã thêm tổng trọng tài cho giải đấu");
          setShowConfirmDialog(false);
          setPendingRefereeId(null);
        },
        onError: (error) => {
          console.error("Error assigning chief referee:", error);
          showToast.error(
            "Lỗi",
            "Không thể thêm tổng trọng tài. Vui lòng thử lại",
          );
        },
      },
    );
  };

  const handleRemoveSelection = () => {
    onSelect(null);
    setPendingRefereeId(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle>Chọn Tổng Trọng Tài</CardTitle>
            <CardDescription>
              Chọn tổng trọng tài để quản lý giải đấu này
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoadingReferees ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : availableReferees.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">
              Không có tổng trọng tài sẵn sàng
            </p>
            <p className="text-sm text-muted-foreground">
              Vui lòng tạo tài khoản trọng tài trước
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Danh sách tổng trọng tài</label>
              <Select
                value={selectedRefereeId?.toString() || ""}
                onValueChange={(value) =>
                  handleSelectReferee(parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tổng trọng tài..." />
                </SelectTrigger>
                <SelectContent>
                  {availableReferees.map((referee) => (
                    <SelectItem
                      key={referee.id}
                      value={referee.id.toString()}
                    >
                      {referee.fullName} (@{referee.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Referee Card */}
            {selectedReferee && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{selectedReferee.fullName}</h4>
                      <Badge variant="secondary" className="bg-blue-200 text-blue-900">
                        <Check className="h-3 w-3 mr-1" />
                        Đã chọn
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      @{selectedReferee.username}
                    </p>
                    {selectedReferee.email && (
                      <p className="text-sm text-muted-foreground">
                        {selectedReferee.email}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRemoveSelection}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Info Alert */}
            {!selectedRefereeId && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  💡 Tổng trọng tài sẽ có quyền duyệt kết quả các trận đấu và quản lý
                  giải đấu.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận chọn tổng trọng tài</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRefereeId && (
                <>
                  Bạn có chắc muốn chọn{" "}
                  <strong>
                    {
                      availableReferees.find((r) => r.id === pendingRefereeId)
                        ?.fullName
                    }
                  </strong>{" "}
                  làm tổng trọng tài cho giải đấu này?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={createReferee.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSelection}
              disabled={createReferee.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createReferee.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
