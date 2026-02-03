import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ReportList, ReportGenerator, ExportOptions } from "./components";

export default function ReportsCenter() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {t("tournamentManager.reportsCenter.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t(
                  "tournamentManager.reportsCenter.searchPlaceholder",
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("tournamentManager.reportsCenter.all")}
                </SelectItem>
                <SelectItem value="tournament">
                  {t("tournamentManager.reportsCenter.tournament")}
                </SelectItem>
                <SelectItem value="delegation">
                  {t("tournamentManager.reportsCenter.delegation")}
                </SelectItem>
                <SelectItem value="match">
                  {t("tournamentManager.reportsCenter.match")}
                </SelectItem>
                <SelectItem value="statistics">
                  {t("tournamentManager.reportsCenter.statistics")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ReportList />
        </div>

        <div className="space-y-6">
          <ReportGenerator />
          <ExportOptions />
        </div>
      </div>
    </div>
  );
}
