import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExcelFileUpload from "@/components/custom/ExcelFileUpload";
import ImportPreview from "@/components/custom/ImportPreview";
import { usePreviewImportTeams, useConfirmImportTeams } from "@/hooks/queries";
import { showToast } from "@/utils/toast.utils";
import type { ImportTeamDto } from "@/types/team.types";

interface TeamImportDialogProps {
  /**
   * Dialog open state (controlled)
   */
  open?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Tournament ID to import teams into
   */
  tournamentId: number;

  /**
   * Callback after successful import
   */
  onImportSuccess?: () => void;

  /**
   * Trigger button (optional)
   */
  trigger?: React.ReactNode;
}

/**
 * Team Import Dialog Component
 * Allows importing teams from Excel file with preview and validation
 */
export const TeamImportDialog: React.FC<TeamImportDialogProps> = ({
  open: controlledOpen,
  onOpenChange,
  tournamentId,
  onImportSuccess,
  trigger,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<{
    teams: ImportTeamDto[];
    errors: Array<{ row: number; field: string; message: string }>;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState<"upload" | "preview">(
    "upload",
  );

  // React Query mutations
  const previewMutation = usePreviewImportTeams();
  const confirmMutation = useConfirmImportTeams();

  const isPreviewLoading = previewMutation.isPending;
  const isImportLoading = confirmMutation.isPending;

  // Handle file selection
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setPreviewData(null);
  };

  // Handle file removal
  const handleFileRemoved = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setCurrentStep("upload");
  };

  // Preview import
  const handlePreview = () => {
    if (!selectedFile) {
      showToast.error("Vui lòng chọn file để preview");
      return;
    }

    previewMutation.mutate(selectedFile, {
      onSuccess: (result) => {
        if (result.success) {
          setPreviewData(result.data);
          setCurrentStep("preview");
        } else {
          showToast.error("Không thể preview file. Vui lòng thử lại.");
        }
      },
      onError: (error: unknown) => {
        console.error("Preview error:", error);
        const errorMessage =
          error instanceof Error && "response" in error
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (error as any).response?.data?.message
            : "Có lỗi xảy ra khi preview file. Vui lòng thử lại.";
        showToast.error(errorMessage);
      },
    });
  };

  // Confirm import
  const handleConfirmImport = () => {
    if (!previewData || previewData.errors.length > 0) {
      showToast.error("Vui lòng sửa các lỗi trước khi import");
      return;
    }

    confirmMutation.mutate(
      {
        tournamentId,
        teams: previewData.teams,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            showToast.success(
              `Import thành công ${result.data.created} teams!`,
            );
            handleOpenChange(false);
            onImportSuccess?.();
          } else {
            showToast.error("Import thất bại. Vui lòng thử lại.");
          }
        },
        onError: (error: unknown) => {
          console.error("Import error:", error);
          const errorMessage =
            error instanceof Error && "response" in error
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (error as any).response?.data?.message
              : "Có lỗi xảy ra khi import. Vui lòng thử lại.";
          showToast.error(errorMessage);
        },
      },
    );
  };

  // Reset state
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setCurrentStep("upload");
    previewMutation.reset();
    confirmMutation.reset();
  };

  // Handle dialog close
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isPreviewLoading && !isImportLoading) {
      handleReset();
    }
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  // Back to upload step
  const handleBackToUpload = () => {
    setCurrentStep("upload");
    setPreviewData(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Import Teams từ Excel</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === "upload"
              ? "Upload File Excel"
              : "Xem trước dữ liệu"}
          </DialogTitle>
          <DialogDescription>
            {currentStep === "upload"
              ? "Tải lên file Excel chứa danh sách teams và members. Vui lòng sử dụng file mẫu để đảm bảo định dạng đúng."
              : "Kiểm tra dữ liệu trước khi import vào hệ thống"}
          </DialogDescription>
        </DialogHeader>

        {currentStep === "upload" ? (
          // Upload Step
          <div className="py-4">
            <ExcelFileUpload
              templateType="registration"
              showTemplateDownload={true}
              onFileSelected={handleFileSelected}
              onFileRemoved={handleFileRemoved}
              disabled={isPreviewLoading}
            />
          </div>
        ) : (
          // Preview Step
          <div className="py-4">
            {previewData && (
              <ImportPreview
                entries={previewData.teams.flatMap((team) =>
                  team.members.map((member) => ({
                    rowNumber: team.rowNumber,
                    teamName: team.name,
                    teamDescription: team.description || "-",
                    memberName: member.memberName,
                    memberEmail: member.email,
                    memberRole: member.role,
                  })),
                )}
                errors={previewData.errors}
                columns={[
                  { key: "teamName", label: "Tên Team" },
                  { key: "teamDescription", label: "Mô tả" },
                  { key: "memberName", label: "Tên Member" },
                  { key: "memberEmail", label: "Email" },
                  {
                    key: "memberRole",
                    label: "Vai trò",
                    render: (value: unknown) => {
                      const roleLabels = {
                        team_manager: "Quản lý",
                        coach: "HLV",
                        athlete: "VĐV",
                      };
                      const role = value as keyof typeof roleLabels;
                      return roleLabels[role] || String(value);
                    },
                  },
                ]}
              />
            )}
          </div>
        )}

        <DialogFooter>
          {currentStep === "upload" ? (
            <>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPreviewLoading}
              >
                Hủy
              </Button>
              <Button
                onClick={handlePreview}
                disabled={!selectedFile || isPreviewLoading}
              >
                {isPreviewLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Xem trước
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleBackToUpload}
                disabled={isImportLoading}
              >
                Quay lại
              </Button>
              <Button
                onClick={handleConfirmImport}
                disabled={
                  !previewData ||
                  previewData.errors.length > 0 ||
                  isImportLoading
                }
              >
                {isImportLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Xác nhận Import
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamImportDialog;
