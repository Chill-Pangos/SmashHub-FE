import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LiveMatches,
  IncidentReport,
  PendingMatchReview,
  ScheduledMatches,
} from "./components";
import { Eye, ClipboardCheck, AlertTriangle, Clock, Video } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Mock data removed - LiveMatches now uses React Query with useMatchesByStatus("in_progress")

export default function MatchSupervision() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("scheduled");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {t("chiefReferee.matchSupervision")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("chiefReferee.matchSupervisionDescription")}
          </p>
        </div>
        <Button>
          <Video className="mr-2 h-4 w-4" />
          {t("chiefReferee.viewCamera")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("chiefReferee.scheduledMatches")}
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {t("chiefReferee.liveMatches")}
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            {t("chiefReferee.pendingReview")}
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t("chiefReferee.incidents")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-6 mt-6">
          <ScheduledMatches />
        </TabsContent>

        <TabsContent value="live" className="space-y-6 mt-6">
          <LiveMatches />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <PendingMatchReview />
        </TabsContent>

        <TabsContent value="incidents" className="mt-6">
          <IncidentReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
