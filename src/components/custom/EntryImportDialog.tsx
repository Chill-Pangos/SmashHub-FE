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
import {
  usePreviewImportSingleEntries,
  usePreviewImportDoubleEntries,
  usePreviewImportTeamEntries,
  useConfirmImportSingleEntries,
  useConfirmImportDoubleEntries,
  useConfirmImportTeamEntries,
} from "@/hooks/queries";
import { showToast } from "@/utils/toast.utils";
import type {
  ImportSingleEntryDto,
  ImportDoubleEntryDto,
  ImportTeamEntryDto,
} from "@/types/entry.types";
import type { TournamentContentType } from "@/types/tournament.types";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();
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
  const [currentStep, setCurrentStep] = useState<"upload" | "preview">(
    "upload",
  );

  // React Query mutations for preview
  const previewSingleMutation = usePreviewImportSingleEntries();
  const previewDoubleMutation = usePreviewImportDoubleEntries();
  const previewTeamMutation = usePreviewImportTeamEntries();

  // React Query mutations for confirm
  const confirmSingleMutation = useConfirmImportSingleEntries();
  const confirmDoubleMutation = useConfirmImportDoubleEntries();
  const confirmTeamMutation = useConfirmImportTeamEntries();

  // Derive loading states from mutations
  const isPreviewLoading =
    previewSingleMutation.isPending ||
    previewDoubleMutation.isPending ||
    previewTeamMutation.isPending;

  const isImportLoading =
    confirmSingleMutation.isPending ||
    confirmDoubleMutation.isPending ||
    confirmTeamMutation.isPending;

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
  const handlePreview = () => {
    if (!selectedFile) {
      showToast.error(t("components.entryImportDialog.selectFileToPreview"));
      return;
    }

    const handlePreviewSuccess = (result: {
      success: boolean;
      data: typeof previewData;
    }) => {
      if (result.success) {
        setPreviewData(result.data);
        setCurrentStep("preview");
      } else {
        showToast.error(t("components.entryImportDialog.cannotPreviewFile"));
      }
    };

    const handlePreviewError = (error: unknown) => {
      console.error("Preview error:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message
          : t("components.entryImportDialog.errorPreviewingFile");
      showToast.error(errorMessage);
    };

    switch (contentType) {
      case "single":
        previewSingleMutation.mutate(
          { file: selectedFile, contentId },
          { onSuccess: handlePreviewSuccess, onError: handlePreviewError },
        );
        break;
      case "double":
        previewDoubleMutation.mutate(
          { file: selectedFile, contentId },
          { onSuccess: handlePreviewSuccess, onError: handlePreviewError },
        );
        break;
      case "team":
        previewTeamMutation.mutate(
          { file: selectedFile, contentId },
          { onSuccess: handlePreviewSuccess, onError: handlePreviewError },
        );
        break;
    }
  };

  // Confirm import
  const handleConfirmImport = () => {
    if (!previewData || previewData.errors.length > 0) {
      showToast.error(t("components.entryImportDialog.fixErrorsBeforeImport"));
      return;
    }

    const handleConfirmSuccess = (result: {
      success: boolean;
      data: { created: number };
    }) => {
      if (result.success) {
        showToast.success(
          t("components.entryImportDialog.importSuccess", {
            count: result.data.created,
          }),
        );
        handleOpenChange(false);
        onImportSuccess?.();
      } else {
        showToast.error(t("components.entryImportDialog.importFailed"));
      }
    };

    const handleConfirmError = (error: unknown) => {
      console.error("Import error:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message
          : t("components.entryImportDialog.errorImporting");
      showToast.error(errorMessage);
    };

    switch (contentType) {
      case "single":
        confirmSingleMutation.mutate(
          { contentId, entries: previewData.entries as ImportSingleEntryDto[] },
          { onSuccess: handleConfirmSuccess, onError: handleConfirmError },
        );
        break;
      case "double":
        confirmDoubleMutation.mutate(
          { contentId, entries: previewData.entries as ImportDoubleEntryDto[] },
          { onSuccess: handleConfirmSuccess, onError: handleConfirmError },
        );
        break;
      case "team":
        confirmTeamMutation.mutate(
          { contentId, entries: previewData.entries as ImportTeamEntryDto[] },
          { onSuccess: handleConfirmSuccess, onError: handleConfirmError },
        );
        break;
    }
  };

  // Reset state
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setCurrentStep("upload");
    previewSingleMutation.reset();
    previewDoubleMutation.reset();
    previewTeamMutation.reset();
    confirmSingleMutation.reset();
    confirmDoubleMutation.reset();
    confirmTeamMutation.reset();
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
          { key: "name", label: t("components.entryImportDialog.athleteName") },
          { key: "email", label: t("components.entryImportDialog.email") },
        ];
      case "double":
        return [
          {
            key: "player1Name",
            label: t("components.entryImportDialog.player1Name"),
          },
          {
            key: "player1Email",
            label: t("components.entryImportDialog.player1Email"),
          },
          {
            key: "player2Name",
            label: t("components.entryImportDialog.player2Name"),
          },
          {
            key: "player2Email",
            label: t("components.entryImportDialog.player2Email"),
          },
        ];
      case "team":
        return [
          {
            key: "teamName",
            label: t("components.entryImportDialog.teamName"),
          },
          {
            key: "members",
            label: t("components.entryImportDialog.members"),
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
        return t("components.entryImportDialog.single");
      case "double":
        return t("components.entryImportDialog.double");
      case "team":
        return t("components.entryImportDialog.team");
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            {`Import Entries (${getContentTypeLabel()})`}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === "upload"
              ? t("components.entryImportDialog.uploadExcelTitle", {
                  contentType: getContentTypeLabel(),
                })
              : t("components.entryImportDialog.previewData")}
          </DialogTitle>
          <DialogDescription>
            {currentStep === "upload"
              ? t("components.entryImportDialog.uploadDescription", {
                  contentType: getContentTypeLabel().toLowerCase(),
                })
              : t("components.entryImportDialog.checkDataBeforeImport")}
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
                {t("components.entryImportDialog.cancel")}
              </Button>
              <Button
                onClick={handlePreview}
                disabled={!selectedFile || isPreviewLoading}
              >
                {isPreviewLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("components.entryImportDialog.preview")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleBackToUpload}
                disabled={isImportLoading}
              >
                {t("components.entryImportDialog.back")}
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
                {t("components.entryImportDialog.confirmImport")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EntryImportDialog;
