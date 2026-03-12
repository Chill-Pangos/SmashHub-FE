import React from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

interface ImportError {
  row: number;
  field: string;
  message: string;
}

/**
 * Generic type for preview entries
 * Allows flexible data structure while maintaining type safety
 */
type PreviewEntry = Record<string, unknown> & {
  rowNumber?: number;
};

/**
 * Column definition with proper typing
 */
interface PreviewColumn {
  key: string;
  label: string;
  render?: (value: unknown, entry: PreviewEntry) => React.ReactNode;
}

interface ImportPreviewProps {
  /**
   * Preview data entries
   */
  entries: PreviewEntry[];

  /**
   * Validation errors
   */
  errors: ImportError[];

  /**
   * Custom columns to display
   */
  columns?: PreviewColumn[];

  /**
   * Show row numbers
   */
  showRowNumbers?: boolean;
}

/**
 * Import Preview Component
 * Displays preview of imported data with validation errors
 */
export const ImportPreview: React.FC<ImportPreviewProps> = ({
  entries,
  errors,
  columns,
  showRowNumbers = true,
}) => {
  const { t } = useTranslation();
  const hasErrors = errors.length > 0;
  const totalEntries = entries.length;

  // Get error rows
  const errorRows = new Set(errors.map((e) => e.row));

  return (
    <div className="space-y-4">
      {/* Summary Alert */}
      {hasErrors ? (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>
            {t("components.importPreview.errorsFoundTitle")}
          </AlertTitle>
          <AlertDescription
            dangerouslySetInnerHTML={{
              __html: t("components.importPreview.errorsFoundDescription", {
                errorCount: errors.length,
                rowCount: errorRows.size,
              }),
            }}
          />
        </Alert>
      ) : (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">
            {t("components.importPreview.validationSuccessTitle")}
          </AlertTitle>
          <AlertDescription
            className="text-green-700"
            dangerouslySetInnerHTML={{
              __html: t(
                "components.importPreview.validationSuccessDescription",
                {
                  count: totalEntries,
                },
              ),
            }}
          />
        </Alert>
      )}

      {/* Errors List */}
      {hasErrors && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-red-800">
            {t("components.importPreview.errorListTitle", {
              count: errors.length,
            })}
          </h3>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-md bg-white p-3 text-sm"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <div>
                  <span className="font-medium text-red-700">
                    {t("components.importPreview.row", { row: error.row })}
                  </span>
                  {" - "}
                  <span className="text-gray-600">{error.field}:</span>{" "}
                  <span className="text-gray-800">{error.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Table */}
      {entries.length > 0 && columns && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-800">
            {t("components.importPreview.previewDataTitle", {
              count: entries.length,
            })}
          </h3>
          <div className="max-h-96 overflow-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  {showRowNumbers && (
                    <TableCell>{t("components.importPreview.stt")}</TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.label}</TableCell>
                  ))}
                  <TableCell>{t("components.importPreview.status")}</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => {
                  const rowNumber =
                    typeof entry.rowNumber === "number"
                      ? entry.rowNumber
                      : index + 1;
                  const hasRowError = errorRows.has(rowNumber);

                  return (
                    <TableRow
                      key={index}
                      className={hasRowError ? "bg-red-50" : ""}
                    >
                      {showRowNumbers && (
                        <TableCell className="text-center text-sm text-gray-500">
                          {rowNumber}
                        </TableCell>
                      )}
                      {columns.map((col) => {
                        const value = entry[col.key];
                        const displayValue = col.render
                          ? col.render(value, entry)
                          : String(value ?? "-");

                        return (
                          <TableCell key={col.key} className="text-sm">
                            {displayValue}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        {hasRowError ? (
                          <Badge variant="destructive" className="text-xs">
                            {t("components.importPreview.error")}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-green-500 bg-green-50 text-xs text-green-700"
                          >
                            {t("components.importPreview.valid")}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportPreview;
