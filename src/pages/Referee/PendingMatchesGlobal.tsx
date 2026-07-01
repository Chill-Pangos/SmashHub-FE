import { useTranslation } from "react-i18next";
import ResultsSubmissionTab from "./TournamentDetail/TournamentDetailTabs/ResultsSubmissionTab";

export default function PendingMatchesGlobal() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {t("portal.referee.title")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("portal.referee.pendingMatches")}
          </h1>
        </div>
      </div>
      <ResultsSubmissionTab />
    </div>
  );
}
