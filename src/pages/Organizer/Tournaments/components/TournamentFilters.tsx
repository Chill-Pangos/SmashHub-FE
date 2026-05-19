import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TournamentFilters({
  onSearch,
  onSort,
}: {
  onSearch?: (q: string) => void;
  onSort?: (value: string) => void;
}) {
  const [query, setQuery] = useState("");

  const sortOptions = useMemo(
    () => [
      { value: "start_asc", label: "Start date ↑" },
      { value: "start_desc", label: "Start date ↓" },
      { value: "participants_desc", label: "Participants ↓" },
    ],
    [],
  );

  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      <div className="flex w-full max-w-md items-center gap-2">
        <input
          type="search"
          placeholder="Search tournaments"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Select onValueChange={(v) => onSort?.(v)}>
          <SelectTrigger className="min-w-[160px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
