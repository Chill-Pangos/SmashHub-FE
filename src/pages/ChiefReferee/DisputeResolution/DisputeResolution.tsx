import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DisputeDetail, ResolutionForm, ProcessHistory } from "./components";
import { useTranslation } from "@/hooks/useTranslation";

export default function DisputeResolution() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/chief-referee/complaint-board")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {t("chiefReferee.disputeResolutionTitle")}
        </h1>
      </div>

      <DisputeDetail />
      <ResolutionForm />
      <ProcessHistory />
    </div>
  );
}
