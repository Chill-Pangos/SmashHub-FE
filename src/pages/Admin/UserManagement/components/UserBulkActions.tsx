import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Eye, Trash2, X } from "lucide-react";

interface UserBulkActionsProps {
  selectedCount: number;
  isLoading?: boolean;
  onViewSelected: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export default function UserBulkActions({
  selectedCount,
  isLoading,
  onViewSelected,
  onDeleteSelected,
  onClearSelection,
}: UserBulkActionsProps) {
  const { t } = useTranslation();

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-md border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium">
        {t("admin.usersSelected", { count: selectedCount })}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewSelected}
          disabled={isLoading}
        >
          <Eye className="mr-2 h-4 w-4" />
          {t("admin.viewSelectedUsers")}
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteSelected}
          disabled={isLoading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("admin.deleteSelectedUsers")}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          {t("admin.clearSelection")}
        </Button>
      </div>
    </div>
  );
}
