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
import { entryService } from "@/services";
import { showToast } from "@/utils/toast.utils";
import type {
  ImportSingleEntryDto,
  ImportDoubleEntryDto,
  ImportTeamEntryDto,
} from "@/types/entry.types";
import type { TournamentContentType } from "@/types/tournament.types";

interface EntryImportDialogProps {
  /**
   * Dialog open state (controlled)
   */
  open?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Tournament content ID to import entries into
   */
  contentId: number;

  /**
   * Content type (single, double, or team)
   */
  contentType: TournamentContentType;

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
 * Entry Import Dialog Component
 * Allows importing entries from Excel file based on content type
 */
export const EntryImportDialog: React.FC<EntryImportDialogProps> = ({
  open: controlledOpen,
  onOpenChange,
  contentId,
  contentType,
  onImportSuccess,
  trigger,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<{
    entries: (
      | ImportSingleEntryDto
      | ImportDoubleEntryDto
      | ImportTeamEntryDto
    )[];
    errors: Array<{ row: number; field: string; message: string }>;
  } | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isImportLoading, setIsImportLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"upload" | "preview">(
    "upload",
  );

  // Get template type based on content type
  const getTemplateType = (): "single" | "double" | "team" => {
    return contentType;
  };

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
  const handlePreview = async () => {
    if (!selectedFile) {
      showToast.error("Vui lòng chọn file để preview");
      return;
    }

    setIsPreviewLoading(true);

    try {
      let result;

      switch (contentType) {
        case "single":
          result = await entryService.previewImportSingleEntries(
            selectedFile,
            contentId,
          );
          break;
        case "double":
          result = await entryService.previewImportDoubleEntries(
            selectedFile,
            contentId,
          );
          break;
        case "team":
          result = await entryService.previewImportTeamEntries(
            selectedFile,
            contentId,
          );
          break;
        default:
          throw new Error("Invalid content type");
      }

      if (result.success) {
        setPreviewData(result.data);
        setCurrentStep("preview");
      } else {
        showToast.error("Không thể preview file. Vui lòng thử lại.");
      }
    } catch (error: unknown) {
      console.error("Preview error:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message
          : "Có lỗi xảy ra khi preview file. Vui lòng thử lại.";
      showToast.error(errorMessage);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Confirm import
  const handleConfirmImport = async () => {
    if (!previewData || previewData.errors.length > 0) {
      showToast.error("Vui lòng sửa các lỗi trước khi import");
      return;
    }

    setIsImportLoading(true);

    try {
      let result;

      switch (contentType) {
        case "single":
          result = await entryService.confirmImportSingleEntries({
            contentId,
            entries: previewData.entries as ImportSingleEntryDto[],
          });
          break;
        case "double":
          result = await entryService.confirmImportDoubleEntries({
            contentId,
            entries: previewData.entries as ImportDoubleEntryDto[],
          });
          break;
        case "team":
          result = await entryService.confirmImportTeamEntries({
            contentId,
            entries: previewData.entries as ImportTeamEntryDto[],
          });
          break;
        default:
          throw new Error("Invalid content type");
      }

      if (result.success) {
        showToast.success(`Import thành công ${result.data.created} entries!`);
        handleOpenChange(false);
        onImportSuccess?.();
      } else {
        showToast.error("Import thất bại. Vui lòng thử lại.");
      }
    } catch (error: unknown) {
      console.error("Import error:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message
          : "Có lỗi xảy ra khi import. Vui lòng thử lại.";
      showToast.error(errorMessage);
    } finally {
      setIsImportLoading(false);
    }
  };

  // Reset state
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setCurrentStep("upload");
    setIsPreviewLoading(false);
    setIsImportLoading(false);
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

  // Get preview columns based on content type
  const getPreviewColumns = () => {
    switch (contentType) {
      case "single":
        return [
          { key: "name", label: "Tên vận động viên" },
          { key: "email", label: "Email" },
        ];
      case "double":
        return [
          { key: "player1Name", label: "VĐV 1 - Tên" },
          { key: "player1Email", label: "VĐV 1 - Email" },
          { key: "player2Name", label: "VĐV 2 - Tên" },
          { key: "player2Email", label: "VĐV 2 - Email" },
        ];
      case "team":
        return [
          { key: "teamName", label: "Tên đội" },
          {
            key: "members",
            label: "Thành viên",
            render: (value: unknown) => {
              const members = value as Array<{ name: string; email: string }>;
              return (
                members?.map((m) => `${m.name} (${m.email})`).join(", ") || "-"
              );
            },
          },
        ];
      default:
        return [];
    }
  };

  // Get content type label
  const getContentTypeLabel = () => {
    switch (contentType) {
      case "single":
        return "Đơn";
      case "double":
        return "Đôi";
      case "team":
        return "Đội";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            Import Entries ({getContentTypeLabel()})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === "upload"
              ? `Upload File Excel - Nội dung ${getContentTypeLabel()}`
              : "Xem trước dữ liệu"}
          </DialogTitle>
          <DialogDescription>
            {currentStep === "upload"
              ? `Tải lên file Excel chứa danh sách đăng ký nội dung thi đấu ${getContentTypeLabel().toLowerCase()}. Vui lòng sử dụng file mẫu để đảm bảo định dạng đúng.`
              : "Kiểm tra dữ liệu trước khi import vào hệ thống"}
          </DialogDescription>
        </DialogHeader>

        {currentStep === "upload" ? (
          // Upload Step
          <div className="py-4">
            <ExcelFileUpload
              templateType={getTemplateType()}
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
                entries={
                  previewData.entries as unknown as Array<
                    Record<string, unknown>
                  >
                }
                errors={previewData.errors}
                columns={getPreviewColumns()}
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

export default EntryImportDialog;
