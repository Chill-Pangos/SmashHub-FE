import { useMemo } from "react";
import type { Match } from "@/types";
import { MatchHistoryList } from "./components";
import { useMatchesByStatus } from "@/hooks/queries";
import { useTranslation } from "@/hooks/useTranslation";

export default function MatchHistory() {
  const { t } = useTranslation();

  // Fetch completed matches using React Query
  const { data: response, isLoading } = useMatchesByStatus("completed", 0, 50);

  // Extract matches from response
  const matches: Match[] = useMemo(() => {
    if (!response) return [];
    return Array.isArray(response) ? response : response.data || [];
  }, [response]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("match.matchHistory")}</h1>
        <p className="text-muted-foreground">
          {t("referee.viewCompletedMatches")}
        </p>
      </div>

      <MatchHistoryList matches={matches} isLoading={isLoading} />
    </div>
  );
}
