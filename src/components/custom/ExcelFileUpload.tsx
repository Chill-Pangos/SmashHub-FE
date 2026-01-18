import React, { useRef } from "react";
import { Upload, FileSpreadsheet, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExcelFileUpload } from "@/hooks/useExcelFileUpload";
import { downloadTemplateByType } from "@/utils/file.utils";

interface ExcelFileUploadProps {
  /**
   * Template type for download button
   */
  templateType?: "single" | "double" | "team" | "registration";

  /**
   * Show template download button
   */
  showTemplateDownload?: boolean;

  /**
   * Callback when file is selected and validated
   */
  onFileSelected?: (file: File) => void;

  /**
   * Callback when file is removed
   */
  onFileRemoved?: () => void;

  /**
   * Accept file types (default: Excel files)
   */
  accept?: string;

  /**
   * Custom placeholder text
   */
  placeholder?: string;

  /**
   * Disable file upload
   */
  disabled?: boolean;

  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Excel File Upload Component
 * Provides drag-and-drop and click-to-upload functionality with validation
 */
export const ExcelFileUpload: React.FC<ExcelFileUploadProps> = ({
  templateType = "registration",
  showTemplateDownload = true,
  onFileSelected,
  onFileRemoved,
  accept = ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
  placeholder = "Kéo thả file Excel vào đây hoặc click để chọn file",
  disabled = false,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadState, handleFileSelect, handleFileDrop, resetUpload } =
    useExcelFileUpload();

  // Handle file selection
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event);
    if (event.target.files?.[0]) {
      onFileSelected?.(event.target.files[0]);
    }
  };

  // Handle file removal
  const onRemoveFile = () => {
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileRemoved?.();
  };

  // Handle drag over
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Handle drop
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    handleFileDrop(event);
    if (event.dataTransfer.files?.[0]) {
      onFileSelected?.(event.dataTransfer.files[0]);
    }
  };

  // Handle click to open file dialog
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Handle template download
  const handleDownloadTemplate = () => {
    downloadTemplateByType(templateType);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Template Download Button */}
      {showTemplateDownload && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Tải file mẫu
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center
          transition-colors duration-200
          ${
            disabled
              ? "bg-gray-50 border-gray-300 cursor-not-allowed"
              : uploadState.file
                ? "bg-green-50 border-green-400"
                : uploadState.error
                  ? "bg-red-50 border-red-400"
                  : "bg-white border-gray-300 hover:border-primary hover:bg-gray-50 cursor-pointer"
          }
        `}
        onDragOver={handleDragOver}
        onDrop={onDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={onFileChange}
          disabled={disabled}
          className="hidden"
        />

        {!uploadState.file ? (
          // No file selected
          <div className="space-y-3">
            <div className="flex justify-center">
              <Upload
                className={`h-12 w-12 ${disabled ? "text-gray-400" : "text-gray-500"}`}
              />
            </div>
            <div className="space-y-1">
              <p
                className={`text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"}`}
              >
                {placeholder}
              </p>
              <p className="text-xs text-gray-500">
                Hỗ trợ file: .xlsx, .xls (tối đa 5MB)
              </p>
            </div>
          </div>
        ) : (
          // File selected
          <div className="space-y-3">
            <div className="flex justify-center">
              <FileSpreadsheet className="h-12 w-12 text-green-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {uploadState.fileName}
              </p>
              <p className="text-xs text-gray-500">{uploadState.fileSize}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFile();
              }}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Xóa file
            </Button>
          </div>
        )}

        {/* Error Message */}
        {uploadState.error && (
          <div className="mt-3 text-sm text-red-600">{uploadState.error}</div>
        )}
      </div>

      {/* Helper Text */}
      <div className="text-xs text-gray-500">
        <p>
          💡 <strong>Lưu ý:</strong> Vui lòng tải file mẫu và điền thông tin
          theo đúng định dạng để đảm bảo quá trình import thành công.
        </p>
      </div>
    </div>
  );
};

export default ExcelFileUpload;
