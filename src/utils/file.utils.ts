/**
 * File upload utility functions
 * Handles Excel file validation and upload preparation
 */

/**
 * Allowed Excel file MIME types
 */
export const EXCEL_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
  "application/x-excel",
  "application/x-msexcel",
];

/**
 * Maximum file size (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validates if the file is an Excel file
 *
 * @param file File to validate
 * @returns True if file is a valid Excel file
 */
export function isExcelFile(file: File): boolean {
  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension =
    fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

  // Check MIME type
  const hasValidMimeType = EXCEL_MIME_TYPES.includes(file.type);

  return hasValidExtension || hasValidMimeType;
}

/**
 * Validates file size
 *
 * @param file File to validate
 * @param maxSize Maximum file size in bytes (default: 5MB)
 * @returns True if file size is valid
 */
export function isValidFileSize(
  file: File,
  maxSize: number = MAX_FILE_SIZE,
): boolean {
  return file.size <= maxSize;
}

/**
 * Validates Excel file for upload
 *
 * @param file File to validate
 * @returns Object with validation result and error message
 */
export function validateExcelFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!file) {
    return { valid: false, error: "Vui lòng chọn file để upload" };
  }

  if (!isExcelFile(file)) {
    return {
      valid: false,
      error: "File không hợp lệ. Vui lòng chọn file Excel (.xlsx hoặc .xls)",
    };
  }

  if (!isValidFileSize(file)) {
    return {
      valid: false,
      error: `File quá lớn. Kích thước tối đa là ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Formats file size to human readable format
 *
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Creates a FormData object with file for upload
 *
 * @param file File to upload
 * @param additionalFields Additional fields to append to FormData
 * @returns FormData object ready for upload
 */
export function createFileUploadFormData(
  file: File,
  additionalFields?: Record<string, string | number>,
): FormData {
  const formData = new FormData();
  formData.append("file", file);

  if (additionalFields) {
    Object.entries(additionalFields).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
  }

  return formData;
}

/**
 * Triggers file download from blob
 *
 * @param blob Blob data to download
 * @param filename Name of the file to download
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Downloads Excel template file from assets
 *
 * @param templatePath Path to template file in assets folder
 * @param filename Name of the file to download
 */
export function downloadExcelTemplate(
  templatePath: string,
  filename: string,
): void {
  const link = document.createElement("a");
  link.href = templatePath;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Excel template file paths in assets
 */
export const EXCEL_TEMPLATES = {
  TEAM_REGISTRATION: "/src/assets/DangKyDanhSach.xlsx",
  SINGLE_ENTRY: "/src/assets/DangKyNoiDungThiDau_Single.xlsx",
  DOUBLE_ENTRY: "/src/assets/DangKyNoiDungThiDau_Double.xlsx",
  TEAM_ENTRY: "/src/assets/DangKyNoiDungThiDau_Team.xlsx",
} as const;

/**
 * Gets template file path by entry type
 *
 * @param type Entry type ('single', 'double', 'team', or 'registration')
 * @returns Template file path
 */
export function getExcelTemplatePath(
  type: "single" | "double" | "team" | "registration",
): string {
  switch (type) {
    case "registration":
      return EXCEL_TEMPLATES.TEAM_REGISTRATION;
    case "single":
      return EXCEL_TEMPLATES.SINGLE_ENTRY;
    case "double":
      return EXCEL_TEMPLATES.DOUBLE_ENTRY;
    case "team":
      return EXCEL_TEMPLATES.TEAM_ENTRY;
    default:
      throw new Error(`Unknown template type: ${type}`);
  }
}

/**
 * Downloads Excel template by type
 *
 * @param type Entry type
 */
export function downloadTemplateByType(
  type: "single" | "double" | "team" | "registration",
): void {
  const templatePath = getExcelTemplatePath(type);
  let filename: string;

  switch (type) {
    case "registration":
      filename = "Mẫu_Đăng_Ký_Danh_Sách.xlsx";
      break;
    case "single":
      filename = "Mẫu_Đăng_Ký_Đơn.xlsx";
      break;
    case "double":
      filename = "Mẫu_Đăng_Ký_Đôi.xlsx";
      break;
    case "team":
      filename = "Mẫu_Đăng_Ký_Đội.xlsx";
      break;
  }

  downloadExcelTemplate(templatePath, filename);
}
