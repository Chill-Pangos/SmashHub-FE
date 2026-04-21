import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";

interface ServerPaginationProps {
  skip: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isLoading?: boolean;
  limitOptions?: number[];
  onSkipChange: (nextSkip: number) => void;
  onLimitChange: (nextLimit: number) => void;
}

export default function ServerPagination({
  skip,
  limit,
  total,
  hasNext,
  hasPrevious,
  isLoading,
  limitOptions = [10, 20, 50, 100],
  onSkipChange,
  onLimitChange,
}: ServerPaginationProps) {
  const { t } = useTranslation();

  const safeLimit = Math.max(1, limit);
  const currentPage = Math.floor(skip / safeLimit) + 1;
  const totalPages = Math.max(
    1,
    Math.ceil((Math.max(total, 1) || 1) / safeLimit),
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        {t("common.page")} {currentPage} / {totalPages} ({t("common.total")}:{" "}
        {total})
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {t("common.itemsPerPage")}
        </span>
        <Select
          value={String(safeLimit)}
          onValueChange={(value) => onLimitChange(Number(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          disabled={isLoading || !hasPrevious}
          onClick={() => onSkipChange(Math.max(0, skip - safeLimit))}
        >
          {t("common.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading || !hasNext}
          onClick={() => onSkipChange(skip + safeLimit)}
        >
          {t("common.next")}
        </Button>
      </div>
    </div>
  );
}
