import { DecisionHistory, DecisionDetail } from "./components";
import { useTranslation } from "@/hooks/useTranslation";

export default function DecisionLog() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {t("chiefReferee.decisionLogTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("chiefReferee.decisionLogDescription")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DecisionHistory />
        </div>
        <div>
          <DecisionDetail />
        </div>
      </div>
    </div>
  );
}
