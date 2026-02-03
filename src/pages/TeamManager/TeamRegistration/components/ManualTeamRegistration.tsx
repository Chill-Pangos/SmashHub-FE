import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { showToast } from "@/utils";
import { useCreateTeamMember } from "@/hooks/queries";
import { useUsers } from "@/hooks/queries";
import teamService from "@/services/team.service";

interface TeamMemberInput {
  userId: number;
  role: "team_manager" | "coach" | "athlete";
}

interface ManualTeamRegistrationProps {
  tournamentId: number;
  onSuccess: () => void;
}

export default function ManualTeamRegistration({
  tournamentId,
  onSuccess,
}: ManualTeamRegistrationProps) {
  const [step, setStep] = useState<"form" | "members">("form");
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamId, setTeamId] = useState<number | null>(null);

  const [members, setMembers] = useState<TeamMemberInput[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<
    "team_manager" | "coach" | "athlete"
  >("coach");
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isSavingMembers, setIsSavingMembers] = useState(false);

  // Fetch all users for selection
  const { data: users = [], isLoading: isLoadingUsers } = useUsers(0, 1000);

  // Mutation to create team member
  const { mutateAsync: createTeamMember } = useCreateTeamMember();

  const availableUsers = users.filter(
    (u) => !members.some((m) => m.userId === u.id),
  );

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      showToast.error("Lỗi", "Vui lòng nhập tên đoàn");
      return;
    }

    setIsCreatingTeam(true);
    try {
      const newTeam = await teamService.createTeam({
        tournamentId,
        name: teamName.trim(),
        description: teamDescription.trim() || undefined,
      });

      setTeamId(newTeam.id);
      setStep("members");
      showToast.success("Thành công", "Tạo đoàn thành công");
    } catch (error) {
      showToast.error("Lỗi", "Không thể tạo đoàn. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsCreatingTeam(false);
    }
  };

  const handleAddMember = () => {
    if (!selectedUserId) {
      showToast.error("Lỗi", "Vui lòng chọn thành viên");
      return;
    }

    const user = users.find((u) => u.id === Number(selectedUserId));
    if (!user) {
      showToast.error("Lỗi", "Thành viên không tồn tại");
      return;
    }

    // Check if member already added
    if (members.some((m) => m.userId === user.id)) {
      showToast.error("Lỗi", "Thành viên này đã được thêm");
      return;
    }

    setMembers([...members, { userId: user.id, role: selectedRole }]);
    setSelectedUserId("");
    setSelectedRole("coach");
    showToast.success("Thành công", `Đã thêm ${user.username}`);
  };

  const handleSaveMembers = async () => {
    if (members.length === 0) {
      showToast.error("Lỗi", "Vui lòng thêm ít nhất một thành viên");
      return;
    }

    if (!members.some((m) => m.role === "team_manager")) {
      showToast.error("Lỗi", "Đoàn phải có ít nhất một trưởng đoàn");
      return;
    }

    if (!teamId) {
      showToast.error("Lỗi", "Không tìm thấy ID đoàn");
      return;
    }

    setIsSavingMembers(true);
    try {
      // Create all team members
      await Promise.all(
        members.map((member) =>
          createTeamMember({
            teamId,
            userId: member.userId,
            role: member.role,
          }),
        ),
      );

      showToast.success(
        "Thành công",
        "Đã tạo đoàn và thêm thành viên thành công",
      );
      onSuccess();
    } catch (error) {
      showToast.error("Lỗi", "Không thể thêm thành viên. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsSavingMembers(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      team_manager: "default",
      coach: "secondary",
      athlete: "outline",
    };
    const labels: Record<string, string> = {
      team_manager: "Trưởng đoàn",
      coach: "HLV",
      athlete: "VĐV",
    };

    return (
      <Badge variant={variants[role] || "outline"}>
        {labels[role] || role}
      </Badge>
    );
  };

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Create Team */}
      {step === "form" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Thông tin đoàn thể thao
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tên đoàn <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Nhập tên đoàn (VD: Đoàn Hà Nội, Team A)"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Mô tả (Tùy chọn)
              </label>
              <Input
                placeholder="Nhập mô tả về đoàn..."
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
              />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Lưu ý:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Đoàn phải có ít nhất 1 trưởng đoàn</li>
                    <li>
                      Một người có thể có vai trò khác nhau ở các đoàn khác nhau
                    </li>
                    <li>Bạn có thể thêm hoặc chỉnh sửa thành viên sau</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreateTeam}
              disabled={isCreatingTeam || !teamName.trim()}
              className="w-full"
            >
              {isCreatingTeam ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Tạo đoàn
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Add Members */}
      {step === "members" && teamId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Thêm thành viên vào đoàn: {teamName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Member Form */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-2 block">
                    Chọn thành viên
                  </label>
                  <Select
                    value={selectedUserId}
                    onValueChange={setSelectedUserId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Chọn thành viên --" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.username} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Vai trò
                  </label>
                  <Select
                    value={selectedRole}
                    onValueChange={(
                      value: "team_manager" | "coach" | "athlete",
                    ) => setSelectedRole(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team_manager">Trưởng đoàn</SelectItem>
                      <SelectItem value="coach">HLV</SelectItem>
                      <SelectItem value="athlete">VĐV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAddMember}
                variant="outline"
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm thành viên
              </Button>
            </div>

            {/* Members List */}
            {members.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Danh sách thành viên ({members.length})
                </label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên thành viên</TableHead>
                        <TableHead>Vai trò</TableHead>
                        <TableHead className="w-10 text-center">
                          Hành động
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member, index) => {
                        const user = users.find((u) => u.id === member.userId);
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              {user ? (
                                <>
                                  <p className="font-medium">{user.username}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {user.email}
                                  </p>
                                </>
                              ) : (
                                "Không tìm thấy"
                              )}
                            </TableCell>
                            <TableCell>{getRoleBadge(member.role)}</TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMemberToDelete(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Manager Check */}
                {!members.some((m) => m.role === "team_manager") && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ Đoàn phải có ít nhất một trưởng đoàn
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("form");
                  setMembers([]);
                }}
              >
                Quay lại
              </Button>
              <Button
                onClick={handleSaveMembers}
                disabled={
                  isSavingMembers ||
                  members.length === 0 ||
                  !members.some((m) => m.role === "team_manager")
                }
                className="flex-1"
              >
                {isSavingMembers ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Xác nhận và lưu
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={memberToDelete !== null}>
        <AlertDialogContent>
          <AlertDialogTitle>Xóa thành viên</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa thành viên này khỏi đoàn? Hành động này
            không thể hoàn tác.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel onClick={() => setMemberToDelete(null)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (memberToDelete !== null) {
                  setMembers(members.filter((_, i) => i !== memberToDelete));
                  setMemberToDelete(null);
                  showToast.success("Thành công", "Đã xóa thành viên");
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
