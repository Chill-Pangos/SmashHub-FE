import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Calendar as CalendarIcon } from "lucide-react";
import { MatchTable, MatchFilters } from "./components";
import type { Match } from "./components";

export default function MatchManagement() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (match: Match) => {
    console.log("Edit match:", match);
  };

  const handleViewDetail = (matchId: number) => {
    console.log("View match detail:", matchId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {t("tournamentManager.matchManagement.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("tournamentManager.matchManagement.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {t("tournamentManager.matchManagement.viewSchedule")}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("tournamentManager.matchManagement.exportSchedule")}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("tournamentManager.matchManagement.createMatch")}
          </Button>
        </div>
      </div>

      <MatchFilters />

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t(
                "tournamentManager.matchManagement.searchPlaceholder",
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <MatchTable
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onViewDetail={handleViewDetail}
        />
      </Card>
    </div>
  );
}
