import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trophy, Users, Loader2, AlertCircle, Check } from "lucide-react";
import { showToast } from "@/utils";
import type { TournamentContent, Tournament } from "@/types";
import { useMembersByTeam, useRegisterEntry } from "@/hooks/queries";

interface ManualEntryRegistrationProps {
  selectedTeamId: number | null;
  selectedTournament: Tournament | undefined;
  onSuccess: () => void;
}

export default function ManualEntryRegistration({
  selectedTeamId,
  selectedTournament,
  onSuccess,
}: ManualEntryRegistrationProps) {
  // State for content and member selection
  const [selectedContent, setSelectedContent] =
    useState<TournamentContent | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Fetch team members
  const { data: teamMembers = [], isLoading: isMembersLoading } =
    useMembersByTeam(selectedTeamId || 0, 0, 100, {
      enabled: !!selectedTeamId,
    });

  // Register entry mutation
  const { mutateAsync: registerEntry } = useRegisterEntry();

  // Filter athletes only for entry registration
  const athletes = useMemo(
    () => teamMembers.filter((m) => m.role === "athlete"),
    [teamMembers],
  );

  // Validate selected members match content requirements
  const validateMembers = (
    contentType: string,
    memberCount: number,
  ): boolean => {
    switch (contentType) {
      case "single":
        return memberCount === 1;
      case "double":
        return memberCount === 2;
      case "team":
        return memberCount >= 3 && memberCount <= 5;
      default:
        return false;
    }
  };

  const isValidSelection =
    selectedMembers.length > 0 &&
    selectedContent &&
    validateMembers(selectedContent.type, selectedMembers.length);

  const handleSelectMember = (memberId: number, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, memberId]);
    } else {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    }
  };

  const handleRegisterEntry = async () => {
    if (!selectedTeamId || !selectedContent) {
      showToast.error("Lỗi", "Vui lòng chọn đoàn và nội dung thi đấu");
      return;
    }

    if (!isValidSelection) {
      const required =
        selectedContent.type === "single"
          ? "1"
          : selectedContent.type === "double"
            ? "2"
            : "3-5";
      showToast.error(
        "Lỗi",
        `Nội dung ${selectedContent.name} yêu cầu ${required} thành viên`,
      );
      return;
    }

    setIsRegistering(true);
    try {
      await registerEntry({
        contentId: selectedContent.id!,
        teamId: selectedTeamId,
        memberIds: selectedMembers,
      });

      showToast.success(
        "Thành công",
        `Đã đăng ký ${selectedMembers.length} thành viên cho nội dung ${selectedContent.name}`,
      );

      // Reset form
      setSelectedContent(null);
      setSelectedMembers([]);
      setConfirmDialogOpen(false);

      onSuccess();
    } catch (error) {
      showToast.error(
        "Lỗi",
        "Không thể đăng ký. Vui lòng kiểm tra lại thông tin và thử lại.",
      );
      console.error(error);
    } finally {
      setIsRegistering(false);
    }
  };

  if (isMembersLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">
            Đang tải danh sách thành viên...
          </p>
        </div>
      </div>
    );
  }

  if (athletes.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium">Không có vận động viên</p>
            <p className="mt-1">
              Đoàn của bạn chưa có vận động viên để đăng ký thi đấu. Vui lòng
              thêm vận động viên vào đoàn trước.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Select Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Chọn nội dung thi đấu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedTournament?.contents &&
          selectedTournament.contents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selectedTournament.contents.map((content: TournamentContent) => (
                <Card
                  key={content.id}
                  className={`cursor-pointer border transition-all ${
                    selectedContent?.id === content.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground"
                  }`}
                  onClick={() => {
                    setSelectedContent(content);
                    setSelectedMembers([]);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{content.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {content.type === "single"
                            ? "Đơn"
                            : content.type === "double"
                              ? "Đôi"
                              : "Đoàn"}
                        </p>
                      </div>
                      {selectedContent?.id === content.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>
                        <span className="font-medium">Loại:</span>{" "}
                        {content.type === "single"
                          ? "Đơn (1 người)"
                          : content.type === "double"
                            ? "Đôi (2 người)"
                            : "Đoàn (3-5 người)"}
                      </p>
                      {content.gender && (
                        <p>
                          <span className="font-medium">Giới tính:</span>{" "}
                          {content.gender === "male"
                            ? "Nam"
                            : content.gender === "female"
                              ? "Nữ"
                              : "Cả hai"}
                        </p>
                      )}
                      {content.minElo && (
                        <p>
                          <span className="font-medium">ELO tối thiểu:</span>{" "}
                          {content.minElo}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              Giải đấu này chưa có nội dung thi đấu nào.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Select Members */}
      {selectedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Chọn thành viên đăng ký
            </CardTitle>
            <p className="text-sm text-muted-foreground font-normal mt-2">
              {selectedContent.type === "single"
                ? "Vui lòng chọn 1 vận động viên"
                : selectedContent.type === "double"
                  ? "Vui lòng chọn 2 vận động viên"
                  : "Vui lòng chọn 3-5 vận động viên"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Validation message */}
            {selectedMembers.length > 0 && (
              <div
                className={`p-3 rounded-lg border text-sm ${
                  isValidSelection
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200"
                }`}
              >
                {isValidSelection ? (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Đã chọn đủ thành viên
                  </div>
                ) : (
                  <div>
                    {selectedContent.type === "single" &&
                      selectedMembers.length !== 1 &&
                      "Vui lòng chọn đúng 1 vận động viên"}
                    {selectedContent.type === "double" &&
                      selectedMembers.length !== 2 &&
                      "Vui lòng chọn đúng 2 vận động viên"}
                    {selectedContent.type === "team" &&
                      (selectedMembers.length < 3 ||
                        selectedMembers.length > 5) &&
                      `Vui lòng chọn 3-5 vận động viên (hiện tại: ${selectedMembers.length})`}
                  </div>
                )}
              </div>
            )}

            {/* Members Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          selectedMembers.length > 0 &&
                          selectedMembers.length === athletes.length
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedMembers(athletes.map((m) => m.userId));
                          } else {
                            setSelectedMembers([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Tên thành viên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>ELO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {athletes.map((member) => {
                    const user = member.user;
                    return (
                      <TableRow
                        key={member.id}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedMembers.includes(member.userId)}
                            onCheckedChange={(checked) =>
                              handleSelectMember(
                                member.userId,
                                checked as boolean,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {user ? (
                            <>
                              <p className="font-medium">{user.username}</p>
                              {user.firstName && user.lastName && (
                                <p className="text-xs text-muted-foreground">
                                  {user.firstName} {user.lastName}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground">
                              Không tìm thấy
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {user?.email || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {((user as unknown as Record<string, unknown>)
                              ?.elo as React.ReactNode) || "-"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedContent(null);
                  setSelectedMembers([]);
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={() => setConfirmDialogOpen(true)}
                disabled={!isValidSelection || isRegistering}
                className="flex-1"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    Đăng ký {selectedMembers.length} thành viên
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Xác nhận đăng ký</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-2">
              <p>
                Bạn sắp đăng ký{" "}
                <strong>{selectedMembers.length} thành viên</strong> cho nội
                dung <strong>{selectedContent?.name}</strong>.
              </p>
              <p className="text-sm">Các thành viên được chọn:</p>
              <ul className="text-sm list-disc list-inside space-y-1 text-foreground">
                {selectedMembers
                  .map(
                    (memberId) =>
                      athletes.find((m) => m.userId === memberId)?.user
                        ?.username,
                  )
                  .filter(Boolean)
                  .map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
              </ul>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                ⚠️ Hành động này không thể hoàn tác. Vui lòng kiểm tra kỹ trước
                khi xác nhận.
              </p>
            </div>
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRegisterEntry}
              disabled={isRegistering}
              className="bg-primary hover:bg-primary/90"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                "Xác nhận đăng ký"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
