import { useState, useCallback } from "react";
import { validateExcelFile } from "@/utils/file.utils";
import { showToast } from "@/utils/toast.utils";

/**
 * File upload state
 */
export interface FileUploadState {
  file: File | null;
  fileName: string;
  fileSize: string;
  isValidating: boolean;
  error: string | null;
}

/**
 * Custom hook for Excel file upload handling
 * Provides file validation, state management, and upload functionality
 */
export function useExcelFileUpload() {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    fileName: "",
    fileSize: "",
    isValidating: false,
    error: null,
  });

  /**
   * Handles file selection from input
   */
  /**
   * Resets upload state
   */
  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      fileName: "",
      fileSize: "",
      isValidating: false,
      error: null,
    });
  }, []);

  /**
   * Handles file selection from input
   */
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];

      if (!selectedFile) {
        resetUpload();
        return;
      }

      // Validate file
      const validation = validateExcelFile(selectedFile);

      if (!validation.valid) {
        setUploadState({
          file: null,
          fileName: "",
          fileSize: "",
          isValidating: false,
          error: validation.error || "File không hợp lệ",
        });
        showToast.error(validation.error || "File không hợp lệ");
        return;
      }

      // File is valid
      setUploadState({
        file: selectedFile,
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
        isValidating: false,
        error: null,
      });
    },
    [resetUpload],
  );

  /**
   * Handles file drop
   */
  const handleFileDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const droppedFile = event.dataTransfer.files?.[0];

      if (!droppedFile) {
        return;
      }

      // Validate file
      const validation = validateExcelFile(droppedFile);

      if (!validation.valid) {
        setUploadState({
          file: null,
          fileName: "",
          fileSize: "",
          isValidating: false,
          error: validation.error || "File không hợp lệ",
        });
        showToast.error(validation.error || "File không hợp lệ");
        return;
      }

      // File is valid
      setUploadState({
        file: droppedFile,
        fileName: droppedFile.name,
        fileSize: formatFileSize(droppedFile.size),
        isValidating: false,
        error: null,
      });
    },
    [],
  );

  /**
   * Validates if file is ready for upload
   */
  const isFileReady = useCallback((): boolean => {
    return uploadState.file !== null && uploadState.error === null;
  }, [uploadState.file, uploadState.error]);

  return {
    uploadState,
    handleFileSelect,
    handleFileDrop,
    resetUpload,
    isFileReady,
  };
}

/**
 * Helper function to format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
